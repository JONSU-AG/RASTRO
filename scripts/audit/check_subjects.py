import re
import json

with open('src/data/learningPathData.js', 'r', encoding='utf-8') as f:
    text = f.read()

# find SUBJECTS_CONFIG array
match = re.search(r'export const SUBJECTS_CONFIG = (\[[\s\S]*?\]);', text)
if match:
    data = json.loads(match.group(1))
    print(f"Total subjects in SUBJECTS_CONFIG: {len(data)}")
    for i, s in enumerate(data, 1):
        print(f"{i}. ID: {s['id']}, Name: {s['name']}, Area: {s.get('area', '')}")

# Check SUBJECT_ROADMAP keys
rm_match = re.search(r'export const SUBJECT_ROADMAP = (\{[\s\S]*?\n\};)', text)
if rm_match:
    print("\nRoadmap found!")
    # Let's count keys
    lines = rm_match.group(1).split('\n')
    keys = []
    for line in lines:
        m = re.match(r'^\s*["\']?([^"\':]+)["\']?\s*:\s*\[', line)
        if m:
            keys.append(m.group(1))
    print(f"Total keys in SUBJECT_ROADMAP: {len(keys)}")
    for k in keys:
        print(" -", k)
