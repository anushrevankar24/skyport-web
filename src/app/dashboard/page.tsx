'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { tunnelsAPI, Tunnel } from '@/lib/api';
import { Plus, Globe, Activity, Trash2, ExternalLink, RefreshCw } from 'lucide-react';

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'localhost:8080';

export default function DashboardPage() {
  const [tunnels, setTunnels] = useState<Tunnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadTunnels();
  }, [isAuthenticated, router]);

  const loadTunnels = async () => {
    try {
      const response = await tunnelsAPI.getTunnels();
      setTunnels(response.tunnels);
    } catch {
      setError('Failed to load tunnels');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await tunnelsAPI.getTunnels();
      setTunnels(response.tunnels);
    } catch {
      setError('Failed to refresh tunnels');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateTunnel = async (name: string, subdomain: string, localPort: number) => {
    try {
      const newTunnel = await tunnelsAPI.createTunnel({ name, subdomain, local_port: localPort });
      setTunnels([newTunnel, ...tunnels]);
      setShowCreateModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error && 'response' in err 
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error 
        : undefined;
      setError(errorMessage || 'Failed to create tunnel');
    }
  };

  const handleDeleteTunnel = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tunnel?')) return;
    
    try {
      await tunnelsAPI.deleteTunnel(id);
      setTunnels(tunnels.filter(t => t.id !== id));
    } catch {
      setError('Failed to delete tunnel');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  SkyPort
                </h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start shadow-sm">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="flex-1">{error}</span>
            <button onClick={() => setError('')} className="ml-4 text-red-800 hover:text-red-900 font-bold">×</button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Globe size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{tunnels.length}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Tunnels</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Activity size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {tunnels.filter(t => t.is_active).length}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Active Tunnels</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ExternalLink size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {tunnels.filter(t => !t.is_active).length}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Inactive Tunnels</h3>
          </div>
        </div>

        {/* Create Tunnel Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Create New Tunnel
          </button>
        </div>

        {/* Tunnels List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Your Tunnels</h2>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                refreshing 
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-indigo-300 hover:shadow-sm'
              }`}
              title="Refresh tunnel status"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          {tunnels.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe size={40} className="text-indigo-600" />
              </div>
              <p className="text-xl font-semibold text-gray-900 mb-2">No tunnels yet</p>
              <p className="text-gray-600 mb-6">Create your first tunnel to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                <Plus size={20} />
                Create Your First Tunnel
              </button>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 gap-4">
              {tunnels.map((tunnel) => (
                <div 
                  key={tunnel.id} 
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {/* Title with Status Badge */}
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{tunnel.name}</h3>
                        <span className={`px-4 py-1.5 text-sm font-bold rounded-full ${
                          tunnel.is_active 
                            ? 'bg-green-100 text-green-700 ring-2 ring-green-600/30' 
                            : 'bg-gray-100 text-gray-600 ring-2 ring-gray-400/30'
                        }`}>
                          {tunnel.is_active ? '● ACTIVE' : '○ OFFLINE'}
                        </span>
                      </div>
                      
                      {/* All info in one line - compact */}
                      <div className="flex items-center gap-3 text-sm flex-wrap">
                        {/* Link */}
                        <a 
                          href={`http://${tunnel.subdomain}.${DOMAIN}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-700 font-medium hover:shadow-sm transition-all group/link"
                          title="Open tunnel URL"
                        >
                          <ExternalLink size={16} className="group-hover/link:scale-110 transition-transform" />
                          <span className="truncate">{tunnel.subdomain}.{DOMAIN}</span>
                        </a>

                        {/* Port */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-50 rounded-lg text-purple-700 font-medium">
                          <Activity size={16} />
                          <span>Port {tunnel.local_port}</span>
                        </div>

                        {/* Last Seen */}
                        {tunnel.last_seen && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-lg text-gray-600">
                            <span className="font-medium">Last seen:</span>
                            <span>{new Date(tunnel.last_seen).toLocaleString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Delete Button */}
                    <div className="ml-4 flex-shrink-0">
                      <button
                        onClick={() => handleDeleteTunnel(tunnel.id)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete tunnel"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Agent Instructions */}
        <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connect with SkyPort Agent</h3>
              <p className="text-gray-700 mb-4">
                Download and install the SkyPort Agent on your computer, then sign in with your account to manage these tunnels.
              </p>
              <a 
                href="/agent-auth" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Agent Authentication
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Create Tunnel Modal */}
      {showCreateModal && (
        <CreateTunnelModal 
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTunnel}
        />
      )}
    </div>
  );
}

interface CreateTunnelModalProps {
  onClose: () => void;
  onCreate: (name: string, subdomain: string, localPort: number) => void;
}

function CreateTunnelModal({ onClose, onCreate }: CreateTunnelModalProps) {
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [localPort, setLocalPort] = useState(3000);
  const [loading, setLoading] = useState(false);
  const [subdomainError, setSubdomainError] = useState<string | null>(null);

  const handleSubdomainChange = (value: string) => {
    // Convert to lowercase and remove invalid characters
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(cleanValue);
    
    // Clear error when user starts typing
    if (subdomainError) {
      setSubdomainError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate subdomain before submission
    const { validateSubdomain } = await import('@/lib/validation');
    const validation = validateSubdomain(subdomain);
    
    if (!validation.isValid) {
      setSubdomainError(validation.error || 'Invalid subdomain');
      return;
    }
    
    setLoading(true);
    try {
      await onCreate(name, subdomain, localPort);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Plus size={24} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Create New Tunnel</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tunnel Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 transition-all"
              placeholder="My Web App"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subdomain
            </label>
            <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
              <input
                type="text"
                required
                value={subdomain}
                onChange={(e) => handleSubdomainChange(e.target.value)}
                className={`flex-1 px-4 py-3 focus:outline-none bg-white text-gray-900 placeholder-gray-400 ${
                  subdomainError ? 'border-red-500' : ''
                }`}
                placeholder="myapp"
                minLength={3}
                maxLength={63}
              />
              <span className="px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 font-medium border-l border-gray-300">
                .{DOMAIN}
              </span>
            </div>
            {subdomainError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {subdomainError}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Use lowercase letters, numbers, and hyphens only (3-63 characters)
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Local Port
            </label>
            <input
              type="number"
              required
              min="1"
              max="65535"
              value={localPort}
              onChange={(e) => setLocalPort(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 transition-all"
              placeholder="3000"
            />
            <p className="mt-2 text-xs text-gray-500">
              Port number where your local service is running (1-65535)
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Tunnel'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


