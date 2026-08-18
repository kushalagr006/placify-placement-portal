import React, { useState } from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Logo } from './components/Logo';
import { Illustration } from './components/Illustration';
import { RoleSelector } from './components/RoleSelector';
import { InputField } from './components/InputField';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { SignUpModal } from './components/SignUpModal';
import { TpoAdminPortalContainer } from './components/admin/TpoAdminPortalContainer';
import { CompanyPortalContainer } from './components/recruiter/CompanyPortalContainer';
import { StudentPortal } from './components/student/StudentPortal';

// Icons
import { Mail, Lock } from 'lucide-react';

/* =========================================================================
   1. LOGIN PAGE VIEW
   ========================================================================= */
const LoginPageView = () => {
  const { loginWithCredentials, isLoading } = usePortal();

  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const res = await loginWithCredentials(email, password, selectedRole);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Centered Main 50/50 Card */}
      <div className="max-w-[1080px] w-full bg-white rounded-[24px] shadow-card overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-slate-200/60">
        
        {/* LEFT SECTION (50%) */}
        <div className="bg-gradient-to-b from-[#F5F9FF] to-[#EDF4FF] p-8 sm:p-10 flex flex-col justify-between items-center text-center relative border-b lg:border-b-0 lg:border-r border-slate-100">
          <div className="w-full flex flex-col items-center pt-2">
            <Logo />
            <div className="mt-8">
              <h2 className="text-[20px] font-bold text-[#0F172A] tracking-tight">
                Find. Apply. Get Hired.
              </h2>
              <p className="text-[#64748B] text-sm font-medium mt-2 max-w-[340px] leading-relaxed">
                Explore internships and full-time opportunities from top companies.
              </p>
            </div>
          </div>

          <div className="my-6 w-full flex justify-center">
            <Illustration />
          </div>

          <div className="w-full text-center pb-1">
            <p className="text-[#64748B] text-xs font-medium">
              © <span className="font-bold text-[#0F172A]">2026</span> Placify. All rights reserved.
            </p>
          </div>
        </div>

        {/* RIGHT SECTION (50%) */}
        <div className="bg-white p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-[32px] font-extrabold text-[#0F172A] tracking-tight">
                Welcome Back!
              </h2>
              <p className="text-[#64748B] text-base font-medium mt-1.5">
                Login to your account
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-[12px] text-xs font-semibold text-center">
                {errorMsg}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <RoleSelector
                selectedRole={selectedRole}
                onSelectRole={handleSelectRole}
              />

              <InputField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                icon={Mail}
                required
              />

              <div>
                <InputField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  icon={Lock}
                  isPassword={true}
                  required
                />

                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-xs sm:text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 active:scale-[0.99] text-white font-bold text-base rounded-[14px] shadow-btn hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? 'Authenticating...' : 'Login'}
              </button>
            </form>
          </div>

          <div className="text-center pt-8 mt-4 border-t border-slate-100">
            <p className="text-sm font-medium text-[#64748B]">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUpOpen(true)}
                className="font-bold text-[#2563EB] hover:text-[#1D4ED8] hover:underline transition-colors ml-1"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

      </div>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        defaultRole={selectedRole}
      />

      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        selectedRole={selectedRole}
      />
    </div>
  );
};

/* =========================================================================
   2. MAIN APPLICATION ROUTER
   ========================================================================= */
const MainApp = () => {
  const { isLoggedIn, activeRole, logout } = usePortal();

  if (!isLoggedIn) {
    return <LoginPageView />;
  }

  // TPO Admin Workspace
  if (activeRole === 'admin') {
    return <TpoAdminPortalContainer onLogout={logout} />;
  }

  // Employer / Recruiter Workspace
  if (activeRole === 'recruiter' || activeRole === 'company') {
    return <CompanyPortalContainer onLogout={logout} />;
  }

  // Student Portal Workspace
  return <StudentPortal onLogout={logout} />;
};

export default function App() {
  return (
    <PortalProvider>
      <MainApp />
    </PortalProvider>
  );
}
