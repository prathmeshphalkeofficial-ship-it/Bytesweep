from flask import Flask, render_template, jsonify, request, Response, send_from_directory
import os, hashlib, time, json, base64
from system_drives import get_all_drives, SKIP_FOLDERS

app = Flask(__name__)

LOGO_BASE64 = None
logo_path = os.path.join(os.path.dirname(__file__), "static", "logo.png")
if os.path.exists(logo_path):
    with open(logo_path, "rb") as f:
        LOGO_BASE64 = base64.b64encode(f.read()).decode()

FILE_TYPES = {
    'images': ('png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tiff', 'raw', 'psd', 'heic', 'avif'),
    'videos': ('mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v', 'mpeg'),
    'audio': ('mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'),
    'documents': ('pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md', 'rtf', 'odt'),
    'archives': ('zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'),
    'code': ('py', 'js', 'html', 'css', 'java', 'cpp', 'c', 'h', 'cs', 'php', 'rb', 'go', 'rs'),
    'executables': ('exe', 'dll', 'bat', 'msi', 'cmd', 'sh', 'app'),
}

def get_file_hash(file_path):
    hasher = hashlib.md5()
    try:
        with open(file_path, "rb") as f:
            chunk = f.read(8192)
            while chunk:
                hasher.update(chunk)
                chunk = f.read(8192)
        return hasher.hexdigest()
    except:
        return None


def get_json_safe_path(path):
    """Convert filesystem path to JSON-safe path with forward slashes"""
    if path is None:
        return None
    return path.replace(os.sep, '/')

def scan_directory(folder_path):
    """Scans a single directory and returns list of file paths."""
    all_paths = []
    try:
        for root, dirs, files in os.walk(folder_path):
            dirs[:] = [d for d in dirs if d not in SKIP_FOLDERS]
            for f in files:
                all_paths.append(os.path.join(root, f))
    except (PermissionError, OSError):
        pass
    return all_paths

def scan_generator(folder_path, size_limit_mb, unused_years, scan_all=False):
    files_info = []

    def send(data):
        return f"data: {json.dumps(data)}\n\n"

    def validate_path(path):
        if not path or not path.strip():
            return False, "ERROR: No folder path provided."
        normalized = os.path.normpath(path.strip())
        real_path = os.path.abspath(os.path.expanduser(normalized))
        if not os.path.exists(real_path):
            return False, f"ERROR: Path does not exist: {real_path}"
        if not os.path.isdir(real_path):
            return False, f"ERROR: Not a directory: {real_path}"
        if not os.access(real_path, os.R_OK):
            return False, f"ERROR: No read permission for: {real_path}"
        return True, real_path

    if scan_all:
        drives = get_all_drives()
        yield send({"type": "status", "msg": f"Scanning all drives: {drives}"})
        all_paths = []
        for drive in drives:
            yield send({"type": "status", "msg": f"Scanning {drive}..."})
            paths = scan_directory(drive)
            all_paths.extend(paths)
            yield send({"type": "status", "msg": f"Found {len(paths)} files on {drive}"})
    else:
        valid, result = validate_path(folder_path)
        if not valid:
            yield send({"type": "status", "msg": result})
            yield send({"type": "complete", "total_files": 0, "total_size_mb": 0,
                        "duplicates": [], "large_files": [], "unused_files": [], "dup_waste_mb": 0})
            return

        yield send({"type": "status", "msg": f"Starting scan of {result}..."})
        all_paths = scan_directory(result)

    total = len(all_paths)
    yield send({"type": "status", "msg": f"Found {total} files. Analyzing..."})

    for i, full_path in enumerate(all_paths):
        try:
            stats = os.stat(full_path)
            ext = os.path.splitext(full_path)[1].lower().lstrip('.')
            files_info.append({
                "name": os.path.basename(full_path),
                "path": full_path,
                "size_bytes": stats.st_size,
                "size_mb": round(stats.st_size / (1024 * 1024), 2),
                "last_accessed": stats.st_atime,
                "file_type": ext if ext else "unknown",
            })
        except:
            pass

        if i % 5 == 0:
            yield send({"type": "file", "path": full_path, "current": i, "total": total})
        
        if i % 100 == 0:
            yield send({"type": "progress", "current": i, "total": total,
                        "msg": f"Scanning files... {i}/{total}"})

    yield send({"type": "status", "msg": "Detecting duplicates..."})

    hash_map = {}
    for i, file in enumerate(files_info):
        fh = get_file_hash(file["path"])
        if fh:
            hash_map.setdefault(fh, []).append(file)
        if i % 50 == 0:
            yield send({"type": "progress", "current": i, "total": len(files_info),
                        "msg": f"Hashing files... {i}/{len(files_info)}"})

    duplicates = [g for g in hash_map.values() if len(g) > 1]

    yield send({"type": "status", "msg": "Finding large files..."})
    large_files = sorted([f for f in files_info if f["size_mb"] > size_limit_mb],
                         key=lambda x: x["size_bytes"], reverse=True)

    yield send({"type": "status", "msg": "Finding unused files..."})
    cutoff = time.time() - (unused_years * 365 * 24 * 60 * 60)
    unused_files = sorted([f for f in files_info if f["last_accessed"] < cutoff],
                          key=lambda x: x["last_accessed"])

    dup_waste = sum(g[0]["size_mb"] * (len(g) - 1) for g in duplicates)
    total_size = sum(f["size_mb"] for f in files_info)

    type_counts = {}
    for f in files_info:
        ft = f.get("file_type", "unknown")
        if ft not in type_counts:
            type_counts[ft] = {"count": 0, "size_mb": 0}
        type_counts[ft]["count"] += 1
        type_counts[ft]["size_mb"] += f["size_mb"]

    yield send({
        "type": "complete",
        "total_files": len(files_info),
        "total_size_mb": round(total_size, 2),
        "duplicates": [[{**f} for f in g] for g in duplicates],
        "large_files": large_files[:50],
        "unused_files": unused_files[:50],
        "dup_waste_mb": round(dup_waste, 2),
        "file_types": type_counts,
    })


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/favicon.ico")
def favicon():
    logo_path = os.path.join(os.path.dirname(__file__), "static", "logo.png")
    if os.path.exists(logo_path):
        return send_from_directory("static", "logo.png", mimetype="image/png")
    return "", 404

