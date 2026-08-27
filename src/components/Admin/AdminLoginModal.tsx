import React, { useState } from 'react';
import { Lock, Mail, Key, ShieldCheck, AlertCircle, ArrowRight, X, LogIn } from 'lucide-react';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { checkUserIsAdmin, ROOT_ADMIN_EMAIL } from '../../lib/firestoreService';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const isAdmin = await checkUserIsAdmin(user);

      if (!isAdmin) {
        setError(`Access Denied. Account (${user.email}) does not have administrative permissions. Authorized email is ${ROOT_ADMIN_EMAIL}.`);
        await auth.signOut();
        setIsLoading(false);
        return;
      }

      onSuccess(user);
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Login cancelled.');
      } else {
        setError(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let user: User;
      if (isRegisterMode) {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        user = cred.user;
      } else {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        user = cred.user;
      }

      const isAdmin = await checkUserIsAdmin(user);
      if (!isAdmin) {
        setError(`Access Denied: Account (${user.email}) does not have admin permissions.`);
        await auth.signOut();
        setIsLoading(false);
        return;
      }

      onSuccess(user);
    } catch (err: any) {
      console.error('Email auth error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else {
        setError(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-vp-surface-raised border border-vp shadow-2xl p-6 sm:p-8 relative space-y-6 text-vp-primary">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-vp-muted hover:text-vp-primary hover:bg-vp-surface-hover transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-vp-brand-subtle border border-vp-brand text-vp-brand flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-vp-primary tracking-tight">
            Admin Mission Control
          </h2>
          <p className="text-xs text-vp-muted max-w-xs mx-auto">
            Authorized administrators only. Authenticate to manage software catalog, drafts, categories, and sponsorships.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-vp-error/10 border border-vp-error/25 text-vp-error text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-vp-error shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        {/* Google Sign-In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-vp-surface-subtle hover:bg-vp-surface-hover border border-vp text-xs font-semibold text-vp-primary flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"
            />
          </svg>
          <span>{isLoading ? 'Authenticating...' : 'Sign in with Google'}</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px bg-white/[0.08] flex-1" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-vp-faint">or with email</span>
          <div className="h-px bg-white/[0.08] flex-1" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-vp-secondary mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-vp-muted" />
              <span>Admin Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yogigunes@gmail.com"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-vp-bg border border-vp text-xs text-vp-primary placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-vp-secondary mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-vp-muted" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-vp-bg border border-vp text-xs text-vp-primary placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-vp-brand hover:bg-vp-brand-hover text-vp-inverse font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm cursor-pointer disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>
              {isLoading
                ? 'Processing...'
                : isRegisterMode
                ? 'Create & Authenticate Admin'
                : 'Sign In to Admin Area'}
            </span>
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="pt-2 text-center text-xs text-vp-faint flex items-center justify-center gap-1.5">
          <span>{isRegisterMode ? 'Already have credentials?' : 'Need to set up admin password?'}</span>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError(null);
            }}
            className="text-vp-brand hover:text-emerald-300 font-semibold underline cursor-pointer"
          >
            {isRegisterMode ? 'Sign In' : 'Set up credentials'}
          </button>
        </div>

        {/* Root admin notice */}
        <div className="p-3 rounded-xl bg-vp-bg/80 border border-white/[0.04] text-[11px] text-vp-faint text-center">
          Root administrator authority configured for: <span className="font-mono text-vp-muted">{ROOT_ADMIN_EMAIL}</span>
        </div>
      </div>
    </div>
  );
};
