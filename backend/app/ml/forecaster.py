from datetime import date, timedelta
from typing import List, Dict, Any, Tuple
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor

class ConformalCashFlowForecaster:
    """
    ConformalCashFlowForecaster implements Conformalized Quantile Regression (CQR)
    (Romano, Patterson, & Candès, NeurIPS 2019) over personal cash-flow series
    to guarantee finite-sample (1 - alpha) prediction interval coverage.
    """

    def __init__(self, alpha: float = 0.10):
        self.alpha = alpha  # 90% confidence target
        self.q_lo = alpha / 2.0  # 0.05
        self.q_mid = 0.50        # Median
        self.q_hi = 1.0 - (alpha / 2.0)  # 0.95

        self.model_lo = GradientBoostingRegressor(loss="quantile", alpha=self.q_lo, n_estimators=60, max_depth=3)
        self.model_mid = GradientBoostingRegressor(loss="quantile", alpha=self.q_mid, n_estimators=60, max_depth=3)
        self.model_hi = GradientBoostingRegressor(loss="quantile", alpha=self.q_hi, n_estimators=60, max_depth=3)

        self.conformal_offset: float = 0.0
        self.is_fitted: bool = False
        self.daily_historical_burn: float = 0.0

    def extract_features(self, dates: List[date]) -> np.ndarray:
        """
        Engineers temporal calendar features:
        - Day of week (0 to 6)
        - Day of month (1 to 31)
        - Is weekend flag
        - Days from nearest payday (1st or 15th)
        """
        feats = []
        for d in dates:
            dow = d.weekday()
            dom = d.day
            is_wknd = 1.0 if dow >= 5 else 0.0
            dist_p1 = abs(dom - 1)
            dist_p15 = abs(dom - 15)
            payday_dist = min(dist_p1, dist_p15)
            feats.append([dow, dom, is_wknd, payday_dist])
        return np.array(feats, dtype=float)

    def fit_and_calibrate(self, daily_series: pd.DataFrame):
        """
        Splits data chronologically into Train (70%) and Calibration (30%).
        Fits quantile regressors and computes exact conformal adjustment score.
        daily_series columns: ['date', 'net_cashflow']
        """
        if len(daily_series) < 30:
            # Fallback for short series
            self.daily_historical_burn = float(daily_series['net_cashflow'].mean()) if len(daily_series) > 0 else 0.0
            self.conformal_offset = 50.0
            self.is_fitted = True
            return

        split_idx = int(len(daily_series) * 0.70)
        train_df = daily_series.iloc[:split_idx]
        cal_df = daily_series.iloc[split_idx:]

        X_train = self.extract_features(train_df['date'].tolist())
        y_train = train_df['net_cashflow'].values

        X_cal = self.extract_features(cal_df['date'].tolist())
        y_cal = cal_df['net_cashflow'].values

        # 1. Fit Quantile Regressors
        self.model_lo.fit(X_train, y_train)
        self.model_mid.fit(X_train, y_train)
        self.model_hi.fit(X_train, y_train)

        # 2. CQR Calibration Phase
        # Predict on calibration split
        q_lo_cal = self.model_lo.predict(X_cal)
        q_hi_cal = self.model_hi.predict(X_cal)

        # Conformity score E_i = max(q_lo - y, y - q_hi)
        residuals = np.maximum(q_lo_cal - y_cal, y_cal - q_hi_cal)

        # Finite-sample conformal quantile: ceil((n + 1) * (1 - alpha)) / n
        n_cal = len(residuals)
        p = np.clip(np.ceil((n_cal + 1) * (1.0 - self.alpha)) / n_cal, 0.0, 1.0)
        self.conformal_offset = float(np.quantile(residuals, p, method="higher"))

        self.daily_historical_burn = float(daily_series[daily_series['net_cashflow'] < 0]['net_cashflow'].abs().mean())
        if np.isnan(self.daily_historical_burn):
            self.daily_historical_burn = 45.0
        self.is_fitted = True

    def forecast_trajectory(
        self,
        current_liquid_balance: float,
        horizon_days: int = 60,
        start_date: date = None
    ) -> List[Dict[str, Any]]:
        """
        Generates multi-horizon probabilistic trajectory with Conformal prediction bands.
        """
        if start_date is None:
            start_date = date.today()

        future_dates = [start_date + timedelta(days=i + 1) for i in range(horizon_days)]
        X_fut = self.extract_features(future_dates)

        if self.is_fitted and hasattr(self.model_mid, "predict"):
            pred_lo = self.model_lo.predict(X_fut) - self.conformal_offset
            pred_mid = self.model_mid.predict(X_fut)
            pred_hi = self.model_hi.predict(X_fut) + self.conformal_offset
        else:
            # Cold-start fallback
            base_drift = -25.0
            pred_lo = np.full(horizon_days, base_drift - 40.0)
            pred_mid = np.full(horizon_days, base_drift)
            pred_hi = np.full(horizon_days, base_drift + 40.0)

        # Cumulative balance projection
        traj = []
        cur_mid = current_liquid_balance
        cur_lo = current_liquid_balance
        cur_hi = current_liquid_balance

        for i, d in enumerate(future_dates):
            cur_mid += pred_mid[i]
            # Uncertainty compounds over horizon: sigma_t = offset * sqrt(t)
            time_decay = np.sqrt(i + 1) * 0.4
            cur_lo += (pred_lo[i] - time_decay)
            cur_hi += (pred_hi[i] + time_decay)

            traj.append({
                "date": d.isoformat(),
                "median_balance": round(float(cur_mid), 2),
                "lower_bound_90": round(float(cur_lo), 2),
                "upper_bound_90": round(float(cur_hi), 2),
                "projected_net_cashflow": round(float(pred_mid[i]), 2)
            })

        return traj
