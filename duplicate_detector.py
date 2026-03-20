# duplicate_detector.py
# This file finds files that have identical content, even if they have different names.

import hashlib

def get_file_hash(file_path):
    """
    Creates a unique 'fingerprint' (hash) for a file based on its contents.
    Two files with the same content will have the same hash.
    """
    hasher = hashlib.md5()

    try:
        with open(file_path, "rb") as f:  # "rb" means read as raw bytes
            # We read in chunks so large files don't overwhelm memory
            chunk = f.read(8192)
            while chunk:
                hasher.update(chunk)
                chunk = f.read(8192)
        return hasher.hexdigest()  # Returns a string like "a1b2c3d4..."

    except (PermissionError, FileNotFoundError):
        return None  # Can't read this file, skip it


def find_duplicates(files_info):
    """
    Goes through all scanned files and groups ones with the same content.
    Returns a list of groups — each group is a list of duplicate files.
    """
    hash_map = {}  # Key = hash string, Value = list of files with that hash

    print("🔎 Checking for duplicate files...")

    for file in files_info:
        file_hash = get_file_hash(file["path"])

        if file_hash is None:
            continue  # Skip files we couldn't read

        if file_hash not in hash_map:
            hash_map[file_hash] = []

        hash_map[file_hash].append(file)

    # Only keep groups that have MORE than one file (those are the duplicates)
    duplicates = [group for group in hash_map.values() if len(group) > 1]

    print(f"✅ Found {len(duplicates)} groups of duplicate files.")
    return duplicates