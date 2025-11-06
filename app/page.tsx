'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

type OS = 'mac' | 'windows' | 'linux' | 'unknown';

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [detectedOS, setDetectedOS] = useState<OS>('unknown');
  const [showInstructions, setShowInstructions] = useState(false);
  const tableScrollRef = useRef<HTMLDivElement>(null);

  const installCommand = 'curl -fsSL https://vibe-coders-desktop.vercel.app/install | bash';

  useEffect(() => {
    // Redirect to /home if user is authenticated
    if (isLoaded && isSignedIn) {
      router.push('/home');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    // Scroll table to show Appily column on mobile
    if (tableScrollRef.current && window.innerWidth < 640) {
      // Scroll to the right to show the Appily column
      tableScrollRef.current.scrollLeft = tableScrollRef.current.scrollWidth;
    }
  }, []);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Detect OS from user agent
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('mac') !== -1) {
      setDetectedOS('mac');
    } else if (userAgent.indexOf('win') !== -1) {
      setDetectedOS('windows');
    } else if (userAgent.indexOf('linux') !== -1) {
      setDetectedOS('linux');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getOSInstructions = () => {
    switch (detectedOS) {
      case 'mac':
        return {
          name: 'macOS',
          steps: [
            {
              icon: '🔍',
              title: 'Open Spotlight Search',
              description: 'Press Command (⌘) + Space on your keyboard',
            },
            {
              icon: '💻',
              title: 'Type "Terminal"',
              description: 'You\'ll see a black icon with ">_" appear',
            },
            {
              icon: '⏎',
              title: 'Press Enter',
              description: 'This opens the Terminal app',
            },
            {
              icon: '📋',
              title: 'Paste the command',
              description: 'Right-click and select Paste, or press Command (⌘) + V',
            },
            {
              icon: '✅',
              title: 'Press Enter',
              description: 'The installation will start automatically and open your browser!',
            },
          ],
        };
      case 'windows':
        return {
          name: 'Windows',
          steps: [
            {
              icon: '📦',
              title: 'Install WSL first',
              description: 'Open PowerShell as Administrator, then run: wsl --install',
            },
            {
              icon: '🔄',
              title: 'Restart your computer',
              description: 'After restart, WSL will finish setup',
            },
            {
              icon: '🐧',
              title: 'Open Ubuntu',
              description: 'Search for "Ubuntu" in Start menu and open it',
            },
            {
              icon: '📋',
              title: 'Paste the command',
              description: 'Right-click in the Ubuntu window to paste',
            },
            {
              icon: '✅',
              title: 'Press Enter',
              description: 'The installation will start and open your browser!',
            },
          ],
        };
      case 'linux':
        return {
          name: 'Linux',
          steps: [
            {
              icon: '⌨️',
              title: 'Open Terminal',
              description: 'Press Ctrl + Alt + T, or search for "Terminal" in your apps',
            },
            {
              icon: '📋',
              title: 'Paste the command',
              description: 'Right-click and select Paste, or press Ctrl + Shift + V',
            },
            {
              icon: '✅',
              title: 'Press Enter',
              description: 'The installation will start and open your browser!',
            },
          ],
        };
      default:
        return {
          name: 'Your System',
          steps: [
            {
              icon: '🖥️',
              title: 'Open Terminal/Command Prompt',
              description: 'Look for Terminal (Mac/Linux) or PowerShell (Windows)',
            },
            {
              icon: '📋',
              title: 'Paste the command',
              description: 'Right-click to paste',
            },
            {
              icon: '✅',
              title: 'Press Enter',
              description: 'Follow the on-screen instructions',
            },
          ],
        };
    }
  };

  const instructions = getOSInstructions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Appily
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                Pricing
              </a>
              <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                How It Works
              </a>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <Link
                href="/home"
                className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-purple-500 via-teal-500 to-blue-500 bg-clip-text text-transparent">
                The AI Development Platform for Non-Technical Builders
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto">
              Professional AI coding power with simple buttons.
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
              Build unlimited projects without learning git, terminal, or npm.
            </p>

            {/* Installation Box */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl mb-8 max-w-4xl mx-auto border border-gray-200 dark:border-slate-700 overflow-hidden">
              {/* OS Detection Header */}
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-6">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{detectedOS === 'mac' ? '🍎' : detectedOS === 'windows' ? '🪟' : detectedOS === 'linux' ? '🐧' : '💻'}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Installation for {instructions.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Installation Command */}
              <div className="p-8">
                <div
                  onClick={copyCommand}
                  className="bg-gray-900 dark:bg-black rounded-xl p-6 cursor-pointer hover:ring-4 hover:ring-teal-500/50 transition-all group relative"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm font-medium uppercase tracking-wide">Installation Command</span>
                    <div className="flex items-center gap-2 text-teal-400 text-sm font-semibold">
                      {copied ? (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="group-hover:text-teal-300">Click to copy</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="font-mono text-sm sm:text-base text-white break-all">
                    {installCommand}
                  </div>
                </div>

                {/* Toggle Instructions */}
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium inline-flex items-center gap-2 transition"
                  >
                    {showInstructions ? (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        <span>Hide instructions</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span>Show me how to install</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Step-by-step instructions */}
              {showInstructions && (
                <div className="px-8 pb-8">
                  <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                      Step-by-Step Guide
                    </h4>
                    <div className="space-y-5">
                      {instructions.steps.map((step, index) => (
                        <div key={index} className="flex gap-4 items-start">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {step.title}
                            </h5>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {detectedOS === 'windows' && (
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-900 dark:text-blue-300">
                          <strong>Windows Note:</strong> WSL (Windows Subsystem for Linux) is required.
                          If you haven't installed it yet, follow Step 1 above first!
                        </p>
                      </div>
                    )}

                    <div className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                      <p className="text-sm text-gray-900 dark:text-white text-center">
                        <strong>That&apos;s it!</strong> After pressing Enter, the app will install automatically and open in your browser.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Demo placeholder */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30">
              <div className="aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">Demo Video Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Appily?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              You shouldn't have to choose between easy and powerful.
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Appily gives you unlimited AI coding power with zero technical complexity.
            </p>
          </div>

          {/* Scroll hint for mobile */}
          <div className="text-center mb-4 sm:hidden">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              👈 Swipe to compare features
            </p>
          </div>

          {/* Comparison Table */}
          <div ref={tableScrollRef} className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-gray-200">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-slate-700">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white"></th>
                  <th className="py-4 px-4 text-center">
                    <div className="font-bold text-lg text-purple-600 dark:text-purple-400">Lovable</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-normal mt-1">Easy but limited</div>
                  </th>
                  <th className="py-4 px-4 text-center">
                    <div className="font-bold text-lg text-blue-600 dark:text-blue-400">Cursor/Claude Code</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-normal mt-1">Powerful but complex</div>
                  </th>
                  <th className="py-4 px-4 text-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50">
                    <div className="font-bold text-lg text-teal-600 dark:text-teal-400">Appily</div>
                    <div className="text-xs text-teal-700 dark:text-teal-300 font-semibold mt-1">Easy AND powerful</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">Import existing projects</td>
                  <td className="py-4 px-4 text-center text-red-600 dark:text-red-400">❌</td>
                  <td className="py-4 px-4 text-center text-green-600 dark:text-green-400">✅</td>
                  <td className="py-4 px-4 text-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50 text-green-600 dark:text-green-400 font-semibold">✅ One click</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">Choose your backend</td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-red-600 dark:text-red-400">❌</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Supabase only</div>
                  </td>
                  <td className="py-4 px-4 text-center text-green-600 dark:text-green-400">✅</td>
                  <td className="py-4 px-4 text-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50 text-green-600 dark:text-green-400 font-semibold">✅</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">Build mobile apps</td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-red-600 dark:text-red-400">❌</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Web only</div>
                  </td>
                  <td className="py-4 px-4 text-center text-green-600 dark:text-green-400">✅</td>
                  <td className="py-4 px-4 text-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50 text-green-600 dark:text-green-400 font-semibold">✅</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">Framework choice</td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-red-600 dark:text-red-400">❌</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">React/TS only</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-green-600 dark:text-green-400">✅</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Unlimited</div>
                  </td>
                  <td className="py-4 px-4 text-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50">
                    <div className="text-green-600 dark:text-green-400 font-semibold">✅</div>
                    <div className="text-xs text-teal-700 dark:text-teal-300 mt-1 font-medium">Unlimited</div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">Team collaboration</td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-yellow-600 dark:text-yellow-400">⚠️</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Can't import team projects</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-green-600 dark:text-green-400">✅</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Git-based (requires git knowledge)</div>
                  </td>
                  <td className="py-4 px-4 text-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50">
                    <div className="text-green-600 dark:text-green-400 font-semibold">✅</div>
                    <div className="text-xs text-teal-700 dark:text-teal-300 mt-1 font-medium">Git-based with UI buttons</div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">Setup time</td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-green-600 dark:text-green-400">✅</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Instant</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-red-600 dark:text-red-400">❌</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">2-4 hours</div>
                  </td>
                  <td className="py-4 px-4 text-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50">
                    <div className="text-green-600 dark:text-green-400 font-semibold">✅</div>
                    <div className="text-xs text-teal-700 dark:text-teal-300 mt-1 font-medium">2 minutes</div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">How to save your work</td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-green-600 dark:text-green-400">✅</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click deploy</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-red-600 dark:text-red-400">❌</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">git add && commit && push</div>
                  </td>
                  <td className="py-4 px-4 text-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50">
                    <div className="text-green-600 dark:text-green-400 font-semibold">✅</div>
                    <div className="text-xs text-teal-700 dark:text-teal-300 mt-1 font-medium">Click "Save"</div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">Technical knowledge needed</td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-green-600 dark:text-green-400">✅</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">None</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-red-600 dark:text-red-400">❌</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Git, npm, terminal</div>
                  </td>
                  <td className="py-4 px-4 text-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50">
                    <div className="text-green-600 dark:text-green-400 font-semibold">✅</div>
                    <div className="text-xs text-teal-700 dark:text-teal-300 mt-1 font-medium">None</div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">Learning curve</td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-2xl">🟢</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Easy</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-2xl">🔴</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Steep</div>
                  </td>
                  <td className="py-4 px-4 text-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50">
                    <div className="text-2xl">🟢</div>
                    <div className="text-xs text-teal-700 dark:text-teal-300 mt-1 font-medium">Easy</div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">Power & Flexibility</td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-2xl">🟡</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Limited</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-2xl">🟢</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Unlimited</div>
                  </td>
                  <td className="py-4 px-4 text-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50">
                    <div className="text-2xl">🟢</div>
                    <div className="text-xs text-teal-700 dark:text-teal-300 mt-1 font-medium">Unlimited</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Key insights */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-purple-50 dark:bg-purple-950/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-900">
              <div className="text-purple-600 dark:text-purple-400 font-semibold mb-3">The Lovable Problem</div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                "I built a prototype but now my CTO says we can't use it in production because we can't integrate with our existing systems."
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-900">
              <div className="text-blue-600 dark:text-blue-400 font-semibold mb-3">The Cursor Problem</div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                "I watched a demo and got excited, then spent 3 hours installing Node.js, npm, git, and gave up."
              </p>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50 rounded-2xl p-8 border-2 border-teal-200 dark:border-teal-800">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-3">The Appily Solution</div>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Start in 2 minutes. Click buttons instead of typing commands. Use any framework. Import your team's projects.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400 italic">
            For designers, PMs, and non-technical builders
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              The Same Power, None of the Pain
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you've seen in Cursor demos, but actually easy to use
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Without Appily */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg border-2 border-red-200 dark:border-red-900/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">😰</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Without Appily</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Install Node.js</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Download installer, run setup wizard, configure PATH</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Install Homebrew (Mac)</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Copy paste long command, wait 20 minutes</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Install Git</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Learn what version control is, configure username and email</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Learn Terminal Commands</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">cd, ls, mkdir, chmod, grep, and 50 more commands</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">5</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Configure SSH Keys</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Generate keys, add to GitHub, troubleshoot permissions</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">6</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Install AI Tools</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">npm install -g, fix permission errors, set up API keys</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">7</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Type Git Commands</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">git add ., git commit -m &quot;fix&quot;, git push origin main</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">8</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Debug Cryptic Errors</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Spend hours on Stack Overflow figuring out what went wrong</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900/50">
                <p className="text-center font-semibold text-red-800 dark:text-red-400">
                  ⏱️ Time to start: 2-4 hours (if you&apos;re lucky)
                </p>
              </div>
            </div>

            {/* With Appily */}
            <div className="bg-gradient-to-br from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 rounded-3xl p-8 shadow-2xl border-2 border-teal-400 dark:border-teal-600 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-400 dark:bg-yellow-500 text-yellow-900 dark:text-yellow-950 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  ⚡ 100x Faster
                </div>
              </div>

              <div className="flex items-center gap-3 mb-8 mt-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎉</span>
                </div>
                <h3 className="text-2xl font-bold text-white">With Appily</h3>
              </div>

              {/* Step 1 */}
              <div className="mb-8 bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-600 font-bold text-lg">1</span>
                  </div>
                  <h4 className="text-xl font-bold text-white">Install Appily</h4>
                </div>
                <p className="text-teal-100 dark:text-cyan-100 mb-3 pl-13">One command installs everything automatically</p>
                <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-white">
                  {installCommand}
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-600 font-bold text-lg">2</span>
                  </div>
                  <h4 className="text-xl font-bold text-white">Just Click Buttons</h4>
                </div>
                <p className="text-teal-100 dark:text-cyan-100 mb-4 pl-13">Everything you need, just simple clicks:</p>

                <div className="space-y-2 pl-13">
                  <div className="w-full bg-white/20 text-white font-semibold py-3 px-4 rounded-lg text-left flex items-center gap-3">
                    <span className="text-2xl">🌐</span>
                    <div className="flex-1">
                      <div className="text-sm">Click "New Project"</div>
                      <div className="text-xs text-teal-200">We handle all the setup automatically</div>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 text-white font-semibold py-3 px-4 rounded-lg text-left flex items-center gap-3">
                    <span className="text-2xl">💬</span>
                    <div className="flex-1">
                      <div className="text-sm">Chat with AI</div>
                      <div className="text-xs text-teal-200">Same powerful Claude/Cursor AI</div>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 text-white font-semibold py-3 px-4 rounded-lg text-left flex items-center gap-3">
                    <span className="text-2xl">💾</span>
                    <div className="flex-1">
                      <div className="text-sm">Click "Save"</div>
                      <div className="text-xs text-teal-200">We save your work safely</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white/20 rounded-lg border border-white/30">
                <p className="text-center font-semibold text-white">
                  ⚡ Time to start: 2 minutes
                </p>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                100x
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Faster Setup</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-2">
                0
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Terminal Commands</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent mb-2">
                95%
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Less Complexity</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose the plan that works for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* BYOK Plan */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition border-2 border-gray-200 dark:border-slate-700">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Bring Your Own Key</h3>
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">Free</div>
                <p className="text-gray-600 dark:text-gray-400">Forever</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-teal-500 text-xl">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Use your own AI API key</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-500 text-xl">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">All core features included</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-500 text-xl">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Pay your AI provider directly</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-500 text-xl">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">No monthly fees</span>
                </li>
              </ul>

              <Link
                href="/home"
                className="block w-full bg-gray-900 dark:bg-slate-800 text-white text-center py-4 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-slate-700 transition"
              >
                Get Started Free
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition border-2 border-teal-400 dark:border-teal-600 relative">
              <div className="absolute top-4 right-4 bg-yellow-400 dark:bg-yellow-500 text-yellow-900 dark:text-yellow-950 px-3 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                <div className="text-5xl font-bold text-white mb-2">$20</div>
                <p className="text-teal-100 dark:text-cyan-100">per month</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 dark:text-yellow-300 text-xl">✓</span>
                  <span className="text-white">Unlimited AI requests</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 dark:text-yellow-300 text-xl">✓</span>
                  <span className="text-white">Managed API key (no setup)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 dark:text-yellow-300 text-xl">✓</span>
                  <span className="text-white">Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 dark:text-yellow-300 text-xl">✓</span>
                  <span className="text-white">Usage analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 dark:text-yellow-300 text-xl">✓</span>
                  <span className="text-white">Early access to new features</span>
                </li>
              </ul>

              <Link
                href="/home"
                className="block w-full bg-white dark:bg-slate-100 text-teal-600 dark:text-teal-700 text-center py-4 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-white transition"
              >
                Start Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Four simple steps to start coding with AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Install</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Run one command in your terminal. We&apos;ll handle the rest automatically.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Choose API Key</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Bring your own key or sign up for our managed cloud service.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Add Projects</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Browse for existing projects or create new ones with templates.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Start Coding</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Click buttons to commit, deploy, and build. No terminal required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 dark:from-teal-700 dark:via-cyan-700 dark:to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Code with AI?
          </h2>
          <p className="text-xl text-teal-100 dark:text-cyan-100 mb-10">
            Join developers who are building the future with AI assistance
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/home"
              className="bg-white dark:bg-slate-100 text-teal-600 dark:text-teal-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 dark:hover:bg-white transition shadow-xl"
            >
              Get Started Now
            </Link>
            <a
              href="https://github.com/papay0/vibe-coders-desktop"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition"
            >
              View on GitHub
            </a>
          </div>

          <p className="text-teal-200 dark:text-cyan-200 mt-8 text-sm">
            No credit card required for BYOK plan
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to know about Appily
            </p>
          </div>

          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-teal-100 dark:border-slate-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Is this as powerful as Cursor or Claude Code?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Yes!</strong> We use the exact same AI models (Claude, GPT-4, etc.) The only difference is the interface.
                You get all the power of professional AI coding tools, but through a simple web UI instead of the terminal.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-teal-100 dark:border-slate-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Can I import my existing projects?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Absolutely.</strong> Just paste your GitHub URL or browse to a local folder.
                Appily works with any existing project, just like Cursor or Claude Code would.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-teal-100 dark:border-slate-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Will this work for React / Next.js / Vue / [my framework]?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Yes.</strong> Any framework that works with Cursor or Claude Code works here.
                React, Vue, Angular, Svelte, Next.js, Nuxt, Python, Go—you name it. No restrictions.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-teal-100 dark:border-slate-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Do I need to know how to code?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Nope.</strong> That's the whole point. Just describe what you want in plain English,
                and the AI writes the code. You can build real projects without any technical knowledge.
              </p>
            </div>

            {/* FAQ Item 4.5 - New */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-teal-100 dark:border-slate-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                I'm already a developer. Is this for me?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Probably not.</strong> If you're comfortable with your existing workflow, just use Cursor or Claude Code directly.
                Appily is specifically for designers, PMs, and non-technical builders who want the same AI power without the technical barrier.
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-teal-100 dark:border-slate-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                How is this different from Lovable or Bolt?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Lovable and Bolt are great for quick demos, but they have limitations. They run in a sandbox,
                support limited frameworks, and you can't import existing projects. Appily gives you <strong>unlimited power</strong>—any
                framework, any library, import any project—but keeps the same easy-to-use interface.
              </p>
            </div>

            {/* FAQ Item 6 */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-teal-100 dark:border-slate-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                What if I get stuck or need help?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                We have detailed guides for every step of the way. Plus, our community is active and helpful.
                Check out our <a href="https://github.com/papay0/vibe-coders-desktop" target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 hover:underline font-semibold">GitHub</a> for
                documentation and support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-slate-950 text-gray-400 dark:text-gray-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold text-white mb-4">Appily</div>
              <p className="text-sm">
                Making AI-powered development accessible to everyone.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#pricing" className="hover:text-teal-400 transition">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-teal-400 transition">How It Works</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://github.com/papay0/vibe-coders-desktop" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition">Documentation</a></li>
                <li><a href="https://github.com/papay0/vibe-coders-desktop/issues" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://github.com/papay0" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition">About</a></li>
                <li><a href="https://github.com/papay0/vibe-coders-desktop/issues" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 dark:border-slate-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2025 Appily. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
