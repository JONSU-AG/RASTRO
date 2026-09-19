import sys
sys.path.insert(0, 'scripts')
import cepreunsa_syllabus_data

syllabus = cepreunsa_syllabus_data.SYLLABUS

checklist = {
    "Literatura": [
        "Metamorfosis", "Kafka", "Borges", "Ña Catita", "Aves sin nido", 
        "Arguedas", "Vargas Llosa", "Reynoso", "Quijote", "Edipo"
    ],
    "Filosofía": [
        "Medieval", "Latinoamér", "Ciencia", "Epistemolog", "Política"
    ],
    "Psicología": [
        "Proyecto de Vida", "Hábitos de estudio", "Conductas de riesgo", "Sexualidad"
    ],
    "Química": [
        "Gaseoso", "Soluciones", "Hidrocarburos", "Oxigenadas"
    ],
    "Física": [
        "Fluidos", "Hidrostática", "Calor", "Térmic", "Magnetis", "Inducción"
    ],
    "Biología": [
        "Biotecnolog", "Bioética", "Ecorregiones", "Sostenibil", "ODS"
    ]
}

print("VERIFICANDO COBERTURA DE LOS TEMAS EN cepreunsa_syllabus_data.py:")
for subj, terms in checklist.items():
    print(f"\n--- {subj} ---")
    weeks = syllabus.get(subj, {}).get('weeks', [])
    all_text = ""
    for w in weeks:
        all_text += " " + w['title']
        for t in w['topics']:
            all_text += " " + t['title'] + " " + t.get('short', '') + " " + t.get('kw', '')
            
    for term in terms:
        found = term.lower() in all_text.lower()
        print(f"  [{'✓' if found else '✗'}] {term}")
