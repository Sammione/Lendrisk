import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Dice5,
  RefreshCw,
  Download,
  FileText,
  Sparkles,
  Target,
  TrendingDown,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  User,
  Calendar,
  Activity as ActivityIcon,
  Zap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Mock data for demo when API is not available
const mockIncomeData = [
  { month: 'Oct', amount: 450000 },
  { month: 'Nov', amount: 420000 },
  { month: 'Dec', amount: 480000 },
  { month: 'Jan', amount: 310000 },
  { month: 'Feb', amount: 460000 },
  { month: 'Mar', amount: 495000 },
];

const mockSpendingData = [
  { name: 'Rent', value: 35 },
  { name: 'Utilities', value: 15 },
  { name: 'Betting', value: 12 },
  { name: 'Airtime/Data', value: 10 },
  { name: 'Savings', value: 20 },
  { name: 'Other', value: 8 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#e2e8f0'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15
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

const BorrowerProfile = ({ borrowerId }) => {
  const [borrower, setBorrower] = useState(null);
  const [charts, setCharts] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);
  const [activeChart, setActiveChart] = useState('income');

  const fetchBorrowerData = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/v1/borrowers/${id}`);
      const data = await response.json();

      if (data.status === 'success') {
        setBorrower(data.data.borrower);
        setCharts(data.data.charts);
        setAlerts(data.data.alerts);
        setTransactions(data.data.transactions);
        setLoans(data.data.loans);
        setUsingMockData(false);
      }
    } catch (err) {
      console.error('Error fetching borrower data:', err);
      setUsingMockData(true);
      setBorrower({
        id: borrowerId || 'LEN-091220',
        name: 'Tobi Adeyemi',
        phone: '+234 812 456 7890',
        risk_score: 72,
        risk_category: 'Moderate',
        created_at: new Date().toISOString()
      });
      setCharts({
        monthly_income: mockIncomeData,
        spending_by_category: mockSpendingData
      });
      setAlerts([
        { id: 1, type: 'Betting Spike', description: 'Increased betting activity detected', severity: 'high' },
        { id: 2, type: 'Liquidity Warning', description: 'Money ran out quickly after income', severity: 'medium' }
      ]);
      setLoans([
        { id: 'L-3341', principal_amount: 50000, issued_on: new Date().toISOString(), status: 'Active' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = borrowerId || 'LEN-091220';
    fetchBorrowerData(id);
  }, [borrowerId]);

  const handleLoanAction = async (action) => {
    if (!borrower) return;

    setActionLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/borrowers/${borrower.id}/loan-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert(`Loan ${action}ed successfully!`);
      }
    } catch (err) {
      console.error('Error performing loan action:', err);
      alert(`Action "${action}" completed (simulated)`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRunMonitoring = async () => {
    if (!borrower) return;

    try {
      const response = await fetch(`${API_URL}/api/v1/borrowers/${borrower.id}/monitor`, {
        method: 'POST'
      });

      const data = await response.json();
      if (data.status === 'success') {
        if (data.drift_detected) {
          alert(`Drift detected! ${data.alerts.length} new alerts generated.`);
          fetchBorrowerData(borrower.id);
        } else {
          alert('No drift detected. Borrower behavior is consistent.');
        }
      }
    } catch (err) {
      console.error('Error running monitoring:', err);
      alert('Monitoring check completed (simulated)');
    }
  };

  const formatCurrency = (value) => {
    return `₦${value.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRiskColor = (score) => {
    if (score >= 70) return '#10b981';
    if (score >= 35) return '#f59e0b';
    return '#ef4444';
  };

  const getRiskLabel = (score) => {
    if (score >= 70) return 'Low Risk';
    if (score >= 35) return 'Moderate Risk';
    return 'High Risk';
  };

  const getRiskBadgeClass = (category) => {
    switch (category) {
      case 'Low': return 'badge-low';
      case 'Moderate': return 'badge-mod';
      case 'High': return 'badge-high';
      default: return 'badge-mod';
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <div className="absolute inset-2 bg-indigo-500/10 rounded-full animate-pulse" />
          </div>
          <p className="text-slate-400 font-medium">Loading borrower intelligence profile...</p>
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!borrower) {
    return (
      <div className="flex h-96 items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <div>
            <p className="text-white font-bold text-xl">Borrower Not Found</p>
            <p className="text-slate-500 mt-2">The requested borrower profile does not exist.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const score = borrower.risk_score || 72;
  const incomeData = charts?.monthly_income || mockIncomeData;
  const spendingData = charts?.spending_by_category || mockSpendingData;
  const riskColor = getRiskColor(score);

  return (
    <motion.div
      className="animate-in space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Profile Section - Premium Glassmorphism */}
      <motion.div variants={itemVariants} className="relative group">
        {/* Animated glow background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000" />

        <div className="relative glass-card !p-8 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full blur-3xl" />

          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-8">
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative"
              >
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-700 flex items-center justify-center border-2 border-white/20 shadow-2xl shadow-indigo-500/40">
                  <User size={48} className="text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center border-4 border-slate-900">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Info */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-black font-display tracking-tight text-white">
                      {borrower.name}
                    </h2>
                    {usingMockData && (
                      <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded">
                        Demo
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-slate-400">
                    <span className="flex items-center gap-2">
                      <Smartphone size={14} />
                      <span className="text-sm">{borrower.phone}</span>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-sm font-mono">ID: {borrower.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`risk-score-badge ${getRiskBadgeClass(borrower.risk_category)}`}>
                    {getRiskLabel(score)}
                  </span>
                  <div className="h-6 w-px bg-slate-700" />
                  <span className="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                    <ShieldCheck size={14} />
                    KYC Verified
                  </span>
                  <span className="flex items-center gap-2 text-indigo-400 text-sm font-bold bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
                    <ActivityIcon size={14} />
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Score Gauge */}
            <div className="flex items-center gap-10">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* Outer glow ring */}
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-30"
                  style={{ backgroundColor: riskColor }}
                />

                {/* SVG Gauge */}
                <motion.svg
                  viewBox="0 0 100 100"
                  className="w-full h-full -rotate-90"
                >
                  {/* Background track */}
                  <circle
                    cx="50" cy="50" r="42"
                    stroke="#1e293b" strokeWidth="8" fill="none"
                  />
                  {/* Progress arc */}
                  <motion.circle
                    cx="50" cy="50" r="42"
                    stroke={riskColor} strokeWidth="8" fill="none"
                    strokeLinecap="round"
                    strokeDasharray="263.9"
                    initial={{ strokeDashoffset: 263.9 }}
                    animate={{ strokeDashoffset: 263.9 * (1 - score / 100) }}
                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      filter: `drop-shadow(0 0 8px ${riskColor})`
                    }}
                  />
                </motion.svg>

                {/* Center content */}
                <div className="absolute flex flex-col items-center">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-5xl font-black font-display text-white"
                  >
                    {score}
                  </motion.span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] mt-1">
                    Risk Score
                  </span>
                </div>
              </div>

              {/* Info panel */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                      <Calendar size={16} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Member Since</p>
                      <p className="text-sm text-white font-medium">
                        {formatDate(borrower.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Target size={16} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Analysis Period</p>
                      <p className="text-sm text-white font-medium">Last 90 Days</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Zap size={16} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Last Updated</p>
                      <p className="text-sm text-white font-medium">Today, 10:45 AM</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRunMonitoring}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-sm font-bold rounded-lg transition-colors border border-indigo-500/20"
                >
                  <RefreshCw size={14} />
                  Run Drift Check
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Charts */}
        <div className="col-span-8 space-y-8">
          {/* Income Chart */}
          <motion.div variants={itemVariants} className="glass-card !bg-slate-900/40 border-slate-800/40">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <BarChart3 size={20} className="text-indigo-400" />
                  </div>
                  Monthly Income Patterns
                </h3>
                <p className="text-slate-500 text-sm mt-2">Comparing money coming in against spending trends</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
                <button
                  onClick={() => setActiveChart('income')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeChart === 'income'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/20'
                      : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                  6 Months
                </button>
                <button
                  onClick={() => setActiveChart('12months')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeChart === '12months'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/20'
                      : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                  12 Months
                </button>
              </div>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis
                    dataKey="month"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(8px)'
                    }}
                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                    formatter={(value) => [formatCurrency(value), 'Income']}
                  />
                  <Bar
                    dataKey="amount"
                    radius={[8, 8, 0, 0]}
                    fill="url(#barGradient)"
                    barSize={40}
                  >
                    {incomeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.amount < 400000 ? '#f59e0b' : '#6366f1'}
                        opacity={0.85}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Warning indicator */}
            <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <p className="text-xs font-medium text-amber-500/80 tracking-wide">
                <span className="font-bold">January Alert:</span> Income dropped by 35% — Potential risk indicator
              </p>
            </div>
          </motion.div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-8">
            {/* Spending Pie Chart */}
            <motion.div variants={itemVariants} className="glass-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <PieChartIcon size={20} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Spending Breakdown</h3>
                  <p className="text-slate-500 text-xs">By category</p>
                </div>
              </div>

              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {COLORS.map((color, index) => (
                        <linearGradient key={index} id={`pie-${index}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={1} />
                          <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={spendingData}
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#pie-${index})`} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
                      }}
                      formatter={(value) => [`${value}%`, 'Share']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {spendingData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-xs text-slate-400">{item.name}</span>
                    <span className="text-xs text-slate-500 ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Alerts Panel */}
            <motion.div variants={itemVariants} className="glass-card relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <AlertCircle size={100} />
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <AlertCircle size={20} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Activity Alerts</h3>
                  <p className="text-slate-500 text-xs">{alerts.length} active alerts</p>
                </div>
              </div>

              <div className="space-y-3">
                {alerts.length > 0 ? (
                  alerts.slice(0, 3).map((alert, idx) => (
                    <motion.div
                      key={alert.id}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`flex gap-4 p-4 rounded-xl border-l-4 ${alert.severity === 'high'
                          ? 'bg-red-500/5 border-red-500/60'
                          : 'bg-amber-500/5 border-amber-500/60'
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${alert.severity === 'high'
                          ? 'bg-red-500/10'
                          : 'bg-amber-500/10'
                        }`}>
                        {alert.type.toLowerCase().includes('betting') ? (
                          <Dice5 size={16} className={alert.severity === 'high' ? 'text-red-500' : 'text-amber-500'} />
                        ) : (
                          <TrendingDown size={16} className={alert.severity === 'high' ? 'text-red-500' : 'text-amber-500'} />
                        )}
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${alert.severity === 'high' ? 'text-red-100' : 'text-amber-100'
                          }`}>
                          {alert.type}
                        </p>
                        <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                          {alert.description}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex gap-4 p-4 bg-red-500/5 border-l-4 border-red-500/60 rounded-xl"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <Dice5 size={16} className="text-red-500" />
                    </div>
                    <div>
                      <p className="font-bold text-red-100 text-sm">Increased Betting Activity</p>
                      <p className="text-slate-400 text-xs mt-1">12% jump in betting spending over past 2 weeks</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Monitoring Timeline */}
          <motion.div variants={itemVariants} className="glass-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <FileText size={20} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Monitoring Timeline</h3>
                <p className="text-slate-500 text-xs">Drift activity and behavioral changes</p>
              </div>
            </div>

            <div className="space-y-4">
              {alerts.length > 0 ? (
                alerts.map((alert, idx) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 items-start p-4 bg-slate-800/30 rounded-xl border border-white/5 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${alert.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'
                      }`} />
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">{alert.type}</p>
                      <p className="text-slate-400 text-sm mt-1">{alert.description}</p>
                      <p className="text-xs text-slate-600 mt-2">
                        {alert.created_at ? formatDate(alert.created_at) : 'Recent'}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs text-slate-500 hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-slate-700"
                    >
                      Dismiss
                    </motion.button>
                  </motion.div>
                ))
              ) : (
                <>
                  <div className="flex gap-4 items-start p-4 bg-slate-800/30 rounded-xl border border-white/5">
                    <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5" />
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">Income Drop Detected</p>
                      <p className="text-slate-400 text-sm mt-1">APR 04: Income dropped by 30% — Warning triggered</p>
                      <p className="text-xs text-slate-600 mt-2">Apr 4, 2024</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start p-4 bg-slate-800/30 rounded-xl border border-white/5">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mt-1.5" />
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">Betting Activity Spike</p>
                      <p className="text-slate-400 text-sm mt-1">MAR 28: Betting transactions increased by 45%</p>
                      <p className="text-xs text-slate-600 mt-2">Mar 28, 2024</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: AI Insights & Actions */}
        <div className="col-span-4 space-y-8">
          {/* AI Insight Panel */}
          <motion.div variants={itemVariants} className="glass-card bg-indigo-500/5 border-indigo-500/30 relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 p-4">
              <div className="px-3 py-1 bg-indigo-500/20 text-[10px] font-black text-indigo-300 rounded-full tracking-widest uppercase flex items-center gap-1">
                <Sparkles size={10} />
                AI Risk Model
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Sparkles size={24} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AI Insight Summary</h3>
                <p className="text-slate-500 text-xs">Powered by machine learning</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Main insight */}
              <div className="p-5 bg-white/5 rounded-xl border border-white/5 backdrop-blur-sm">
                <p className="text-slate-200 text-sm leading-relaxed font-medium">
                  "The borrower has a <span className="font-bold text-white underline decoration-amber-500 decoration-2 underline-offset-4">Risk Score of {score}</span>.
                  While their income is generally stable, their spending shows a worrying increase in
                  <span className="text-red-400 font-bold"> betting activity</span>.
                  They can likely repay the loan, but there is <span className="text-amber-400 font-bold">moderate risk</span> involved."
                </p>
              </div>

              {/* Risk factors */}
              <div className="space-y-3">
                <RiskFactor
                  label="Income Stability"
                  status="Good"
                  statusColor="emerald"
                  icon={TrendingUp}
                />
                <RiskFactor
                  label="Spare Cash"
                  status="Low"
                  statusColor="amber"
                  icon={DollarSign}
                />
                <RiskFactor
                  label="Trust History"
                  status="High"
                  statusColor="indigo"
                  icon={ShieldCheck}
                />
                <RiskFactor
                  label="Betting Behavior"
                  status="Concerning"
                  statusColor="red"
                  icon={Dice5}
                />
              </div>
            </div>
          </motion.div>

          {/* Active Loans */}
          {loans.length > 0 && (
            <motion.div variants={itemVariants} className="glass-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle size={20} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Active Loans</h3>
                  <p className="text-slate-500 text-xs">{loans.length} loan(s) active</p>
                </div>
              </div>

              <div className="space-y-3">
                {loans.map((loan) => (
                  <div
                    key={loan.id}
                    className="p-4 bg-slate-800/30 rounded-xl border border-white/5 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-bold text-white text-lg">
                        {formatCurrency(loan.principal_amount)}
                      </p>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${loan.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : loan.status === 'Repaid'
                            ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                        {loan.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Loan ID: <span className="text-slate-400 font-mono">{loan.id}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Issued: {formatDate(loan.issued_on)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLoanAction('approve')}
              disabled={actionLoading}
              className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-base shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <ArrowRight size={20} />
              )}
              Approve Loan Request
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLoanAction('request_more_data')}
              className="w-full btn-secondary flex items-center justify-center gap-3 py-4 text-base"
            >
              <Smartphone size={18} />
              Request Bank Statement Sync
            </motion.button>

            <div className="pt-4 flex flex-col items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLoanAction('reject')}
                className="text-slate-500 text-xs font-black uppercase tracking-widest hover:text-red-500 transition-colors px-6 py-2"
              >
                Reject Loan Request
              </motion.button>
              <p className="text-[10px] text-slate-700 font-bold text-center uppercase tracking-tighter">
                This tool assists decision-making. You make the final call.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Risk Factor Component
const RiskFactor = ({ label, status, statusColor, icon: Icon }) => {
  const colorClasses = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  return (
    <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClasses[statusColor]}`}>
          <Icon size={14} />
        </div>
        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className={`text-xs font-black uppercase px-2.5 py-1 rounded ${colorClasses[statusColor]}`}>
        {status}
      </span>
    </div>
  );
};

export default BorrowerProfile;