import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { useAuth } from '../context/AuthContext';
import { SUPPORTED_LANGUAGES } from '../utils/constants';

export const RegisterPage = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferredLanguage: 'en',
    acceptTerms: false,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!formData.acceptTerms) {
      setError('Please agree to the terms of responsible agricultural advisory use.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await signUp(
        formData.email.trim(),
        formData.password,
        formData.fullName.trim(),
        formData.preferredLanguage
      );

      // Check if session was immediately established or email confirmation is required
      if (res?.session) {
        navigate('/profile');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error('[REGISTRATION_ERROR]', err);
      setError(err.message || 'Unable to register. Please check details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Registration Complete!</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Your farmer account was created successfully. If email confirmation is enabled for your project, please check your inbox to confirm your email, then proceed to sign in.
          </p>
          <Link to="/login">
            <Button size="md" className="w-full mt-2">
              Proceed to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 py-8">
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
            Create Farmer Account
          </h2>
          <p className="text-xs text-gray-500">
            Join the smart agriculture network for tailored crop advisories
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
            label="Farmer's Full Name"
            required
            placeholder="e.g. Ramesh Patil"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />

          <Input
            label="Email Address"
            required
            type="email"
            placeholder="farmer@example.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <Select
            label="Preferred Advisory Language"
            required
            options={SUPPORTED_LANGUAGES.map((l) => ({ value: l.code, label: `${l.native} (${l.label})` }))}
            name="preferredLanguage"
            value={formData.preferredLanguage}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password"
              required
              type="password"
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />

            <Input
              label="Confirm Password"
              required
              type="password"
              placeholder="••••••••"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <label className="flex items-start gap-2.5 text-xs text-gray-600 pt-1 cursor-pointer">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="w-4 h-4 rounded text-agro-600 focus:ring-agro-500 border-gray-300 mt-0.5"
            />
            <span className="leading-snug">
              I understand that AI advisories are decision support tools and do not substitute certified laboratory soil testing or official KVK consultations.
            </span>
          </label>

          <Button
            type="submit"
            isLoading={isLoading}
            icon={UserPlus}
            size="lg"
            className="w-full mt-2"
          >
            Create Farmer Account
          </Button>
        </form>

        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-agro-600 font-bold hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

