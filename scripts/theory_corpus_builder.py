# -*- coding: utf-8 -*-
"""
GENERADOR MAESTRO DE TEORÍA ACADÉMICA OFICIAL CEPREUNSA / UNSA (600 SUBTEMAS)
Genera marco teórico denso, secciones analíticas, fórmulas KaTeX canónicas
y claves de admisión para los 15 cursos oficiales de la Universidad Nacional de San Agustín.
Cero texto genérico o boilerplate: 100% sustancia conceptual rigurosa.
"""

import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

WORKSPACE = r"c:\Users\Usuario\.antigravity-ide\RUMBO"
OUTPUT_LEARNING_PATH = os.path.join(WORKSPACE, "src", "data", "learningPathData.js")
OUTPUT_THEORY = os.path.join(WORKSPACE, "src", "data", "cepreunsaOfficialTheory.js")
BANCO_JSON = os.path.join(WORKSPACE, "src", "data", "bancoPreguntasCepreunsa.json")

from cepreunsa_syllabus_data import SYLLABUS
print(f"Loaded SYLLABUS with {len(SYLLABUS)} courses.")

# Cargar banco de preguntas
with open(BANCO_JSON, "r", encoding="utf-8") as f:
    BANCO_QUESTIONS = json.load(f)
print(f"Loaded {len(BANCO_QUESTIONS)} questions from bancoPreguntasCepreunsa.json.")

# Mapa de preguntas agrupadas por asignatura y semana
questions_by_course_week = {}
for q in BANCO_QUESTIONS:
    c = q.get("asignatura", "").strip()
    w = q.get("semana", 1)
    k = (c.lower(), w)
    if k not in questions_by_course_week:
        questions_by_course_week[k] = []
    questions_by_course_week[k].append(q)

def get_questions_for(course_name, week_num, sub_idx, kw=""):
    # Buscar preguntas que coincidan con la materia y semana
    c_lower = course_name.lower()
    candidates = []
    for (c, w), qlist in questions_by_course_week.items():
        if c in c_lower or c_lower in c:
            if w == week_num:
                candidates.extend(qlist)
    
    if not candidates:
        # Fallback a cualquier semana de la materia
        for (c, w), qlist in questions_by_course_week.items():
            if c in c_lower or c_lower in c:
                candidates.extend(qlist)

    if not candidates:
        # Fallback global
        candidates = BANCO_QUESTIONS

    # Filtrar por palabra clave si es posible
    kw_matches = []
    if kw:
        kw_low = kw.lower()
        for q in candidates:
            if kw_low in q.get("q", "").lower() or kw_low in (q.get("explanation") or "").lower():
                kw_matches.append(q)
    
    pool = kw_matches if len(kw_matches) >= 4 else candidates
    start = (sub_idx * 4) % max(1, len(pool))
    slice_q = pool[start : start + 4]
    if len(slice_q) < 4:
        slice_q = pool[:4]
    return slice_q
