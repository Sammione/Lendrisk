import React from 'react';
import { CreditCard, TrendingUp, Search, Download } from 'lucide-react';

const LoanManagement = () => {
  const loans = [
    { id: '#L-3341', borrower: 'Tobi Adeyemi', amount: '₦ 50,000', issued: '02 Oct 2023', nextDue: '02 Nov 2023', status: 'Active', statusColor: 'emerald' },
    { id: '#L-2910', borrower: 'Chinedu Okafor', amount: '₦ 150,000', issued: '15 Sep 2023', nextDue: '15 Oct 2023', status: 'Active', statusColor: 'emerald' },
    { id: '#L-2884', borrower: 'Aisha Bello', amount: '₦ 20,000', issued: '01 Sep 2023', nextDue: '01 Oct 2023', status: 'Delinquent', statusColor: 'amber' },
    { id: '#L-2101', borrower: 'Samuel Ojo', amount: '₦ 75,000', issued: '10 Aug 2023', nextDue: '-', status: 'Defaults', statusColor: 'red' },
    { id: '#L-1903', borrower: 'Ngozi Eze', amount: '₦ 30,000', issued: '05 Aug 2023', nextDue: '-', status: 'Repaid', statusColor: 'indigo' },
  ];

  return (
    <div className="animate-in space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-display text-white">Loan Management</h2>
          <p className="text-slate-400 mt-1">Direct oversight of disbursed capital and collections.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 hover:text-white transition-colors border border-slate-700/50">
          <Download size={20} /> Export Book
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
         <MetricCard title="Total Disbursed" value="₦ 45.2M" />
         <MetricCard title="Portfolio at Risk" value="₦ 3.4M" danger />
         <MetricCard title="Collection Rate" value="92.4%" />
         <MetricCard title="Loans This Month" value="412" />
      </div>

      <div className="glass-card">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-lg font-bold text-white">Current Loan Register</h3>
           <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                 className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                 placeholder="Search by Loan ID..." 
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b justify-between items-center mb-6 border-slate-700/50 text-xs font-black text-slate-500 uppercase tracking-widest">
                <th className="py-4 pl-4">Loan ID</th>
                <th className="py-4">Borrower</th>
                <th className="py-4">Principal Amount</th>
                <th className="py-4">Issued On</th>
                <th className="py-4">Next Payment Due</th>
                <th className="py-4 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 pl-4 font-bold text-slate-300">{loan.id}</td>
                  <td className="py-4 font-bold text-white">{loan.borrower}</td>
                  <td className="py-4 font-bold text-indigo-300">{loan.amount}</td>
                  <td className="py-4 text-sm text-slate-400">{loan.issued}</td>
                  <td className="py-4 text-sm text-slate-400">{loan.nextDue}</td>
                  <td className="py-4 pr-4">
                     <span className={`text-xs font-bold px-3 py-1 rounded bg-${loan.statusColor}-500/10 text-${loan.statusColor}-500 border border-${loan.statusColor}-500/20 uppercase tracking-wider`}>
                        {loan.status}
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
