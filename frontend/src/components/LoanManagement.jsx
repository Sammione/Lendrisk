import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  TrendingUp,
  Search,
  Download,
  RefreshCw,
  Filter,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MoreVertical,
  Calendar
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

const LoanManagement = () => {
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    try {
      setLoading(true);

      const statsRes = await fetch(`${API_URL}/api/v1/dashboard`);
      const statsData = await statsRes.json();
      if (statsData.status === 'success') {
        setStats(statsData.data);
      }

      let loansUrl = `${API_URL}/api/v1/loans?page=${page}&limit=20`;
      if (statusFilter !== 'all') {
        loansUrl += `&status=${statusFilter}`;
      }

      const loansRes = await fetch(loansUrl);
      const loansData = await loansRes.json();
      if (loansData.status === 'success') {
        setLoans(loansData.data.loans);
        setTotalPages(loansData.data.pages);
      }
    } catch (err) {
      console.error('Error fetching loan data:', err);
      // Use mock data as fallback
      setLoans([
        { id: '#L-3341', borrower_id: 'LEN-091220', borrower_name: 'Tobi Adeyemi', principal_amount: 50000, issued_on: new Date(2023, 9, 2).toISOString(), next_due_date: new Date(2023, 10, 2).toISOString(), status: 'Active' },
        { id: '#L-2910', borrower_id: 'LEN-091221', borrower_name: 'Chinedu Okafor', principal_amount: 150000, issued_on: new Date(2023, 8, 15).toISOString(), next_due_date: new Date(2023, 9, 15).toISOString(), status: 'Active' },
        { id: '#L-2884', borrower_id: 'LEN-091222', borrower_name: 'Aisha Bello', principal_amount: 20000, issued_on: new Date(2023, 8, 1).toISOString(), next_due_date: new Date(2023, 9, 1).toISOString(), status: 'Delinquent' },
        { id: '#L-2101', borrower_id: 'LEN-091223', borrower_name: 'Samuel Ojo', principal_amount: 75000, issued_on: new Date(2023, 7, 10).toISOString(), next_due_date: null, status: 'Defaults' },
        { id: '#L-1903', borrower_id: 'LEN-091224', borrower_name: 'Ngozi Eze', principal_amount: 30000, issued_on: new Date(2023, 7, 5).toISOString(), next_due_date: null, status: 'Repaid' },
      ]);
      setStats({
        total_disbursed: 45200000,
        portfolio_at_risk: 3400000,
        collection_rate: 92.4
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, statusFilter]);

  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'N/A';
    return `₦${value.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' };
      case 'Repaid': return { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/20' };
      case 'Delinquent': return { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' };
      case 'Defaults': return { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' };
      case 'Approved': return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' };
      case 'Rejected': return { bg: 'bg-slate-500/10', text: 'text-slate-500', border: 'border-slate-500/20' };
      default: return { bg: 'bg-slate-500/10', text: 'text-slate-500', border: 'border-slate-500/20' };
    }
  };

  const filteredLoans = loans.filter(loan =>
    loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.borrower_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const headers = ['Loan ID', 'Borrower', 'Amount', 'Issued On', 'Next Due', 'Status'];
    const rows = loans.map(loan => [
      loan.id,
      loan.borrower_name,
      loan.principal_amount,
      formatDate(loan.issued_on),
      formatDate(loan.next_due_date),
      loan.status
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loans_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
          <p className="text-slate-400 font-medium">Loading loan data...</p>
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
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <CreditCard size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black font-display text-white tracking-tight">Loan Management</h2>
            <p className="text-slate-400 mt-1">Direct oversight of disbursed capital and collections</p>
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
            onClick={handleExport}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={20} />
            Export Data
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-4 gap-6">
        <MetricCard
          icon={DollarSign}
          title="Total Disbursed"
          value={stats ? formatCurrency(stats.total_disbursed) : '₦0'}
          color="indigo"
        />
        <MetricCard
          icon={AlertTriangle}
          title="Portfolio at Risk"
          value={stats ? formatCurrency(stats.portfolio_at_risk) : '₦0'}
          color="red"
          isDanger
        />
        <MetricCard
          icon={TrendingUp}
          title="Collection Rate"
          value={stats ? `${stats.collection_rate}%` : '0%'}
          color="emerald"
        />
        <MetricCard
          icon={CreditCard}
          title="Active Loans"
          value={loans.filter(l => l.status === 'Active').length.toString()}
          color="indigo"
        />
      </motion.div>

      {/* Loans Table */}
      <motion.div variants={itemVariants} className="glass-card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Current Loan Register</h3>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-premium pl-10 pr-4 py-2 text-sm w-64"
                placeholder="Search by ID or Borrower..."
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-premium py-2 px-4 text-sm"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Repaid">Repaid</option>
              <option value="Delinquent">Delinquent</option>
              <option value="Defaults">Defaults</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                <th className="text-left">Loan ID</th>
                <th className="text-left">Borrower</th>
                <th className="text-left">Principal Amount</th>
                <th className="text-left">Issued On</th>
                <th className="text-left">Next Payment Due</th>
                <th className="text-left">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center">
                        <CreditCard size={32} className="text-slate-600" />
                      </div>
                      <div>
                        <p className="text-slate-400 font-medium">No loans found</p>
                        <p className="text-slate-600 text-sm mt-1">Try adjusting your search or filters</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan, i) => {
                  const status = getStatusColor(loan.status);
                  return (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                    >
                      <td className="font-bold text-white font-mono">{loan.id}</td>
                      <td className="font-bold text-white">{loan.borrower_name}</td>
                      <td className="font-bold text-indigo-300">{formatCurrency(loan.principal_amount)}</td>
                      <td className="text-sm text-slate-400">{formatDate(loan.issued_on)}</td>
                      <td className="text-sm text-slate-400">{formatDate(loan.next_due_date)}</td>
                      <td>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${status.bg} ${status.text} border ${status.border} uppercase tracking-wider`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition-colors"
                          >
                            <Eye size={14} className="text-slate-400" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition-colors"
                          >
                            <MoreVertical size={14} className="text-slate-400" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6 pt-6 border-t border-slate-700/50">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </motion.button>
            <span className="text-slate-400 text-sm font-medium">
              Page <span className="text-white font-bold">{page}</span> of <span className="text-white font-bold">{totalPages}</span>
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Metric Card Component
const MetricCard = ({ icon: Icon, title, value, color, isDanger }) => {
  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      gradient: 'from-indigo-500 to-indigo-700'
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      gradient: 'from-emerald-500 to-emerald-700'
    },
    red: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      gradient: 'from-red-500 to-red-700'
    }
  };

  const theme = colorClasses[color] || colorClasses.indigo;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="glass-card !p-5 relative overflow-hidden group"
    >
      <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${theme.gradient} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity`} />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className={`text-2xl font-black font-display mt-1 ${isDanger ? 'text-red-400' : 'text-white'}`}>
            {value}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-xl ${theme.bg} flex items-center justify-center`}>
          <Icon size={18} className={theme.text} />
        </div>
      </div>
    </motion.div>
  );
};

export default LoanManagement;