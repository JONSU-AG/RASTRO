import os
import pypdf

pdf_path = r"C:\Users\Usuario\Desktop\CEPREUNSA\Tomos\RCU-0028-Aprobacion-de-TEMARIO-y-MATRIZ-ADMISION-2027.pdf"
if not os.path.exists(pdf_path):
    pdf_path = r"c:\Users\Usuario\.antigravity-ide\RUMBO\public\assets\TEMARIO-y-MATRIZ-ADMISION-2027.pdf"

print("Reading PDF:", pdf_path)
reader = pypdf.PdfReader(pdf_path)
print("Total pages:", len(reader.pages))

# Extract first 15 pages or search for tables/matrices
for i in range(min(15, len(reader.pages))):
    text = reader.pages[i].extract_text()
    first_line = text.split('\n')[0] if text else ''
    print(f"--- Page {i+1} ({first_line[:60]}) ---")
    lines = text.split('\n')
    for line in lines[:15]:
        print("  ", line)
