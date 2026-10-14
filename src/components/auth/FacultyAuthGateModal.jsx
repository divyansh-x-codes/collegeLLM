import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  X, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCollege } from '../../context/CollegeContext.jsx';

export const FacultyAuthGateModal = ({ isOpen, onClose }) => {
  const { 
    loginStaffCredentials, 
    loginWithGoogle, 
    showToast 
  } = useCollege();

  const [email, setEmail] = useState('simplydivyanshk@gmail.com');
  const [password, setPassword] = useState('faculty@2024');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your institutional faculty email.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your faculty security password.');
      return;
    }

    setIsAuthenticating(true);

    try {
      // Simulate quick secure authentication check
      const success = loginStaffCredentials(email, password);
      if (success) {
        onClose();
      } else {
        setErrorMsg('Authentication failed: Unauthorized credentials for faculty administration.');
      }
    } catch (err) {
      setErrorMsg('Authentication error. Please verify your connection.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGoogleSSO = async () => {
    setErrorMsg('');
    setIsGoogleLoading(true);
    try {
      const success = await loginWithGoogle({ targetPortal: 'admin' });
      if (success) {
        onClose();
      }
    } catch (err) {
      setErrorMsg('Google SSO authorization failed. Try faculty email login.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleQuickFill = (targetEmail = 'jnv.peren55@gmail.com') => {
    setEmail(targetEmail);
    setPassword('faculty@2024');
    setErrorMsg('');
    showToast(`Loaded ${targetEmail} credentials.`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0c1427] border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 text-left shadow-2xl relative text-slate-100 modal-content-animate overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing Ambient Gradient */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-lg shrink-0">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
                Security Checkpoint
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
              Faculty Authentication Required
            </h3>
            <p className="text-xs text-slate-400">
              Verify credentials to switch out of the Student Portal
            </p>
          </div>
        </div>

        {/* Info Note */}
        <div className="p-3 rounded-xl bg-[#080d1b] border border-slate-800/80 text-xs text-slate-300 mb-5 relative z-10 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            Faculty & Administrative zones require authorized clearance. Enter your staff credentials or use institutional Google SSO.
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Institutional Faculty Email</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('jnv.peren55@gmail.com')}
                  className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
                >
                  Fill JNV Peren
                </button>
                <span className="text-slate-600">·</span>
                <button
                  type="button"
                  onClick={() => handleQuickFill('simplydivyanshk@gmail.com')}
                  className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                >
                  Fill Divyansh
                </button>
              </div>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jnv.peren55@gmail.com"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#080d1b] border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Faculty Security Password</span>
              <span className="text-[10px] text-slate-500 font-mono">Default: faculty@2024</span>
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#080d1b] border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white p-0.5 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Verify & Enter Button */}
          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
          >
            {isAuthenticating ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Verify & Enter Faculty Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-[#0c1427] px-3 text-[10px] uppercase font-mono tracking-wider text-slate-500 shrink-0">
            or Single Sign-On
          </span>
        </div>

        {/* Google SSO Button */}
        <button
          type="button"
          onClick={handleGoogleSSO}
          disabled={isGoogleLoading}
          className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-200 bg-[#080d1b] hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google (Faculty SSO)'}</span>
        </button>

        {/* Cancel button */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel & Stay on Student Portal
          </button>
        </div>
      </div>
    </div>
  );
};
