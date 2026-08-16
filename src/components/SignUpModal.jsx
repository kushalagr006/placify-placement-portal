import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, CheckCircle2, ArrowRight, Building, BookOpen } from 'lucide-react';
import { authService } from '../services/authService';
import { RoleSelector } from './RoleSelector';

const BRANCH_OPTIONS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
];

const FALLBACK_COLLEGES = [
  { id: 'SSIPMT', _id: 'SSIPMT', name: 'SSIPMT Raipur C.G', code: 'SSIPMT', location: 'Raipur, C.G.' },
  { id: 'CSVTU', _id: 'CSVTU', name: 'CSVTU Bhilai C.G', code: 'CSVTU', location: 'Bhilai, C.G.' },
  { id: 'AMITY', _id: 'AMITY', name: 'Amity University Raipur', code: 'AMITY', location: 'Raipur, C.G.' },
  { id: 'BIT', _id: 'BIT', name: 'BIT DURG', code: 'BIT', location: 'Durg, C.G.' },
  { id: 'MAIC', _id: 'MAIC', name: 'MAIC Raipur', code: 'MAIC', location: 'Raipur, C.G.' },
  { id: 'SSPU', _id: 'SSPU', name: 'SSPU Bhilai', code: 'SSPU', location: 'Bhilai, C.G.' },
];

export const SignUpModal = ({ isOpen, onClose, selectedRole: initialRole = 'student' }) => {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState(BRANCH_OPTIONS[0]);
  const [colleges, setColleges] = useState(FALLBACK_COLLEGES);
  const [selectedCollegeId, setSelectedCollegeId] = useState(FALLBACK_COLLEGES[0].id);
  const [signedUp, setSignedUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      authService
        .getColleges()
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setColleges(data);
            setSelectedCollegeId(data[0].id || data[0]._id);
          }
        })
        .catch((err) => {
          console.log('Using default colleges fallback list:', err);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Map UI role 'recruiter' to backend role 'company'
      const backendRole = selectedRole === 'recruiter' ? 'company' : selectedRole;
      await authService.signup({
        name,
        email,
        password,
        role: backendRole,
        collegeId: selectedRole === 'admin' || selectedRole === 'student' ? selectedCollegeId : undefined,
        branch: selectedRole === 'student' ? branch : undefined,
      });
      setSignedUp(true);
    } catch (err) {
      if (!err.response) {
        setErrorMsg('Cannot connect to backend server. Please make sure backend_node server is running.');
      } else {
        const detail = err.response.data?.detail;
        if (typeof detail === 'string') {
          setErrorMsg(detail);
        } else if (Array.isArray(detail) && detail.length > 0) {
          setErrorMsg(detail.map((d) => d.msg || JSON.stringify(d)).join(', '));
        } else {
          setErrorMsg('Registration failed. Please check your details and try again.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setPassword('');
    setBranch(BRANCH_OPTIONS[0]);
    setSelectedCollegeId(FALLBACK_COLLEGES[0].id);
    setErrorMsg('');
    setSignedUp(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-[24px] shadow-2xl p-6 sm:p-8 relative border border-slate-100">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
        >
          <X size={20} />
        </button>

        {signedUp ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Account Created!</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Welcome aboard, <strong className="text-slate-800">{name}</strong>! Your <span className="capitalize font-semibold text-blue-600">{selectedRole}</span> account has been registered successfully.
              {selectedRole === 'student' ? ' Your registration is now pending approval by your college TPO officer.' : ' You can now log in.'}
            </p>
            <button
              onClick={handleClose}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-[14px] text-sm transition-all shadow-md hover:shadow-lg"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Create Account</h3>
            <p className="text-slate-500 text-sm mb-4">
              Register a new account on Placement Portal.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-[12px] text-xs font-semibold text-center">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4 mb-6">
              {/* Role Selection Tabs */}
              <RoleSelector
                selectedRole={selectedRole}
                onSelectRole={(r) => setSelectedRole(r)}
              />

              {/* College Selection for Admin & Student */}
              {(selectedRole === 'admin' || selectedRole === 'student') && (
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                    <Building size={16} className="text-blue-600" /> Select College / Institution
                  </label>
                  <div className="relative flex items-center">
                    <select
                      value={selectedCollegeId}
                      onChange={(e) => setSelectedCollegeId(e.target.value)}
                      required
                      className="w-full h-12 px-4 bg-white text-slate-900 text-sm font-semibold border border-slate-200 rounded-[14px] outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all cursor-pointer"
                    >
                      <option value="">-- Choose your College --</option>
                      {colleges.map((c) => (
                        <option key={c.id || c._id} value={c.id || c._id}>
                          {c.name} ({c.code}){c.location ? ` - ${c.location}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Branch Selection for Student */}
              {selectedRole === 'student' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                    <BookOpen size={16} className="text-blue-600" /> Select Academic Branch
                  </label>
                  <div className="relative flex items-center">
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      required
                      className="w-full h-12 px-4 bg-white text-slate-900 text-sm font-semibold border border-slate-200 rounded-[14px] outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all cursor-pointer"
                    >
                      {BRANCH_OPTIONS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 text-slate-400" size={19} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full h-12 pl-11 pr-4 bg-white text-slate-900 text-sm font-medium border border-slate-200 rounded-[14px] outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">
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

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-slate-400" size={19} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                    className="w-full h-12 pl-11 pr-4 bg-white text-slate-900 text-sm font-medium border border-slate-200 rounded-[14px] outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-[14px] text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>{loading ? 'Creating Account...' : `Sign Up as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
