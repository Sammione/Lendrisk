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
  FileText
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
import { motion } from 'framer-motion';

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

const BorrowerProfile = ({ borrowerId }) => {
  const [borrower, setBorrower] = useState(null);
  const [charts, setCharts] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

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
      // Use mock data as fallback
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
      // Simulate success for demo
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
    if (score >= 70) return '#10b981'; // emerald
    if (score >= 35) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const getRiskLabel = (score) => {
    if (score >= 70) return 'Low Risk';
    if (score >= 35) return 'Moderate Risk';
    return 'High Risk';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <RefreshCw size={48} className="animate-spin text-indigo-500 mx-auto" />
          <p className="text-slate-400">Loading borrower profile...</p>
        </div>
      </div>
    );
  }

  if (!borrower) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <AlertCircle size={48} className="text-red-500 mx-auto" />
          <p className="text-slate-400">Borrower not found</p>
        </div>
      </div>
    );
  }

  const score = borrower.risk_score || 72;
  const incomeData = charts?.monthly_income || mockIncomeData;
  const spendingData = charts?.spending_by_category || mockSpendingData;

  return (
    <div className="animate-in space-y-10">
      {/* Header Profile Section - Ultra Glassmorphism */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative glass-card flex justify-between items-center overflow-hidden">
          <div className="relative z-10 flex items-center gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center border-2 border-white/20 shadow-2xl shadow-indigo-500/40"
            >
              <ShieldCheck size={48} className="text-white" />
            </motion.div>

            <div className="space-y-4">
              <div>
                <h2 className="text-4xl font-bold font-display tracking-tight text-white">{borrower.name}</h2>
                <p className="text-slate-400 font-medium flex items-center gap-2 mt-2">
                  <Smartphone size={16} className="text-slate-500" /> {borrower.phone} • ID: #{borrower.id}
                </p>
              </div>

              <div className="flex gap-4 items-center">
                <span className={`risk-score-badge badge-mod border-${borrower.risk_category === 'Low' ? 'emerald' :
                    borrower.risk_category === 'High' ? 'red' : 'amber'
                  }-500/40`}>
                  {getRiskLabel(score)}
                </span>
                <div className="h-4 w-px bg-slate-700"></div>
                <span className="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/5 px-3 py-1 rounded-lg border border-emerald-500/10">
                  <CheckCircle size={14} /> KYC Verified
                </span>
                {usingMockData && (
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">Demo Mode</span>
                )}
              </div>
            </div>
          </div>

          {/* Risk Gauge Circle - High End Visual */}
          <div className="flex items-center gap-10 pr-10">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <motion.svg
                viewBox="0 0 100 100"
                className="w-full h-full -rotate-90 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                <circle
                  cx="50" cy="50" r="45"
                  stroke="#1e293b" strokeWidth="6" fill="transparent"
                />
                <motion.circle
                  cx="50" cy="50" r="45"
                  stroke={getRiskColor(score)} strokeWidth="8" fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray="282.7"
                  initial={{ strokeDashoffset: 282.7 }}
                  animate={{ strokeDashoffset: 282.7 * (1 - score / 100) }}
                  transition={{ duration: 2, ease: "circOut" }}
                />
              </motion.svg>
              <div className="absolute flex flex-col items-center">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-5xl font-black font-display text-white"
                >
                  {score}
                </motion.span>
                <span className="text-[11px] text-slate-400 uppercase font-bold tracking-[0.2em]">Risk Score</span>
              </div>
            </div>

            <div className="text-right space-y-1">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Based On</p>
              <p className="text-sm font-bold text-slate-200">Last 90 Days of Transactions</p>
              <p className="text-xs text-slate-500">Last Synched: Today, 10:45 AM</p>
              <button
                onClick={handleRunMonitoring}
                className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mx-auto"
              >
                <RefreshCw size={12} /> Run Drift Check
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Behavioral Stats */}
        <div className="col-span-8 space-y-8">
          <div className="glass-card !bg-slate-900/40 border-slate-800/40">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <TrendingUp size={24} className="text-indigo-400" />
                  Monthly Income Patterns
                </h3>
                <p className="text-slate-500 text-sm mt-1">Comparing money coming in against money spent.</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-xl">
                <button className="px-4 py-1.5 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-lg border border-indigo-400/20">6 Months</button>
                <button className="px-4 py-1.5 text-slate-500 text-xs font-bold hover:text-slate-300">12 Months</button>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} dy={15} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}
                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="#6366f1" barSize={35}>
                    {incomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.amount < 400000 ? '#f59e0b' : '#6366f1'} opacity={0.9} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-center gap-4">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <p className="text-xs font-medium text-amber-500/80 tracking-wide uppercase">
                Warning for January: Income changed by 35%.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="glass-card">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">How Money is Spent</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendingData}
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass-card relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <AlertCircle size={120} />
              </div>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Recent Activity Alerts</h3>
              <div className="space-y-4">
                {alerts.length > 0 ? (
                  alerts.slice(0, 3).map((alert, idx) => (
                    <motion.div
                      key={alert.id}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`flex gap-4 p-4 ${alert.severity === 'high' ? 'bg-red-500/5 border-l-4 border-red-500/60' : 'bg-amber-500/5 border-l-4 border-amber-500/60'
                        } rounded-r-xl`}
                    >
                      {alert.type.toLowerCase().includes('betting') ? (
                        <Dice5 size={22} className={alert.severity === 'high' ? 'text-red-500 mt-1' : 'text-amber-500 mt-1'} />
                      ) : (
                        <Clock size={22} className={alert.severity === 'high' ? 'text-red-500 mt-1' : 'text-amber-500 mt-1'} />
                      )}
                      <div>
                        <p className={`font-bold text-sm ${alert.severity === 'high' ? 'text-red-100' : 'text-amber-100'}`}>{alert.type}</p>
                        <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">{alert.description}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex gap-4 p-4 bg-red-500/5 border-l-4 border-red-500/60 rounded-r-xl"
                  >
                    <Dice5 size={22} className="text-red-500 mt-1" />
                    <div>
                      <p className="font-bold text-red-100 text-sm">Increased Betting Activity</p>
                      <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">Noticed a 12% jump in betting spending over the past 2 weeks.</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Drift Activity Feed - New per blueprint */}
          <div className="glass-card">
            <h3 className="text-lg font-bold text-white flex items-center gap-3 mb-6">
              <FileText size={20} className="text-indigo-400" />
              Monitoring Timeline
            </h3>
            <div className="space-y-4">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div key={alert.id} className="flex gap-4 items-start p-4 bg-slate-800/30 rounded-xl border border-white/5">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${alert.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'
                      }`}></div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">{alert.type}</p>
                      <p className="text-slate-400 text-sm mt-1">{alert.description}</p>
                      <p className="text-xs text-slate-600 mt-2">
                        {alert.created_at ? formatDate(alert.created_at) : 'Recent'}
                      </p>
                    </div>
                    <button className="text-xs text-slate-500 hover:text-white transition-colors">
                      Dismiss
                    </button>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex gap-4 items-start p-4 bg-slate-800/30 rounded-xl border border-white/5">
                    <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5"></div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">Income Drop Detected</p>
                      <p className="text-slate-400 text-sm mt-1">APR 04: Income dropped by 30% — Warning triggered</p>
                      <p className="text-xs text-slate-600 mt-2">Apr 4, 2024</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start p-4 bg-slate-800/30 rounded-xl border border-white/5">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mt-1.5"></div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">Betting Activity Spike</p>
                      <p className="text-slate-400 text-sm mt-1">MAR 28: Betting transactions increased by 45%</p>
                      <p className="text-xs text-slate-600 mt-2">Mar 28, 2024</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Insights & Actions */}
        <div className="col-span-4 space-y-8">
          <div className="glass-card bg-indigo-500/5 border-indigo-500/30 ring-1 ring-white/5 relative group">
            <div className="absolute top-0 right-0 p-4">
              <div className="px-2 py-1 bg-indigo-500/20 text-[10px] font-black text-indigo-300 rounded tracking-widest uppercase">AI Risk Model</div>
            </div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <AlertCircle size={24} className="text-indigo-400" />
              AI Insight Summary
            </h3>
            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-slate-200 text-sm leading-relaxed font-medium">
                  "The borrower has a <span className="font-bold text-white underline decoration-amber-500 decoration-2 underline-offset-4">Risk Score of {score}</span>.
                  While their income is steady, their spending shows a worrying increase
                  in <span className="text-red-400">betting</span>.
                  They can likely repay the loan, but there is some risk involved."
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-white/5">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Income Status</span>
                  <span className="text-emerald-400 text-xs font-black uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Good</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-white/5">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Spare Cash</span>
                  <span className="text-amber-400 text-xs font-black uppercase bg-amber-500/10 px-2 py-0.5 rounded">Low</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-white/5">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Trust History</span>
                  <span className="text-indigo-400 text-xs font-black uppercase bg-indigo-500/10 px-2 py-0.5 rounded">High</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Loans */}
          {loans.length > 0 && (
            <div className="glass-card">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                <CheckCircle size={20} className="text-emerald-400" />
                Active Loans
              </h3>
              <div className="space-y-3">
                {loans.map((loan) => (
                  <div key={loan.id} className="p-4 bg-slate-800/30 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">{formatCurrency(loan.principal_amount)}</p>
                        <p className="text-xs text-slate-500">ID: {loan.id}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${loan.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                          loan.status === 'Repaid' ? 'bg-indigo-500/10 text-indigo-500' :
                            'bg-amber-500/10 text-amber-500'
                        }`}>
                        {loan.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Issued: {formatDate(loan.issued_on)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLoanAction('approve')}
              disabled={actionLoading}
              className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-base shadow-indigo-500/40 disabled:opacity-50"
            >
              {actionLoading ? <RefreshCw size={20} className="animate-spin" /> : <ArrowRight size={20} />}
              Approve Loan Request
            </motion.button>
            <button
              onClick={() => handleLoanAction('request_more_data')}
              className="w-full bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 hover:text-white text-slate-300 font-bold py-4 rounded-2xl transition-all shadow-xl"
            >
              Request Bank Statement Sync
            </button>
            <div className="pt-4 flex flex-col items-center gap-3">
              <button
                onClick={() => handleLoanAction('reject')}
                className="text-slate-500 text-xs font-black uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                Reject Loan Request
              </button>
              <p className="text-[10px] text-slate-700 font-bold text-center uppercase tracking-tighter">
                This tool helps you decide. You make the final choice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowerProfile;