import React from 'react';
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Smartphone, 
  Dice5 
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
  Pie
} from 'recharts';
import { motion } from 'framer-motion';

// Mock data for initial design reveal
const incomeData = [
  { month: 'Oct', amount: 450000 },
  { month: 'Nov', amount: 420000 },
  { month: 'Dec', amount: 480000 },
  { month: 'Jan', amount: 310000 },
  { month: 'Feb', amount: 460000 },
  { month: 'Mar', amount: 495000 },
];

const spendingData = [
  { name: 'Rent', value: 35 },
  { name: 'Utilities', value: 15 },
  { name: 'Betting', value: 12 },
  { name: 'Airtime/Data', value: 10 },
  { name: 'Savings', value: 20 },
  { name: 'Other', value: 8 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#e2e8f0'];

const BorrowerProfile = ({ borrowerData }) => {
  const score = 72; // Moderate risk for demo

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
                <h2 className="text-4xl font-bold font-display tracking-tight text-white">Tobi Adeyemi</h2>
                <p className="text-slate-400 font-medium flex items-center gap-2 mt-2">
                  <Smartphone size={16} className="text-slate-500" /> +234 812 456 7890 • ID: #LEN-091220
                </p>
              </div>
              
              <div className="flex gap-4 items-center">
                <span className="risk-score-badge badge-mod border-amber-500/40">Moderate behavioral Risk</span>
                <div className="h-4 w-px bg-slate-700"></div>
                <span className="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/5 px-3 py-1 rounded-lg border border-emerald-500/10">
                  <CheckCircle size={14} /> KYC Verified
                </span>
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
                    stroke="#f59e0b" strokeWidth="8" fill="transparent" 
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
                  <span className="text-[11px] text-amber-500/80 uppercase font-bold tracking-[0.2em]">Risk Score</span>
               </div>
            </div>
            
            <div className="text-right space-y-1">
               <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Assessment Basis</p>
               <p className="text-sm font-bold text-slate-200">90-Day Transaction Flow</p>
               <p className="text-xs text-slate-500">Last Synched: Today, 10:45 AM</p>
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
                  Monthly Income & Liquidity Regularity
                </h3>
                <p className="text-slate-500 text-sm mt-1">Verification of consistent inflows versus monthly burn rate.</p>
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
                Critical Behavioral Anomaly detected in January: 35% income volatility.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
             <div className="glass-card">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Spending Composition</h3>
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
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Active Intelligence Feed</h3>
                <div className="space-y-4">
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex gap-4 p-4 bg-red-500/5 border-l-4 border-red-500/60 rounded-r-xl"
                  >
                    <Dice5 size={22} className="text-red-500 mt-1" />
                    <div>
                      <p className="font-bold text-red-100 text-sm">Betting Influx Cluster</p>
                      <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">System flags sudden 12% spike in non-essential gambling spend over the last 14 days.</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-4 p-4 bg-amber-500/5 border-l-4 border-amber-500/60 rounded-r-xl"
                  >
                    <Clock size={22} className="text-amber-500 mt-1" />
                    <div>
                      <p className="font-bold text-amber-100 text-sm">Post-Payday Survival Drop</p>
                      <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">Liquidity survival rate collapsed to 3.2 days after latest salary inflow. High debt-burn suspected.</p>
                    </div>
                  </motion.div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: AI Insights & Actions */}
        <div className="col-span-4 space-y-8">
          <div className="glass-card bg-indigo-500/5 border-indigo-500/30 ring-1 ring-white/5 relative group">
            <div className="absolute top-0 right-0 p-4">
               <div className="px-2 py-1 bg-indigo-500/20 text-[10px] font-black text-indigo-300 rounded tracking-widest uppercase">Verified AI Model v4.1</div>
            </div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <AlertCircle size={24} className="text-indigo-400" />
              Machine Insights
            </h3>
            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-slate-200 text-sm leading-relaxed font-medium">
                  "The borrower profile shows an <span className="font-bold text-white underline decoration-amber-500 decoration-2 underline-offset-4">Anomaly Score of 0.72</span>. 
                  Although base income regularity is 'Grade A', the spending behavior indicates 
                  significant <span className="text-red-400">behavioral drift</span> in gambling clusters. 
                  Repayment capacity is stable, but volatility is likely."
                </p>
              </div>
              
              <div className="space-y-3">
                 <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-white/5">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Income Health</span>
                    <span className="text-emerald-400 text-xs font-black uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Optimal</span>
                 </div>
                 <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-white/5">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Discretionary Ratio</span>
                    <span className="text-amber-400 text-xs font-black uppercase bg-amber-500/10 px-2 py-0.5 rounded">Concerning</span>
                 </div>
                 <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-white/5">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Historical Trust</span>
                    <span className="text-indigo-400 text-xs font-black uppercase bg-indigo-500/10 px-2 py-0.5 rounded">High Baseline</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-base shadow-indigo-500/40"
            >
              Approve Loan Request <ArrowRight size={20} />
            </motion.button>
            <button className="w-full bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 hover:text-white text-slate-300 font-bold py-4 rounded-2xl transition-all shadow-xl">
              Request Bank Statement Sync
            </button>
            <div className="pt-4 flex flex-col items-center gap-3">
               <button className="text-slate-500 text-xs font-black uppercase tracking-widest hover:text-red-500 transition-colors">
                 Reject with Explanatory Letter
               </button>
               <p className="text-[10px] text-slate-700 font-bold text-center uppercase tracking-tighter">
                 Decision Support Tool. Final approval resides with Bank Officer.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowerProfile;
