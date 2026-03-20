import os
import platform

def get_all_drives():
    """
    Returns a list of all available drives/mount points to scan.
    Works on Windows, Mac, and Linux.
    """
    system = platform.system()
    drives = []
    
    if system == "Windows":
        import string
        for letter in string.ascii_uppercase:
            drive = f"{letter}:\\"
            if os.path.exists(drive) and os.access(drive, os.R_OK):
                drives.append(drive)
    elif system == "Darwin":
        drives.append("/")
    elif system == "Linux":
        drives.append("/")
    
    return drives

SKIP_FOLDERS = {
    "AppData", ".git", "node_modules", "__pycache__", "Temp", "temp", 
    "cache", "Cache", ".cache", "Windows", "$Recycle.Bin", "System Volume Information",
    "ProgramData", ".vscode", ".venv", "venv", ".conda", "conda"
}

SKIP_PATTERNS = {".git", ".svn", ".hg"}
