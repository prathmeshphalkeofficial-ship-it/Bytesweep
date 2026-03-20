# report_generator.py
# This file prints a neat, readable summary of everything ByteSweep found.

import time

def format_size(size_mb):
    """Converts MB number into a readable string like '1.23 MB' or '2.10 GB'."""
    if size_mb >= 1024:
        return f"{round(size_mb / 1024, 2)} GB"
    return f"{size_mb} MB"

def format_date(timestamp):
    """Converts a Unix timestamp into a readable date like '2021-03-15'."""
    return time.strftime("%Y-%m-%d", time.localtime(timestamp))

def generate_report(files_info, duplicates, large_files, unused_files):
    """Prints the full ByteSweep report to the terminal."""

    print("\n" + "="*55)
    print("           🧹 BYTESWEEP SCAN REPORT")
    print("="*55)

    # --- Summary ---
    total_size_mb = sum(f["size_mb"] for f in files_info)
    print(f"\n📁 Total files scanned : {len(files_info)}")
    print(f"💾 Total size scanned  : {format_size(total_size_mb)}")

    # --- Duplicates ---
    print(f"\n{'─'*55}")
    print(f"🔁 DUPLICATE FILES — {len(duplicates)} group(s) found")
    print(f"{'─'*55}")

    if duplicates:
        for i, group in enumerate(duplicates, 1):
            wasted = group[0]["size_mb"] * (len(group) - 1)
            print(f"\n  Group {i} ({len(group)} copies | wasted: {format_size(wasted)}):")
            for f in group:
                print(f"    • {f['path']}")
    else:
        print("  No duplicates found. ✨")

    # --- Large Files ---
    print(f"\n{'─'*55}")
    print(f"📦 LARGE FILES — {len(large_files)} found")
    print(f"{'─'*55}")

    if large_files:
        for f in large_files[:10]:  # Show top 10 only
            print(f"  • {format_size(f['size_mb']):>10}  {f['path']}")
        if len(large_files) > 10:
            print(f"  ... and {len(large_files) - 10} more.")
    else:
        print("  No large files found. ✨")

    # --- Unused Files ---
    print(f"\n{'─'*55}")
    print(f"🕰️  UNUSED FILES — {len(unused_files)} found")
    print(f"{'─'*55}")

    if unused_files:
        for f in unused_files[:10]:  # Show top 10 only
            print(f"  • Last used {format_date(f['last_accessed'])}  →  {f['path']}")
        if len(unused_files) > 10:
            print(f"  ... and {len(unused_files) - 10} more.")
    else:
        print("  No unused files found. ✨")

    # --- Cleanup Estimate ---
    dup_waste = sum(g[0]["size_mb"] * (len(g) - 1) for g in duplicates)
    large_total = sum(f["size_mb"] for f in large_files)
    print(f"\n{'='*55}")
    print(f"💡 POSSIBLE CLEANUP ESTIMATE")
    print(f"{'─'*55}")
    print(f"  Duplicate waste   : {format_size(dup_waste)}")
    print(f"  Large files total : {format_size(large_total)}")
    print(f"  Unused files      : {len(unused_files)} file(s)")
    print(f"\n⚠️  ByteSweep does NOT delete anything.")
    print(f"   Review the list above before taking any action.")
    print("="*55 + "\n")