import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Activity,
  AlertTriangle,
  Plus,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShieldAlert,
  Eye,
  Zap,
  TrendingDown
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const GlobalPulse = ({ onAddBorrower, onViewProfile }) => {
  const [stats, setStats] = useState(null);
  const [borrowers, setBorrowers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const statsRes = await fetch(`${API_URL}/api/v1/dashboard`);
      const statsData = await statsRes.json();
      if (statsData.status === 'success') {
        setStats(statsData.data);
      }

      const borrowersRes = await fetch(`${API_URL}/api/v1/borrowers?limit=10`);
      const borrowersData = await borrowersRes.json();
      if (borrowersData.status === 'success') {
        setBorrowers(borrowersData.data.borrowers);
      }

      const alertsRes = await fetch(`${API_URL}/api/v1/alerts?resolved=false`);
      const alertsData = await alertsRes.json();
      if (alertsData.status === 'success') {
        setAlerts(alertsData.data);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Is the API server running?');

      // Use mock data as fallback
      setStats({
        total_borrowers: 1248,
        active_loans: 892,
        high_risk_count: 156,
        moderate_risk_count: 423,
        low_risk_count: 669,
        total_disbursed: 45200000,
        portfolio_at_risk: 3400000,
        collection_rate: 92.4,
        active_alerts: 12,
        delinquent_loans: 23
      });

      setBorrowers([
        {
          id: 'LEN-091220',
          name: 'Tobi Adeyemi',
          risk_score: 72,
          risk_category: 'Moderate'
        },
        {
          id: 'LEN-091221',
          name: 'Chinedu Okafor',
          risk_score: 94,
          risk_category: 'Low'
        },
        {
          id: 'LEN-091222',
          name: 'Aisha Bello',
          risk_score: 35,
          risk_category: 'High'
        }
      ]);

      setAlerts([
        { id: 1, borrower_name: 'Tobi Adeyemi', alert_type: 'Betting Spike', description: 'Increased betting activity detected' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `₦${(value / 1000).toFixed(1)}K`;
    }
    return `₦${value}`;
  };

  const formatFullCurrency = (value) => {
    return `₦${value.toLocaleString()}`;
  };

  const getRiskBadgeClass = (category) => {
    switch (category) {
      case 'Low': return 'badge-low';
      case 'Moderate': return 'badge-mod';
      case 'High': return 'badge-high';
      default: return 'badge-mod';
    }
  };

  const getAlertIcon = (type) => {
    if (type.toLowerCase().includes('betting') || type.toLowerCase().includes('gambling')) {
      return <TrendingUp size={14} className="text-red-500" />;
    }
    if (type.toLowerCase().includes('income')) {
      return <TrendingDown size={14} className="text-amber-500" />;
    }
    return <AlertTriangle size={14} className="text-amber-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <div className="absolute inset-2 bg-indigo-500/10 rounded-full animate-pulse" />
          </div>
          <p className="text-slate-400 font-medium">Loading dashboard intelligence...</p>
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="animate-in space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black font-display text-white tracking-tight">Dashboard Overview</h2>
              <p className="text-slate-400 mt-1">Real-time portfolio intelligence and monitoring</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchData}
            className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors border border-slate-700/50"
          >
            <RefreshCw size={20} className="text-slate-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddBorrower}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Borrower
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid - Premium Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Active Borrowers"
          value={stats ? stats.total_borrowers.toLocaleString() : '0'}
          subtext="Total portfolio"
          color="indigo"
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          icon={Activity}
          label="Collection Rate"
          value={stats ? `${stats.collection_rate}%` : '0%'}
          subtext="Repayment efficiency"
          color="emerald"
          trend="+2.4%"
          trendUp={true}
        />
        <StatCard
          icon={AlertTriangle}
          label="Active Alerts"
          value={stats ? stats.active_alerts : '0'}
          subtext="Requires attention"
          color="amber"
          trend="+3"
          trendUp={false}
        />
        <StatCard
          icon={DollarSign}
          label="Total Disbursed"
          value={stats ? formatCurrency(stats.total_disbursed) : '₦0'}
          subtext="Portfolio value"
          color="indigo"
          trend="+8.2%"
          trendUp={true}
        />
      </motion.div>

      {/* Risk Distribution */}
      {stats && (
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6">
          <RiskDistributionCard
            label="Low Risk"
            count={stats.low_risk_count}
            total={stats.total_borrowers}
            color="emerald"
          />
          <RiskDistributionCard
            label="Moderate Risk"
            count={stats.moderate_risk_count}
            total={stats.total_borrowers}
            color="amber"
          />
          <RiskDistributionCard
            label="High Risk"
            count={stats.high_risk_count}
            total={stats.total_borrowers}
            color="red"
          />
        </motion.div>
      )}

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <motion.div variants={itemVariants} className="glass-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <ShieldAlert size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Active Monitoring Alerts</h3>
                <p className="text-slate-500 text-xs">{alerts.length} alerts require review</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-sm text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </motion.button>
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 4).map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-4 bg-red-500/5 border-l-4 border-red-500/60 rounded-xl transition-all hover:bg-red-500/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    {getAlertIcon(alert.alert_type)}
                  </div>
                  <div>
                    <p className="font-bold text-red-100 text-sm">{alert.alert_type}</p>
                    <p className="text-xs text-slate-400">
                      {alert.borrower_name} • {alert.description}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-white transition-colors"
                >
                  View Details <ArrowUpRight size={12} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Borrowers List */}
      <motion.div variants={itemVariants} className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Users size={20} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Borrowers Needing Attention</h3>
              <p className="text-slate-500 text-xs">Based on risk score and recent activity</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-sm text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
          >
            View All <ChevronRight size={14} />
          </motion.button>
        </div>

        {borrowers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-800/50 flex items-center justify-center">
              <Users size={40} className="text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium">No borrowers found</p>
            <p className="text-slate-600 text-sm mt-2">Add your first borrower to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {borrowers.map((borrower, index) => (
              <motion.div
                key={borrower.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4, scale: 1.005 }}
                onClick={() => onViewProfile(borrower.id)}
                className="flex items-center justify-between p-5 bg-slate-800/30 hover:bg-slate-700/50 border border-white/5 rounded-xl cursor-pointer transition-all group relative overflow-hidden"
              >
                {/* Left color indicator */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${borrower.risk_category === 'High' ? 'bg-red-500' :
                    borrower.risk_category === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />

                <div className="flex items-center gap-4 pl-4">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${borrower.risk_category === 'High' ? 'bg-red-500/10 text-red-400' :
                      borrower.risk_category === 'Moderate' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-emerald-500/10 text-emerald-400'
                    }`}>
                    {borrower.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>

                  <div>
                    <p className="font-bold text-white text-base">{borrower.name}</p>
                    <p className="text-xs text-slate-500 font-mono">ID: {borrower.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  {/* Risk Score */}
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className={`text-xl font-black ${borrower.risk_score >= 70 ? 'text-emerald-400' :
                          borrower.risk_score >= 35 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                        {borrower.risk_score}
                      </span>
                      <span className="text-xs text-slate-500">pts</span>
                    </div>
                    <p className="text-xs text-slate-500">Risk Score</p>
                  </div>

                  {/* Risk Badge */}
                  <div>
                    <span className={`risk-score-badge ${getRiskBadgeClass(borrower.risk_category)}`}>
                      {borrower.risk_category}
                    </span>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="text-slate-600 group-hover:text-white transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Premium Stat Card Component
const StatCard = ({ icon: Icon, label, value, subtext, color, trend, trendUp }) => {
  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      border: 'border-indigo-500/20',
      glow: 'shadow-indigo-500/10',
      gradient: 'from-indigo-500 to-indigo-700'
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      glow: 'shadow-emerald-500/10',
      gradient: 'from-emerald-500 to-emerald-700'
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
      glow: 'shadow-amber-500/10',
      gradient: 'from-amber-500 to-amber-700'
    },
    red: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/20',
      glow: 'shadow-red-500/10',
      gradient: 'from-red-500 to-red-700'
    }
  };

  const theme = colorClasses[color] || colorClasses.indigo;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="glass-card !p-5 relative overflow-hidden group"
    >
      {/* Background gradient orb */}
      <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${theme.gradient} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity`} />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-black font-display text-white mt-1">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{subtext}</p>
          </div>

          <div className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend} from last month
          </div>
        </div>

        <div className={`w-12 h-12 rounded-xl ${theme.bg} flex items-center justify-center`}>
          <Icon size={20} className={theme.text} />
        </div>
      </div>
    </motion.div>
  );
};

// Risk Distribution Card
const RiskDistributionCard = ({ label, count, total, color }) => {
  const percentage = Math.round((count / total) * 100);

  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-500',
      light: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20'
    },
    amber: {
      bg: 'bg-amber-500',
      light: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20'
    },
    red: {
      bg: 'bg-red-500',
      light: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/20'
    }
  };

  const theme = colorClasses[color] || colorClasses.emerald;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card !p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-slate-400">{label}</span>
        <span className={`text-sm font-black ${theme.text}`}>{percentage}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full ${theme.bg} rounded-full relative`}
        >
          <div className="absolute inset-0 bg-white/20 animate-shimmer" />
        </motion.div>
      </div>

      <p className="text-xs text-slate-500 mt-3">
        <span className="font-bold text-white">{count}</span> of {total} borrowers
      </p>
    </motion.div>
  );
};

export default GlobalPulse;