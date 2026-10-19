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

  // Persona Change Handler
  const [activePersona, setActivePersona] = useState('salaried');
  const handlePersonaChange = (personaId) => {
    setActivePersona(personaId);
    const personaNames = {
      salaried: 'Rahul Sharma (Salaried Tech Lead, Bengaluru)',
      freelancer: 'Priya Patel (Independent Designer, Mumbai)',
      student: 'Aarav Mehta (Student & AI Intern, New Delhi)'
    };
    showToast(`Active Persona: ${personaNames[personaId] || personaId}`, 'success');
  };

  // Region Change Handler (drives currency automatically)
  const handleRegionChange = (regionCode) => {
    const reg = REGIONS.find(r => r.code === regionCode) || REGIONS[0];
    setActiveRegion(regionCode);
    setActiveCurrency(reg.currency);
    showToast(`Switched Region to ${reg.name} (${reg.currency} ${reg.symbol})`, 'success');
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
    <div className="relative min-h-screen w-full bg-[#E5E8EE] overflow-x-hidden flex items-center justify-center p-2 sm:p-4 lg:p-6 font-sans">
      
      {/* Ambient Blurred Extra Portion Around Webapp */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-teal-300/30 blur-[130px]" />
        <div className="absolute top-1/3 -right-32 w-[38rem] h-[38rem] rounded-full bg-blue-400/20 blur-[140px]" />
        <div className="absolute -bottom-32 left-1/4 w-[36rem] h-[36rem] rounded-full bg-indigo-300/25 blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/20 backdrop-blur-2xl pointer-events-none" />
      </div>

      {/* Floating Elevated Canvas / Tablet Container with Margins & Z-Index */}
      <div className="relative z-20 w-full max-w-[1600px] h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)] bg-[#F3F4F7] rounded-[28px] sm:rounded-[36px] border border-white/90 shadow-[0_30px_90px_-15px_rgba(0,0,0,0.14),0_0_0_1px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden backdrop-blur-xl">
        
        {/* Top Horizontal Navbar */}
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          activeRegion={activeRegion}
          onRegionChange={handleRegionChange}
          activePersona={activePersona}
          onPersonaChange={handlePersonaChange}
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
      </div>

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
