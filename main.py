# main.py
# This is the main file. Run this to start ByteSweep.

from scanner import scan_folder
from duplicate_detector import find_duplicates
from large_file_detector import find_large_files
from unused_file_detector import find_unused_files
from report_generator import generate_report
from system_drives import get_all_drives, SKIP_FOLDERS

SCAN_MODE = "all"  # "all" = scan all drives, "single" = scan one folder
FOLDER_TO_SCAN = "C:/Users/Dell"  # Only used if SCAN_MODE = "single"

LARGE_FILE_LIMIT_MB = 100
UNUSED_YEARS = 2

print("\n🧹 Welcome to ByteSweep!")

if SCAN_MODE == "all":
    drives = get_all_drives()
    print(f"   Scanning ALL drives: {drives}")
    all_files = []
    for drive in drives:
        print(f"\n   Scanning {drive}...")
        files = scan_folder(drive, skip_folders=SKIP_FOLDERS)
        all_files.extend(files)
        print(f"   Found {len(files)} files on {drive}")
else:
    print(f"   Scanning: {FOLDER_TO_SCAN}")
    all_files = scan_folder(FOLDER_TO_SCAN)

if not all_files:
    print("\n❌ No files found. Check your folder path in main.py.")
else:
    # Step 2: Run all three detectors
    duplicates   = find_duplicates(all_files)
    large_files  = find_large_files(all_files, size_limit_mb=LARGE_FILE_LIMIT_MB)
    unused_files = find_unused_files(all_files, years=UNUSED_YEARS)

    # Step 3: Print the report
    generate_report(all_files, duplicates, large_files, unused_files)