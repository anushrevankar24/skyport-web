'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Cookies from 'js-cookie';
import Link from 'next/link';

function AgentAuthContent() {
  const [authSuccess, setAuthSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedToken, setCopiedToken] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const redirect = searchParams.get('redirect');
    const callbackUrl = searchParams.get('callback');
    
    const handleAgentAuthInternal = async () => {
      if (isAuthenticated) {
        const token = Cookies.get('token');
        if (token) {
          window.location.href = `skyport://auth?success=true&token=${token}`;
          setAuthSuccess(true);
        } else {
          setError('No valid authentication token found');
        }
      } else {
        setError('Please log in first');
      }
      setLoading(false);
    };

    const handleWebLoginCallbackInternal = () => {
      if (isAuthenticated) {
        setAuthSuccess(true);
        setTimeout(() => {
          window.close();
        }, 2000);
      }
      setLoading(false);
    };

    const initiateAgentLoginInternal = () => {
      const callbackUrl = searchParams.get('callback');
      
      if (!isAuthenticated) {
        const loginUrl = callbackUrl 
          ? `/login?callback=${encodeURIComponent(callbackUrl)}`
          : '/login';
        window.location.href = loginUrl;
      } else {
        const authToken = Cookies.get('token');
        if (authToken && callbackUrl) {
          const redirectUrl = `${callbackUrl}?success=true&token=${authToken}`;
          window.location.href = redirectUrl;
        } else {
          setAuthSuccess(true);
        }
      }
    };
    
    if (token && isAuthenticated) {
      handleAgentAuthInternal();
    } else if (redirect === 'agent') {
      handleWebLoginCallbackInternal();
    } else if (callbackUrl && isAuthenticated) {
      initiateAgentLoginInternal();
    } else {
      setLoading(false);
    }
  }, [searchParams, isAuthenticated]);

  const initiateAgentLogin = () => {
    const callbackUrl = searchParams.get('callback');
    
    if (!isAuthenticated) {
      const loginUrl = callbackUrl 
        ? `/login?callback=${encodeURIComponent(callbackUrl)}`
        : '/login';
      window.location.href = loginUrl;
    } else {
      const authToken = Cookies.get('token');
      if (authToken && callbackUrl) {
        const redirectUrl = `${callbackUrl}?success=true&token=${authToken}`;
        window.location.href = redirectUrl;
      } else {
        setAuthSuccess(true);
      }
    }
  };

  const copyToken = () => {
    const token = Cookies.get('token');
    if (token) {
      navigator.clipboard.writeText(token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating agent...</p>
        </div>
      </div>
    );
  }

  if (authSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Authentication Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            Your SkyPort Agent has been successfully authenticated as
          </p>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 mb-6">
            <p className="text-lg font-semibold text-indigo-700">{user?.email}</p>
          </div>
          <p className="text-sm text-gray-500">
            You can now close this window and return to the agent.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Authentication Failed
          </h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Back to Dashboard */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Agent Authentication</h2>
                <p className="text-indigo-100">Connect your SkyPort Agent</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {isAuthenticated ? (
              <div className="space-y-6">
                {/* User Info */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-900">Logged in as:</p>
                      <p className="font-bold text-green-700">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Token Section */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Authentication Token
                  </h3>
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 relative">
                    <code className="text-sm text-green-400 break-all font-mono">
                      {Cookies.get('token')}
                    </code>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Copy this token and paste it into your SkyPort Agent to authenticate.
                  </p>
                </div>

                {/* Action Button */}
                <button
                  onClick={copyToken}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  {copiedToken ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Token Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Token
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Authentication Required
                  </h3>
                  <p className="text-gray-600">
                    You need to be logged in to authenticate your agent.
                  </p>
                </div>
                <button
                  onClick={initiateAgentLogin}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                  Sign In to Authenticate Agent
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-indigo-800">
              <p className="font-semibold mb-1">How it works:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Copy the authentication token above</li>
                <li>Paste it into your SkyPort Agent CLI</li>
                <li>Your agent will be connected to your account</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgentAuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AgentAuthContent />
    </Suspense>
  );
}
