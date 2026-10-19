import React, { useState } from 'react';
import { 
  Share2, 
  MoreVertical, 
  MoreHorizontal, 
  Link2, 
  TrendingUp, 
  Download, 
  Edit2, 
  Check, 
  Gift, 
  Activity, 
  Plus, 
  Pin, 
  Trash2, 
  ChevronDown, 
  LayoutGrid, 
  List, 
  Bell, 
  Search, 
  Calendar,
  X,
  Target,
  Sparkles,
  Zap,
  ArrowUpRight
} from 'lucide-react';

export default function Overview({ 
  accountsSummary, 
  stressData, 
  forecastData, 
  transactions, 
  onResetData, 
  setActiveTab 
}) {
  // Goals Checklist State (Interactive)
  const [goals, setGoals] = useState([
    { id: 1, text: 'Read 2 books', completed: true },
    { id: 2, text: 'Sports every day', completed: false },
    { id: 3, text: 'Complete the course', completed: false },
    { id: 4, text: 'Bend down with a parachute', completed: false }
  ]);

  // Tasks In Process State (Interactive)
  const [tasks, setTasks] = useState([
    {
      id: 'task-1',
      type: 'gift',
      title: 'Buy Susan a gift for Birthday',
      date: 'Today',
      hasBell: true,
      bellActive: true
    },
    {
      id: 'task-2',
      type: 'medical',
      title: "Doctor's appointment on Tuesday",
      date: '02.09.2023',
      hasBell: true,
      bellActive: false
    }
  ]);

  // UI Interactive States
  const [activeTaskMenu, setActiveTaskMenu] = useState('task-2'); // default open on card 2 matching image
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('Tomorrow');
  const [sortBy, setSortBy] = useState('Recent');
  const [selectedDay, setSelectedDay] = useState('F'); // Friday selected matching image
  const [hoveredWeekDay, setHoveredWeekDay] = useState(null);

  // Toggle goal completion
  const toggleGoal = (id) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const completedCount = goals.filter(g => g.completed).length;

  // Add new task
  const handleAddNewTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks(prev => [
      ...prev,
      {
        id: `task-${Date.now()}`,
        type: 'custom',
        title: newTaskTitle.trim(),
        date: newTaskDate || 'Today',
        hasBell: true,
        bellActive: false
      }
    ]);
    setNewTaskTitle('');
    setShowAddTaskModal(false);
  };

  // Delete task
  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setActiveTaskMenu(null);
  };

  const weekDays = [
    { label: 'M', value: 35, sport: 40, study: 25 },
    { label: 'T', value: 45, sport: 50, study: 35 },
    { label: 'W', value: 50, sport: 45, study: 40 },
    { label: 'T', value: 40, sport: 35, study: 30 },
    { label: 'F', value: 85, sport: 85, study: 55, isPeak: true },
    { label: 'S', value: 70, sport: 65, study: 70 },
    { label: 'S', value: 55, sport: 50, study: 45 }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-9 lg:py-8 space-y-6 select-none bg-[#08090C]">
      
      {/* ========================================================= */}
      {/* HEADER SECTION (from image: Hi, Dilan! + Create / Search / Bell / Avatar) */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Hi, Dilan!</span>
            <span className="text-xl">👋</span>
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5 font-medium">
            Welcome back to your financial control center
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* + Create Pill Button (Exact from image.png) */}
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-black hover:bg-[#1A1C24] text-white border border-[#2B2E3A] px-4 py-2 rounded-full text-xs font-bold shadow-md hover:shadow-[#FF5722]/20 hover:border-[#FF5722]/50 transition-all duration-200 btn-interactive"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>Create</span>
          </button>

          {/* Search Button (Circle) */}
          <button 
            onClick={() => setActiveTab('transactions')}
            className="w-9 h-9 rounded-full bg-[#14151B] border border-[#232632] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#FF5722]/50 transition-all btn-interactive"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notification Bell (Circle with orange dot) */}
          <button 
            className="relative w-9 h-9 rounded-full bg-[#14151B] border border-[#232632] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#FF5722]/50 transition-all btn-interactive"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF5722] shadow-[0_0_8px_#FF5722]"></span>
          </button>

          {/* User Profile Avatar */}
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#2B2E3A] hover:border-[#FF5722] transition-colors cursor-pointer shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
              alt="Dilan" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="w-full h-full bg-[#242732] flex items-center justify-center text-xs font-bold text-white">D</div>';
              }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TOP ROW: Overall Information | Weekly Progress | Month Progress */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* CARD 1: Overall Information (Black Card) - 5 cols */}
        <div className="lg:col-span-5 bg-[#111217] border border-[#222530] rounded-3xl p-5 text-white flex flex-col justify-between shadow-xl card-interactive relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5722]/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div>
            {/* Header: Overall Information + Share + 3 Dots */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white tracking-tight">Overall Information</h2>
              <div className="flex items-center gap-1.5 text-[#9CA3AF]">
                <button className="p-1 hover:text-white transition-colors" title="Share">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-1 hover:text-white transition-colors" title="Options">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Big Statistics Row */}
            <div className="flex items-center gap-8 mb-5">
              <div className="flex items-baseline gap-2.5">
                <span className="text-4xl font-extrabold text-white tracking-tight">43</span>
                <span className="text-xs text-[#9CA3AF] leading-tight font-medium">
                  Tasks done<br />for all time
                </span>
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-4xl font-extrabold text-white tracking-tight">2</span>
                <span className="text-xs text-[#9CA3AF] leading-tight font-medium">
                  projects are<br />stopped
                </span>
              </div>
            </div>
          </div>

          {/* 3 Inner White/Light Cards (Exact layout from image.png) */}
          <div className="grid grid-cols-3 gap-3">
            {/* Inner Card 1: Projects */}
            <div className="bg-white rounded-2xl p-3 flex flex-col items-center justify-center text-center text-[#111215] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-6 h-6 mb-1.5 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-dashed border-[#111215] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#111215]"></div>
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight">28</span>
              <span className="text-[11px] text-[#6B7280] font-semibold">Projects</span>
            </div>

            {/* Inner Card 2: In Progress */}
            <div className="bg-white rounded-2xl p-3 flex flex-col items-center justify-center text-center text-[#111215] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-6 h-6 mb-1.5 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-dotted border-[#111215]"></div>
              </div>
              <span className="text-xl font-extrabold tracking-tight">14</span>
              <span className="text-[11px] text-[#6B7280] font-semibold">In Progress</span>
            </div>

            {/* Inner Card 3: Completed */}
            <div className="bg-white rounded-2xl p-3 flex flex-col items-center justify-center text-center text-[#111215] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-6 h-6 mb-1.5 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border border-[#111215] flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#111215] stroke-[3]" />
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight">11</span>
              <span className="text-[11px] text-[#6B7280] font-semibold">Completed</span>
            </div>
          </div>
        </div>

        {/* CARD 2: Weekly Progress (Light/Frosted Card) - 4 cols */}
        <div className="lg:col-span-4 bg-[#F8F9FA] rounded-3xl p-5 text-[#111215] flex flex-col justify-between shadow-lg card-interactive relative border border-white">
          <div>
            {/* Header: Weekly progress + link icon */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-[#111215] tracking-tight">Weekly progress</h2>
              <button className="text-[#6B7280] hover:text-[#111215] transition-colors">
                <Link2 className="w-4 h-4" />
              </button>
            </div>

            {/* Legend: • Sport  • Study */}
            <div className="flex items-center gap-4 text-xs font-semibold mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#111215]"></span>
                <span className="text-[#111215]">Sport</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#9CA3AF]"></span>
                <span className="text-[#6B7280]">Study</span>
              </div>
            </div>

            {/* Smooth Spline Chart with Peak Badge (+24%) */}
            <div className="relative h-24 my-1">
              <svg viewBox="0 0 320 90" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#111215" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#111215" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Light Study curve */}
                <path
                  d="M 10 50 Q 60 70 110 55 T 210 55 T 310 40"
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Primary Sport curve with peak at Friday (x: 235, y: 15) */}
                <path
                  d="M 10 60 Q 60 25 110 50 T 210 20 T 310 45"
                  fill="none"
                  stroke="#111215"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Shading under curve */}
                <path
                  d="M 10 60 Q 60 25 110 50 T 210 20 T 310 45 L 310 90 L 10 90 Z"
                  fill="url(#curveFill)"
                />
              </svg>

              {/* Floating Black Badge +24% (Exact position from image.png) */}
              <div className="absolute top-1 right-[22%] bg-black text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5 animate-bounce-subtle">
                <span className="text-[#FF5722] font-black">+</span>
                <span>24%</span>
              </div>
            </div>
          </div>

          {/* Days of Week (M T W T F S S with circle pills) */}
          <div className="flex items-center justify-between text-xs font-bold text-[#6B7280] pt-2 border-t border-gray-200">
            {weekDays.map((d, i) => (
              <button
                key={i}
                onClick={() => setSelectedDay(d.label)}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  selectedDay === d.label && (i === 4 || i === 5)
                    ? 'bg-[#111215] text-white shadow-sm' 
                    : 'hover:text-[#111215]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* CARD 3: Month Progress (Light/Frosted Card) - 3 cols */}
        <div className="lg:col-span-3 bg-[#F8F9FA] rounded-3xl p-5 text-[#111215] flex flex-col justify-between shadow-lg card-interactive border border-white">
          <div>
            {/* Header: Month progress + chart icon */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#111215] tracking-tight">Month progress</h2>
              <TrendingUp className="w-4 h-4 text-[#6B7280]" />
            </div>
            <p className="text-[11px] text-[#6B7280] font-medium mt-0.5 mb-3">
              +20% compared to last month*
            </p>

            {/* Split Content: Legend on Left, Multi-ring Donut on Right */}
            <div className="flex items-center justify-between my-1">
              {/* Legend */}
              <div className="flex flex-col gap-2 text-xs font-bold text-[#111215]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#111215]"></span>
                  <span>Sport</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6B7280]"></span>
                  <span>Study</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]"></span>
                  <span>Project</span>
                </div>
              </div>

              {/* Concentric Multi-ring Gauge (with 120% in center) */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Outer ring (120% wrap) */}
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#E2E8F0" strokeWidth="5" />
                  <circle 
                    cx="50" cy="50" r="42" fill="none" stroke="#111215" strokeWidth="5.5" 
                    strokeDasharray="264" strokeDashoffset="40" strokeLinecap="round" 
                  />
                  {/* Middle ring */}
                  <circle cx="50" cy="50" r="33" fill="none" stroke="#E2E8F0" strokeWidth="4.5" />
                  <circle 
                    cx="50" cy="50" r="33" fill="none" stroke="#6B7280" strokeWidth="4.5" 
                    strokeDasharray="207" strokeDashoffset="70" strokeLinecap="round" 
                  />
                  {/* Inner ring */}
                  <circle cx="50" cy="50" r="24" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                  <circle 
                    cx="50" cy="50" r="24" fill="none" stroke="#CBD5E1" strokeWidth="4" 
                    strokeDasharray="150" strokeDashoffset="50" strokeLinecap="round" 
                  />
                </svg>
                {/* 120% bold in center */}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-base font-black text-[#111215] tracking-tight">120%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Pills: Share + Download Report */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
            <button className="w-8 h-8 rounded-full bg-[#111215] text-white flex items-center justify-center hover:bg-[#252832] transition-colors btn-interactive" title="Share">
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => alert('Financial progress report compiled successfully.')}
              className="flex-1 bg-white border border-gray-300 hover:border-black text-[#111215] text-xs font-bold py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all btn-interactive shadow-sm"
            >
              <span>Download Report</span>
              <Download className="w-3.5 h-3.5 text-[#6B7280]" />
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* MIDDLE ROW: Month Goals | Tasks In Process */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* CARD 4: Month goals (Light/Frosted Card) - 4 cols */}
        <div className="lg:col-span-4 bg-[#F8F9FA] rounded-3xl p-5 text-[#111215] flex flex-col justify-between shadow-lg card-interactive border border-white">
          <div>
            {/* Header: Month goals: + Circular indicator 1/4 + Edit Pencil */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#111215] tracking-tight">Month goals:</h2>
                {/* 1/4 circular badge */}
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                    <circle 
                      cx="18" cy="18" r="14" fill="none" stroke="#111215" strokeWidth="3.5" 
                      strokeDasharray="88" 
                      strokeDashoffset={88 - (88 * (completedCount / goals.length))} 
                      strokeLinecap="round" 
                      className="transition-all duration-300"
                    />
                  </svg>
                  <span className="absolute text-[8px] font-black text-[#111215]">
                    {completedCount}/{goals.length}
                  </span>
                </div>
              </div>
              <button className="text-[#6B7280] hover:text-[#111215] transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            {/* Checklist items */}
            <div className="flex flex-col gap-3">
              {goals.map(g => (
                <div 
                  key={g.id}
                  onClick={() => toggleGoal(g.id)}
                  className="flex items-center gap-3 cursor-pointer group select-none"
                >
                  <div className={`w-4 h-4 rounded-[5px] flex items-center justify-center transition-all ${
                    g.completed 
                      ? 'bg-[#111215] text-white shadow-sm animate-check-pop' 
                      : 'border-2 border-gray-300 group-hover:border-black'
                  }`}>
                    {g.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={`text-xs font-semibold transition-all ${
                    g.completed 
                      ? 'text-[#111215] line-through opacity-70' 
                      : 'text-[#374151] group-hover:text-black'
                  }`}>
                    {g.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-[#9CA3AF] font-medium pt-3 mt-4 border-t border-gray-200 flex justify-between">
            <span>Productivity tracker</span>
            <span className="text-[#111215] font-bold">{Math.round((completedCount / goals.length) * 100)}% on track</span>
          </div>
        </div>

        {/* SECTION: Task In process (2) - 8 cols */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Task In process</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#181920] border border-[#2B2E3A] text-[#9CA3AF]">
                ({tasks.length})
              </span>
            </h2>
            <button 
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-semibold text-[#9CA3AF] hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Open archive</span>
              <span>&gt;</span>
            </button>
          </div>

          {/* Grid of Task Cards: Card 1 + Card 2 (with Dropdown) + Card 3 (+ Add task) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Task Card 1: Gift box */}
            {tasks[0] && (
              <div className="bg-[#F8F9FA] rounded-3xl p-4 text-[#111215] flex flex-col justify-between min-h-[175px] shadow-lg card-interactive border border-white">
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-[#111215]">
                    <Gift className="w-4 h-4" />
                  </div>
                  <button 
                    onClick={() => setActiveTaskMenu(activeTaskMenu === tasks[0].id ? null : tasks[0].id)}
                    className="text-[#6B7280] hover:text-[#111215]"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <div className="my-2">
                  <h3 className="text-xs font-bold text-[#111215] leading-snug">
                    {tasks[0].title}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-[11px] text-[#6B7280] font-medium">{tasks[0].date}</span>
                  <button className="w-7 h-7 rounded-full bg-[#111215] text-white flex items-center justify-center hover:bg-[#252832] transition-colors btn-interactive shadow-sm">
                    <Bell className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Task Card 2: Medical Cross with Active Dropdown Menu */}
            {tasks[1] && (
              <div className="relative bg-[#F8F9FA] rounded-3xl p-4 text-[#111215] flex flex-col justify-between min-h-[175px] shadow-lg card-interactive border border-white">
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-[#111215]">
                    <Activity className="w-4 h-4" />
                  </div>
                  <button 
                    onClick={() => setActiveTaskMenu(activeTaskMenu === tasks[1].id ? null : tasks[1].id)}
                    className="text-[#6B7280] hover:text-[#111215]"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <div className="my-2">
                  <h3 className="text-xs font-bold text-[#111215] leading-snug">
                    {tasks[1].title}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-[11px] text-[#6B7280] font-medium">{tasks[1].date}</span>
                  <button className="text-[#6B7280] hover:text-[#111215] transition-colors">
                    <Bell className="w-4 h-4" />
                  </button>
                </div>

                {/* Dropdown Menu (Exact recreation of image: Pin Note, Edit, Delete) */}
                {activeTaskMenu === tasks[1].id && (
                  <div className="absolute top-2 right-2 bg-black text-white rounded-2xl p-2 shadow-2xl border border-[#2F323E] flex flex-col gap-1 z-30 min-w-[125px] animate-dropdown">
                    <button 
                      onClick={() => setActiveTaskMenu(null)}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#1E2028] transition-colors text-left"
                    >
                      <span>Pin Note</span>
                      <Pin className="w-3.5 h-3.5 text-[#FF5722]" />
                    </button>
                    <button 
                      onClick={() => setActiveTaskMenu(null)}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#1E2028] transition-colors text-left"
                    >
                      <span>Edit</span>
                      <Edit2 className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTask(tasks[1].id)}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#1E2028] text-red-400 transition-colors text-left"
                    >
                      <span>Delete</span>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Task Card 3: Dotted "+ Add task" card (Exact from image.png) */}
            <div 
              onClick={() => setShowAddTaskModal(true)}
              className="rounded-3xl border-2 border-dashed border-[#2F3240] hover:border-[#FF5722] hover:bg-[#FF5722]/5 p-4 flex items-center justify-center flex-col min-h-[175px] cursor-pointer transition-all duration-200 group btn-interactive"
            >
              <div className="w-9 h-9 rounded-full bg-[#181A22] border border-[#2B2E3A] flex items-center justify-center text-[#9CA3AF] group-hover:text-[#FF5722] group-hover:border-[#FF5722] transition-colors mb-2">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold text-[#9CA3AF] group-hover:text-white transition-colors">
                + Add task
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* BOTTOM ROW: Last Projects (3 Dark Cards from image.png) */}
      {/* ========================================================= */}
      <div className="pt-2">
        {/* Header with Sort by and Layout Toggles */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white tracking-tight">Last Projects</h2>
          <div className="flex items-center gap-3">
            {/* Sort by dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF] cursor-pointer hover:text-white transition-colors">
              <span>Sort by</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
            {/* Grid / List Toggles */}
            <div className="flex items-center gap-1 bg-[#14151B] border border-[#232632] p-1 rounded-xl">
              <button className="p-1 rounded-lg bg-black text-white shadow-sm">
                <LayoutGrid className="w-3.5 h-3.5 text-[#FF5722]" />
              </button>
              <button className="p-1 rounded-lg text-[#6B7280] hover:text-white transition-colors">
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3 Dark Rounded Cards (Exact from image.png) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Project 1: New Schedule (3/6) */}
          <div className="bg-[#111217] border border-[#222530] rounded-3xl p-5 text-white flex flex-col justify-between shadow-xl card-interactive hover:border-[#FF5722]/50 group">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-bold text-white tracking-tight">New Schedule</h3>
                {/* 3/6 Circular meter */}
                <div className="relative w-7 h-7 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#252834" strokeWidth="3" />
                    <circle 
                      cx="18" cy="18" r="14" fill="none" stroke="#FF5722" strokeWidth="3.5" 
                      strokeDasharray="88" strokeDashoffset="44" strokeLinecap="round" 
                    />
                  </svg>
                  <span className="absolute text-[8px] font-bold text-white">3/6</span>
                </div>
              </div>

              {/* Status Dot: • In progress */}
              <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF] mb-3">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <span>In progress</span>
              </div>

              {/* Project summary line */}
              <p className="text-xs text-[#9CA3AF] leading-relaxed line-clamp-2">
                Done: Develop a new plan for Alina's education; Print a new timetable; Buy ...
              </p>
            </div>
          </div>

          {/* Project 2: Prototype animation (1/1) */}
          <div className="bg-[#111217] border border-[#222530] rounded-3xl p-5 text-white flex flex-col justify-between shadow-xl card-interactive hover:border-[#FF5722]/50 group">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-bold text-white tracking-tight">Prototype animation</h3>
                {/* 1/1 Circular meter */}
                <div className="relative w-7 h-7 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#252834" strokeWidth="3" />
                    <circle 
                      cx="18" cy="18" r="14" fill="none" stroke="#10B981" strokeWidth="3.5" 
                      strokeDasharray="88" strokeDashoffset="0" strokeLinecap="round" 
                    />
                  </svg>
                  <span className="absolute text-[8px] font-bold text-white">1/1</span>
                </div>
              </div>

              {/* Status Dot: • Completed */}
              <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF] mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Completed</span>
              </div>

              {/* Project summary line */}
              <p className="text-xs text-[#9CA3AF] leading-relaxed line-clamp-2">
                Done: Micro-interactions and motion choreography finalized for launch demo.
              </p>
            </div>
          </div>

          {/* Project 3: Ai Project 2 part (2/8) */}
          <div className="bg-[#111217] border border-[#222530] rounded-3xl p-5 text-white flex flex-col justify-between shadow-xl card-interactive hover:border-[#FF5722]/50 group">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-bold text-white tracking-tight">Ai Project 2 part</h3>
                {/* 2/8 Circular meter */}
                <div className="relative w-7 h-7 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#252834" strokeWidth="3" />
                    <circle 
                      cx="18" cy="18" r="14" fill="none" stroke="#FF5722" strokeWidth="3.5" 
                      strokeDasharray="88" strokeDashoffset="66" strokeLinecap="round" 
                    />
                  </svg>
                  <span className="absolute text-[8px] font-bold text-white">2/8</span>
                </div>
              </div>

              {/* Status Dot: • In progress */}
              <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF] mb-3">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <span>In progress</span>
              </div>

              {/* Project summary line */}
              <p className="text-xs text-[#9CA3AF] leading-relaxed line-clamp-2">
                Done: Model calibration verified against reserve threshold buffers.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: Quick Add Task Dialog */}
      {/* ========================================================= */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121319] border border-[#2A2E3D] rounded-3xl p-6 w-full max-w-md shadow-2xl text-white animate-dropdown">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Add New Task</h3>
              <button 
                onClick={() => setShowAddTaskModal(false)}
                className="text-[#9CA3AF] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#9CA3AF] mb-1.5">Task Description</label>
                <input 
                  type="text"
                  placeholder="e.g. Schedule financial audit call"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-[#181A22] border border-[#2B2E3A] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5722]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9CA3AF] mb-1.5">Due Date</label>
                <input 
                  type="text"
                  placeholder="e.g. Tomorrow or 24.10.2026"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  className="w-full bg-[#181A22] border border-[#2B2E3A] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#9CA3AF] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#FF5722] hover:bg-[#F4511E] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-[#FF5722]/30 active:scale-95 transition-all"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: + Create Dialog */}
      {/* ========================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121319] border border-[#2A2E3D] rounded-3xl p-6 w-full max-w-md shadow-2xl text-white animate-dropdown">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Create New Item</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-[#9CA3AF] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                onClick={() => { setShowCreateModal(false); setShowAddTaskModal(true); }}
                className="bg-[#181A22] border border-[#282B38] hover:border-[#FF5722] p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all btn-interactive"
              >
                <div className="w-10 h-10 rounded-full bg-[#FF5722]/15 text-[#FF5722] flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white">New Task</span>
                <span className="text-[10px] text-[#9CA3AF]">Add action item</span>
              </button>

              <button 
                onClick={() => { setShowCreateModal(false); setActiveTab('goals'); }}
                className="bg-[#181A22] border border-[#282B38] hover:border-[#FF5722] p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all btn-interactive"
              >
                <div className="w-10 h-10 rounded-full bg-[#FF5722]/15 text-[#FF5722] flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white">New Goal</span>
                <span className="text-[10px] text-[#9CA3AF]">Set financial target</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
