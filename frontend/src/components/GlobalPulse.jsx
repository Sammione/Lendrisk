import React, { useState, useEffect } from 'react';
import { Users, Activity, AlertTriangle, Plus, ChevronRight, TrendingUp, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const GlobalPulse = ({ onAddBorrower, onViewProfile }) => {
  const [stats, setStats] = useState(null);
  const [borrowers, setBorrowers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard stats
      const statsRes = await fetch(`${API_URL}/api/v1/dashboard`);
      const statsData = await statsRes.json();
      if (statsData.status === 'success') {
        setStats(statsData.data);
      }

      // Fetch borrowers (limited to 10 for dashboard)
      const borrowersRes = await fetch(`${API_URL}/api/v1/borrowers?limit=10`);
      const borrowersData = await borrowersRes.json();
      if (borrowersData.status === 'success') {
        setBorrowers(borrowersData.data.borrowers);
      }

      // Fetch active alerts
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

  const getRiskBadgeClass = (category) => {
    switch (category) {
      case 'Low': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Moderate': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'High': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getAlertIcon = (type) => {
    if (type.toLowerCase().includes('betting') || type.toLowerCase().includes('gambling')) {
      return <TrendingUp size={14} className="text-red-500" />;
    }
    if (type.toLowerCase().includes('income')) {
      return <TrendingUp size={14} className="text-amber-500" />;
    }
    return <AlertTriangle size={14} className="text-amber-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <RefreshCw size={48} className="animate-spin text-indigo-500 mx-auto" />
          <p className="text-slate-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-display text-white">Dashboard Overview</h2>
          <p className="text-slate-400 mt-1">Current view of all ongoing loans</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700/50"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={onAddBorrower}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} /> Add New Borrower
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6">
        <div className="glass-card flex items-center gap-4 border-l-4 border-l-indigo-500">
          <div className="p-3 bg-indigo-500/10 rounded-xl">
            <Users size={24} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Active Borrowers</p>
            <p className="text-2xl font-bold text-white font-display">
              {stats ? stats.total_borrowers.toLocaleString() : '0'}
            </p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <Activity size={24} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Collection Rate</p>
            <p className="text-2xl font-bold text-white font-display">
              {stats ? `${stats.collection_rate}%` : '0%'}
            </p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4 border-l-4 border-l-amber-500">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <AlertTriangle size={24} className="text-amber-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Active Alerts</p>
            <p className="text-2xl font-bold text-amber-400 font-display">
              {stats ? stats.active_alerts : '0'} Warning
            </p>
          </div>
        </div>
      </div>

      {/* Alerts Section - New per blueprint */}
      {alerts.length > 0 && (
        <div className="glass-card">
          <h3 className="text-lg font-bold text-white border-b border-slate-700/50 pb-4 mb-4 flex items-center gap-3">
            <AlertTriangle size={20} className="text-amber-500" />
            Active Monitoring Alerts
          </h3>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 bg-red-500/5 border-l-4 border-red-500/60 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  {getAlertIcon(alert.alert_type)}
                  <div>
                    <p className="font-bold text-red-100 text-sm">{alert.alert_type}</p>
                    <p className="text-xs text-slate-400">{alert.borrower_name} • {alert.description}</p>
                  </div>
                </div>
                <button className="text-xs text-slate-500 hover:text-white transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Borrowers List */}
      <div className="glass-card">
        <h3 className="text-lg font-bold text-white border-b border-slate-700/50 pb-4 mb-4">
          Borrowers Needing Attention
        </h3>

        {borrowers.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Users size={48} className="mx-auto mb-4 opacity-20" />
            <p>No borrowers found. Add your first borrower to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {borrowers.map((borrower) => (
              <div
                key={borrower.id}
                onClick={() => onViewProfile(borrower.id)}
                className="flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-700/50 border border-white/5 rounded-xl cursor-pointer transition-colors group relative overflow-hidden"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${borrower.risk_category === 'High' ? 'bg-red-500' :
                    borrower.risk_category === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}></div>
                <div className="flex items-center gap-4 pl-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">
                    {borrower.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{borrower.name}</p>
                    <p className="text-xs text-slate-400">ID: #{borrower.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-12">
                  <div className="text-right">
                    <p className={`font-bold text-sm ${borrower.risk_score >= 70 ? 'text-emerald-400' :
                        borrower.risk_score >= 35 ? 'text-amber-400' : 'text-red-400'
                      }`}>{borrower.risk_score} Score</p>
                    <p className="text-xs text-slate-500">{borrower.risk_category} Risk</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded ${getRiskBadgeClass(borrower.risk_category)}`}>
                      {borrower.risk_category}
                    </span>
                  </div>
                  <ChevronRight className="text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalPulse;