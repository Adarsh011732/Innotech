import random
from datetime import date, timedelta
from typing import List, Dict, Any
import numpy as np

class SimFinEngine:
    """
    SimFinEngine generates realistic, non-stationary personal finance transaction ledgers
    with authentic merchant text strings, pay cycles, recurring bills, and economic shocks.
    """

    CATEGORIES = [
        "Housing & Rent",
        "Utilities",
        "Groceries",
        "Debt & Loans",
        "Healthcare",
        "Transportation",
        "Dining & Takeout",
        "Entertainment",
        "Shopping & Lifestyle",
        "Subscriptions",
        "Income & Salary"
    ]

    MERCHANT_POOLS = {
        "Food & Dining": [
            ("SWIGGY BANGALORE ONLINE", 12.00, 32.00),
            ("ZOMATO GOURMET DINING", 15.00, 45.00),
            ("TST* SWEETGREEN 4295 NY", 14.50, 22.00),
            ("CHIPOTLE 1928 ONLINE", 12.00, 19.50),
            ("STARBUCKS STORE 11492", 5.50, 9.75),
            ("DOORDASH*SHAKE SHACK", 24.00, 48.00),
            ("JOE'S PIZZA GREENWICH", 8.00, 28.00),
            ("TRADER JOE'S #542 NYC", 45, 135),
            ("WHOLE FOODS MARKET SOHO", 65, 190)
        ],
        "Gaming": [
            ("STEAM PURCHASE GAMES", 19.99, 69.99),
            ("PLAYSTATION NETWORK STORE", 29.99, 79.99),
            ("XBOX LIVE GOLD SUBSCR", 14.99, 59.99),
            ("NINTENDO ESHOP DIGITAL", 19.99, 59.99),
            ("EPIC GAMES STORE ONLINE", 14.99, 49.99)
        ],
        "Shopping": [
            ("AMZN Mktp US* 8H2910G", 18.50, 125.00),
            ("FLIPKART INTERNET ORDER", 22.00, 95.00),
            ("TARGET ST. 1824 NEW YORK", 22.00, 95.00),
            ("UNIQLO SOHO FIFTH AVE", 39.00, 110.00),
            ("SEPHORA USA #492", 35.00, 85.00)
        ],
        "Online Payments": [
            ("RAZORPAY DIGITAL CHECKOUT", 15.00, 85.00),
            ("PAYPAL TRANSFER DIGITAL", 25.00, 120.00),
            ("STRIPE CHECKOUT PAYMENT", 20.00, 95.00),
            ("BILLDESK SERVICE PAYMENT", 18.00, 65.00)
        ],
        "Bills & Utilities": [
            ("CONEDISON ELEC & GAS", 85, 175),
            ("NATIONAL GRID UTIL", 60, 140),
            ("VERIZON FIOS INTERNET", 79.99, 89.99),
            ("AIRTEL BROADBAND FIBER", 30.00, 55.00),
            ("AVALON PROPERTY MGMT ACH", 1800, 2400)
        ],
        "Travel & Transport": [
            ("UBER *TRIP 8492 SAN FRANCISCO", 14.50, 42.00),
            ("OLA CABS TRIP BENGALURU", 8.50, 26.00),
            ("LYFT *RIDE MON 4PM", 16.00, 38.00),
            ("SHELL OIL 574829 QPS", 35.00, 65.00),
            ("CHEVRON FUEL STATION", 40.00, 70.00),
            ("MTA SUBWAY VENDING NY", 2.90, 34.00)
        ],
        "Subscriptions": [
            ("NETFLIX.COM DIGITAL", 19.99, 19.99),
            ("SPOTIFY USA STREAMING", 11.99, 11.99),
            ("APPLE.COM/BILL ICLOUD", 2.99, 9.99),
            ("EQUINOX GYM CLUB CHARGE", 190.00, 240.00),
            ("PLANET FITNESS AUTO-DEBIT", 15.00, 24.99)
        ],
        "Education": [
            ("COURSERA PLUS LEARNING", 39.00, 79.00),
            ("UDEMY ONLINE COURSES", 12.99, 34.99),
            ("CAMPUS BOOKSTORE TEXTBOOKS", 45.00, 140.00),
            ("STANFORD ONLINE CERTIFICATE", 95.00, 250.00)
        ],
        "Healthcare": [
            ("CVS PHARMACY #0492", 15, 65),
            ("WALGREENS STORE 391", 20, 75),
            ("QUEST DIAGNOSTICS LAB", 45, 150),
            ("ONE MEDICAL GROUP COPAY", 35, 35),
            ("APOLLO PHARMACY DIGITAL", 12.00, 45.00)
        ],
        "Other": [
            ("LOCAL HARDWARE STORE", 14.00, 45.00),
            ("POSTAL COURIER EXPRESS", 12.00, 35.00),
            ("ATM SURCHARGE WITHDRAWAL", 3.00, 5.00)
        ]
    }

    @classmethod
    def generate_persona_data(cls, persona: str = "salaried", days_history: int = 180) -> Dict[str, Any]:
        """
        Generate complete ledger for a chosen user profile.
        """
        np.random.seed(42 if persona == "salaried" else 99)
        random.seed(42 if persona == "salaried" else 99)

        end_date = date.today()
        start_date = end_date - timedelta(days=days_history)

        accounts = []
        transactions = []
        goals = []

        if persona == "salaried":
            # Salaried Professional: $6,500 net monthly, stable
            accounts = [
                {"id": "acc_chk", "name": "Chase Premier Checking", "account_type": "checking", "balance": 4850.00},
                {"id": "acc_sav", "name": "Marcus High Yield Savings", "account_type": "savings", "balance": 14200.00},
                {"id": "acc_cc", "name": "Sapphire Reserve Card", "account_type": "credit_card", "balance": 820.00}
            ]
            goals = [
                {
                    "id": "goal_emergency_fund",
                    "title": "6-Month Emergency Reserve",
                    "target_amount": 18000.00,
                    "current_amount": 14200.00,
                    "deadline": end_date + timedelta(days=120),
                    "category": "Emergency Fund"
                },
                {
                    "id": "goal_japan_trip",
                    "title": "Tokyo Vacation Goal",
                    "target_amount": 4000.00,
                    "current_amount": 1200.00,
                    "deadline": end_date + timedelta(days=210),
                    "category": "Travel"
                }
            ]
            monthly_income = 6500.0
            rent_amount = 2100.0

        elif persona == "freelancer":
            # Freelancer: volatile income ($2,500 to $7,000/mo)
            accounts = [
                {"id": "acc_chk", "name": "Mercury Business Checking", "account_type": "checking", "balance": 2650.00},
                {"id": "acc_sav", "name": "Ally Rainy Day Fund", "account_type": "savings", "balance": 4100.00},
                {"id": "acc_cc", "name": "Amex Blue Cash", "account_type": "credit_card", "balance": 1450.00}
            ]
            goals = [
                {
                    "id": "goal_emergency_fund",
                    "title": "Freelancer Buffer Fund",
                    "target_amount": 12000.00,
                    "current_amount": 4100.00,
                    "deadline": end_date + timedelta(days=180),
                    "category": "Emergency Fund"
                }
            ]
            monthly_income = 4800.0
            rent_amount = 1750.0

        else:  # student_paycheck
            # Tight margin: $1,500/mo, low buffer, high stress
            accounts = [
                {"id": "acc_chk", "name": "College Checking Account", "account_type": "checking", "balance": 395.00},
                {"id": "acc_sav", "name": "Emergency Cushion", "account_type": "savings", "balance": 450.00},
                {"id": "acc_cc", "name": "Discover Student Card", "account_type": "credit_card", "balance": 780.00}
            ]
            goals = [
                {
                    "id": "goal_emergency_fund",
                    "title": "Starter $1,000 Emergency Fund",
                    "target_amount": 1000.00,
                    "current_amount": 450.00,
                    "deadline": end_date + timedelta(days=90),
                    "category": "Emergency Fund"
                }
            ]
            monthly_income = 1500.0
            rent_amount = 650.0

        current_cursor = start_date
        tx_counter = 1

        while current_cursor <= end_date:
            day_of_month = current_cursor.day

            # 1. Income stream
            if persona == "salaried":
                if day_of_month in [1, 15]:
                    transactions.append({
                        "id": f"tx_{tx_counter:05d}",
                        "account_id": "acc_chk",
                        "date": current_cursor,
                        "description": "TECH CORP PAYROLL DIRECT DEP",
                        "amount": round(monthly_income / 2.0, 2),
                        "tx_type": "credit",
                        "category": "Income & Salary",
                        "confidence": 0.99,
                        "needs_review": False,
                        "is_recurring": True,
                        "is_user_overridden": False
                    })
                    tx_counter += 1

            elif persona == "freelancer":
                # Poisson arrival of client invoices
                if random.random() < 0.08:
                    payout = round(random.uniform(850.0, 2600.0), 2)
                    transactions.append({
                        "id": f"tx_{tx_counter:05d}",
                        "account_id": "acc_chk",
                        "date": current_cursor,
                        "description": f"STRIPE TRANSFER {random.choice(['DESIGN STUDIO', 'TECH CONSULTING', 'MEDIA PROJECT'])}",
                        "amount": payout,
                        "tx_type": "credit",
                        "category": "Income & Salary",
                        "confidence": 0.96,
                        "needs_review": False,
                        "is_recurring": False,
                        "is_user_overridden": False
                    })
                    tx_counter += 1

            else:  # student
                if day_of_month in [5, 20]:
                    transactions.append({
                        "id": f"tx_{tx_counter:05d}",
                        "account_id": "acc_chk",
                        "date": current_cursor,
                        "description": "CAMPUS BOOKSTORE STIPEND ACH",
                        "amount": 750.00,
                        "tx_type": "credit",
                        "category": "Income & Salary",
                        "confidence": 0.98,
                        "needs_review": False,
                        "is_recurring": True,
                        "is_user_overridden": False
                    })
                    tx_counter += 1

            # 2. Monthly Fixed Rent on 1st
            if day_of_month == 1:
                transactions.append({
                    "id": f"tx_{tx_counter:05d}",
                    "account_id": "acc_chk",
                    "date": current_cursor,
                    "description": "AVALON PROPERTY MGMT ACH RENT",
                    "amount": rent_amount,
                    "tx_type": "debit",
                    "category": "Housing & Rent",
                    "confidence": 0.99,
                    "needs_review": False,
                    "is_recurring": True,
                    "is_user_overridden": False
                })
                tx_counter += 1

            # 3. Monthly Recurring Utilities on 5th
            if day_of_month == 5:
                transactions.append({
                    "id": f"tx_{tx_counter:05d}",
                    "account_id": "acc_chk",
                    "date": current_cursor,
                    "description": "CONEDISON ELEC & GAS",
                    "amount": round(random.uniform(90, 145), 2),
                    "tx_type": "debit",
                    "category": "Utilities",
                    "confidence": 0.97,
                    "needs_review": False,
                    "is_recurring": True,
                    "is_user_overridden": False
                })
                tx_counter += 1

            # 4. Monthly Subscriptions on 12th
            if day_of_month == 12:
                transactions.append({
                    "id": f"tx_{tx_counter:05d}",
                    "account_id": "acc_cc",
                    "date": current_cursor,
                    "description": "NETFLIX.COM DIGITAL",
                    "amount": 19.99,
                    "tx_type": "debit",
                    "category": "Subscriptions",
                    "confidence": 0.99,
                    "needs_review": False,
                    "is_recurring": True,
                    "is_user_overridden": False
                })
                tx_counter += 1
                transactions.append({
                    "id": f"tx_{tx_counter:05d}",
                    "account_id": "acc_cc",
                    "date": current_cursor,
                    "description": "SPOTIFY USA STREAMING",
                    "amount": 11.99,
                    "tx_type": "debit",
                    "category": "Subscriptions",
                    "confidence": 0.99,
                    "needs_review": False,
                    "is_recurring": True,
                    "is_user_overridden": False
                })
                tx_counter += 1

            # 5. Stochastic Discretionary Spending (Food, Groceries, Shopping, Uber)
            # Probability varies between weekday and weekend
            is_weekend = current_cursor.weekday() >= 5
            num_txs = random.choices([0, 1, 2, 3], weights=[0.2, 0.45, 0.25, 0.1] if not is_weekend else [0.1, 0.3, 0.4, 0.2])[0]

            for _ in range(num_txs):
                cat = random.choices([
                    "Food & Dining", "Shopping", "Gaming",
                    "Travel & Transport", "Subscriptions", "Bills & Utilities",
                    "Online Payments", "Education", "Healthcare", "Other"
                ], weights=[0.25, 0.18, 0.12, 0.12, 0.08, 0.08, 0.06, 0.04, 0.04, 0.03])[0]
                merchant, min_v, max_v = random.choice(cls.MERCHANT_POOLS[cat])
                
                # Scale amounts if student
                factor = 0.55 if persona == "student" else 1.0
                val = round(random.uniform(min_v * factor, max_v * factor), 2)

                # Simulated classifier confidence
                # Ambiguous string receives lower confidence to demonstrate Tier 1 / review tag
                is_ambiguous = random.random() < 0.08
                confidence = round(random.uniform(0.55, 0.69), 2) if is_ambiguous else round(random.uniform(0.88, 0.99), 2)

                transactions.append({
                    "id": f"tx_{tx_counter:05d}",
                    "account_id": "acc_chk" if cat == "Groceries" else "acc_cc",
                    "date": current_cursor,
                    "description": merchant,
                    "amount": val,
                    "tx_type": "debit",
                    "category": cat,
                    "confidence": confidence,
                    "needs_review": is_ambiguous,
                    "is_recurring": False,
                    "is_user_overridden": False
                })
                tx_counter += 1

            # 6. Occasional financial shock events (every ~75 days)
            if current_cursor.day == 22 and current_cursor.month in [3, 8]:
                transactions.append({
                    "id": f"tx_{tx_counter:05d}",
                    "account_id": "acc_cc",
                    "date": current_cursor,
                    "description": "MIDAS AUTO REPAIR & BRAKES",
                    "amount": 540.00 if persona != "student" else 280.00,
                    "tx_type": "debit",
                    "category": "Transportation",
                    "confidence": 0.92,
                    "needs_review": False,
                    "is_recurring": False,
                    "is_user_overridden": False
                })
                tx_counter += 1

            current_cursor += timedelta(days=1)

        return {
            "accounts": accounts,
            "transactions": transactions,
            "goals": goals,
            "persona": persona
        }
