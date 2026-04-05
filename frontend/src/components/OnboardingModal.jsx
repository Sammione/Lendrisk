import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';

const OnboardingModal = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [borrowerName, setBorrowerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loanAmount, setLoanAmount] = useState('');

  if (!isOpen) return null;

  const sendConsentSMS = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/send-sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: borrowerName, phone: phoneNumber })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Twilio Backend Error");
      }
      
      if (data.status === "simulated") {
        alert("Warning: Render Backend reported Twilio is not fully configured. Ensure Env variables are added to Render.");
      }
      
      setStep(2);
    } catch (e) {
      console.error(e);
      alert("Failed to send real SMS: " + e.message);
      setStep(2); // continue to simulation
    }
  };

  const simulateProcessing = async () => {
    setStep(3); // Connecting to Mono/Okra
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/onboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: borrowerName,
          phone: phoneNumber,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
      >
        {/* Step 1: Input Borrower & Loan Request */}
        {step === 1 && (
          <div className="space-y-6 animate-in">
            <div>
              <h2 className="text-2xl font-bold font-display text-white">Add New Borrower</h2>
              <p className="text-slate-400 text-sm mt-1">Initiate a loan request and behavioral scan.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Borrower Full Name</label>
                <input 
                  type="text" 
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Tobi Adeyemi"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number (For SMS Link)</label>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="+234 800 000 0000"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Loan Amount Requested (₦)</label>
                <input 
                  type="number" 
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="50,000"
                />
              </div>
              <button 
                onClick={sendConsentSMS}
                disabled={!borrowerName}
                className="w-full btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Consent Request
              </button>
            </div>
          </div>
        )}

        {/* Step 2: APIs Consent Sent */}
        {step === 2 && (
          <div className="text-center space-y-6 animate-in py-8">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto">
              <Smartphone size={32} className="text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Awaiting Borrower Consent</h3>
              <p className="text-slate-400 text-sm mt-2">An SMS link has been sent to {borrowerName} for Mono/Okra bank connection.</p>
            </div>
            <button 
              onClick={simulateProcessing}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold transition-colors border border-white/5"
            >
              Simulate Borrower Consent Approval
            </button>
          </div>
        )}

        {/* Processing Steps */}
        {step >= 3 && step <= 5 && (
          <div className="text-center space-y-8 animate-in py-8">
            <div className="relative w-24 h-24 mx-auto">
               <svg className="animate-spin text-indigo-500/20 w-full h-full" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" strokeWidth="2" stroke="currentColor"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400" size={32} />
            </div>
            
            <div className="space-y-4">
              <ProcessingStep text="Linking Mono/Okra APIs..." active={step === 3} completed={step > 3} />
              <ProcessingStep text="Pulling 90-day transaction history..." active={step === 4} completed={step > 4} />
              <ProcessingStep text="Building behavioral risk profile..." active={step === 5} completed={step > 5} />
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};

const ProcessingStep = ({ text, active, completed }) => (
  <div className={`flex items-center gap-3 text-sm transition-all duration-300 ${active ? 'text-indigo-400 font-bold' : completed ? 'text-emerald-500' : 'text-slate-600'}`}>
    {completed ? <CheckCircle size={18} /> : active ? <Loader2 size={18} className="animate-spin" /> : <div className="w-4 h-4 border-2 border-slate-700 rounded-full" />}
    <p>{text}</p>
  </div>
);

export default OnboardingModal;
