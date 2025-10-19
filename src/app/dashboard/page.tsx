'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { tunnelsAPI, Tunnel } from '@/lib/api';
import { Plus, Globe, Activity, Trash2, ExternalLink, RefreshCw } from 'lucide-react';

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
    } catch (err: any) {
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
    } catch (err: any) {
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
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create tunnel');
    }
  };

  const handleDeleteTunnel = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tunnel?')) return;
    
    try {
      await tunnelsAPI.deleteTunnel(id);
      setTunnels(tunnels.filter(t => t.id !== id));
    } catch (err: any) {
      setError('Failed to delete tunnel');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SkyPort Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={logout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button onClick={() => setError('')} className="float-right font-bold">×</button>
          </div>
        )}

        {/* Create Tunnel Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Plus size={20} />
            Create New Tunnel
          </button>
        </div>

        {/* Tunnels List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Your Tunnels</h2>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm ${refreshing ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'}`}
              title="Refresh tunnel status"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          {tunnels.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Globe size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">No tunnels yet</p>
              <p>Create your first tunnel to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tunnels.map((tunnel) => (
                <div key={tunnel.id} className="p-6 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{tunnel.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        tunnel.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tunnel.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <ExternalLink size={16} />
                        <span>http://{tunnel.subdomain}.localhost:8080</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity size={16} />
                        <span>Port {tunnel.local_port}</span>
                      </div>
                      {tunnel.last_seen && (
                        <div className="text-xs text-gray-500">
                          Last seen: {new Date(tunnel.last_seen).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDeleteTunnel(tunnel.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete tunnel"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Agent Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Connect with SkyPort Agent</h3>
          <p className="text-blue-700 mb-4">
            Download and install the SkyPort Agent on your computer, then sign in with your account to manage these tunnels.
          </p>
          <div className="flex gap-4">
            <a 
              href="/agent-auth" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Agent Authentication
            </a>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCreate(name, subdomain, localPort);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Create New Tunnel</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tunnel Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
              placeholder="My Web App"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subdomain
            </label>
            <div className="flex">
              <input
                type="text"
                required
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                placeholder="myapp"
              />
              <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600">
                .localhost:8080
              </span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Local Port
            </label>
            <input
              type="number"
              required
              min="1"
              max="65535"
              value={localPort}
              onChange={(e) => setLocalPort(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {loading ? 'Creating...' : 'Create Tunnel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

