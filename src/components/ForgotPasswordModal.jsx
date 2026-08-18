import React, { useState } from 'react';
import { X, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export const ForgotPasswordModal = ({ isOpen, onClose, defaultRole = 'student' }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setEmail('');
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-[24px] shadow-2xl p-6 sm:p-8 relative border border-slate-100">
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Reset Link Sent!</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              We've sent password reset instructions to <strong className="text-slate-800">{email}</strong> for your <span className="capitalize font-semibold text-blue-600">{defaultRole}</span> account.
            </p>
            <button
              onClick={handleReset}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-[14px] text-sm transition-all shadow-md hover:shadow-lg"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Reset Password</h3>
            <p className="text-slate-500 text-sm mb-6">
              Enter your registered <span className="capitalize font-semibold text-blue-600">{defaultRole}</span> email address below.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 text-slate-400" size={19} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full h-12 pl-11 pr-4 bg-white text-slate-900 text-sm font-medium border border-slate-200 rounded-[14px] outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-[14px] text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <span>Send Reset Instructions</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
