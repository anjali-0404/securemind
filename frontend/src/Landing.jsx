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
      <section className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 lg:px-12 text-center overflow-hidden">
        {/* Decorative gradient circles */}
        <div className="absolute -top-20 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="space-y-8 mb-16 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm hover:border-slate-500 transition-colors">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-300">New: Advanced Pattern Recognition</span>
          </div>

          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight text-white">
              Code Analysis{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Analyze, understand, and improve your code quality with intelligent insights. Get actionable recommendations in seconds.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button
              onClick={onGetStarted}
              className="group px-8 py-3 bg-white text-black rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onInstall}
              className="px-8 py-3 border border-slate-600 text-white rounded-lg font-semibold hover:bg-slate-800 hover:border-slate-500 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Install Now
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="w-full max-w-4xl mx-auto mt-16 mb-16">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {[
              { value: '10K+', label: 'Users' },
              { value: '99.8%', label: 'Accuracy' },
              { value: '24/7', label: 'Support' }
            ].map((stat, idx) => (
              <div key={idx} className="group p-6 rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm hover:border-slate-600 hover:bg-slate-800/50 transition-all duration-200">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Preview - Generic Dashboard */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="group relative rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm p-8 hover:border-slate-600 transition-all duration-300 overflow-hidden">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300"></div>

            {/* Dashboard Header */}
            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs text-slate-500 font-mono">analysis-dashboard.app</span>
              </div>

              {/* Dashboard Content */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  { icon: '📊', label: 'Performance', value: 'Excellent' },
                  { icon: '🔍', label: 'Scan Status', value: 'Complete' },
                  { icon: '✅', label: 'Health Score', value: '94/100' },
                  { icon: '⚡', label: 'Processing Time', value: '1.2s' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="text-xs text-slate-400">{item.label}</div>
                    <div className="text-sm font-semibold text-white mt-1">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Progress bars */}
              <div className="space-y-3 mt-6 pt-6 border-t border-slate-700/50">
                {[
                  { label: 'Code Quality', percentage: 92 },
                  { label: 'Security Score', percentage: 88 },
                  { label: 'Best Practices', percentage: 85 }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="text-white font-semibold">{item.percentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-700/50 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
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
