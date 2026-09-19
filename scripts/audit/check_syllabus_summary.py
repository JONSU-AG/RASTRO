import sys
import os

sys.path.insert(0, 'scripts')
import cepreunsa_syllabus_data

syllabus = cepreunsa_syllabus_data.SYLLABUS

print(f"Total subjects in SYLLABUS: {len(syllabus)}")
for name, data in syllabus.items():
    weeks = data['weeks']
    total_topics = sum(len(w['topics']) for w in weeks)
    print(f"- {name}: {len(weeks)} semanas, {total_topics} subtemas, area={data.get('area')}")
