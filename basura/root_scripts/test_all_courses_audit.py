import json
import re

# Cargar el banco oficial
with open('src/data/bancoPreguntasCepreunsa.json', 'r', encoding='utf-8') as f:
    banco = json.load(f)

print(f"Total de preguntas en banco: {len(banco)}")

# Cargar la teoría oficial de cepreunsaOfficialTheory.js
with open('src/data/cepreunsaOfficialTheory.js', 'r', encoding='utf-8') as f:
    theory_content = f.read()

courses = [
    ('Filosofía', 'filosof'),
    ('Biología', 'biolog'),
    ('Lenguaje', 'lengua'),
    ('Historia', 'histor'),
    ('Psicología', 'psicol'),
    ('Física', 'fisic'),
    ('Química', 'quimic'),
    ('Cívica', 'civic'),
    ('Geografía', 'geograf'),
    ('Raz. Lógico', 'logic'),
    ('Raz. Matemático', 'matem'),
    ('Raz. Verbal', 'verbal'),
    ('Literatura', 'literat'),
    ('Álgebra', 'algeb'),
    ('Inglés', 'ingl')
]

results = []

for name, kw in courses:
    has_theory = f"'{name}':" in theory_content or f'"{name}":' in theory_content
    qs = [q for q in banco if kw in (q.get('asignatura') or '').lower()]
    
    valid_qs = 0
    clean_options = 0
    has_formula = 0
    
    sample_q = None
    if qs:
        sample_q = qs[0]
        for q in qs:
            opts = q.get('options', [])
            ans = q.get('answer')
            if opts and ans is not None and 0 <= ans < len(opts):
                valid_qs += 1
                if len(opts) >= 4:
                    clean_options += 1
            text = (q.get('q') or '') + ' ' + (q.get('explanation') or '')
            if any(sym in text for sym in ['^', '√', '²', '³', 'Δ', 'λ', 'Ω', 'μ', '∑', '∫', '+', '=', '/']):
                has_formula += 1
                
    sec_pattern = re.compile(rf"'{re.escape(name)}':.*?title:\s*'([^']+)'", re.DOTALL)
    m = sec_pattern.search(theory_content)
    t_title = m.group(1) if m else "No extraído"

    status = {
        'curso': name,
        'has_theory': has_theory,
        'theory_title': t_title,
        'banco_count': len(qs),
        'valid_structure': (valid_qs == len(qs)) if qs else False,
        'clean_options': clean_options,
        'has_formula_or_symbol': has_formula > 0,
        'sample_q': sample_q.get('q')[:90] + '...' if sample_q and sample_q.get('q') else None,
        'sample_correct': sample_q['options'][sample_q['answer']] if sample_q and sample_q.get('options') else None
    }
    results.append(status)

print("\n========================================================")
print("AUDITORÍA DE LOS 15 CURSOS - PERSPECTIVA DEL ESTUDIANTE")
print("========================================================")
all_pass = True
for r in results:
    is_ok = (r['has_theory'] and r['banco_count'] > 0 and r['valid_structure'])
    icon = "✅" if is_ok else "❌"
    if not is_ok:
        all_pass = False
    print(f"\n{icon} CURSO: {r['curso']}")
    print(f"   • Teoría General CEPREUNSA: {'SÍ' if r['has_theory'] else 'NO'} -> {r['theory_title']}")
    print(f"   • Preguntas en Banco: {r['banco_count']} (Estructura 100% válida: {r['valid_structure']})")
    print(f"   • Opciones (A,B,C,D,E): {r['clean_options']} preguntas con 4 o 5 opciones")
    print(f"   • Notación matemática/símbolos: {'Presente' if r['has_formula_or_symbol'] else 'Texto plano'}")
    print(f"   • Pregunta Inicial: {r['sample_q']}")
    print(f"   • Respuesta Deducible: {r['sample_correct']}")

print("\n--------------------------------------------------------")
print(f"RESULTADO GLOBAL: {'TODOS LOS 15 CURSOS ACTIVOS Y LISTOS' if all_pass else 'HAY CURSOS CON FALLAS'}")
