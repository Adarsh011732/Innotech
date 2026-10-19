import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import ForecastView from './components/ForecastView';
import TransactionsView from './components/TransactionsView';
import GoalsView from './components/GoalsView';
import SimulatorView from './components/SimulatorView';
import XaiView from './components/XaiView';
import RecurringView from './components/RecurringView';
import CategoryOverrideModal from './components/CategoryOverrideModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPersona, setCurrentPersona] = useState('salaried');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

  // Persona Switch Handler
  const handlePersonaChange = async (newPersona) => {
    setCurrentPersona(newPersona);
    showToast(`Loading ${newPersona.toUpperCase()} persona & retraining models...`);
    try {
      const res = await fetch(`/api/data/seed/${newPersona}`, { method: 'POST' });
      if (res.ok) {
        await loadAllData();
        showToast(`Active Profile: ${newPersona.toUpperCase()}`, 'success');
      }
    } catch (e) {
      showToast('Error switching profile', 'danger');
    }
  };

  // Reset Data Handler
  const handleResetData = async () => {
    showToast('Resetting data to baseline...');
    await handlePersonaChange(currentPersona);
  };

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

  return (
    <div className="flex w-screen h-screen bg-[#090A0D] text-white overflow-hidden font-sans">
      {/* Sidebar (Fintrixity navigation) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        txCount={transactions.length}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <Header 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentPersona={currentPersona}
          onPersonaChange={handlePersonaChange}
          onResetData={handleResetData}
          isRefreshing={isRefreshing}
          stressData={stressData}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
        />

        {/* Tab Viewport */}
        {activeTab === 'dashboard' && (
          <Overview 
            accountsSummary={accountsSummary}
            stressData={stressData}
            forecastData={forecastData}
            transactions={transactions}
            onResetData={handleResetData}
            onOpenOverrideModal={(tx) => setSelectedTxForOverride(tx)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'forecast' && (
          <ForecastView 
            forecastData={forecastData}
            onHorizonChange={handleHorizonChange}
            currentHorizon={currentHorizon}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView 
            transactions={transactions}
            onOpenOverrideModal={(tx) => setSelectedTxForOverride(tx)}
          />
        )}

        {activeTab === 'goals' && (
          <GoalsView 
            goalData={goalsData}
            onApplyRecourse={handleApplyRecourse}
          />
        )}

        {activeTab === 'recurring' && (
          <RecurringView 
            accountsSummary={accountsSummary}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorView />
        )}

        {activeTab === 'xai' && (
          <XaiView />
        )}
      </div>

      {/* 1-Click Category Override Modal */}
      {selectedTxForOverride && (
        <CategoryOverrideModal 
          tx={selectedTxForOverride}
          onClose={() => setSelectedTxForOverride(null)}
          onSave={handleSaveOverride}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-[#13161C] border border-white/[0.12] text-white px-4 py-2.5 rounded-lg shadow-xl z-50 flex items-center gap-2.5 animate-dropdown text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-[#FF5722]"></span>
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
