import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../services/supabase';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import {
  Settings,
  Globe,
  Lock,
  Shield,
  Trash2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../utils/constants';

export const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();

  // Password reset state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);
    setPasswordError(null);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordMsg('Password changed successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-agro-600" />
          <span>Account Settings & Preferences</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage your interface language, security credentials, and data privacy options.
        </p>
      </div>

      {/* 1. Language Preferences */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-agro-50 text-agro-600 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Application Language</h2>
            <p className="text-xs text-gray-500">
              Select the language used across menus and AI agricultural guidance
            </p>
          </div>
        </div>

        <div className="max-w-xs">
          <Select
            label="Active Language"
            options={SUPPORTED_LANGUAGES.map((l) => ({
              value: l.code,
              label: `${l.native} (${l.label})`,
            }))}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
        </div>
      </div>

      {/* 2. Password & Security Management */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Change Password</h2>
            <p className="text-xs text-gray-500">
              Update your account password to maintain farm data security
            </p>
          </div>
        </div>

        {passwordMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{passwordMsg}</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
          <Input
            label="New Password"
            type="password"
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Repeat new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit" isLoading={isUpdatingPassword} size="sm">
            Update Password
          </Button>
        </form>
      </div>

      {/* 3. Data Privacy & Row Level Security Information */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Data Privacy & Isolation</h2>
            <p className="text-xs text-gray-500">
              PostgreSQL Row Level Security (RLS) protects your agricultural data
            </p>
          </div>
        </div>

        <div className="text-xs text-gray-600 space-y-2 leading-relaxed bg-gray-50 p-4 rounded-2xl">
          <p>
            • <strong>Tenant Data Isolation:</strong> Every farm, soil report, crop recommendation, and conversation is strictly isolated using Supabase PostgreSQL RLS policies tied to your user identifier (<code className="text-gray-800">{user?.id}</code>).
          </p>
          <p>
            • <strong>User-Controlled Data:</strong> You have full control over your advisory history and can delete individual reports anytime from the History tab.
          </p>
          <p>
            • <strong>No Cross-Farmer Contamination:</strong> Your proprietary farm parameters and crop images are never shared with or exposed to any other user.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="text-red-600 hover:bg-red-50 border-red-200"
          >
            Sign Out of Account
          </Button>
        </div>
      </div>
    </div>
  );
};

