import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Activity,
  Settings,
  Search,
  Bell,
  LogOut,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react';
import BorrowerProfile from './components/BorrowerProfile';
import GlobalPulse from './components/GlobalPulse';
import OnboardingModal from './components/OnboardingModal';
import LoanManagement from './components/LoanManagement';
import SystemConfig from './components/SystemConfig';
import './styles/index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [selectedBorrowerId, setSelectedBorrowerId] = useState(null);
  const [alertCount, setAlertCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const fetchAlertCount = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/alerts?resolved=false`);
      const data = await response.json();
      if (data.status === 'success') {
        setAlertCount(data.data.length);
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
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
      setActiveTab('profile');
    }
  };

  const navItems = [
    { id: 'dashboard', icon: Activity, label: 'Overview', badge: null },
    { id: 'profile', icon: Users, label: 'Borrowers', badge: null },
    { id: 'loans', icon: CreditCard, label: 'Loans', badge: null },
    { id: 'alerts', icon: AlertTriangle, label: 'Alerts', badge: alertCount },
    { id: 'config', icon: Settings, label: 'Settings', badge: null }
  ];

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center space-y-8 p-12"
        >
          <motion.div
            className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-2xl shadow-indigo-500/40"
            animate={{
              boxShadow: ['0 0 40px rgba(99,102,241,0.3)', '0 0 60px rgba(99,102,241,0.5)', '0 0 40px rgba(99,102,241,0.3)']
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <ShieldCheck size={48} className="text-white" />
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-4xl font-black font-display text-white tracking-tight">Session Ended</h2>
            <p className="text-slate-400 text-lg">Your session has been securely terminated.</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAuthenticated(true)}
            className="btn-primary px-8 py-4 text-lg"
          >
            Sign In Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sidebar */}
      <motion.aside
        className="sidebar"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3 mb-10 px-2"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap size={20} className="text-white" />
            </div>
            <div className="absolute -inset-1 bg-indigo-500/20 rounded-xl blur-sm -z-10" />
          </div>
          <div>
            <h1 className="text-xl font-black font-display text-white tracking-tight">
              Lend<span className="text-gradient">risk</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Intelligence</p>
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item, index) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              active={activeTab === item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id !== 'profile') setSelectedBorrowerId(null);
              }}
              delay={index * 0.05}
            />
          ))}
        </nav>

        {/* User Section */}
        <div className="pt-6 mt-6 border-t border-slate-800/50">
          <motion.button
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-300 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sign Out</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <motion.header
          className="flex justify-between items-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Search */}
          <motion.div
            className={`relative transition-all duration-300 ${isSearchFocused ? 'w-[500px]' : 'w-96'}`}
            layout
          >
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isSearchFocused ? 'text-indigo-400' : 'text-slate-500'}`}>
              <Search size={18} />
            </div>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch(searchQuery);
              }}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="input-premium pl-12 pr-4 py-3"
              placeholder="Search borrowers by ID, name, or phone..."
            />
            {isSearchFocused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500"
              >
                Press Enter to search
              </motion.div>
            )}
          </motion.div>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            {/* Notifications */}
            <motion.button
              className="relative p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('alerts')}
            >
              <Bell size={20} className="text-slate-400" />
              {alertCount > 0 && (
                <span className="notification-badge">
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              )}
            </motion.button>

            {/* User Profile */}
            <div className="flex items-center gap-4 pl-6 border-l border-slate-800/50">
              <div className="text-right">
                <p className="text-xs font-bold text-white uppercase tracking-tighter">Loan Officer</p>
                <p className="text-[10px] text-slate-500">M-PESA Branch #09</p>
              </div>
              <motion.div
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-500 p-0.5"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center font-bold text-xs uppercase text-white">
                  BA
                </div>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Content Area */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' ? (
              <motion.div key="dashboard" variants={itemVariants}>
                <GlobalPulse
                  onAddBorrower={() => setIsModalOpen(true)}
                  onViewProfile={handleViewProfile}
                />
              </motion.div>
            ) : activeTab === 'profile' ? (
              <motion.div key="profile" variants={itemVariants}>
                <BorrowerProfile borrowerId={selectedBorrowerId} />
              </motion.div>
            ) : activeTab === 'loans' ? (
              <motion.div key="loans" variants={itemVariants}>
                <LoanManagement />
              </motion.div>
            ) : activeTab === 'alerts' ? (
              <motion.div key="alerts" variants={itemVariants}>
                <AlertCenter onViewBorrower={handleViewProfile} />
              </motion.div>
            ) : activeTab === 'config' ? (
              <motion.div key="config" variants={itemVariants}>
                <SystemConfig />
              </motion.div>
            ) : (
              <motion.div key="empty" className="h-96 flex flex-col items-center justify-center text-slate-500 space-y-6" variants={itemVariants}>
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Activity size={64} className="opacity-20" />
                </motion.div>
                <div className="text-center">
                  <p className="font-display text-2xl font-bold text-slate-400">Coming Soon</p>
                  <p className="text-sm text-slate-600 mt-2">This module is under active development.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Onboarding Modal */}
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
    </motion.div>
  );
};

