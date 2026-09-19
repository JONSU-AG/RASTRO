import os
import json
import re

with open('src/data/learningPathData.js', 'r', encoding='utf-8') as f:
    text = f.read()

config_match = re.search(r'export const SUBJECTS_CONFIG\s*=\s*(\{[\s\S]*?\n\};)', text)
if config_match:
    print("SUBJECTS_CONFIG found")
    # find lines with name: and area:
    lines = config_match.group(1).split('\n')
    current_key = ""
    for line in lines:
        k_m = re.match(r'^\s*(\w+):\s*\{', line)
        if k_m:
            current_key = k_m.group(1)
        name_m = re.search(r'name:\s*[\'"]([^\'"]+)[\'"]', line)
        area_m = re.search(r'area:\s*[\'"]([^\'"]+)[\'"]', line)
        if name_m:
            print(f"Key: {current_key}, Name: {name_m.group(1)}")
        if area_m:
            print(f"  Area: {area_m.group(1)}")

# Check SUBJECT_ROADMAP
roadmap_keys = re.findall(r'(\w+):\s*\[\s*\{', text)
print("\nRoadmap subject keys:", roadmap_keys)

# Count nodes and subtemas per subject
for key in roadmap_keys:
    # count subtemas
    subtemas_count = len(re.findall(rf'{key}_s\d+_p\d+', text))
    # count main planets
    planets_count = len(re.findall(rf'id:\s*[\'"]{key}_s\d+[\'"]', text))
    print(f"Subject {key}: {planets_count} planets, {subtemas_count} subtemas")
