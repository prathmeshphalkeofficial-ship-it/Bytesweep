# unused_file_detector.py
# This file finds files you haven't opened in a long time (default: 2 years).

import time

def find_unused_files(files_info, years=2):
    """
    Returns files that haven't been accessed for more than 'years' years.
    'last_accessed' is stored as a Unix timestamp (number of seconds since 1970).
    """
    print(f"🕰️  Checking for files not accessed in over {years} year(s)...")

    # Calculate what time it was 'years' ago (in seconds)
    seconds_in_a_year = 365 * 24 * 60 * 60
    cutoff_time = time.time() - (years * seconds_in_a_year)

    unused_files = []

    for file in files_info:
        if file["last_accessed"] < cutoff_time:
            unused_files.append(file)

    # Sort by oldest first
    unused_files.sort(key=lambda f: f["last_accessed"])

    print(f"✅ Found {len(unused_files)} unused files.")
    return unused_files