const NavItem = ({ icon: Icon, label, badge, active, onClick, delay }) => (
  <motion.button
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay }}
    onClick={onClick}
    className={`nav-item ${active ? 'active' : ''}`}
    whileHover={{ x: 4 }}
  >
    <span className={`relative ${active ? 'text-indigo-400' : ''}`}>
      <Icon size={18} />
      {active && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute -inset-1 bg-indigo-500/10 rounded-lg -z-10"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </span>
    <span className="text-sm">{label}</span>
    {badge !== null && badge > 0 && (
      <span className="ml-auto notification-badge">
        {badge > 9 ? '9+' : badge}
      </span>
    )}
  </motion.button>
);

// Alert Center Component
const AlertCenter = ({ onViewBorrower }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/alerts?resolved=false`);
        const data = await response.json();
        if (data.status === 'success') {
          setAlerts(data.data);
        }
      } catch (err) {
        console.error('Error fetching alerts:', err);
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
      return { color: 'red', label: 'Critical', gradient: 'from-red-500 to-red-600' };
    }
    if (type.toLowerCase().includes('income') || type.toLowerCase().includes('liquidity')) {
      return { color: 'amber', label: 'Warning', gradient: 'from-amber-500 to-amber-600' };
    }
    return { color: 'slate', label: 'Info', gradient: 'from-slate-500 to-slate-600' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="animate-in space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h2 className="text-3xl font-black font-display text-white">Alert Center</h2>
        <p className="text-slate-400 mt-2">Active monitoring alerts requiring immediate attention</p>
      </div>

      {alerts.length === 0 ? (
        <motion.div
          className="glass-card text-center py-16"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <ShieldCheck size={40} className="text-emerald-500" />
          </div>
          <p className="text-white font-bold text-xl">All Systems Clear</p>
          <p className="text-slate-500 mt-2">No active alerts at this time. Your portfolio is healthy.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => {
            const severity = getAlertSeverity(alert.alert_type);
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`glass-card border-l-4 ${severity.color === 'red' ? 'border-l-red-500' : severity.color === 'amber' ? 'border-l-amber-500' : 'border-l-slate-500'}`}
              >
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider bg-gradient-to-r ${severity.gradient} text-white`}>
                        {severity.label}
                      </span>
                      <span className="text-sm font-bold text-white">{alert.alert_type}</span>
                    </div>
                    <p className="text-slate-300 mb-3 leading-relaxed">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        {formatDate(alert.created_at)}
                      </span>
                      <span>•</span>
                      <span className="font-medium text-slate-400">{alert.borrower_name}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onViewBorrower(alert.borrower_id)}
                      className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-sm font-bold rounded-lg transition-colors border border-indigo-500/20"
                    >
                      View Profile
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleResolveAlert(alert.id)}
                      className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-sm font-bold rounded-lg transition-colors border border-slate-700/50"
                    >
                      Dismiss
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default App;