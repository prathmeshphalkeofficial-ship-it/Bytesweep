import os
import time

DEFAULT_SKIP_FOLDERS = {
    "AppData", ".git", "node_modules", "__pycache__", "Temp", "temp", 
    "cache", "Cache", ".cache", "Windows", "$Recycle.Bin", "System Volume Information",
    "ProgramData", ".vscode", ".venv", "venv", ".conda", "conda", "Program Files",
    "Program Files (x86)", "Recovery", "PerfLogs"
}

def scan_folder(folder_path, skip_folders=None):
    """
    Scans a folder recursively and returns a list of file info dictionaries.
    """
    if skip_folders is None:
        skip_folders = DEFAULT_SKIP_FOLDERS
    
    files_info = []
    
    for root, dirs, files in os.walk(folder_path):
        dirs[:] = [d for d in dirs if d not in skip_folders]
        
        for f in files:
            full_path = os.path.join(root, f)
            try:
                stats = os.stat(full_path)
                files_info.append({
                    "name": f,
                    "path": full_path,
                    "size_bytes": stats.st_size,
                    "size_mb": round(stats.st_size / (1024 * 1024), 2),
                    "last_accessed": stats.st_atime,
                    "last_modified": stats.st_mtime,
                    "created": stats.st_ctime,
                })
            except (PermissionError, FileNotFoundError, OSError):
                pass
    
    return files_info
