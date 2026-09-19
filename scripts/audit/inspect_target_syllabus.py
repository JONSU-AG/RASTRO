import sys
sys.path.insert(0, 'scripts')
import cepreunsa_syllabus_data

syllabus = cepreunsa_syllabus_data.SYLLABUS

targets = ["Literatura", "Filosofía", "Psicología", "Química", "Física", "Biología"]

for t in targets:
    s = syllabus.get(t, {})
    print(f"\n==================== {t.upper()} ====================")
    for w in s.get('weeks', []):
        print(f"Semana {w['sem']}: {w['title']}")
        for top in w['topics']:
            print(f"   * {top['title']} (short: {top.get('short')}, kw: {top.get('kw')})")
