import React from 'react';
import { Users, Activity, AlertTriangle, Plus, ChevronRight, TrendingUp } from 'lucide-react';

const GlobalPulse = ({ onAddBorrower, onViewProfile }) => {
  return (
    <div className="animate-in space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-display text-white">Global Pulse</h2>
          <p className="text-slate-400 mt-1">Real-time overview of the active loan portfolio</p>
        </div>
        <button 
          onClick={onAddBorrower}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Add New Borrower
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6">
        <div className="glass-card flex items-center gap-4 border-l-4 border-l-indigo-500">
          <div className="p-3 bg-indigo-500/10 rounded-xl">
            <Users size={24} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Active Borrowers</p>
            <p className="text-2xl font-bold text-white font-display">1,248</p>
          </div>
        </div>
        
        <div className="glass-card flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <Activity size={24} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Portfolio Health</p>
            <p className="text-2xl font-bold text-white font-display">94.2%</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4 border-l-4 border-l-amber-500">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <AlertTriangle size={24} className="text-amber-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Active Drift Alerts</p>
            <p className="text-2xl font-bold text-amber-400 font-display">12 Warning</p>
          </div>
        </div>
      </div>

      {/* Borrowers List */}
      <div className="glass-card">
        <h3 className="text-lg font-bold text-white border-b border-slate-700/50 pb-4 mb-4">
          Priority Monitoring Queue
        </h3>
        
        <div className="space-y-3">
          {/* Example Row 1: The one we built the profile for */}
          <div 
             onClick={() => onViewProfile('LEN-091220')}
             className="flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-700/50 border border-white/5 rounded-xl cursor-pointer transition-colors group relative overflow-hidden"
          >
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
             <div className="flex items-center gap-4 pl-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">TA</div>
                <div>
                   <p className="font-bold text-white">Tobi Adeyemi</p>
                   <p className="text-xs text-slate-400">ID: #LEN-091220</p>
                </div>
             </div>
             <div className="flex items-center gap-12">
                <div className="text-right">
                   <p className="text-amber-400 font-bold text-sm">72 Score</p>
                   <p className="text-xs text-slate-500">Moderate Risk</p>
                </div>
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                   <TrendingUp size={14} /> Betting Influx Drift
                </div>
                <ChevronRight className="text-slate-500 group-hover:text-white transition-colors" />
             </div>
          </div>

          {/* Example Row 2 */}
          <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-white/5 rounded-xl opacity-75">
             <div className="flex items-center gap-4 pl-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">CO</div>
                <div>
                   <p className="font-bold text-white">Chinedu Okafor</p>
                   <p className="text-xs text-slate-400">ID: #LEN-091221</p>
                </div>
             </div>
             <div className="flex items-center gap-12 pr-10">
                <div className="text-right">
                   <p className="text-emerald-400 font-bold text-sm">94 Score</p>
                   <p className="text-xs text-slate-500">Low Risk</p>
                </div>
                <div className="w-40 text-right">
                   <p className="text-xs text-slate-500">Stable</p>
                </div>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default GlobalPulse;
