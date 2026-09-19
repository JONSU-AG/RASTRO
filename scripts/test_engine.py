import sys, os, json
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath('.'))

from scripts.cepreunsa_syllabus_data import SYLLABUS

with open('src/data/bancoPreguntasCepreunsa.json', 'r', encoding='utf-8') as f:
    banco = json.load(f)

print(f"Loaded {len(banco)} questions and {len(SYLLABUS)} syllabus courses.")

for subj_name, subj_data in SYLLABUS.items():
    print(f"\n==================== {subj_name} ({subj_data.get('area')}) ====================")
    for w in subj_data['weeks']:
        sem = w.get('sem')
        print(f"  Semana {sem}: {w.get('title')}")
        for t_idx, t in enumerate(w.get('topics', [])):
            print(f"    {sem}.{t_idx+1}: {t.get('title')}")
