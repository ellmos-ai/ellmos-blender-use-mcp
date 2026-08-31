r"""Visuelles Verify-Gate fuer selbstgebaute Roblox-Blender-Assets (FBX).

Ergaenzt das bestehende Struktur-Gate (verify_reimport.py: Existenz/Meshzahl/Namen/
skriptfrei) um Fehlerklassen, die dort NICHT erkannt werden: auf der Seite liegende
Meshes (Rotation nicht applied), schwebende Teile in Mehrteil-Assets, Pivot/Origin
ausserhalb des Modells, Rotation/Scale-Residuen im Export, Empties im Export sowie
ein visueller Output (4 Render-Views) fuer die Sichtpruefung.

Aufruf (Blender Background-Modus):
    blender.exe --background --factory-startup --python verify_asset_visual.py -- \
        --fbx <pfad.fbx> --out <ausgabeordner> [--expect-height MIN,MAX] [--json]

Hinweis Hochachse: Nach dem Reimport in Blender ist Z die Hochachse (Blender-eigene
Konvention; der FBX-Roundtrip mit Standard-Achsen sorgt dafuer, dass Z beim Reimport
wieder "oben" ist, unabhaengig davon, dass FBX intern Y-up nutzt).

Schreibt verify_visual_result.json in <out> mit {ok, fails[], warns[], metrics{...},
renders[]} und setzt Exit-Code 0 (ok) bzw. 1 (fails vorhanden).
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

# --- Default-Toleranzen (per CLI ueberschreibbar, siehe parse_args) ---
DEFAULT_ROTATION_WARN_DEG = 0.05
DEFAULT_ROTATION_FAIL_DEG = 1.0
DEFAULT_SCALE_WARN_TOL = 0.002
DEFAULT_SCALE_FAIL_TOL = 0.02
DEFAULT_PIVOT_OUTSIDE_MARGIN_FRAC = 0.02
DEFAULT_PIVOT_WARN_FRAC = 0.15
DEFAULT_ASSEMBLY_GAP_FRAC = 0.03
RENDER_RESOLUTION = (640, 480)


def parse_height_range(value: str) -> tuple[float, float]:
    """Parst 'MIN,MAX' zu einem Float-Tupel (fuer --expect-height)."""
    parts = value.split(",")
    if len(parts) != 2:
        raise argparse.ArgumentTypeError("Format muss MIN,MAX sein, z.B. 3,8")
    try:
        lo, hi = float(parts[0]), float(parts[1])
    except ValueError as exc:
        raise argparse.ArgumentTypeError(f"Ungueltige Zahl in '{value}'") from exc
    if lo > hi:
        lo, hi = hi, lo
    return lo, hi


def parse_args() -> argparse.Namespace:
    """Liest die Skript-Argumente nach dem '--' Trenner (Blender-Konvention)."""
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    parser = argparse.ArgumentParser(description="Visuelles Verify-Gate fuer FBX-Assets.")
    parser.add_argument("--fbx", required=True, help="Pfad zur zu pruefenden FBX-Datei.")
    parser.add_argument("--out", required=True, help="Ausgabeordner fuer JSON-Ergebnis und Renders.")
    parser.add_argument(
        "--expect-height",
        type=parse_height_range,
        default=None,
        help="Optionales Hoehen-Gate 'MIN,MAX' (gleiche Einheit wie die FBX-Datei, i.d.R. Studs).",
    )
    parser.add_argument("--json", action="store_true", help="Ergebnis zusaetzlich als kompaktes JSON auf stdout.")
    parser.add_argument("--no-render", action="store_true", help="Renders ueberspringen (nur Geometrie-Checks).")
    parser.add_argument("--rotation-warn-deg", type=float, default=DEFAULT_ROTATION_WARN_DEG)
    parser.add_argument("--rotation-fail-deg", type=float, default=DEFAULT_ROTATION_FAIL_DEG)
    parser.add_argument("--scale-warn-tol", type=float, default=DEFAULT_SCALE_WARN_TOL)
    parser.add_argument("--scale-fail-tol", type=float, default=DEFAULT_SCALE_FAIL_TOL)
    parser.add_argument("--pivot-outside-margin-frac", type=float, default=DEFAULT_PIVOT_OUTSIDE_MARGIN_FRAC)
    parser.add_argument("--pivot-warn-frac", type=float, default=DEFAULT_PIVOT_WARN_FRAC)
    parser.add_argument("--assembly-gap-frac", type=float, default=DEFAULT_ASSEMBLY_GAP_FRAC)
    parser.add_argument(
        "--strict-child-rotation",
        action="store_true",
        help=(
            "Rotations-Residuen auch bei Kind-Objekten (mit Parent) als FAIL werten statt nur als WARN. "
            "Standard ist aus, weil Kind-Rotationen in Hierarchien (z.B. Waffen-Grip am Socket, radial "
            "angeordnete Teile) haeufig beabsichtigte Posen sind und keine Export-Residuen -- empirisch "
            "belegt an einem echten Produktions-Kit, das ohne diese Ausnahme dutzende falsche FAILs erzeugte."
        ),
    )
    return parser.parse_args(argv)


def clear_scene() -> None:
    """Leert die Szene vollstaendig (auch Default-Cube/Kamera/Licht bei --factory-startup)."""
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()
    # verwaiste Datenbloecke aus vorherigen Laeufen mit aufraeumen
    for block_collection in (bpy.data.meshes, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
        for block in list(block_collection):
            if block.users == 0:
                block_collection.remove(block)


def import_fbx(fbx_path: Path) -> None:
    bpy.ops.import_scene.fbx(filepath=str(fbx_path))


def world_bbox(obj: bpy.types.Object) -> tuple[Vector, Vector]:
    """Welt-Bounding-Box eines Objekts aus den 8 lokalen bound_box-Ecken."""
    corners = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    xs = [c.x for c in corners]
    ys = [c.y for c in corners]
    zs = [c.z for c in corners]
    return Vector((min(xs), min(ys), min(zs))), Vector((max(xs), max(ys), max(zs)))


def combine_bboxes(bboxes: list[tuple[Vector, Vector]]) -> tuple[Vector, Vector]:
    mins = [min(b[0][i] for b in bboxes) for i in range(3)]
    maxs = [max(b[1][i] for b in bboxes) for i in range(3)]
    return Vector(mins), Vector(maxs)


def find_pivot(all_objects: list[bpy.types.Object]) -> tuple[Vector, str | None]:
    """Bestimmt den Referenzpunkt (Pivot) des gesamten Assets.

    Gibt es genau EIN Objekt ohne Parent (typischerweise eine Gruppen-Empty oder ein
    einzelnes Root-Mesh), zaehlt dessen Welt-Position als Pivot. Bei mehreren
    Top-Level-Objekten (flaches Mehrteil-Kit ohne gemeinsamen Parent) gilt der
    Szenen-Ursprung (0,0,0) als Pivot, weil genau dort das Kit beim Re-Import landen wuerde.
    """
    top_level = [obj for obj in all_objects if obj.parent is None]
    if len(top_level) == 1:
        return top_level[0].matrix_world.translation.copy(), top_level[0].name
    return Vector((0.0, 0.0, 0.0)), None


def check_transforms(
    all_objects: list[bpy.types.Object],
    rotation_warn_deg: float,
    rotation_fail_deg: float,
    scale_warn_tol: float,
    scale_fail_tol: float,
    strict_child_rotation: bool,
) -> tuple[list[str], list[str], list[dict]]:
    """Prueft pro Objekt die LOKALE Rotation/Skalierung auf Nicht-Identitaet (Transform-Residuen).

    Nutzt matrix_basis.decompose() statt rotation_euler, damit die Pruefung unabhaengig
    vom eingestellten rotation_mode (Euler/Quaternion/Achse-Winkel) korrekt funktioniert.

    WICHTIGE EINSCHRAENKUNG (empirisch an einem echten Produktions-Kit gefunden): Eine
    reine Rotations-Abweichung ist bei Kind-Objekten (obj.parent gesetzt) NICHT von einer
    beabsichtigten Pose innerhalb der Hierarchie (Waffe am Hand-Socket, radial angeordnete
    Teile) unterscheidbar. Deshalb eskaliert Rotation bei Kind-Objekten standardmaessig nur
    zu WARN, nicht zu FAIL -- volle Staerke (FAIL) nur bei Root-Objekten (kein Parent), wo
    eine Rotation praktisch immer ein vergessenes "Transform anwenden" vor dem Export ist.
    Ueber --strict-child-rotation kann das strengere Verhalten erzwungen werden. Skalierung
    bleibt davon unberuehrt (Non-Uniform-Scale ist unabhaengig von der Hierarchietiefe fast
    immer ein Bug, z.B. bei Roblox-Kollision problematisch).
    """
    fails: list[str] = []
    warns: list[str] = []
    details: list[dict] = []
    for obj in all_objects:
        _, rot_quat, scale = obj.matrix_basis.decompose()
        rotation_deg = math.degrees(rot_quat.angle)
        scale_deviation = max(abs(s - 1.0) for s in scale)
        is_child = obj.parent is not None

        rotation_severity = None
        if rotation_deg > rotation_fail_deg:
            rotation_severity = "fail" if (strict_child_rotation or not is_child) else "warn"
        elif rotation_deg > rotation_warn_deg:
            rotation_severity = "warn"

        scale_severity = None
        if scale_deviation > scale_fail_tol:
            scale_severity = "fail"
        elif scale_deviation > scale_warn_tol:
            scale_severity = "warn"

        severity = "fail" if "fail" in (rotation_severity, scale_severity) else (
            "warn" if "warn" in (rotation_severity, scale_severity) else None
        )
        if severity:
            entry = {
                "name": obj.name,
                "rotation_deg": round(rotation_deg, 3),
                "scale": [round(s, 4) for s in scale],
                "is_child": is_child,
                "severity": severity,
            }
            details.append(entry)
            (fails if severity == "fail" else warns).append(obj.name)
    return fails, warns, details


def check_pivot(
    pivot: Vector,
    pivot_source: str | None,
    bbox_min: Vector,
    bbox_max: Vector,
    outside_margin_frac: float,
    warn_frac: float,
) -> tuple[str | None, str | None, dict]:
    """Prueft die Pivot-Lage relativ zur Gesamt-BBox: FAIL wenn deutlich ausserhalb,
    WARN wenn innerhalb aber nicht an der Basis-Mitte (Toleranz parametrisierbar)."""
    diagonal = (bbox_max - bbox_min).length or 1e-6
    margin = diagonal * outside_margin_frac
    inside = all((bbox_min[i] - margin) <= pivot[i] <= (bbox_max[i] + margin) for i in range(3))
    base_center = Vector(((bbox_min.x + bbox_max.x) / 2, (bbox_min.y + bbox_max.y) / 2, bbox_min.z))
    offset = (pivot - base_center).length
    normalized_offset = offset / diagonal
    info = {
        "pivot": [round(v, 4) for v in pivot],
        "pivot_source": pivot_source or "scene_origin",
        "inside_bbox": inside,
        "offset_from_base_center": round(offset, 4),
        "offset_from_base_center_normalized": round(normalized_offset, 4),
    }
    fail = None if inside else "origin_outside_bbox"
    warn = None if (not inside or normalized_offset <= warn_frac) else "origin_not_at_base_center"
    return fail, warn, info


def check_assembly(mesh_objects: list[bpy.types.Object], gap_frac: float) -> list[str]:
    """Assembly-Guard: Jedes Mesh-Teil muss (leicht expandiert) mindestens ein anderes
    Teil beruehren/ueberschneiden. Bei nur 1 Mesh wird die Pruefung uebersprungen."""
    if len(mesh_objects) < 2:
        return []
    bboxes = {obj.name: world_bbox(obj) for obj in mesh_objects}
    overall_min, overall_max = combine_bboxes(list(bboxes.values()))
    diagonal = (overall_max - overall_min).length or 1e-6
    margin = diagonal * gap_frac
    floating: list[str] = []
    for name, (bmin, bmax) in bboxes.items():
        expanded_min = [bmin[i] - margin for i in range(3)]
        expanded_max = [bmax[i] + margin for i in range(3)]
        touches_any = False
        for other_name, (omin, omax) in bboxes.items():
            if other_name == name:
                continue
            if all(expanded_min[i] <= omax[i] and omin[i] <= expanded_max[i] for i in range(3)):
                touches_any = True
                break
        if not touches_any:
            floating.append(name)
    return floating


def render_views(mesh_objects: list[bpy.types.Object], out_dir: Path, no_render: bool) -> tuple[list[str], list[str]]:
    """Rendert 4 Ansichten (Front/Seite/Top/Perspektive) als PNG mit neutralem Studio-Licht
    (Workbench-Engine, keine Materialien/Lichter im Asset noetig). Fehler bei einzelnen
    Ansichten werden als WARN behandelt, nicht als Absturz."""
    renders: list[str] = []
    warns: list[str] = []
    if not mesh_objects:
        warns.append("render_skipped:no_mesh_objects")
        return renders, warns
    if no_render:
        return renders, warns

    bboxes = [world_bbox(obj) for obj in mesh_objects]
    overall_min, overall_max = combine_bboxes(bboxes)
    center = (overall_min + overall_max) / 2
    dimensions = overall_max - overall_min
    diagonal = max(dimensions.length, 0.05)

    scene = bpy.context.scene
    try:
        scene.render.engine = "BLENDER_WORKBENCH"
        scene.display.shading.light = "STUDIO"
        scene.display.shading.show_shadows = True
    except Exception as exc:  # Blender-Versionsabhaengig, nicht fatal
        warns.append(f"render_engine_setup_warning:{exc}")

    scene.render.resolution_x, scene.render.resolution_y = RENDER_RESOLUTION
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False

    cam_data = bpy.data.cameras.new("VerifyCam")
    cam_obj = bpy.data.objects.new("VerifyCam", cam_data)
    bpy.context.collection.objects.link(cam_obj)
    scene.camera = cam_obj
    cam_data.clip_start = max(diagonal * 0.001, 0.001)
    cam_data.clip_end = diagonal * 20

    def point_at(location: Vector, target: Vector, up_axis: str = "Z") -> None:
        cam_obj.location = location
        direction = target - location
        if direction.length < 1e-9:
            return
        cam_obj.rotation_euler = direction.to_track_quat("-Z", up_axis).to_euler()

    ortho_views = {
        "front": dict(location=center + Vector((0, -diagonal * 2, 0)), span=max(dimensions.x, dimensions.z) * 1.25, up="Z"),
        "side": dict(location=center + Vector((-diagonal * 2, 0, 0)), span=max(dimensions.y, dimensions.z) * 1.25, up="Z"),
        "top": dict(location=center + Vector((0, 0, diagonal * 2)), span=max(dimensions.x, dimensions.y) * 1.25, up="Y"),
    }

    for view_name, setup in ortho_views.items():
        try:
            cam_data.type = "ORTHO"
            cam_data.ortho_scale = max(setup["span"], 0.1)
            point_at(setup["location"], center, setup["up"])
            out_file = out_dir / f"view_{view_name}.png"
            scene.render.filepath = str(out_file)
            bpy.ops.render.render(write_still=True)
            renders.append(out_file.name)
        except Exception as exc:
            warns.append(f"render_failed:{view_name}:{exc}")

    try:
        cam_data.type = "PERSP"
        cam_data.lens = 35
        persp_location = center + Vector((diagonal * 1.3, -diagonal * 1.3, diagonal * 0.9))
        point_at(persp_location, center, "Z")
        out_file = out_dir / "view_perspective.png"
        scene.render.filepath = str(out_file)
        bpy.ops.render.render(write_still=True)
        renders.append(out_file.name)
    except Exception as exc:
        warns.append(f"render_failed:perspective:{exc}")

    return renders, warns


def write_and_exit(result: dict, out_dir: Path, as_json: bool) -> None:
    """Schreibt verify_visual_result.json, druckt eine Konsolen-Zusammenfassung und
    beendet mit Exit-Code 0/1 passend zu result['ok']."""
    result_path = out_dir / "verify_visual_result.json"
    result_path.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")

    if as_json:
        print(json.dumps(result, ensure_ascii=False))
    else:
        status = "OK" if result["ok"] else "FAIL"
        print(f"[{status}] {result.get('fbx', '?')}")
        for fail in result.get("fails", []):
            print(f"  FAIL: {fail}")
        for warn in result.get("warns", []):
            print(f"  WARN: {warn}")
        metrics = result.get("metrics", {})
        if "height" in metrics:
            print(
                f"  Metrics: height={metrics['height']} width={metrics['width']} "
                f"depth={metrics['depth']} mesh_count={metrics['mesh_count']} empty_count={metrics['empty_count']}"
            )
        if result.get("renders"):
            print(f"  Renders: {', '.join(result['renders'])}")

    if not result["ok"]:
        raise SystemExit(1)


def main() -> None:
    args = parse_args()
    fbx_path = Path(args.fbx).resolve()
    out_dir = Path(args.out).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    if not fbx_path.exists():
        result = {
            "ok": False,
            "fbx": str(fbx_path),
            "fails": ["fbx_not_found"],
            "warns": [],
            "metrics": {},
            "renders": [],
        }
        write_and_exit(result, out_dir, args.json)
        return

    clear_scene()
    import_fbx(fbx_path)

    all_objects = list(bpy.context.scene.objects)
    mesh_objects = [obj for obj in all_objects if obj.type == "MESH"]
    non_mesh_objects = [obj for obj in all_objects if obj.type != "MESH"]

    fails: list[str] = []
    warns: list[str] = []

    # 1) Transform-Residuen (Rotation/Scale nicht applied)
    t_fails, t_warns, t_details = check_transforms(
        all_objects,
        args.rotation_warn_deg,
        args.rotation_fail_deg,
        args.scale_warn_tol,
        args.scale_fail_tol,
        args.strict_child_rotation,
    )
    fails += [f"transform_residual:{name}" for name in t_fails]
    warns += [f"transform_residual_warn:{name}" for name in t_warns]

    metrics: dict[str, object] = {
        "mesh_count": len(mesh_objects),
        "empty_count": len(non_mesh_objects),
        "transform_residuals": t_details,
    }

    if not mesh_objects:
        fails.append("no_mesh_objects_found")
    else:
        bboxes = [world_bbox(obj) for obj in mesh_objects]
        bbox_min, bbox_max = combine_bboxes(bboxes)
        dimensions = bbox_max - bbox_min
        height, width, depth = dimensions.z, dimensions.x, dimensions.y
        metrics.update(
            {
                "bbox_min": [round(v, 4) for v in bbox_min],
                "bbox_max": [round(v, 4) for v in bbox_max],
                "height": round(height, 4),
                "width": round(width, 4),
                "depth": round(depth, 4),
                "ratio_height_width": round(height / width, 4) if width > 1e-9 else None,
                "ratio_height_depth": round(height / depth, 4) if depth > 1e-9 else None,
            }
        )

        # 2) Pivot/Origin relativ zur Gesamt-BBox
        pivot, pivot_source = find_pivot(all_objects)
        pivot_fail, pivot_warn, pivot_info = check_pivot(
            pivot, pivot_source, bbox_min, bbox_max, args.pivot_outside_margin_frac, args.pivot_warn_frac
        )
        metrics["origin"] = pivot_info
        if pivot_fail:
            fails.append(pivot_fail)
        if pivot_warn:
            warns.append(pivot_warn)

        # 3) Assembly-Guard (Zusammenhang)
        floating = check_assembly(mesh_objects, args.assembly_gap_frac)
        metrics["floating_parts"] = floating
        fails += [f"floating_part:{name}" for name in floating]

        # 4) Aufrecht-Plausibilitaet / optionales Hoehen-Gate
        if args.expect_height:
            lo, hi = args.expect_height
            metrics["expected_height_range"] = [lo, hi]
            if not (lo <= height <= hi):
                fails.append("height_out_of_expected_range")

    # 5) Empties/Nicht-Mesh zaehlen und listen (nur WARN)
    if non_mesh_objects:
        metrics["empties"] = [obj.name for obj in non_mesh_objects]
        warns.append(f"empties_present:{len(non_mesh_objects)}")

    # 6) Renders
    renders, render_warns = render_views(mesh_objects, out_dir, args.no_render)
    warns += render_warns

    result = {
        "ok": len(fails) == 0,
        "fbx": str(fbx_path),
        "fails": fails,
        "warns": warns,
        "metrics": metrics,
        "renders": renders,
        "blender_version": bpy.app.version_string,
    }
    write_and_exit(result, out_dir, args.json)


if __name__ == "__main__":
    main()
