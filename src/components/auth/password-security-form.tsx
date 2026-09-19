'use client';

import React, { useState, useId } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  ShieldCheck,
  KeyRound,
  ArrowRight,
} from 'lucide-react';

interface PasswordSecurityFormProps {
  mode: 'account' | 'admin';
  onSuccess?: () => void;
}

export function PasswordSecurityForm({ mode, onSuccess }: PasswordSecurityFormProps) {
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Strength Validation Calculations
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasSpecialOrNumber = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);

  const strengthScore =
    (hasMinLength ? 1 : 0) +
    (hasUppercase ? 1 : 0) +
    (hasLowercase ? 1 : 0) +
    (hasSpecialOrNumber ? 1 : 0);

  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (strengthScore < 4) {
      setErrorMessage('Please ensure your new password meets all security requirements.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Failed to change password. Please check your current password.');
      } else {
        setSuccessMessage('Password changed successfully! Keep your credentials secure.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Messages */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center gap-2.5">
          <Check className="w-4 h-4 flex-shrink-0 text-blue-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current Password */}
        <div>
          <label
            htmlFor={currentPasswordId}
            className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider"
          >
            Current Password *
          </label>
          <div className="relative">
            <input
              id={currentPasswordId}
              type={showCurrent ? 'text' : 'password'}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your existing password"
              className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-blue-200 bg-white text-ink text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            <KeyRound className="w-4 h-4 text-text-secondary/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="p-1 text-text-secondary/60 hover:text-ink absolute right-3 top-1/2 -translate-y-1/2"
              aria-label={showCurrent ? 'Hide password' : 'Show password'}
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label
            htmlFor={newPasswordId}
            className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider"
          >
            New Password *
          </label>
          <div className="relative">
            <input
              id={newPasswordId}
              type={showNew ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Create a strong new password"
              className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-blue-200 bg-white text-ink text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            <Lock className="w-4 h-4 text-text-secondary/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="p-1 text-text-secondary/60 hover:text-ink absolute right-3 top-1/2 -translate-y-1/2"
              aria-label={showNew ? 'Hide password' : 'Show password'}
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Strength Meter Visual */}
          {newPassword.length > 0 && (
            <div className="mt-2.5 space-y-2">
              <div className="flex gap-1.5 h-1.5 w-full">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full flex-1 rounded-full transition-colors ${
                      strengthScore >= step
                        ? strengthScore <= 2
                          ? 'bg-amber-400'
                          : strengthScore === 3
                          ? 'bg-blue-400'
                          : 'bg-blue-600'
                        : 'bg-blue-100'
                    }`}
                  />
                ))}
              </div>

              {/* Requirement Checklist */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
                <div
                  className={`flex items-center gap-1.5 ${
                    hasMinLength ? 'text-blue-600 font-medium' : 'text-text-secondary/70'
                  }`}
                >
                  {hasMinLength ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>8+ characters</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    hasUppercase ? 'text-blue-600 font-medium' : 'text-text-secondary/70'
                  }`}
                >
                  {hasUppercase ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>Uppercase letter (A-Z)</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    hasLowercase ? 'text-blue-600 font-medium' : 'text-text-secondary/70'
                  }`}
                >
                  {hasLowercase ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>Lowercase letter (a-z)</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    hasSpecialOrNumber ? 'text-blue-600 font-medium' : 'text-text-secondary/70'
                  }`}
                >
                  {hasSpecialOrNumber ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <X className="w-3.5 h-3.5" />
                  )}
                  <span>Number or symbol</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label
            htmlFor={confirmPasswordId}
            className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider"
          >
            Confirm New Password *
          </label>
          <div className="relative">
            <input
              id={confirmPasswordId}
              type={showConfirm ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
              className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-blue-200 bg-white text-ink text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            <Lock className="w-4 h-4 text-text-secondary/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="p-1 text-text-secondary/60 hover:text-ink absolute right-3 top-1/2 -translate-y-1/2"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {confirmPassword.length > 0 && (
            <div className="pt-1.5">
              {passwordsMatch ? (
                <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Passwords match
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-red-500 flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Passwords do not match
                </span>
              )}
            </div>
          )}
        </div>

        {/* Submit CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || strengthScore < 4 || !passwordsMatch}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Updating password...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
