import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import ForecastView from './components/ForecastView';
import TransactionsView from './components/TransactionsView';
import GoalsView from './components/GoalsView';
import SimulatorView from './components/SimulatorView';
import XaiView from './components/XaiView';
import CategoryOverrideModal from './components/CategoryOverrideModal';
import { Calendar as CalendarIcon, CheckSquare, Settings as SettingsIcon, Plus, Check } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPersona, setCurrentPersona] = useState('salaried');
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

  // Persona Switch Handler
  const handlePersonaChange = async (newPersona) => {
    setCurrentPersona(newPersona);
    showToast(`Loading ${newPersona.toUpperCase()} persona...`);
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
    <div className="flex w-screen h-screen bg-[#08090C] text-white overflow-hidden font-sans">
      {/* Sidebar (Exact iDraft navigation from image) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <Header 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentPersona={currentPersona}
          onPersonaChange={handlePersonaChange}
          onResetData={handleResetData}
          isRefreshing={isRefreshing}
        />

        {/* Tab Viewport */}
        {activeTab === 'dashboard' && (
          <Overview 
            accountsSummary={accountsSummary}
            stressData={stressData}
            forecastData={forecastData}
            transactions={transactions}
            onResetData={handleResetData}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'calendar' && (
          <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-9 lg:py-8 space-y-6 bg-[#08090C]">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <CalendarIcon className="w-6 h-6 text-[#FF5722]" />
                  <span>Calendar & Financial Schedule</span>
                </h1>
                <p className="text-xs text-[#9CA3AF] mt-1 font-medium">
                  Scheduled paychecks, bill due dates, and major milestone deadlines.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-[#111217] border border-[#222530] rounded-3xl p-5 text-white shadow-xl card-interactive">
                <span className="text-xs text-[#FF5722] font-bold">Today</span>
                <h3 className="text-sm font-bold text-white mt-1">Buy Susan a gift for Birthday</h3>
                <p className="text-xs text-[#9CA3AF] mt-1">Budget allocation: $65.00</p>
              </div>
              <div className="bg-[#111217] border border-[#222530] rounded-3xl p-5 text-white shadow-xl card-interactive">
                <span className="text-xs text-emerald-400 font-bold">Tuesday, 02.09</span>
                <h3 className="text-sm font-bold text-white mt-1">Doctor's appointment</h3>
                <p className="text-xs text-[#9CA3AF] mt-1">Healthcare copay: $40.00</p>
              </div>
              <div className="bg-[#111217] border border-[#222530] rounded-3xl p-5 text-white shadow-xl card-interactive">
                <span className="text-xs text-[#9CA3AF] font-bold">End of Month</span>
                <h3 className="text-sm font-bold text-white mt-1">Emergency Reserve Transfer</h3>
                <p className="text-xs text-[#9CA3AF] mt-1">Automated transfer: $350.00</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-9 lg:py-8 space-y-6 bg-[#08090C]">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <CheckSquare className="w-6 h-6 text-[#FF5722]" />
                  <span>All Tasks & Action Items</span>
                </h1>
                <p className="text-xs text-[#9CA3AF] mt-1 font-medium">
                  Prioritized tasks, review items, and upcoming milestones.
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="bg-[#FF5722] hover:bg-[#F4511E] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-[#FF5722]/30"
              >
                Return to Dashboard
              </button>
            </div>

            <div className="bg-[#111217] border border-[#222530] rounded-3xl p-6 text-white shadow-xl card-interactive space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#181A22] rounded-2xl border border-[#262936]">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-[5px] bg-[#FF5722] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Read 2 books</span>
                    <span className="block text-[10px] text-[#9CA3AF]">Completed this month</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">Done</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#181A22] rounded-2xl border border-[#262936]">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-[5px] border border-[#6B7280]"></div>
                  <div>
                    <span className="text-xs font-bold text-white">Buy Susan a gift for Birthday</span>
                    <span className="block text-[10px] text-[#9CA3AF]">Due Today</span>
                  </div>
                </div>
                <span className="text-[10px] text-[#FF5722] font-bold bg-[#FF5722]/10 px-2.5 py-0.5 rounded-full">In Progress</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#181A22] rounded-2xl border border-[#262936]">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-[5px] border border-[#6B7280]"></div>
                  <div>
                    <span className="text-xs font-bold text-white">Doctor's appointment on Tuesday</span>
                    <span className="block text-[10px] text-[#9CA3AF]">Scheduled for 02.09.2023</span>
                  </div>
                </div>
                <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-0.5 rounded-full">Upcoming</span>
              </div>
            </div>
          </div>
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

        {activeTab === 'simulator' && (
          <SimulatorView />
        )}

        {activeTab === 'xai' && (
          <XaiView />
        )}

        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-9 lg:py-8 space-y-6 bg-[#08090C]">
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <SettingsIcon className="w-6 h-6 text-[#FF5722]" />
              <span>Workspace Settings</span>
            </h1>
            <div className="bg-[#111217] border border-[#222530] rounded-3xl p-6 text-white shadow-xl card-interactive space-y-4 max-w-xl">
              <div>
                <label className="text-xs font-semibold text-[#9CA3AF]">Current Profile</label>
                <div className="text-sm font-bold text-white capitalize mt-1">{currentPersona} Profile</div>
              </div>
              <div className="pt-3 border-t border-[#1E202B]">
                <button 
                  onClick={handleResetData}
                  className="bg-[#181A22] hover:bg-[#FF5722] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                >
                  Reset Workspace Data
                </button>
              </div>
            </div>
          </div>
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
        <div className="fixed bottom-6 right-6 bg-[#111217] border border-[#FF5722]/50 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-[#FF5722]/20 z-50 flex items-center gap-3 animate-dropdown text-xs font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5722] shadow-[0_0_8px_#FF5722]"></span>
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
