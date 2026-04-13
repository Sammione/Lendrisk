import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Key,
  Database,
  Bell,
  Save,
  CheckCircle,
  Settings,
  Zap,
  TrendingUp,
  AlertTriangle,
  Eye,
  RefreshCw,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

const SystemConfig = () => {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    autoApprovalThreshold: 85,
    driftSensitivity: 'medium',
    apiKeys: {
      mono: 'test_sk_mono_93810238a2b3_dev',
      okra: 'test_sk_okra_88291038a8b1_prod'
    },
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    riskThresholds: {
      low: { min: 70, max: 100 },
      moderate: { min: 35, max: 69 },
      high: { min: 0, max: 34 }
    }
  });

  const handleSave = async () => {
    setSaved(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Configuration saved:', config);
    } catch (error) {
      console.error('Error saving configuration:', error);
    } finally {
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const updateThreshold = (level, field, value) => {
    setConfig(prev => ({
      ...prev,
      riskThresholds: {
        ...prev.riskThresholds,
        [level]: {
          ...prev.riskThresholds[level],
          [field]: parseInt(value)
        }
      }
    }));
  };

  return (
    <motion.div
      className="animate-in space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Settings size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black font-display text-white tracking-tight">System Configuration</h2>
            <p className="text-slate-400 mt-1">Manage core risk engine parameters and API integrations</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="btn-primary flex items-center gap-2"
        >
          {saved ? (
            <>
              <CheckCircle size={20} />
              Configuration Saved
            </>
          ) : (
            <>
              <Save size={20} />
              Apply Changes
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* API Settings */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4 }}
          className="col-span-6 space-y-6"
        >
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Key size={20} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Data Connectors</h3>
                <p className="text-slate-500 text-sm">Bank API integrations and authentication</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Mono API Key</label>
                <div className="flex items-center gap-3">
                  <input
                    type="password"
                    value={config.apiKeys.mono}
                    readOnly
                    className="input-premium flex-1"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    <Edit size={16} className="text-slate-400" />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Okra Production Key</label>
                <div className="flex items-center gap-3">
                  <input
                    type="password"
                    value={config.apiKeys.okra}
                    readOnly
                    className="input-premium flex-1"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    <Edit size={16} className="text-slate-400" />
                  </motion.button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg border border-indigo-500/20 transition-colors"
                >
                  <RefreshCw size={16} />
                  Test Connection
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/50 transition-colors"
                >
                  <Plus size={16} />
                  Add New API
                </motion.button>
              </div>
            </div>
          </div>

          {/* Risk Engine Settings */}
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Shield size={20} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Risk Engine Thresholds</h3>
                <p className="text-slate-500 text-sm">Configure behavioral analysis parameters</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Auto-Approval Threshold */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">Auto-Approval Threshold</p>
                    <p className="text-xs text-slate-500">Minimum score required for 0-touch approval</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 font-black text-white min-w-[60px] text-center">
                    {config.autoApprovalThreshold}
                  </div>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={config.autoApprovalThreshold}
                  onChange={(e) => setConfig(prev => ({ ...prev, autoApprovalThreshold: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>50 (Conservative)</span>
                  <span>95 (Aggressive)</span>
                </div>
              </div>

              {/* Drift Sensitivity */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">Behavioral Drift Sensitivity</p>
                    <p className="text-xs text-slate-500">Deviation required to trigger a Priority Alert</p>
                  </div>
                  <select
                    value={config.driftSensitivity}
                    onChange={(e) => setConfig(prev => ({ ...prev, driftSensitivity: e.target.value }))}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 font-bold text-slate-300 focus:outline-none"
                  >
                    <option value="low">Low (15%)</option>
                    <option value="medium">Medium (10%)</option>
                    <option value="high">High (5%)</option>
                  </select>
                </div>
              </div>

              {/* Risk Thresholds */}
              <div className="space-y-3">
                <div>
                  <p className="font-bold text-white mb-2">Risk Category Thresholds</p>
                  <p className="text-xs text-slate-500">Define score ranges for each risk category</p>
                </div>

                {Object.entries(config.riskThresholds).map(([level, range]) => (
                  <div key={level} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold capitalize text-white">
                        {level} Risk
                      </span>
                      <span className="text-xs text-slate-500">
                        {range.min} - {range.max} points
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Min Score</label>
                        <input
                          type="number"
                          value={range.min}
                          onChange={(e) => updateThreshold(level, 'min', e.target.value)}
                          className="input-premium text-sm"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Max Score</label>
                        <input
                          type="number"
                          value={range.max}
                          onChange={(e) => updateThreshold(level, 'max', e.target.value)}
                          className="input-premium text-sm"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Monitoring & Alerts */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, delay: 0.1 }}
          className="col-span-6 space-y-6"
        >
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Bell size={20} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Monitoring & Alerts</h3>
                <p className="text-slate-500 text-sm">Configure notification preferences and alert rules</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Notification Channels */}
              <div className="space-y-3">
                <p className="text-sm font-bold text-white">Notification Channels</p>
                {Object.entries(config.notifications).map(([channel, enabled]) => (
                  <label key={channel} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded border-2 ${enabled ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'
                        }`}>
                        {enabled && <CheckCircle size={12} className="text-white mt-0.5 ml-0.5" />}
                      </div>
                      <span className="text-sm text-slate-300 capitalize">{channel}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => setConfig(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, [channel]: !enabled }
                      }))}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>

              {/* Alert Rules */}
              <div className="space-y-3">
                <p className="text-sm font-bold text-white">Alert Rules</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={16} className="text-amber-400" />
                      <div>
                        <span className="text-sm text-slate-300">High Risk Score</span>
                        <p className="text-xs text-slate-500">Notify when score drops below 35</p>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="sr-only" />
                    <div className="w-10 h-6 bg-slate-600 rounded-full relative">
                      <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Eye size={16} className="text-emerald-400" />
                      <div>
                        <span className="text-sm text-slate-300">Suspicious Activity</span>
                        <p className="text-xs text-slate-500">Monitor for unusual spending patterns</p>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="sr-only" />
                    <div className="w-10 h-6 bg-slate-600 rounded-full relative">
                      <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap size={16} className="text-indigo-400" />
                      <div>
                        <span className="text-sm text-slate-300">Drift Detection</span>
                        <p className="text-xs text-slate-500">Alert on behavioral changes</p>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="sr-only" />
                    <div className="w-10 h-6 bg-slate-600 rounded-full relative">
                      <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="pt-4 border-t border-slate-700/50">
                <p className="text-sm font-bold text-white mb-3">System Status</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div>
                      <span className="text-sm text-slate-300">API Connections</span>
                      <p className="text-xs text-slate-500">All systems operational</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div>
                      <span className="text-sm text-slate-300">Risk Engine</span>
                      <p className="text-xs text-slate-500">Processing normally</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <TrendingUp size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Performance Metrics</h3>
                <p className="text-slate-500 text-sm">System health and processing statistics</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">API Response Time</span>
                  <span className="text-white font-bold">120ms</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full w-3/4"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Processing Queue</span>
                  <span className="text-white font-bold">0 items</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full w-0"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Uptime</span>
                  <span className="text-white font-bold">99.8%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full w-11/12"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Database Health</span>
                  <span className="text-white font-bold">Optimal</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SystemConfig;