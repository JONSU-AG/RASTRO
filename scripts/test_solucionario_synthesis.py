# -*- coding: utf-8 -*-
import sys, os, json
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath('.'))

with open('src/data/bancoPreguntasCepreunsa.json', 'r', encoding='utf-8') as f:
    banco = json.load(f)

def test_subj_sem(subj, sem):
    qs = [q for q in banco if subj.lower() in q.get('asignatura', '').lower() and q.get('semana') == sem]
    print(f"=== {subj} Semana {sem}: {len(qs)} preguntas ===")
    exps = [q.get('explanation') for q in qs if q.get('explanation') and len(q.get('explanation').strip()) > 30]
    print(f"Found {len(exps)} valid solucionario explanations.")
    for e in exps[:3]:
        print("--- EXP ---")
        print(e[:200].replace('\n', ' '))

test_subj_sem('Filosofía', 1)
test_subj_sem('Historia', 1)
test_subj_sem('Física', 1)
test_subj_sem('Química', 1)
test_subj_sem('Geografía', 1)
test_subj_sem('Cívica', 1)
