'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Cookies from 'js-cookie';

export default function AgentAuthConfirmPage() {
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const { user, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callback');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!isAuthenticated || !callbackUrl) {
      setError('Invalid authentication state');
      return;
    }
  }, [isAuthenticated, callbackUrl]);

  const handleConfirm = async () => {
    if (!callbackUrl || !isAuthenticated) {
      setError('Invalid state for agent authentication');
      return;
    }

    setConfirming(true);
    
    try {
      const authToken = Cookies.get('token');
      if (!authToken) {
        throw new Error('No authentication token found');
      }

      // Redirect back to agent with token
      const redirectUrl = `${callbackUrl}?success=true&token=${authToken}`;
      
      setSuccess(true);
      
      // Small delay to show success message, then redirect
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate agent');
      setConfirming(false);
    }
  };

  const handleCancel = () => {
    if (callbackUrl) {
      const redirectUrl = `${callbackUrl}?success=false&error=user_cancelled`;
      window.location.href = redirectUrl;
    } else {
      window.close();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600">Please sign in first.</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-green-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agent Connected!</h2>
          <p className="text-gray-600 mb-4">
            Your SkyPort Agent has been successfully connected to <strong>{user?.email}</strong>.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting back to agent...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Agent</h2>
          <p className="text-gray-600">
            Authorize your SkyPort Agent to access your account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Account Information</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <div><strong>Name:</strong> {user?.name}</div>
            <div><strong>Email:</strong> {user?.email}</div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-900 mb-2">Agent Permissions</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• View and manage your tunnels</li>
            <li>• Connect and disconnect tunnels</li>
            <li>• Access tunnel configuration</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            disabled={confirming}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirming}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {confirming ? 'Connecting...' : 'Connect Agent'}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          By connecting your agent, you agree to allow it to access your SkyPort account.
        </p>
      </div>
    </div>
  );
}




