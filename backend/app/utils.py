import hashlib
import json
from datetime import datetime
from typing import Any

def scenario_hash(scenario_text: str) -> str:
    h = hashlib.sha256()
    h.update(scenario_text.encode("utf-8"))
    return h.hexdigest()[:64]

def now_iso() -> str:
    return datetime.utcnow().isoformat()

def to_json_serializable(obj: Any):
    # helper to make numeric/decimal types JSON-serializable if needed
    try:
        import decimal
        if isinstance(obj, decimal.Decimal):
            return float(obj)
    except Exception:
        pass
    return obj