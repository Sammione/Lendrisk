import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    Loader2,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    Zap,
    Database
} from 'lucide-react';

const ConnectBank = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [status, setStatus] = useState('idle'); // idle, connecting, success, error
    const [selectedBank, setSelectedBank] = useState(null);
    const [progress, setProgress] = useState(0);

    // Mock banks for demo
    const banks = [
        { id: 'gtbank', name: 'GTBank', color: '#FF6600' },
        { id: 'zenith', name: 'Zenith Bank', color: '#006633' },
        { id: 'access', name: 'Access Bank', color: '#0085C7' },
        { id: 'uba', name: 'UBA', color: '#E21515' },
        { id: 'firstbank', name: 'First Bank', color: '#003B7C' },
        { id: 'ecobank', name: 'Ecobank', color: '#F7941D' },
    ];

    const simulateConnection = async () => {
        if (!selectedBank) return;

        setStatus('connecting');
        setProgress(0);

        // Simulate connection progress
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + Math.random() * 15;
            });
        }, 300);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 3000));

        clearInterval(progressInterval);
        setProgress(100);
        setStatus('success');

        // After success, trigger the onboarding process
        setTimeout(() => {
            // Navigate back to main app with success
            navigate(`/?bankConnected=true&email=${encodeURIComponent(email)}`);
        }, 2000);
    };

    if (!token || !email) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card max-w-md w-full p-8 text-center"
                >
                    <AlertCircle size={48} className="text-amber-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Invalid Link</h2>
                    <p className="text-slate-400">This consent link appears to be invalid or expired.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-6 btn-primary"
                    >
                        Go to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 glass-card max-w-lg w-full p-8"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-2xl shadow-indigo-500/40"
                    >
                        <ShieldCheck size={32} className="text-white" />
                    </motion.div>
                    <h1 className="text-2xl font-black font-display text-white">Connect Your Bank</h1>
                    <p className="text-slate-400 mt-2">Securely link your bank account to complete verification</p>
                    <p className="text-xs text-slate-500 mt-1">Demo Mode - No real bank connection</p>
                </div>

                {status === 'idle' && (
                    <div className="space-y-6">
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                            <p className="text-sm text-indigo-300">
                                <span className="font-bold">Email:</span> {email}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Select Your Bank</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {banks.map((bank) => (
                                    <motion.button
                                        key={bank.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedBank(bank)}
                                        className={`p-4 rounded-xl border-2 transition-all ${selectedBank?.id === bank.id
                                                ? 'border-indigo-500 bg-indigo-500/20'
                                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                            }`}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-lg mb-2 flex items-center justify-center text-white font-bold text-sm"
                                            style={{ backgroundColor: bank.color }}
                                        >
                                            {bank.name.charAt(0)}
                                        </div>
                                        <p className="text-sm font-medium text-white">{bank.name}</p>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {selectedBank && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={simulateConnection}
                                className="btn-primary w-full py-4 flex items-center justify-center gap-3"
                            >
                                <Zap size={20} />
                                Connect to {selectedBank.name}
                                <ArrowRight size={18} />
                            </motion.button>
                        )}
                    </div>
                )}

                {status === 'connecting' && (
                    <div className="text-center space-y-8 py-8">
                        <div className="relative w-24 h-24 mx-auto">
                            <svg className="animate-spin text-indigo-500/20 w-full h-full" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" strokeWidth="2" stroke="currentColor" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <Database className="text-indigo-400" size={32} />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white">Connecting to {selectedBank?.name}...</h3>
                            <p className="text-slate-400 mt-2">Securely fetching your transaction data</p>
                        </div>

                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>

                        <div className="space-y-3 text-sm">
                            <ConnectionStep text="Establishing secure connection..." completed={progress > 20} active={progress <= 20} />
                            <ConnectionStep text="Authenticating with bank..." completed={progress > 40} active={progress > 20 && progress <= 40} />
                            <ConnectionStep text="Fetching 90-day transaction history..." completed={progress > 70} active={progress > 40 && progress <= 70} />
                            <ConnectionStep text="Analyzing spending patterns..." completed={progress > 90} active={progress > 70 && progress <= 90} />
                            <ConnectionStep text="Generating risk profile..." completed={progress >= 100} active={progress > 90 && progress < 100} />
                        </div>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-center space-y-8 py-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="w-20 h-20 mx-auto rounded-2xl bg-emerald-500/20 flex items-center justify-center"
                        >
                            <CheckCircle size={40} className="text-emerald-500" />
                        </motion.div>

                        <div>
                            <h3 className="text-2xl font-bold text-white">Bank Connected Successfully!</h3>
                            <p className="text-slate-400 mt-2">Your transaction data has been securely retrieved</p>
                        </div>

                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                            <p className="text-sm text-emerald-300">
                                <span className="font-bold">Status:</span> Analyzing your financial data...
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-slate-400">
                            <Loader2 size={16} className="animate-spin" />
                            <p className="text-sm">Redirecting to dashboard...</p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const ConnectionStep = ({ text, completed, active }) => (
    <div className={`flex items-center gap-3 ${completed ? 'text-emerald-500' : active ? 'text-indigo-400' : 'text-slate-600'}`}>
        {completed ? (
            <CheckCircle size={16} />
        ) : active ? (
            <Loader2 size={16} className="animate-spin" />
        ) : (
            <div className="w-4 h-4 rounded-full border-2 border-slate-700" />
        )}
        <span className="text-sm">{text}</span>
    </div>
);

export default ConnectBank;