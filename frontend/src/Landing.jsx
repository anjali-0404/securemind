import React, { useState } from 'react';
import { Menu, X, Shield, Code, Zap, TrendingUp, Download, ArrowRight } from 'lucide-react';

const Landing = ({ onGetStarted, onInstall }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center px-6 lg:px-12 py-6 backdrop-blur-md bg-slate-900/80 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-cyan-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SecureMind</span>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-8 items-center">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
          <a href="#benefits" className="hover:text-cyan-400 transition-colors">Benefits</a>
          <a href="#detection" className="hover:text-cyan-400 transition-colors">Detection</a>
          <button
            onClick={onInstall}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
          >
            Install Now
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-20 left-0 right-0 bg-slate-800 border-b border-slate-700 p-6 space-y-4 backdrop-blur-md">
          <a href="#features" className="block hover:text-cyan-400 transition-colors">Features</a>
          <a href="#benefits" className="block hover:text-cyan-400 transition-colors">Benefits</a>
          <a href="#detection" className="block hover:text-cyan-400 transition-colors">Detection</a>
          <button
            onClick={onInstall}
            className="w-full px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Install Now
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 lg:px-12 text-center">
        <div className="space-y-6 mb-12">
          <div className="inline-block">
            <div className="flex items-center gap-2 justify-center px-4 py-2 rounded-full border border-cyan-500/50 bg-cyan-500/10">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-sm text-cyan-400 font-semibold">AI-Powered Code Security</span>
            </div>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            Secure Your Code with{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Detect vulnerabilities, hallucinations, and unsafe code patterns before they become security threats. SecureMind analyzes your code with advanced AI to ensure maximum security.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 mb-16">
          <button
            onClick={onGetStarted}
            className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            Get Started
            <ArrowRight size={20} />
          </button>
          <button
            onClick={onInstall}
            className="px-10 py-4 border-2 border-cyan-500 text-cyan-400 rounded-lg font-bold text-lg hover:bg-cyan-500/10 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Install Extension
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mb-12 w-full max-w-2xl">
          <div className="text-center">
            <p className="text-4xl font-bold text-cyan-400">99.8%</p>
            <p className="text-sm text-slate-400">Detection Rate</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-cyan-400">50ms</p>
            <p className="text-sm text-slate-400">Avg Response</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-cyan-400">3K+</p>
            <p className="text-sm text-slate-400">Patterns</p>
          </div>
        </div>

        {/* Demo image placeholder */}
        <div className="w-full max-w-4xl mx-auto rounded-2xl border border-cyan-500/30 bg-slate-800/50 p-8 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-lg p-6 space-y-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="space-y-2 text-left font-mono text-sm text-cyan-300">
              <p className="text-slate-500">$</p>
              <p>
                <span className="text-slate-500">$</span> securemind analyze code.py
              </p>
              <p className="text-green-400 mt-4">✓ Analysis Complete</p>
              <p className="text-yellow-400">⚠ 2 Vulnerabilities Found</p>
              <p className="text-cyan-400">→ Precision: 98.5% | Recall: 96.3%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">
            Powerful Detection <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Features</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature cards */}
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Vulnerability Detection',
                description: 'Detect security vulnerabilities, unsafe patterns, and dangerous code practices.'
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: 'Hallucination Detection',
                description: 'Identify AI-generated code that might contain logical errors or incorrect patterns.'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Real-time Analysis',
                description: 'Get instant feedback on your code as you write with VSCode integration.'
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Accuracy Metrics',
                description: 'View precision, recall, F1-score, and detailed metrics for each analysis.'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Auto-fix Suggestions',
                description: 'Get recommended fixes for detected vulnerabilities with before/after code.'
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: 'Trends Analytics',
                description: 'Track security trends over time with interactive graphs and reports.'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-xl border border-cyan-500/20 bg-slate-800/50 backdrop-blur-sm hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all duration-300 group"
              >
                <div className="text-cyan-400 mb-4 group-hover:text-blue-400 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="relative z-10 py-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">
            Why Choose <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SecureMind</span>
          </h2>

          <div className="space-y-8">
            {[
              {
                num: '01',
                title: 'Enterprise-Grade Security',
                description: 'Built with security-first principles, trained on thousands of real vulnerabilities to catch threats others miss.'
              },
              {
                num: '02',
                title: 'Developer Friendly',
                description: 'Seamless VSCode integration with instant feedback, auto-fix suggestions, and detailed explanations.'
              },
              {
                num: '03',
                title: 'Continuously Learning',
                description: 'Our AI models are constantly updated with the latest security threats and patterns.'
              },
              {
                num: '04',
                title: 'Privacy Focused',
                description: 'Your code stays private. Analysis happens locally without sending sensitive data to remote servers.'
              }
            ].map((benefit, idx) => (
              <div key={idx} className="flex gap-8 items-start">
                <div className="text-4xl font-bold text-cyan-500 min-w-16">{benefit.num}</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detection Section */}
      <section id="detection" className="relative z-10 py-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">
            What We <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Detect</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">Vulnerability Categories</h3>
              {['SQL Injection', 'XSS Attacks', 'Buffer Overflow', 'Insecure Deserialization', 'Weak Cryptography', 'Hard-coded Secrets'].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <span className="text-lg text-slate-300">{item}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">AI Hallucination Patterns</h3>
              {['Logic Errors', 'Infinite Loops', 'Null Pointer Dereference', 'Type Mismatches', 'Memory Leaks', 'Race Conditions'].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <span className="text-lg text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm p-12 lg:p-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Secure Your Code?
            </h2>
            <p className="text-xl text-slate-400 mb-10">
              Join thousands of developers who trust SecureMind to protect their applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={onGetStarted}
                className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
              >
                Get Started Free
              </button>
              <button
                onClick={onInstall}
                className="px-10 py-4 border-2 border-cyan-500 text-cyan-400 rounded-lg font-bold text-lg hover:bg-cyan-500/10 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Install Extension
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-700 bg-slate-900/50 backdrop-blur-md py-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-cyan-400 mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#features" className="hover:text-cyan-400 transition-colors">Features</a></li>
                <li><a href="#detection" className="hover:text-cyan-400 transition-colors">Detection</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-cyan-400 mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-cyan-400 mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-cyan-400 mb-4">Connect</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Discord</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 flex flex-col sm:flex-row justify-between items-center text-slate-400 text-sm">
            <p>&copy; 2024 SecureMind. All rights reserved.</p>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Enterprise-grade security for your code</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Landing;
