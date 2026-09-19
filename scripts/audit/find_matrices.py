import os

search_dirs = [
    r"C:\Users\Usuario\Desktop\CEPREUNSA",
    r"c:\Users\Usuario\.antigravity-ide\RUMBO"
]

found = []
for sdir in search_dirs:
    if os.path.exists(sdir):
        for root, dirs, files in os.walk(sdir):
            for f in files:
                lf = f.lower()
                if any(w in lf for w in ['matriz', 'evalua', 'temario', 'prospecto', 'syllabus']):
                    found.append(os.path.join(root, f))

print(f"Total files matching keywords: {len(found)}")
for p in found:
    print(p)
