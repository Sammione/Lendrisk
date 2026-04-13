import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Loader2,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  User,
  Mail,
  DollarSign,
  Sparkles,
  Zap,
  ArrowLeft,
  Clock,
  Database
} from 'lucide-react';

const OnboardingModal = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [borrowerName, setBorrowerName] = useState('');
  const [email, setEmail] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const sendConsentEmail = async () => {
    setIsProcessing(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

      let response;
      try {
        response = await fetch(`${apiUrl}/api/v1/send-consent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: borrowerName, email: email })
        });
      } catch (endpointError) {
        console.log("Email endpoint not available, trying SMS endpoint...");
        response = await fetch(`${apiUrl}/api/v1/send-sms`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: borrowerName, email: email })
        });
      }

      const data = await response.json();

      if (!response.ok) {
        console.warn("Consent endpoint returned error:", data.detail);
        setStep(2);
        return;
      }

      if (data.status === "simulated") {
        console.log("Consent link generated (simulated mode)");
      }

      setStep(2);
    } catch (e) {
      console.error("Error sending consent:", e);
      setStep(2);
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateProcessing = async () => {
    setStep(3);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/onboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: borrowerName,
          email: email,
          loan_amount: parseFloat(loanAmount),
          mono_code: "okra_token_simulated_8281"
        })
      });

      if (!response.ok) throw new Error("API call failed");

      const data = await response.json();
      console.log("Intelligence Engine Result:", data);

      setStep(4);
      setTimeout(() => setStep(5), 1000);
      setTimeout(() => onComplete(data), 2000);

    } catch (error) {
      console.error(error);
      alert("Failed to connect to Intelligence Engine. Is FastAPI running on port 8000?");
    }
  };

  const steps = [
    { id: 1, title: 'Details', icon: User },
    { id: 2, title: 'Consent', icon: ShieldCheck },
    { id: 3, title: 'Processing', icon: Database },
    { id: 4, title: 'Analysis', icon: Sparkles },
    { id: 5, title: 'Complete', icon: CheckCircle }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg"
      >
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-2xl blur opacity-20" />

        {/* Content */}
        <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black font-display text-white">Add New Borrower</h2>
              <p className="text-slate-400 text-sm mt-1">Initiate a loan request and behavioral scan</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </motion.button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, index) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: step >= s.id ? 1 : 0 }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${step > s.id
                        ? 'bg-emerald-500 text-white'
                        : step === s.id
                          ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                  >
                    {step > s.id ? (
                      <CheckCircle size={18} />
                    ) : (
                      <s.icon size={18} />
                    )}
                  </motion.div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= s.id ? 'text-white' : 'text-slate-600'
                    }`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${step > s.id ? 'bg-emerald-500' : 'bg-slate-800'
                    }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Input Form */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Borrower Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        type="text"
                        value={borrowerName}
                        onChange={(e) => setBorrowerName(e.target.value)}
                        className="input-premium pl-12 pr-4 py-3 w-full"
                        placeholder="e.g. Tobi Adeyemi"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-premium pl-12 pr-4 py-3 w-full"
                        placeholder="tobi@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Loan Amount Requested (₦)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        className="input-premium pl-12 pr-4 py-3 w-full"
                        placeholder="50,000"
                      />
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={sendConsentEmail}
                  disabled={!borrowerName || !email || isProcessing}
                  className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck size={20} />
                      Send Consent Email
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}

            {/* Step 2: Consent Sent */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-6 py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-20 h-20 mx-auto rounded-2xl bg-indigo-500/10 flex items-center justify-center"
                >
                  <ShieldCheck size={40} className="text-indigo-400 animate-pulse" />
                </motion.div>

                <div>
                  <h3 className="text-xl font-bold text-white">Consent Link Sent</h3>
                  <p className="text-slate-400 text-sm mt-2">A secure bank connection link has been sent to:</p>
                  <p className="text-indigo-400 font-bold mt-1">{email}</p>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-slate-500 mb-3">Or click below to simulate consent (for demo):</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={simulateProcessing}
                    className="px-6 py-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-xl text-sm font-bold transition-colors border border-indigo-500/20 flex items-center gap-2 mx-auto"
                  >
                    <Zap size={16} />
                    Simulate Bank Connection
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Steps 3-5: Processing */}
            {step >= 3 && step <= 5 && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-8 py-8"
              >
                <div className="relative w-24 h-24 mx-auto">
                  {/* Spinning ring */}
                  <svg className="animate-spin text-indigo-500/20 w-full h-full" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" strokeWidth="2" stroke="currentColor" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {/* Center icon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <ShieldCheck className="text-indigo-400" size={32} />
                  </div>
                </div>

                <div className="space-y-4">
                  <ProcessingStep
                    text="Linking Mono/Okra APIs..."
                    active={step === 3}
                    completed={step > 3}
                  />
                  <ProcessingStep
                    text="Pulling 90-day transaction history..."
                    active={step === 4}
                    completed={step > 4}
                  />
                  <ProcessingStep
                    text="Building behavioral risk profile..."
                    active={step === 5}
                    completed={step > 5}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const ProcessingStep = ({ text, active, completed }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className={`flex items-center gap-3 text-sm transition-all duration-300 ${active ? 'text-indigo-400 font-bold' : completed ? 'text-emerald-500' : 'text-slate-600'
      }`}
  >
    {completed ? (
      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
        <CheckCircle size={14} className="text-white" />
      </div>
    ) : active ? (
      <div className="w-5 h-5 rounded-full border-2 border-indigo-500 flex items-center justify-center">
        <Loader2 size={12} className="animate-spin" />
      </div>
    ) : (
      <div className="w-5 h-5 rounded-full border-2 border-slate-700" />
    )}
    <p>{text}</p>
  </motion.div>
);

export default OnboardingModal;