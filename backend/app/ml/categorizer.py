import re
from typing import Tuple, Dict, Any, List
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import f1_score

class ExpenseCategorizer:
    """
    Tiered Expense Categorization Engine:
    - Tier 0: User Overrides & Canonical Regex Rule Cache
    - Tier 1: Character N-Gram TF-IDF + Calibrated Logistic Regression
    - Confidence Thresholding & Human-in-the-Loop tagging
    """

    CANONICAL_RULES = {
        r"STEAM|PLAYSTATION|XBOX|NINTENDO|EPIC GAMES|RIOT|BLIZZARD|BARCADE": "Gaming",
        r"SWEETGREEN|CHIPOTLE|STARBUCKS|DOORDASH|UBER \*EATS|PIZZA|RESTAURANT|CAFE|SWIGGY|ZOMATO|WHOLE FOODS|TRADER JOE|KROGER|SAFEWAY|ALDI|GROCERY|SUPERMARKET": "Food & Dining",
        r"AMAZON|AMZN|TARGET|UNIQLO|SEPHORA|BEST BUY|SHOPPING|FLIPKART|MYNTRA": "Shopping",
        r"RAZORPAY|PAYPAL|BILLDESK|ONLINE PAYMENT|WALLET": "Online Payments",
        r"AVALON|RENT|LEASE|LANDLORD|PROPERTY MGMT|CONEDISON|NATIONAL GRID|VERIZON|WATER|SEWER|ELECTRIC|UTILITIES": "Bills & Utilities",
        r"UBER \*TRIP|LYFT|MTA|SUBWAY|SHELL OIL|CHEVRON|TRANSIT|GAS|OLA|PETROL|FLIGHT|AIRLINE": "Travel & Transport",
        r"NETFLIX|SPOTIFY|APPLE\.COM/BILL|EQUINOX|PLANET FITNESS|SUBSCRIPTION|PRIME|ICLOUD|YOUTUBE": "Subscriptions",
        r"COURSERA|UDEMY|BOOKSTORE|TUITION|COLLEGE|UNIVERSITY|CAMPUS|STANFORD|ACADEMY": "Education",
        r"CVS|WALGREENS|QUEST DIAGNOSTICS|PHARMACY|DOCTOR|HEALTHCARE|COPAY|HOSPITAL|CLINIC": "Healthcare",
        r"NELNET|LOAN|CHASE AUTO|CITI CARDS|DISCOVER E-PAYMENT|MORTGAGE": "Bills & Utilities",
        r"PAYROLL|DIRECT DEP|STRIPE TRANSFER|SALARY|STIPEND": "Income & Salary"
    }

    def __init__(self, confidence_threshold: float = 0.70):
        self.confidence_threshold = confidence_threshold
        self.vectorizer = TfidfVectorizer(
            analyzer="char_wb",
            ngram_range=(2, 4),
            max_features=2500,
            lowercase=True
        )
        self.base_model = LogisticRegression(max_iter=1000, C=2.0)
        self.calibrated_model = None
        self.is_trained = False
        self.user_overrides: Dict[str, str] = {}

    def clean_text(self, text: str) -> str:
        text = text.upper()
        # Remove card digits, terminal hashes, postal codes
        text = re.sub(r"#\d+", " ", text)
        text = re.sub(r"\b\d{4,}\b", " ", text)
        text = re.sub(r"[\*\-\/\.,]", " ", text)
        return " ".join(text.split())

    def add_user_override(self, merchant_raw: str, category: str):
        cleaned = self.clean_text(merchant_raw)
        self.user_overrides[cleaned] = category

    def train(self, training_data: List[Tuple[str, str]]):
        """
        Train and calibrate the model on historical transaction descriptions and labels.
        """
        texts = [self.clean_text(t[0]) for t in training_data]
        labels = [t[1] for t in training_data]

        X = self.vectorizer.fit_transform(texts)
        self.calibrated_model = CalibratedClassifierCV(
            estimator=self.base_model,
            method="sigmoid",
            cv=3
        )
        self.calibrated_model.fit(X, labels)
        self.is_trained = True

    def predict(self, description: str) -> Dict[str, Any]:
        """
        Classifies transaction description through the multi-tier pipeline.
        Returns: category, confidence, needs_review, tier_used
        """
        cleaned = self.clean_text(description)

        # Tier 0A: User override memory
        for pattern, cat in self.user_overrides.items():
            if pattern in cleaned:
                return {
                    "category": cat,
                    "confidence": 1.0,
                    "needs_review": False,
                    "tier_used": "Tier 0 (User Override Memory)"
                }

        # Tier 0B: Canonical regex rules
        for pattern, cat in self.CANONICAL_RULES.items():
            if re.search(pattern, cleaned, re.IGNORECASE):
                return {
                    "category": cat,
                    "confidence": 0.98,
                    "needs_review": False,
                    "tier_used": "Tier 0 (Deterministic Regex Engine)"
                }

        # Tier 1: Calibrated ML Model
        if not self.is_trained:
            return {
                "category": "Shopping & Lifestyle",
                "confidence": 0.50,
                "needs_review": True,
                "tier_used": "Fallback (Cold-Start)"
            }

        X = self.vectorizer.transform([cleaned])
        probs = self.calibrated_model.predict_proba(X)[0]
        max_idx = np.argmax(probs)
        confidence = float(probs[max_idx])
        predicted_category = self.calibrated_model.classes_[max_idx]

        needs_review = confidence < self.confidence_threshold

        return {
            "category": predicted_category,
            "confidence": round(confidence, 3),
            "needs_review": needs_review,
            "tier_used": "Tier 1 (Calibrated TF-IDF Classifier)"
        }

    def evaluate_macro_f1(self, test_data: List[Tuple[str, str]]) -> Dict[str, float]:
        """
        Evaluates Macro-F1 and Top-1 Accuracy across holdout data.
        """
        if not self.is_trained:
            return {"macro_f1": 0.0, "accuracy": 0.0}

        y_true = [t[1] for t in test_data]
        y_pred = [self.predict(t[0])["category"] for t in test_data]

        macro_f1 = f1_score(y_true, y_pred, average="macro", zero_division=0)
        acc = float(np.mean(np.array(y_true) == np.array(y_pred)))

        return {
            "macro_f1": round(float(macro_f1), 4),
            "accuracy": round(acc, 4)
        }
