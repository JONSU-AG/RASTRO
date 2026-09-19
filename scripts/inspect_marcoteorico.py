import sys, os
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath('.'))
from scripts.unsa_official_formulas_database import FORMULAS_CATALOG

print(f"Total formulas en FORMULAS_CATALOG: {len(FORMULAS_CATALOG)}")
for k, v in FORMULAS_CATALOG.items():
    print(f" - {k}: {v.get('teorema_nombre', '')[:55]} | {v.get('formula_simple', '')[:40]}")
