import json
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent
with open(BASE_DIR/"metadata.txt", "r", encoding="utf-8") as f:
    raw = f.read()

data = json.loads("{" + raw + "}")
print(data)