'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Cookies from 'js-cookie';

export default function AgentAuthPage() {
  const [authSuccess, setAuthSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if this is a callback from agent login request
    const token = searchParams.get('token');
    const redirect = searchParams.get('redirect');
    const callbackUrl = searchParams.get('callback');
    
    if (token && isAuthenticated) {
      // Agent is requesting authentication with a token
      handleAgentAuth(token);
    } else if (redirect === 'agent') {
      // This is the callback after successful web login
      handleWebLoginCallback();
    } else if (callbackUrl && isAuthenticated) {
      // Agent sent a callback URL and user is authenticated - auto redirect
      initiateAgentLogin();
    } else {
      setLoading(false);
    }
  }, [searchParams, isAuthenticated]);

  const handleAgentAuth = async (token: string) => {
    // For agent auth, we just need to confirm the user is logged in
    // and redirect back to agent with the auth token
    if (isAuthenticated) {
      const authToken = Cookies.get('token');
      if (authToken) {
        // Redirect back to agent with success
        window.location.href = `skyport://auth?success=true&token=${authToken}`;
        setAuthSuccess(true);
      } else {
        setError('No valid authentication token found');
      }
    } else {
      setError('Please log in first');
    }
    setLoading(false);
  };

  const handleWebLoginCallback = () => {
    if (isAuthenticated) {
      setAuthSuccess(true);
      // Close this window/tab after a short delay
      setTimeout(() => {
        window.close();
      }, 2000);
    }
    setLoading(false);
  };

  const initiateAgentLogin = () => {
    // Check if there's a callback URL for agent
    const callbackUrl = searchParams.get('callback');
    
    if (!isAuthenticated) {
      // Store callback URL and redirect to login
      const loginUrl = callbackUrl 
        ? `/login?callback=${encodeURIComponent(callbackUrl)}`
        : '/login';
      window.location.href = loginUrl;
    } else {
      // Already authenticated, handle the callback
      const authToken = Cookies.get('token');
      if (authToken && callbackUrl) {
        // Redirect back to agent with token
        const redirectUrl = `${callbackUrl}?success=true&token=${authToken}`;
        window.location.href = redirectUrl;
      } else {
        setAuthSuccess(true);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating agent...</p>
        </div>
      </div>
    );
  }

  if (authSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-green-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your SkyPort Agent has been successfully authenticated as <strong>{user?.email}</strong>.
          </p>
          <p className="text-sm text-gray-500">
            You can now close this window and return to the agent.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agent Authentication</h2>
          <p className="text-gray-600">
            Connect your SkyPort Agent to your account
          </p>
        </div>

        {isAuthenticated ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700">
                Logged in as: <strong>{user?.email}</strong>
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Authentication Token</h3>
              <div className="bg-gray-50 border rounded-lg p-3">
                <code className="text-sm break-all">
                  {Cookies.get('token')}
                </code>
              </div>
              <p className="text-xs text-gray-500">
                Copy this token and paste it into your SkyPort Agent to authenticate.
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(Cookies.get('token') || '');
                alert('Token copied to clipboard!');
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
            >
              Copy Token
            </button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <p className="text-gray-600">
              You need to be logged in to authenticate your agent.
            </p>
            <button
              onClick={initiateAgentLogin}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
            >
              Sign In to Authenticate Agent
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
