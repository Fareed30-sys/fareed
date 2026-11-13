import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, LogIn, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both your registered email and password.');
      return;
    }

    try {
      setIsLoading(true);
      await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('[LOGIN_ERROR]', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;

    try {
      setForgotLoading(true);
      await resetPassword(forgotEmail.trim());
      setForgotMsg('Password reset link sent to your email! Please check your inbox.');
    } catch (err) {
      setError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200/80 p-8 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-agro-600 flex items-center justify-center text-white shadow-md shadow-agro-600/30">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-gray-900">
              Agro<span className="text-agro-600">AI</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Farmer Account Login
          </h2>
          <p className="text-xs text-gray-500">
            Sign in to access your agricultural dashboard and advisories
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            required
            type="email"
            placeholder="farmer@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            required
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => {
                setForgotEmail(email);
                setForgotModalOpen(true);
              }}
              className="text-agro-700 font-semibold hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            icon={LogIn}
            size="lg"
            className="w-full mt-2"
          >
            Sign In to Farm Workspace
          </Button>
        </form>

        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-agro-600 font-bold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => {
          setForgotModalOpen(false);
          setForgotMsg(null);
        }}
        title="Reset Your Password"
      >
        {forgotMsg ? (
          <div className="text-center py-4 space-y-4">
            <p className="text-xs text-emerald-700 font-semibold">{forgotMsg}</p>
            <Button size="sm" onClick={() => setForgotModalOpen(false)}>
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              Enter your registered email address and we'll send you a secure link to reset your account password.
            </p>
            <Input
              label="Registered Email"
              required
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setForgotModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" isLoading={forgotLoading}>
                Send Reset Link
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

