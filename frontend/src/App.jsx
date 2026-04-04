import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  Settings, 
  Search, 
  Bell, 
  LogOut, 
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import BorrowerProfile from './components/BorrowerProfile';
import GlobalPulse from './components/GlobalPulse';
import OnboardingModal from './components/OnboardingModal';
import LoanManagement from './components/LoanManagement';
import SystemConfig from './components/SystemConfig';
import './styles/index.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 border-8 border-slate-950">
        <div className="text-center space-y-6">
          <ShieldCheck size={64} className="mx-auto text-indigo-500" />
          <h2 className="text-3xl font-bold font-display text-white tracking-widest uppercase">Security Logout</h2>
          <p className="text-slate-400">Your session has been securely terminated.</p>
          <button onClick={() => setIsAuthenticated(true)} className="btn-primary mt-8">Log Back In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar navigation for Banking Officer */}
      <aside className="sidebar">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg ring-4 ring-indigo-500/10">
            L
          </div>
          <h1 className="text-xl font-bold font-display tracking-tight text-white">
            Lend<span className="text-indigo-400">risk</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
           <NavItem 
             icon={<Activity size={20} />} 
             label="Global Pulse" 
             active={activeTab === 'dashboard'} 
             onClick={() => setActiveTab('dashboard')} 
           />
           <NavItem 
             icon={<Users size={20} />} 
             label="Borrower Intelligence" 
             active={activeTab === 'profile'} 
             onClick={() => setActiveTab('profile')} 
           />
           <NavItem 
             icon={<CreditCard size={20} />} 
             label="Loan Management" 
             active={activeTab === 'loans'} 
             onClick={() => setActiveTab('loans')} 
           />
           <NavItem 
             icon={<Settings size={20} />} 
             label="System Config" 
             active={activeTab === 'config'} 
             onClick={() => setActiveTab('config')} 
           />
        </nav>

        <div className="mt-auto space-y-4 pt-6 border-t border-slate-700/50">
           <NavItem 
             icon={<LogOut size={20} />} 
             label="Security Logout" 
             onClick={() => setIsAuthenticated(false)} 
           />
        </div>
      </aside>

      <main className="main-content">
        <header className="flex justify-between items-center mb-8">
           <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                 className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" 
                 placeholder="Search borrower by ID, name or phone..." 
              />
           </div>
           
           <div className="flex items-center gap-6">
              <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                <Bell size={22} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-crimson rounded-full ring-2 ring-slate-900" />
              </button>
              <div className="flex items-center gap-3">
                 <div className="text-right">
                    <p className="text-xs font-bold text-white uppercase tracking-tighter">Bank Officer</p>
                    <p className="text-[10px] text-slate-500">M-PESA Branch #09</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-xs uppercase">
                      BA
                    </div>
                 </div>
              </div>
           </div>
        </header>

        {activeTab === 'dashboard' ? (
           <GlobalPulse 
             onAddBorrower={() => setIsModalOpen(true)}
             onViewProfile={() => setActiveTab('profile')}
           />
        ) : activeTab === 'profile' ? (
           <BorrowerProfile />
        ) : activeTab === 'loans' ? (
           <LoanManagement />
        ) : activeTab === 'config' ? (
           <SystemConfig />
        ) : (
           <div className="h-96 flex flex-col items-center justify-center text-slate-500 space-y-4">
              <Activity size={64} className="opacity-20 animate-pulse" />
              <p className="font-display text-xl font-medium">Coming Soon</p>
              <p className="text-sm">Module is under active construction.</p>
           </div>
        )}
      </main>

      <OnboardingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={() => {
          setIsModalOpen(false);
          setActiveTab('profile');
        }}
      />
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-indigo-500/10 text-white font-semibold border-l-4 border-indigo-500' 
        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
    }`}
  >
    <span className={active ? 'text-indigo-400' : 'group-hover:text-indigo-400 transition-colors'}>
      {icon}
    </span>
    <span className="text-sm">{label}</span>
  </button>
);

export default App;
