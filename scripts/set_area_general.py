# -*- coding: utf-8 -*-
import re

with open('scripts/cepreunsa_syllabus_data.py', 'r', encoding='utf-8') as f:
    content = f.read()

new_content = re.sub(r'\"area\":\s*\"[^\"]+\"', '\"area\": \"General\"', content)

with open('scripts/cepreunsa_syllabus_data.py', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('[OK] Updated cepreunsa_syllabus_data.py: all courses are area: "General"')
