import React, { useState } from 'react';
import { Shield, Key, Database, Bell, Save, CheckCircle } from 'lucide-react';

const SystemConfig = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="animate-in space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-display text-white">System Configuration</h2>
        <p className="text-slate-400 mt-1">Manage core risk engine parameters and API integrations</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* API Settings */}
        <div className="col-span-6 space-y-6">
          <div className="glass-card">
            <h3 className="text-lg font-bold text-white flex items-center gap-3 mb-6">
              <Key className="text-indigo-400" size={20} /> Data Connectors
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mono API Key</label>
                <input 
                  type="password" 
                  value="test_sk_mono_93810238a2b3_dev"
                  readOnly
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Okra Production Key</label>
                <input 
                  type="password" 
                  value="test_sk_okra_88291038a8b1_prod"
                  readOnly
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Risk Engine Settings */}
        <div className="col-span-6 space-y-6">
          <div className="glass-card">
            <h3 className="text-lg font-bold text-white flex items-center gap-3 mb-6">
              <Shield className="text-emerald-400" size={20} /> Risk Engine Thresholds
            </h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-white/5">
                <div>
                  <p className="font-bold text-white">Auto-Approval Threshold</p>
                  <p className="text-xs text-slate-400">Minimum score required for 0-touch approval</p>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 font-black text-white">
                  85
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-white/5">
                <div>
                  <p className="font-bold text-white">Behavioral Drift Sensitivity</p>
                  <p className="text-xs text-slate-400">Deviation required to trigger a Priority Alert</p>
                </div>
                <select className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 font-bold text-slate-300 focus:outline-none">
                  <option>Low (15%)</option>
                  <option selected>Medium (10%)</option>
                  <option>High (5%)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <button onClick={handleSave} className="btn-primary w-full flex justify-center items-center gap-2">
                  {saved ? <><CheckCircle size={18} /> Configuration Saved</> : <><Save size={18} /> Apply Changes</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfig;