@app.route("/logo")
def logo():
    return jsonify({"logo": LOGO_BASE64})

@app.route("/delete", methods=["POST"])
def delete_file():
    data = request.get_json()
    file_path = data.get("path", "")
    if not file_path:
        return jsonify({"success": False, "error": "No path provided"})
    
    real_path = os.path.abspath(os.path.expanduser(file_path))
    if not os.path.exists(real_path):
        return jsonify({"success": False, "error": "File not found"})
    
    try:
        os.remove(real_path)
        return jsonify({"success": True, "deleted": real_path})
    except PermissionError:
        return jsonify({"success": False, "error": "Permission denied - file may be in use"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route("/delete-batch", methods=["POST"])
def delete_batch():
    data = request.get_json()
    paths = data.get("paths", [])
    results = []
    for p in paths:
        real_path = os.path.abspath(os.path.expanduser(p))
        if os.path.exists(real_path):
            try:
                os.remove(real_path)
                results.append({"path": p, "success": True})
            except Exception as e:
                results.append({"path": p, "success": False, "error": str(e)})
        else:
            results.append({"path": p, "success": False, "error": "Not found"})
    return jsonify({"results": results})

@app.route("/locations")
def locations():
    drives = get_all_drives()
    locations = []
    for drive in drives:
        locations.append({
            "path": drive,
            "name": f"Drive {drive}",
            "type": "drive"
        })
        try:
            for item in os.listdir(drive):
                item_path = os.path.join(drive, item)
                if os.path.isdir(item_path) and item not in SKIP_FOLDERS:
                    try:
                        if os.access(item_path, os.R_OK):
                            locations.append({
                                "path": item_path,
                                "name": item,
                                "type": "folder"
                            })
                    except:
                        pass
        except:
            pass
    return jsonify({"locations": locations})


@app.route("/scan")
def scan():
    folder = request.args.get("folder", "").strip()
    size_limit = float(request.args.get("size_limit", 100))
    unused_years = int(request.args.get("unused_years", 2))
    scan_all = request.args.get("scan_all", "false").lower() == "true"
    return Response(scan_generator(folder, size_limit, unused_years, scan_all),
                    mimetype="text/event-stream",
                    headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})

@app.route("/drives")
def drives():
    return jsonify({"drives": get_all_drives()})


@app.route('/debug-path')
def debug_path():
    folder = request.args.get('folder', '')
    real = os.path.realpath(os.path.expanduser(folder))
    return {
        'input': folder,
        'resolved': real,
        'exists': os.path.exists(real),
        'is_dir': os.path.isdir(real),
        'readable': os.access(real, os.R_OK)
    }


if __name__ == "__main__":
    import webbrowser
    webbrowser.open("http://localhost:5000")
    app.run(debug=False, threaded=True)