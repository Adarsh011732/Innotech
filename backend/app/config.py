import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

DB_PATH = DATA_DIR / "personal_finance.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"

# Model artifact directory
MODEL_DIR = BASE_DIR / "models_cache"
MODEL_DIR.mkdir(exist_ok=True)

# Application constants
APP_TITLE = "EXT-093: Personal Finance Risk & Goal Planning Assistant"
APP_VERSION = "1.0.0"

# Default financial constants
DEFAULT_ESSENTIAL_CATEGORIES = [
    "Housing & Rent",
    "Utilities",
    "Groceries",
    "Debt & Loans",
    "Healthcare",
    "Transportation"
]

DEFAULT_DISCRETIONARY_CATEGORIES = [
    "Dining & Takeout",
    "Entertainment",
    "Shopping & Lifestyle",
    "Travel & Vacation",
    "Subscriptions"
]

IMMUTABLE_CATEGORIES = [
    "Housing & Rent",
    "Debt & Loans"
]
