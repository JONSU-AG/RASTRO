import os
import glob

base_path = r"C:\Users\Usuario\Desktop\CEPREUNSA\CEPREUNSA.- bio\CEPREUNSA"
if os.path.exists(base_path):
    print("Found base path:", base_path)
    for root, dirs, files in os.walk(base_path):
        depth = root.replace(base_path, '').count(os.sep)
        if depth <= 2:
            print(f"{'  '*depth}Dir: {os.path.basename(root)} ({len(files)} files, {len(dirs)} subdirs)")
            for f in files[:5]:
                print(f"{'  '*(depth+1)}- {f}")
            if len(files) > 5:
                print(f"{'  '*(depth+1)}... and {len(files)-5} more files")
else:
    print("Base path NOT found:", base_path)
