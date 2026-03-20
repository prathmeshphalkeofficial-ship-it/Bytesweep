# large_file_detector.py
# This file finds files that are larger than a size you choose.

def find_large_files(files_info, size_limit_mb=100):
    """
    Returns a list of files larger than size_limit_mb.
    Default limit is 100 MB — you can change this in main.py.
    """
    print(f"📦 Checking for files larger than {size_limit_mb} MB...")

    large_files = []

    for file in files_info:
        if file["size_mb"] > size_limit_mb:
            large_files.append(file)

    # Sort largest files first so most important ones appear at the top
    large_files.sort(key=lambda f: f["size_bytes"], reverse=True)

    print(f"✅ Found {len(large_files)} large files.")
    return large_files