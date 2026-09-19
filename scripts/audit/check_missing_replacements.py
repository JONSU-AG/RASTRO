import os

path = os.path.join('scripts', 'cepreunsa_syllabus_data.py')
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

terms = [
    ("Biotecnología", "bio_w9"),
    ("Ecorregiones", "bio_w10"),
    ("Magnetismo", "fis_w10"),
    ("Gaseoso", "qui_w10"),
    ("Filosofía de la Ciencia", "fil_w8"),
    ("Filosofía Política", "fil_w9"),
    ("Hábitos de Estudio", "psi_w2"),
    ("Sexualidad Humana", "psi_w7"),
    ("Conductas de Riesgo", "psi_w10"),
    ("Kafka", "lit_w4"),
    ("Aves sin nido", "lit_w8"),
    ("Vargas Llosa", "lit_w10")
]

for term, tag in terms:
    print(f"{tag} ({term}): {'PRESENT' if term in content else 'MISSING'}")
