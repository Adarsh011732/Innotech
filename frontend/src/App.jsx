import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Overview from './components/Overview';
import ForecastView from './components/ForecastView';
import TransactionsView from './components/TransactionsView';
import GoalsView from './components/GoalsView';
import SimulatorView from './components/SimulatorView';
import XaiView from './components/XaiView';
import RecurringView from './components/RecurringView';
import CategoryOverrideModal from './components/CategoryOverrideModal';
import LoginPage, { REGIONS } from './components/LoginPage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeRegion, setActiveRegion] = useState('IN'); // Default India
  const [activeCurrency, setActiveCurrency] = useState('INR'); // Default INR
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Core Data States
  const [accountsSummary, setAccountsSummary] = useState(null);
  const [stressData, setStressData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [goalsData, setGoalsData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedTxForOverride, setSelectedTxForOverride] = useState(null);
  const [currentHorizon, setCurrentHorizon] = useState(60);

  const showToast = (msg, type = 'info') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3200);
  };

  // 1. Fetch Accounts Summary
  const fetchAccountsSummary = async () => {
    try {
      const res = await fetch('/api/accounts/summary');
      if (res.ok) setAccountsSummary(await res.json());
    } catch (e) {
      console.error('Failed to load accounts summary', e);
    }
  };

  // 2. Fetch Stress & Solvency
  const fetchStressData = async () => {
    try {
      const res = await fetch('/api/risk/stress');
      if (res.ok) setStressData(await res.json());
    } catch (e) {
      console.error('Failed to load stress data', e);
    }
  };

  // 3. Fetch Forecast
  const fetchForecastData = async (horizon = 60) => {
    try {
      const res = await fetch(`/api/forecast/cashflow?horizon_days=${horizon}`);
      if (res.ok) setForecastData(await res.json());
    } catch (e) {
      console.error('Failed to load forecast data', e);
    }
  };

  // 4. Fetch Goals & Recourse
  const fetchGoalsData = async () => {
    try {
      const res = await fetch('/api/goals');
      if (res.ok) {
        const goals = await res.json();
        if (goals.length > 0) {
          const evalRes = await fetch(`/api/goals/${goals[0].id}/evaluate`);
          if (evalRes.ok) setGoalsData(await evalRes.json());
        }
      }
    } catch (e) {
      console.error('Failed to load goals data', e);
    }
  };

  // 5. Fetch Transactions
  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions?limit=100');
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (e) {
      console.error('Failed to load transactions', e);
    }
  };

  // Master Data Refresh
  const loadAllData = async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchAccountsSummary(),
      fetchStressData(),
      fetchForecastData(currentHorizon),
      fetchGoalsData(),
      fetchTransactions()
    ]);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Horizon Change Handler
  const handleHorizonChange = async (days) => {
    setCurrentHorizon(days);
    await fetchForecastData(days);
  };

  // Category Override Handler
  const handleSaveOverride = async (txId, newCategory, applyFuture) => {
    try {
      const res = await fetch('/api/transactions/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction_id: txId,
          new_category: newCategory,
          apply_to_future: applyFuture
        })
      });
      if (res.ok) {
        showToast(`Category updated to ${newCategory}`, 'success');
        setSelectedTxForOverride(null);
        await loadAllData();
      }
    } catch (e) {
      showToast('Failed to save category override', 'danger');
    }
  };

  const handleApplyRecourse = (profileTitle) => {
    showToast(`Strategy "${profileTitle}" activated!`, 'success');
  };

  // Login handler from LoginPage with Region & Currency
  const handleLogin = (regionCode, currencyCode) => {
    setActiveRegion(regionCode);
    setActiveCurrency(currencyCode);
    setIsLoggedIn(true);
    const reg = REGIONS.find(r => r.code === regionCode) || REGIONS[0];
    showToast(`Logged in successfully. Region: ${reg.name} (${reg.currency})`, 'success');
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast('Signed out. Please select your region to log in.');
  };

  // If user is not logged in, show split-screen LoginPage with 3D Vault
  if (!isLoggedIn) {
    return (
      <LoginPage 
        onLogin={handleLogin}
        activeRegion={activeRegion}
      />
    );
  }

  return (
    <div className="flex flex-col w-screen h-screen bg-[#F3F4F7] text-zinc-900 overflow-hidden font-sans">
      
      {/* Top Horizontal Navbar from image.png */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        activeRegion={activeRegion}
        onLogout={handleLogout}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'dashboard' && (
          <Overview 
            accountsSummary={accountsSummary}
            setActiveTab={setActiveTab}
            activeRegion={activeRegion}
          />
        )}

        {activeTab === 'forecast' && (
          <ForecastView 
            forecastData={forecastData}
            onHorizonChange={handleHorizonChange}
            currentHorizon={currentHorizon}
            activeCurrency={activeCurrency}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView 
            transactions={transactions}
            onOpenOverrideModal={(tx) => setSelectedTxForOverride(tx)}
            activeCurrency={activeCurrency}
          />
        )}

        {activeTab === 'goals' && (
          <GoalsView 
            goalData={goalsData}
            onApplyRecourse={handleApplyRecourse}
            activeCurrency={activeCurrency}
          />
        )}

        {activeTab === 'recurring' && (
          <RecurringView 
            accountsSummary={accountsSummary}
            activeCurrency={activeCurrency}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorView 
            activeCurrency={activeCurrency}
          />
        )}

        {activeTab === 'xai' && (
          <XaiView />
        )}
      </main>

      {/* 1-Click Category Override Modal */}
      {selectedTxForOverride && (
        <CategoryOverrideModal 
          tx={selectedTxForOverride}
          onClose={() => setSelectedTxForOverride(null)}
          onSave={handleSaveOverride}
          activeCurrency={activeCurrency}
        />
      )}

      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#18191E] text-white px-5 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2.5 animate-dropdown text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
