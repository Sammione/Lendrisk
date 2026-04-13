import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, Search, Download, RefreshCw, Filter } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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

      // Fetch dashboard stats
      const statsRes = await fetch(`${API_URL}/api/v1/dashboard`);
      const statsData = await statsRes.json();
      if (statsData.status === 'success') {
        setStats(statsData.data);
      }

      // Fetch loans
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
      case 'Active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Repaid': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'Delinquent': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Defaults': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Approved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Rejected': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const filteredLoans = loans.filter(loan =>
    loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.borrower_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    // Create CSV content
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

    // Download
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
        <div className="text-center space-y-4">
          <RefreshCw size={48} className="animate-spin text-indigo-500 mx-auto" />
          <p className="text-slate-400">Loading loan data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-display text-white">Loan Management</h2>
          <p className="text-slate-400 mt-1">Direct oversight of disbursed capital and collections.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700/50"
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 hover:text-white transition-colors border border-slate-700/50"
          >
            <Download size={20} /> Export Book
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <MetricCard
          title="Total Disbursed"
          value={stats ? formatCurrency(stats.total_disbursed) : '₦0'}
        />
        <MetricCard
          title="Portfolio at Risk"
          value={stats ? formatCurrency(stats.portfolio_at_risk) : '₦0'}
          danger
        />
        <MetricCard
          title="Collection Rate"
          value={stats ? `${stats.collection_rate}%` : '0%'}
        />
        <MetricCard
          title="Active Loans"
          value={loans.filter(l => l.status === 'Active').length.toString()}
        />
      </div>

      <div className="glass-card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Current Loan Register</h3>
          <div className="flex gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Search by Loan ID or Borrower..."
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/50 text-xs font-black text-slate-500 uppercase tracking-widest">
                <th className="py-4 pl-4">Loan ID</th>
                <th className="py-4">Borrower</th>
                <th className="py-4">Principal Amount</th>
                <th className="py-4">Issued On</th>
                <th className="py-4">Next Payment Due</th>
                <th className="py-4 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <CreditCard size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No loans found</p>
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan, i) => (
                  <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 pl-4 font-bold text-slate-300">{loan.id}</td>
                    <td className="py-4 font-bold text-white">{loan.borrower_name}</td>
                    <td className="py-4 font-bold text-indigo-300">{formatCurrency(loan.principal_amount)}</td>
                    <td className="py-4 text-sm text-slate-400">{formatDate(loan.issued_on)}</td>
                    <td className="py-4 text-sm text-slate-400">{formatDate(loan.next_due_date)}</td>
                    <td className="py-4 pr-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded ${getStatusColor(loan.status)} uppercase tracking-wider`}>
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6 pt-6 border-t border-slate-700/50">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-slate-400 text-sm">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, danger }) => (
  <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{title}</p>
    <p className={`text-3xl font-display font-black ${danger ? 'text-red-400' : 'text-white'}`}>{value}</p>
  </div>
);

export default LoanManagement;