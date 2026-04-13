import React, { useState, useEffect } from 'react';
import {
  Users,
  Activity,
  Settings,
  Search,
  Bell,
  LogOut,
  CreditCard,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import BorrowerProfile from './components/BorrowerProfile';
import GlobalPulse from './components/GlobalPulse';
import OnboardingModal from './components/OnboardingModal';
import LoanManagement from './components/LoanManagement';
import SystemConfig from './components/SystemConfig';
import './styles/index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [selectedBorrowerId, setSelectedBorrowerId] = useState(null);
  const [alertCount, setAlertCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAlertCount = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/alerts?resolved=false`);
      const data = await response.json();
      if (data.status === 'success') {
        setAlertCount(data.data.length);
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
      // Default to showing alert indicator for demo
      setAlertCount(3);
    }
  };

  useEffect(() => {
    fetchAlertCount();
  }, []);

  const handleViewProfile = (borrowerId) => {
    setSelectedBorrowerId(borrowerId);
    setActiveTab('profile');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      // If search query is entered, switch to profile tab to show search results
      setActiveTab('profile');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 border-8 border-slate-950">
        <div className="text-center space-y-6">
          <ShieldCheck size={64} className="mx-auto text-indigo-500" />
          <h2 className="text-3xl font-bold font-display text-white tracking-widest uppercase">Logged Out</h2>
          <p className="text-slate-400">You have been securely logged out.</p>
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
            label="Overview"
            active={activeTab === 'dashboard'}
            onClick={() => { setActiveTab('dashboard'); setSelectedBorrowerId(null); }}
          />
          <NavItem
            icon={<Users size={20} />}
            label="Borrower Profiles"
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          />
          <NavItem
            icon={<CreditCard size={20} />}
            label="Loan Management"
            active={activeTab === 'loans'}
            onClick={() => setActiveTab('loans')}
          />
          <div className="pt-4 mt-4 border-t border-slate-700/50">
            <NavItem
              icon={
                <div className="relative">
                  <AlertTriangle size={20} />
                  {alertCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                      {alertCount > 9 ? '9+' : alertCount}
                    </span>
                  )}
                </div>
              }
              label="Alert Center"
              active={activeTab === 'alerts'}
              onClick={() => setActiveTab('alerts')}
            />
          </div>
          <NavItem
            icon={<Settings size={20} />}
            label="Settings"
            active={activeTab === 'config'}
            onClick={() => setActiveTab('config')}
          />
        </nav>

        <div className="mt-auto space-y-4 pt-6 border-t border-slate-700/50">
          <NavItem
            icon={<LogOut size={20} />}
            label="Logout"
            onClick={() => setIsAuthenticated(false)}
          />
        </div>
      </aside>

      <main className="main-content">
        <header className="flex justify-between items-center mb-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch(searchQuery);
              }}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="Search borrower by ID, name or phone..."
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors" onClick={() => setActiveTab('alerts')}>
              <Bell size={22} />
              {alertCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-crimson rounded-full ring-2 ring-slate-900" />
              )}
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-white uppercase tracking-tighter">Loan Officer</p>
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
            onViewProfile={handleViewProfile}
          />
        ) : activeTab === 'profile' ? (
          <BorrowerProfile borrowerId={selectedBorrowerId} />
        ) : activeTab === 'loans' ? (
          <LoanManagement />
        ) : activeTab === 'alerts' ? (
          <AlertCenter onViewBorrower={handleViewProfile} />
        ) : activeTab === 'config' ? (
          <SystemConfig />
        ) : (
          <div className="h-96 flex flex-col items-center justify-center text-slate-500 space-y-4">
            <Activity size={64} className="opacity-20 animate-pulse" />
            <p className="font-display text-xl font-medium">Coming Soon</p>
            <p className="text-sm">Module is under active construction.</p>
          </div>
        )}

        <OnboardingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onComplete={(data) => {
            setIsModalOpen(false);
            if (data && data.borrower_id) {
              setSelectedBorrowerId(data.borrower_id);
              setActiveTab('profile');
            } else {
              setActiveTab('dashboard');
            }
          }}
        />
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
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

// Alert Center Component
const AlertCenter = ({ onViewBorrower }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_URL}/api/v1/alerts?resolved=false`);
        const data = await response.json();
        if (data.status === 'success') {
          setAlerts(data.data);
        }
      } catch (err) {
        console.error('Error fetching alerts:', err);
        // Mock alerts for demo
        setAlerts([
          { id: 1, borrower_id: 'LEN-091220', borrower_name: 'Tobi Adeyemi', alert_type: 'Betting Spike', description: 'Increased betting activity detected - 45% increase', created_at: new Date().toISOString() },
          { id: 2, borrower_id: 'LEN-091222', borrower_name: 'Aisha Bello', alert_type: 'Income Drift', description: 'Monthly income dropped by 30%', created_at: new Date(Date.now() - 86400000).toISOString() },
          { id: 3, borrower_id: 'LEN-091223', borrower_name: 'Samuel Ojo', alert_type: 'Liquidity Warning', description: 'Balance consistently below threshold', created_at: new Date(Date.now() - 172800000).toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleResolveAlert = async (alertId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await fetch(`${API_URL}/api/v1/alerts/${alertId}/resolve`, { method: 'POST' });
      setAlerts(alerts.filter(a => a.id !== alertId));
    } catch (err) {
      console.error('Error resolving alert:', err);
      setAlerts(alerts.filter(a => a.id !== alertId));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAlertSeverity = (type) => {
    if (type.toLowerCase().includes('betting') || type.toLowerCase().includes('gambling')) {
      return { color: 'red', label: 'High' };
    }
    if (type.toLowerCase().includes('income') || type.toLowerCase().includes('liquidity')) {
      return { color: 'amber', label: 'Medium' };
    }
    return { color: 'slate', label: 'Low' };
  };

  return (
    <div className="animate-in space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-display text-white">Alert Center</h2>
        <p className="text-slate-400 mt-1">Active monitoring alerts requiring attention</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading alerts...</div>
      ) : alerts.length === 0 ? (
        <div className="glass-card text-center py-12">
          <ShieldCheck size={48} className="mx-auto text-emerald-500 mb-4" />
          <p className="text-white font-bold text-lg">All Clear!</p>
          <p className="text-slate-500 mt-2">No active alerts at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const severity = getAlertSeverity(alert.alert_type);
            return (
              <div
                key={alert.id}
                className={`glass-card border-l-4 border-l-${severity.color}-500 !bg-slate-900/60`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded bg-${severity.color}-500/10 text-${severity.color}-500 uppercase`}>
                        {severity.label}
                      </span>
                      <span className="text-sm font-bold text-white">{alert.alert_type}</span>
                    </div>
                    <p className="text-slate-300 mb-2">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{formatDate(alert.created_at)}</span>
                      <span>•</span>
                      <span>Borrower: {alert.borrower_name}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => onViewBorrower(alert.borrower_id)}
                      className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-sm font-bold rounded-lg transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold rounded-lg transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default App;