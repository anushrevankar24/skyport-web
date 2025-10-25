'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Terminal, 
  Download, 
  LogIn, 
  List, 
  Play, 
  Settings, 
  Server, 
  ArrowRight,
  ChevronRight,
  Copy,
  Check,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ChevronLeft
} from 'lucide-react';

export default function DocsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('getting-started');
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(id);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: BookOpen },
    { id: 'installation', title: 'Installation', icon: Download },
    { id: 'authentication', title: 'Authentication', icon: LogIn },
    { id: 'quick-start', title: 'Quick Start', icon: Play },
    { id: 'commands', title: 'Commands', icon: Terminal },
    { id: 'advanced', title: 'Advanced Usage', icon: Settings },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: Server },
  ];

  const CodeBlock = ({ code, language = 'bash', id }: { code: string; language?: string; id: string }) => (
    <div className="relative group">
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => copyToClipboard(code, id)}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          title="Copy to clipboard"
        >
          {copiedCommand === id ? (
            <Check size={16} className="text-green-400" />
          ) : (
            <Copy size={16} className="text-gray-300" />
          )}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-700">
        <code className={`language-${language} text-sm`}>{code}</code>
      </pre>
    </div>
  );

  const Note = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold">i</span>
        </div>
        <div className="text-blue-900 text-sm">{children}</div>
      </div>
    </div>
  );

  const Warning = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold">!</span>
        </div>
        <div className="text-amber-900 text-sm">{children}</div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">
      {/* Sidebar - Same as Dashboard */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white shadow-2xl transform transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-80'} ${!sidebarCollapsed && 'w-80'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className={`p-6 border-b border-gray-200 ${sidebarCollapsed ? 'lg:p-4' : ''}`}>
            <div className={`flex items-center mb-6 ${sidebarCollapsed ? 'lg:justify-center lg:mb-4' : 'justify-between'}`}>
              <div className={`flex items-center space-x-3 ${sidebarCollapsed ? 'lg:space-x-0' : ''}`}>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                {!sidebarCollapsed && (
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    SkyPort
                  </h1>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Collapse Toggle (Desktop only) - Top placement like ChatGPT */}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={sidebarCollapsed ? 'Expand sidebar' : 'Close sidebar'}
                >
                  {sidebarCollapsed ? (
                    <ChevronRight size={20} className="text-gray-700" />
                  ) : (
                    <ChevronLeft size={20} className="text-gray-700" />
                  )}
                </button>
                {/* Mobile close button */}
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Profile Section */}
            {!sidebarCollapsed && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
            )}

            {sidebarCollapsed && (
              <div className="hidden lg:flex justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <nav className="space-y-2">
              {/* Dashboard Link */}
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors ${
                  sidebarCollapsed ? 'lg:justify-center' : ''
                }`}
                title="Dashboard"
              >
                <LayoutDashboard size={20} />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </Link>

              {/* Documentation Link */}
              <Link
                href="/docs"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-50 text-indigo-700 font-medium ${
                  sidebarCollapsed ? 'lg:justify-center' : ''
                }`}
                title="Documentation"
              >
                <BookOpen size={20} />
                {!sidebarCollapsed && <span>Documentation</span>}
              </Link>
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className={`p-6 border-t border-gray-200 ${sidebarCollapsed ? 'lg:p-4' : ''}`}>
            <button
              onClick={logout}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all ${
                sidebarCollapsed ? 'lg:px-2' : ''
              }`}
              title="Sign Out"
            >
              <LogOut size={20} />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'
      }`}>
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu size={24} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Documentation</h2>
                  <p className="text-sm text-gray-600">Complete guide to using SkyPort Agent</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documentation Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Table of Contents */}
            <div className="mb-12 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <List size={20} className="text-indigo-600" />
                Table of Contents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                        activeSection === section.id
                          ? 'bg-indigo-50 text-indigo-700 font-medium'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{section.title}</span>
                      <ChevronRight size={16} className="ml-auto" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Getting Started */}
            <section id="getting-started" className="mb-16 scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <BookOpen size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Getting Started</h2>
                    <p className="text-gray-600">Welcome to SkyPort Agent</p>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    SkyPort is a secure tunnel service that allows you to expose your local services to the internet through encrypted tunnels. 
                    Think of it as your personal gateway to share local applications, APIs, and websites without deploying them.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 my-8">
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                      <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                        <Terminal size={24} className="text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Simple CLI</h3>
                      <p className="text-sm text-gray-600">Easy-to-use command line interface with intuitive commands</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                      <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                        <Server size={24} className="text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Secure Tunnels</h3>
                      <p className="text-sm text-gray-600">End-to-end encrypted connections with automatic SSL/TLS</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                        <Settings size={24} className="text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Easy Setup</h3>
                      <p className="text-sm text-gray-600">Get started in minutes with our automated installers</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Use Cases</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <ArrowRight size={20} className="text-indigo-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700"><strong>Web Development:</strong> Share your local development server with clients or team members</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <ArrowRight size={20} className="text-indigo-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700"><strong>API Testing:</strong> Test webhooks and APIs without deploying</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <ArrowRight size={20} className="text-indigo-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700"><strong>Demos:</strong> Showcase your projects running on localhost</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <ArrowRight size={20} className="text-indigo-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700"><strong>IoT Devices:</strong> Access your home server or IoT devices remotely</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Installation */}
            <section id="installation" className="mb-16 scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Download size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Installation</h2>
                    <p className="text-gray-600">Install SkyPort Agent on your system</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">macOS / Linux</h3>
                    <p className="text-gray-700 mb-4">Run this command in your terminal:</p>
                    <CodeBlock
                      id="install-unix"
                      code="curl -fsSL https://raw.githubusercontent.com/anushrevankar24/skyport-agent/main/install.sh | bash"
                    />
                    <p className="text-sm text-gray-600 mt-3">Or with wget:</p>
                    <div className="mt-2">
                      <CodeBlock
                        id="install-unix-wget"
                        code="wget -qO- https://raw.githubusercontent.com/anushrevankar24/skyport-agent/main/install.sh | bash"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Windows</h3>
                    <p className="text-gray-700 mb-4">Open PowerShell as Administrator and run:</p>
                    <CodeBlock
                      id="install-windows"
                      language="powershell"
                      code="irm https://raw.githubusercontent.com/anushrevankar24/skyport-agent/main/install.ps1 | iex"
                    />
                  </div>

                  <Note>
                    <p><strong>Note:</strong> The installer will automatically download the appropriate binary for your system and install it to your PATH.</p>
                  </Note>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Manual Installation</h3>
                    <p className="text-gray-700 mb-4">If the automated scripts don&apos;t work, you can download binaries manually:</p>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
                      <p className="font-semibold text-gray-900">1. Download the binary for your platform:</p>
                      <ul className="space-y-2 text-sm text-gray-700 ml-4">
                        <li>• <strong>Linux (64-bit):</strong> <code className="bg-white px-2 py-1 rounded border border-gray-300">skyport-linux-amd64</code></li>
                        <li>• <strong>Linux (ARM64):</strong> <code className="bg-white px-2 py-1 rounded border border-gray-300">skyport-linux-arm64</code></li>
                        <li>• <strong>macOS (Intel):</strong> <code className="bg-white px-2 py-1 rounded border border-gray-300">skyport-darwin-amd64</code></li>
                        <li>• <strong>macOS (Apple Silicon):</strong> <code className="bg-white px-2 py-1 rounded border border-gray-300">skyport-darwin-arm64</code></li>
                        <li>• <strong>Windows (64-bit):</strong> <code className="bg-white px-2 py-1 rounded border border-gray-300">skyport-windows-amd64.exe</code></li>
                      </ul>

                      <p className="font-semibold text-gray-900 mt-4">2. Make it executable and move to PATH:</p>
                      <div className="mt-2">
                        <CodeBlock
                          id="manual-install"
                          code={`# Make executable
chmod +x skyport-*

# Move to system PATH
sudo mv skyport-* /usr/local/bin/skyport

# Or install to user directory (no sudo needed)
mkdir -p ~/.local/bin
mv skyport-* ~/.local/bin/skyport
export PATH="$HOME/.local/bin:$PATH"`}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Verify Installation</h3>
                    <p className="text-gray-700 mb-4">Check that SkyPort is installed correctly:</p>
                    <CodeBlock
                      id="verify-install"
                      code="skyport --version"
                    />
                    <p className="text-sm text-gray-600 mt-3">You should see the version number printed to the console.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication" className="mb-16 scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <LogIn size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Authentication</h2>
                    <p className="text-gray-600">Connect the agent to your account</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-gray-700">
                    Before you can start using SkyPort Agent, you need to authenticate it with your SkyPort account.
                  </p>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Login Command</h3>
                    <CodeBlock
                      id="login-cmd"
                      code="skyport login"
                    />
                  </div>

                  <Note>
                    <p><strong>What happens when you run this command:</strong></p>
                    <ol className="mt-2 ml-4 space-y-1">
                      <li>1. Your default browser will open automatically</li>
                      <li>2. You&apos;ll be asked to log in to your SkyPort account</li>
                      <li>3. After successful login, you&apos;ll be redirected back</li>
                      <li>4. Your credentials are securely stored locally</li>
                    </ol>
                  </Note>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Configuration Storage</h3>
                    <p className="text-gray-700 mb-4">SkyPort stores your authentication tokens and configuration in:</p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-3">
                        <ArrowRight size={20} className="text-indigo-600 mt-1 flex-shrink-0" />
                        <span><strong>Linux/macOS:</strong> <code className="bg-gray-100 px-2 py-1 rounded">~/.skyport/</code></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight size={20} className="text-indigo-600 mt-1 flex-shrink-0" />
                        <span><strong>Windows:</strong> <code className="bg-gray-100 px-2 py-1 rounded">%LOCALAPPDATA%\skyport\</code></span>
                      </li>
                    </ul>
                  </div>

                  <Warning>
                    <p><strong>Security Note:</strong> Your authentication tokens are stored locally and should be kept secure. Never share your configuration directory with others.</p>
                  </Warning>
                </div>
              </div>
            </section>

            {/* Quick Start */}
            <section id="quick-start" className="mb-16 scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Play size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Quick Start</h2>
                    <p className="text-gray-600">Get your first tunnel running</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                      Create a Tunnel in Dashboard
                    </h3>
                    <p className="text-gray-700 mb-3">
                      First, create a tunnel configuration in your <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700 font-medium underline">dashboard</Link>. 
                      You&apos;ll need to provide:
                    </p>
                    <ul className="space-y-2 text-gray-700 ml-6">
                      <li className="flex items-start gap-2">
                        <ArrowRight size={18} className="text-indigo-600 mt-1 flex-shrink-0" />
                        <span><strong>Tunnel Name:</strong> A friendly name for your tunnel (e.g., &quot;My Web App&quot;)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight size={18} className="text-indigo-600 mt-1 flex-shrink-0" />
                        <span><strong>Subdomain:</strong> Your unique subdomain (e.g., &quot;myapp&quot; → myapp.skyports.tech)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight size={18} className="text-indigo-600 mt-1 flex-shrink-0" />
                        <span><strong>Local Port:</strong> The port your application is running on (e.g., 3000, 8080)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                      Start Your Local Service
                    </h3>
                    <p className="text-gray-700 mb-3">Make sure your application is running locally. For example:</p>
                    <CodeBlock
                      id="start-service"
                      code={`# Node.js/Next.js
npm run dev

# Python HTTP server
python3 -m http.server 8000

# PHP built-in server
php -S localhost:8000`}
                    />
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                      List Your Tunnels
                    </h3>
                    <p className="text-gray-700 mb-3">View all your configured tunnels:</p>
                    <CodeBlock
                      id="list-tunnels"
                      code="skyport tunnel list"
                    />
                    <p className="text-sm text-gray-600 mt-3">This will show all tunnels you&apos;ve created in the dashboard.</p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm">4</span>
                      Start the Tunnel
                    </h3>
                    <p className="text-gray-700 mb-3">Start your tunnel using the tunnel name:</p>
                    <CodeBlock
                      id="start-tunnel"
                      code="skyport tunnel run my-web-app"
                    />
                    <Note>
                      <p><strong>Success!</strong> Your local service is now accessible at <code className="bg-white px-2 py-1 rounded border border-gray-300">https://myapp.skyports.tech</code></p>
                    </Note>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-300">
                    <h3 className="text-lg font-bold text-green-900 mb-3">🎉 You&apos;re All Set!</h3>
                    <p className="text-green-800">
                      Your tunnel is now active and routing traffic from the internet to your local service. 
                      Visit your tunnel URL in a browser or share it with others!
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Commands Reference */}
            <section id="commands" className="mb-16 scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Terminal size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Commands Reference</h2>
                    <p className="text-gray-600">Complete list of available commands</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Core Commands */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Core Commands</h3>
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <code className="text-indigo-600 font-mono font-semibold">skyport login</code>
                        </div>
                        <div className="px-4 py-3">
                          <p className="text-gray-700">Authenticate with your SkyPort account. Opens browser for OAuth login.</p>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <code className="text-indigo-600 font-mono font-semibold">skyport status</code>
                        </div>
                        <div className="px-4 py-3">
                          <p className="text-gray-700">Show current status of the agent and all active tunnels.</p>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <code className="text-indigo-600 font-mono font-semibold">skyport --help</code>
                        </div>
                        <div className="px-4 py-3">
                          <p className="text-gray-700">Display help information and list all available commands.</p>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <code className="text-indigo-600 font-mono font-semibold">skyport --version</code>
                        </div>
                        <div className="px-4 py-3">
                          <p className="text-gray-700">Display the current version of SkyPort Agent.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tunnel Commands */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Tunnel Management</h3>
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <code className="text-indigo-600 font-mono font-semibold">skyport tunnel list</code>
                        </div>
                        <div className="px-4 py-3">
                          <p className="text-gray-700 mb-2">List all your configured tunnels.</p>
                          <div className="mt-2">
                            <CodeBlock
                              id="cmd-tunnel-list"
                              code={`$ skyport tunnel list
┌─────────────┬──────────────┬────────┬────────────┐
│ Name        │ Subdomain    │ Port   │ Status     │
├─────────────┼──────────────┼────────┼────────────┤
│ My Web App  │ myapp        │ 3000   │ ● ACTIVE   │
│ API Server  │ api          │ 8080   │ ○ OFFLINE  │
└─────────────┴──────────────┴────────┴────────────┘`}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <code className="text-indigo-600 font-mono font-semibold">skyport tunnel run &lt;name&gt;</code>
                        </div>
                        <div className="px-4 py-3">
                          <p className="text-gray-700 mb-2">Start a tunnel by name.</p>
                          <div className="mt-2">
                            <CodeBlock
                              id="cmd-tunnel-run"
                              code={`skyport tunnel run my-web-app

# Run in background
skyport tunnel run my-web-app --background`}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <code className="text-indigo-600 font-mono font-semibold">skyport tunnel stop &lt;name&gt;</code>
                        </div>
                        <div className="px-4 py-3">
                          <p className="text-gray-700 mb-2">Stop a running tunnel.</p>
                          <div className="mt-2">
                            <CodeBlock
                              id="cmd-tunnel-stop"
                              code="skyport tunnel stop my-web-app"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <code className="text-indigo-600 font-mono font-semibold">skyport tunnel info &lt;name&gt;</code>
                        </div>
                        <div className="px-4 py-3">
                          <p className="text-gray-700">Display detailed information about a specific tunnel.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* Advanced Usage */}
            <section id="advanced" className="mb-16 scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Settings size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Advanced Usage</h2>
                    <p className="text-gray-600">Background mode and multiple tunnels</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Background Mode */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Background Mode</h3>
                    <p className="text-gray-700 mb-4">
                      Run tunnels in the background without keeping a terminal window open:
                    </p>
                    <CodeBlock
                      id="background-mode"
                      code={`# Start tunnel in background
skyport tunnel run my-app --background

# Check status
skyport status

# Stop tunnel
skyport tunnel stop my-app`}
                    />
                  </div>

                  {/* Multiple Tunnels */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Running Multiple Tunnels</h3>
                    <p className="text-gray-700 mb-4">
                      You can run multiple tunnels simultaneously, each exposing a different local port:
                    </p>
                    <CodeBlock
                      id="multiple-tunnels"
                      code={`# Terminal 1 - Frontend (port 3000)
skyport tunnel run frontend-app

# Terminal 2 - Backend API (port 8080)
skyport tunnel run backend-api

# Or use background mode
skyport tunnel run frontend-app --background
skyport tunnel run backend-api --background

# Check all running tunnels
skyport status`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Troubleshooting */}
            <section id="troubleshooting" className="mb-16 scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Server size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Troubleshooting</h2>
                    <p className="text-gray-600">Common issues and solutions</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Command Not Found */}
                  <div className="border-l-4 border-amber-500 bg-amber-50 rounded-r-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">❌ Command not found: skyport</h3>
                    <p className="text-gray-700 mb-4"><strong>Solution:</strong></p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-2">Linux/macOS:</p>
                        <CodeBlock
                          id="fix-path-unix"
                          code={`# Check if binary exists
ls -la /usr/local/bin/skyport

# Add to PATH if needed
export PATH="$HOME/.local/bin:$PATH"

# Add to shell profile permanently
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc`}
                        />
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-900 mb-2">Windows:</p>
                        <ol className="text-sm text-gray-700 ml-4 space-y-1">
                          <li>1. Open &quot;Environment Variables&quot; in System Settings</li>
                          <li>2. Add the installation directory to your PATH</li>
                          <li>3. Restart PowerShell/CMD</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* Permission Denied */}
                  <div className="border-l-4 border-amber-500 bg-amber-50 rounded-r-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">❌ Permission denied</h3>
                    <p className="text-gray-700 mb-4"><strong>Solution:</strong></p>
                    <CodeBlock
                      id="fix-permissions"
                      code={`# Make binary executable
chmod +x /usr/local/bin/skyport

# Or reinstall
curl -fsSL https://raw.githubusercontent.com/anushrevankar24/skyport-agent/main/install.sh | bash`}
                    />
                  </div>

                  {/* Connection Issues */}
                  <div className="border-l-4 border-amber-500 bg-amber-50 rounded-r-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">❌ Connection failed / Tunnel not working</h3>
                    <p className="text-gray-700 mb-4"><strong>Check these common issues:</strong></p>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                        <div>
                          <p className="font-semibold">Verify internet connection:</p>
                          <CodeBlock
                            id="check-internet"
                            code="ping skyports.tech"
                          />
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                        <div>
                          <p className="font-semibold">Check agent status:</p>
                          <CodeBlock
                            id="check-status"
                            code="skyport status"
                          />
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                        <div>
                          <p className="font-semibold">Verify local service is running:</p>
                          <CodeBlock
                            id="check-local"
                            code="curl http://localhost:3000"
                          />
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">4</span>
                        <div>
                          <p className="font-semibold">Check firewall settings - ensure SkyPort can make outbound connections</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Authentication Issues */}
                  <div className="border-l-4 border-amber-500 bg-amber-50 rounded-r-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">❌ Authentication failed</h3>
                    <p className="text-gray-700 mb-4"><strong>Solution:</strong></p>
                    <ol className="space-y-2 text-gray-700 ml-4">
                      <li>1. Try logging out and back in:</li>
                    </ol>
                    <div className="mt-2">
                      <CodeBlock
                        id="reauth"
                        code={`# Clear credentials
rm -rf ~/.skyport/

# Login again
skyport login`}
                      />
                    </div>
                  </div>

                  {/* Port Already in Use */}
                  <div className="border-l-4 border-amber-500 bg-amber-50 rounded-r-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">❌ Port already in use</h3>
                    <p className="text-gray-700 mb-4"><strong>Solution:</strong></p>
                    <p className="text-gray-700 mb-2">Find what&apos;s using the port:</p>
                    <CodeBlock
                      id="find-port"
                      code={`# Linux/macOS
lsof -i :3000

# Windows
netstat -ano | findstr :3000`}
                    />
                    <p className="text-gray-700 mt-3">Either stop that process or use a different port in your tunnel configuration.</p>
                  </div>

                  {/* Uninstall */}
                  <div className="border-l-4 border-red-500 bg-red-50 rounded-r-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">🗑️ Uninstalling SkyPort</h3>
                    <p className="text-gray-700 mb-4">To completely remove SkyPort from your system:</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-2">Linux/macOS:</p>
                        <CodeBlock
                          id="uninstall-unix"
                          code={`# Remove service (if installed)
skyport service uninstall

# Remove binary
sudo rm /usr/local/bin/skyport

# Remove configuration
rm -rf ~/.skyport`}
                        />
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-900 mb-2">Windows:</p>
                        <CodeBlock
                          id="uninstall-windows"
                          language="powershell"
                          code={`# Remove service (if installed)
skyport service uninstall

# Remove files
Remove-Item "$env:LOCALAPPDATA\\SkyPort" -Recurse

# Remove from PATH manually via Environment Variables`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Need More Help */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
              <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
                If you&apos;re still experiencing issues or have questions, we&apos;re here to help!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-700 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                >
                  <LayoutDashboard size={20} />
                  Go to Dashboard
                </Link>
                <a
                  href="mailto:support@skyports.tech"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

