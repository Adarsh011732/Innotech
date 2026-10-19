import sys
import uvicorn
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

if __name__ == "__main__":
    print("=" * 70)
    print("  EXT-093: Personal Finance Risk & Goal Planning Assistant")
    print("  Privacy Model: Local-First / Zero-Knowledge Embedded Engine")
    print("=" * 70)
    print("  Starting local API & Dashboard server on http://127.0.0.1:8000 ...")
    print("=" * 70)

    uvicorn.run(
        "backend.app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=False,
        log_level="info"
    )
