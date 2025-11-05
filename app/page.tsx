'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const installCommand = 'curl -fsSL vibe-coders.app/install | sh';

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Vibe Coders
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
              <span className="text-gray-900 dark:text-white">npm? cd? git commit?</span>
              <br />
              <span className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                We Get It—It's Confusing.
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
              Build apps with AI without learning developer jargon. Click buttons instead of typing commands.
            </p>

            {/* Installation Command */}
            <div className="bg-gray-900 dark:bg-slate-950 rounded-2xl p-8 shadow-2xl mb-8 max-w-3xl mx-auto border border-gray-800 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 dark:text-gray-500 text-sm font-mono">Get Started in Seconds</span>
                <button
                  onClick={copyCommand}
                  className="text-sm text-teal-400 hover:text-teal-300 transition"
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <div className="font-mono text-lg sm:text-xl text-white break-all">
                {installCommand}
              </div>
              <p className="text-gray-500 dark:text-gray-600 text-sm mt-4">
                Works on Mac, Linux, and Windows (WSL)
              </p>
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
      <section className="py-20 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              The Difference is Clear
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See how Vibe Coders transforms your development workflow
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Without Vibe Coders */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg border-2 border-red-200 dark:border-red-900/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">😰</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Without Vibe Coders</h3>
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

            {/* With Vibe Coders */}
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
                <h3 className="text-2xl font-bold text-white">With Vibe Coders</h3>
              </div>

              {/* Step 1 */}
              <div className="mb-8 bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-600 font-bold text-lg">1</span>
                  </div>
                  <h4 className="text-xl font-bold text-white">Install Vibe Coders</h4>
                </div>
                <p className="text-teal-100 dark:text-cyan-100 mb-3 pl-13">One command installs everything automatically</p>
                <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-white">
                  curl -fsSL vibe-coders.app/install | sh
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-600 font-bold text-lg">2</span>
                  </div>
                  <h4 className="text-xl font-bold text-white">Use Beautiful Web UI</h4>
                </div>
                <p className="text-teal-100 dark:text-cyan-100 mb-4 pl-13">Click buttons to build projects:</p>

                <div className="space-y-2 pl-13">
                  <button className="w-full bg-white/20 hover:bg-white/30 transition text-white font-semibold py-3 px-4 rounded-lg text-left flex items-center gap-3">
                    <span className="text-2xl">🌐</span>
                    <span>Create Website</span>
                  </button>
                  <button className="w-full bg-white/20 hover:bg-white/30 transition text-white font-semibold py-3 px-4 rounded-lg text-left flex items-center gap-3">
                    <span className="text-2xl">📱</span>
                    <span>Create Mobile App</span>
                  </button>
                  <button className="w-full bg-white/20 hover:bg-white/30 transition text-white font-semibold py-3 px-4 rounded-lg text-left flex items-center gap-3">
                    <span className="text-2xl">💾</span>
                    <span>Commit Changes</span>
                  </button>
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
              href="https://github.com/yourusername/vibe-coders"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition"
            >
              View Documentation
            </a>
          </div>

          <p className="text-teal-200 dark:text-cyan-200 mt-8 text-sm">
            No credit card required for BYOK plan
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-slate-950 text-gray-400 dark:text-gray-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold text-white mb-4">Vibe Coders</div>
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
                <li><a href="#" className="hover:text-teal-400 transition">Documentation</a></li>
                <li><a href="#" className="hover:text-teal-400 transition">API Reference</a></li>
                <li><a href="#" className="hover:text-teal-400 transition">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-teal-400 transition">About</a></li>
                <li><a href="#" className="hover:text-teal-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-teal-400 transition">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 dark:border-slate-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2025 Vibe Coders. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
