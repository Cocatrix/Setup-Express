from pathlib import Path
import json

_BASE = Path(__file__).resolve().parent.parent
_DATA_FILE = _BASE / "mysite" / "static" / "data" / "current_game_boxes.json"
_DATA_FILE.parent.mkdir(parents=True, exist_ok=True)

_cached_keys = None

def write_boxes(keys):
    global _cached_keys
    if keys == _cached_keys:
        return
    with _DATA_FILE.open("w", encoding="utf-8") as f:
        json.dump(keys, f, ensure_ascii=False, indent=2)
    _cached_keys = list(keys)
