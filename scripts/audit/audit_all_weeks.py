import sys
import os

# Set UTF-8 for stdout
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'scripts')
import cepreunsa_syllabus_data

syllabus = cepreunsa_syllabus_data.SYLLABUS

out_lines = []
out_lines.append("# AUDITORÍA COMPLETA DE COBERTURA: 15 ASIGNATURAS x 10 SEMANAS = 600 SUBTEMAS")
out_lines.append("")

for course, data in syllabus.items():
    out_lines.append(f"## 📚 {course} (10 Semanas - 40 Subtemas)")
    for w in data['weeks']:
        out_lines.append(f"- **{w['title']}**")
        for t in w['topics']:
            out_lines.append(f"    * {t['title']}")
    out_lines.append("")

with open("audit_syllabus_output.md", "w", encoding="utf-8") as f:
    f.write("\n".join(out_lines))

print("Wrote audit_syllabus_output.md successfully!")
