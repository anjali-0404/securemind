import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import MLResultsPanel from './MLResultsPanel';
import Landing from './Landing';
import { 
  Shield, 
  Code2, 
  AlertTriangle, 
  CheckCircle, 
  Terminal, 
  Activity, 
  Zap, 
  Bug,
  ChevronRight,
  Lock,
  LayoutDashboard,
  History,
  Settings,
  Bell,
  Search,
  User,
  Menu,
  X,
  FileCode,
  BarChart3,
  Layers,
  FileText,
  GitBranch,
  Download,
  CheckSquare,
  XCircle,
  ArrowRight,
  ExternalLink,
  Copy,
  Share2,
  Trash2,
  Eye,
  EyeOff,
  Moon,
  Sun,
  LogOut,
  Save,
  RefreshCw,
  TrendingUp,
  Zap as Zap2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Plus,
  Check,
  Settings2
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Helper Components ---

const DiffView = ({ original, fixed }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
    <div className="p-0">
      <div className="bg-red-500/10 px-3 py-1.5 border-b border-red-500/20 text-red-400 font-semibold flex items-center justify-between">
        <span>Original Code</span>
        <XCircle className="w-3 h-3" />
      </div>
      <pre className="p-3 text-red-300/90 whitespace-pre-wrap overflow-x-auto custom-scrollbar">{original}</pre>
    </div>
    <div className="p-0 border-l border-slate-800">
      <div className="bg-green-500/10 px-3 py-1.5 border-b border-green-500/20 text-green-400 font-semibold flex items-center justify-between">
        <span>Fixed Code</span>
        <CheckCircle className="w-3 h-3" />
      </div>
      <pre className="p-3 text-green-300/90 whitespace-pre-wrap overflow-x-auto custom-scrollbar">{fixed}</pre>
    </div>
  </div>
);

// --- Views Components ---

const DashboardView = ({ code, setCode, result, loading, error, handleAnalyze, scansCount }) => {
  const [activeIssueIndex, setActiveIssueIndex] = useState(null);
  const [copied, setCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  // Mock function for "Apply Patch"
  const applyPatch = (fixedCode) => {
    setCode(code.replace(result.issues[activeIssueIndex].original_code, fixedCode));
    // In a real app, we'd want to re-analyze or update the UI to reflect the fix
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearCode = () => {
    setCode('');
  };

  const handleShareResults = () => {
    if (!result) return;
    const reportText = `Security Analysis: ${result.classification} (${(result.confidence * 100).toFixed(1)}% confidence)`;
    navigator.clipboard.writeText(reportText);
    setShareMessage('Results copied to clipboard!');
    setTimeout(() => setShareMessage(''), 2000);
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const report = `Security Analysis Report
========================
Classification: ${result.classification.toUpperCase()}
Confidence: ${(result.confidence * 100).toFixed(2)}%
Risk Score: ${result.risk_score}/10

Analysis Details:
${JSON.stringify(result, null, 2)}

Generated: ${new Date().toLocaleString()}`;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-report-${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Metrics (Top Level) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Scans', value: result?.metrics?.total_scans || scansCount.toLocaleString(), icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Critical Issues', value: result?.metrics?.critical_issues || '0', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Fixed Issues', value: result?.metrics?.fixed_issues || '0', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Secure Score', value: result?.risk_score ? `${result.risk_score}/10` : 'N/A', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Analysis Area */}
      <div className="flex flex-col xl:flex-row gap-6 min-h-[700px]">
        
        {/* Input Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col min-h-[500px]"
        >
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-full shadow-lg shadow-slate-200/50 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-50/50">
              <div className="flex items-center gap-3">
                <motion.div 
                  animate={{ rotate: loading ? 360 : 0 }}
                  transition={{ duration: 2, repeat: loading ? Infinity : 0 }}
                  className="p-2 bg-indigo-100 rounded-lg"
                >
                  <Code2 className="w-5 h-5 text-indigo-600" />
                </motion.div>
                <div>
                  <span className="text-sm font-bold text-slate-900">Input Code</span>
                  <p className="text-xs text-slate-400">Paste your Python code here</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80 animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80 animate-pulse" style={{animationDelay: '100ms'}} />
                <div className="w-3 h-3 rounded-full bg-green-400/80 animate-pulse" style={{animationDelay: '200ms'}} />
              </div>
            </div>
            <div className="flex-grow relative group bg-slate-50/30">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Paste your python code here to analyze for vulnerabilities..."
                className="w-full h-full bg-transparent p-6 font-mono text-sm text-slate-700 resize-none focus:outline-none placeholder:text-slate-400 leading-relaxed custom-scrollbar"
                spellCheck="false"
              />
              <div className="absolute bottom-6 right-6 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyCode}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-all"
                  title="Copy code"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearCode}
                  disabled={!code}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Clear code"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAnalyze}
                  disabled={loading || !code.trim()}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all shadow-lg hover:shadow-indigo-500/25 text-sm",
                    loading || !code.trim() 
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                      : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white hover:scale-105 active:scale-95"
                  )}
                >
                  {loading ? (
                    <>
                      <Activity className="w-4 h-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-1 flex flex-col min-h-[500px]"
        >
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-full shadow-lg shadow-slate-200/50 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-50/50">
              <div className="flex items-center gap-3">
                <motion.div 
                  animate={{ scale: result ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.5 }}
                  className="p-2 bg-emerald-100 rounded-lg"
                >
                  <Activity className="w-5 h-5 text-emerald-600" />
                </motion.div>
                <div>
                  <span className="text-sm font-bold text-slate-900">Analysis Results</span>
                  <p className="text-xs text-slate-400">Security classification & metrics</p>
                </div>
              </div>
              <AnimatePresence>
                {result && (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-2"
                  >
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownloadReport}
                      className="text-xs flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors font-medium"
                    >
                      <Download className="w-3.5 h-3.5" /> 
                      Export
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShareResults}
                      className="text-xs flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                    >
                      <Share2 className="w-3.5 h-3.5" /> 
                      Share
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex-grow p-6 overflow-y-auto custom-scrollbar bg-slate-50/30">
              {shareMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm font-medium flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {shareMessage}
                </motion.div>
              )}
              <AnimatePresence mode="wait">
                <MLResultsPanel 
                  result={result} 
                  loading={loading} 
                  error={error}
                  activeIssueIndex={activeIssueIndex}
                  setActiveIssueIndex={setActiveIssueIndex}
                />
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const HistoryView = () => {
  const [historyData, setHistoryData] = useState([
    { id: 1, file: 'auth_utils.py', vulns: 2, risk: 7, date: 'Just now', status: 'critical' },
    { id: 2, file: 'user_model.js', vulns: 1, risk: 5, date: '2 days ago', status: 'medium' },
    { id: 3, file: 'config.json', vulns: 0, risk: 2, date: '3 days ago', status: 'low' },
    { id: 4, file: 'server.go', vulns: 3, risk: 8, date: '5 days ago', status: 'critical' },
    { id: 5, file: 'payment.ts', vulns: 1, risk: 6, date: '7 days ago', status: 'medium' },
  ]);

  const handleExport = () => {
    const report = `Scan History Report\n${'='.repeat(50)}\n${historyData.map(h => `${h.file} - Risk: ${h.risk}/10 - ${h.date}`).join('\n')}\n\nGenerated: ${new Date().toLocaleString()}`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan-history-${Date.now()}.txt`;
    a.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-full flex flex-col"
    >
      <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <motion.div className="p-2 bg-emerald-100 rounded-lg">
              <History className="w-5 h-5 text-emerald-600" />
            </motion.div>
            Scan History
          </h2>
          <p className="text-slate-500 text-sm">View all your past security analyses</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </motion.button>
      </div>
      <div className="p-6 grow flex flex-col">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by file name, project, or date..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none w-full sm:w-auto transition-all hover:border-indigo-300">
            <option>All Projects</option>
            <option>Backend API</option>
            <option>Frontend App</option>
          </select>
          <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none w-full sm:w-auto transition-all hover:border-indigo-300">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Today</option>
          </select>
        </div>
        
        <div className="border border-slate-200 rounded-lg overflow-hidden flex-grow flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs uppercase bg-slate-50 text-slate-600 font-semibold">
                <tr>
                  <th className="px-6 py-4">Scan ID</th>
                  <th className="px-6 py-4">File Name</th>
                  <th className="px-6 py-4">Issues</th>
                  <th className="px-6 py-4">Risk Score</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="overflow-y-auto flex-grow custom-scrollbar">
            <table className="w-full text-sm text-left text-slate-500">
              <tbody className="divide-y divide-slate-100">
                {historyData.map((item, index) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-indigo-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">#{Math.random().toString(36).substr(2, 6).toUpperCase()}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-indigo-500" />
                      {item.file}
                    </td>
                    <td className="px-6 py-4">
                      <motion.span 
                        className={cn("px-2 py-1 rounded-full text-xs font-bold border", 
                          item.status === 'critical' ? 'bg-red-100 text-red-700 border-red-200' :
                          item.status === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                          'bg-green-100 text-green-700 border-green-200'
                        )}
                        whileHover={{ scale: 1.05 }}
                      >
                        {item.vulns} issue{item.vulns !== 1 ? 's' : ''}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            className={cn("h-full", 
                              item.risk >= 7 ? "bg-gradient-to-r from-red-500 to-red-400" :
                              item.risk >= 5 ? "bg-gradient-to-r from-yellow-500 to-yellow-400" :
                              "bg-gradient-to-r from-green-500 to-green-400"
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.risk * 10}%` }}
                            transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 w-8">{item.risk}/10</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{item.date}</td>
                    <td className="px-6 py-4">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        View
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SnippetsView = () => {
  const [snippets, setSnippets] = useState([
    { id: 1, title: 'Auth Middleware Logic', desc: 'Standard authentication middleware with JWT token validation and role-based access control.', lang: 'Python', updated: '2d ago', verified: true },
    { id: 2, title: 'Input Validation Helper', desc: 'Comprehensive input validation with sanitization and XSS prevention for web applications.', lang: 'JavaScript', updated: '5d ago', verified: true },
    { id: 3, title: 'SQL Query Builder', desc: 'Safe parameterized SQL query construction to prevent SQL injection attacks.', lang: 'Go', updated: '1w ago', verified: false },
    { id: 4, title: 'Crypto Utilities', desc: 'Secure hashing, encryption, and decryption utilities with industry-standard algorithms.', lang: 'TypeScript', updated: '3d ago', verified: true },
    { id: 5, title: 'CORS Configuration', desc: 'Properly configured CORS settings for safe cross-origin resource sharing.', lang: 'Node.js', updated: '1w ago', verified: true },
  ]);

  const [showNewSnippetModal, setShowNewSnippetModal] = useState(false);
  const [newSnippet, setNewSnippet] = useState({ title: '', desc: '', lang: 'JavaScript', code: '' });

  const handleDelete = (id) => {
    setSnippets(prev => prev.filter(s => s.id !== id));
  };

  const handleAddSnippet = () => {
    if (newSnippet.title && newSnippet.desc && newSnippet.code) {
      setSnippets([...snippets, {
        id: Math.max(...snippets.map(s => s.id)) + 1,
        title: newSnippet.title,
        desc: newSnippet.desc,
        lang: newSnippet.lang,
        updated: 'just now',
        verified: false
      }]);
      setNewSnippet({ title: '', desc: '', lang: 'JavaScript', code: '' });
      setShowNewSnippetModal(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col gap-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <motion.div className="p-2 bg-violet-100 rounded-lg">
              <Layers className="w-5 h-5 text-violet-600" />
            </motion.div>
            Saved Snippets
          </h2>
          <p className="text-slate-500">Manage your collection of code patterns and analysis results.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewSnippetModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg text-sm font-semibold hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          New Snippet
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {snippets.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-indigo-500/5 transition-all"
              initial={false}
            />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <motion.div 
                  className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition-colors"
                  whileHover={{ rotate: 5 }}
                >
                  <FileCode className="w-5 h-5" />
                </motion.div>
                {item.verified ? (
                  <motion.span 
                    className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200 flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </motion.span>
                ) : (
                  <motion.span 
                    className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full border border-yellow-200 flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    Pending
                  </motion.span>
                )}
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{item.desc}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Code2 className="w-3.5 h-3.5 text-slate-400" />
                  {item.lang}
                </div>
                <span className="text-xs text-slate-400">Updated {item.updated}</span>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute top-4 right-4 flex gap-2"
              >
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                  title="Copy"
                >
                  <Copy className="w-4 h-4" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New Snippet Modal */}
      <AnimatePresence>
        {showNewSnippetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewSnippetModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-linear-to-r from-indigo-600 to-indigo-700 px-6 py-5 flex items-center justify-between border-b border-indigo-500">
                <h3 className="text-2xl font-bold text-white">Create New Snippet</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNewSnippetModal(false)}
                  className="p-2 hover:bg-indigo-500 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Snippet Title</label>
                  <input
                    type="text"
                    value={newSnippet.title}
                    onChange={(e) => setNewSnippet({...newSnippet, title: e.target.value})}
                    placeholder="e.g., Auth Middleware"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea
                    value={newSnippet.desc}
                    onChange={(e) => setNewSnippet({...newSnippet, desc: e.target.value})}
                    placeholder="Describe what this snippet does..."
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Language</label>
                  <select
                    value={newSnippet.lang}
                    onChange={(e) => setNewSnippet({...newSnippet, lang: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option>JavaScript</option>
                    <option>Python</option>
                    <option>TypeScript</option>
                    <option>Go</option>
                    <option>Java</option>
                    <option>C++</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Code</label>
                  <textarea
                    value={newSnippet.code}
                    onChange={(e) => setNewSnippet({...newSnippet, code: e.target.value})}
                    placeholder="Paste your code here..."
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none h-32 font-mono text-sm"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowNewSnippetModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex-1"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddSnippet}
                    disabled={!newSnippet.title || !newSnippet.desc || !newSnippet.code}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Create Snippet
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AnalyticsView = () => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [analyticsTab, setAnalyticsTab] = useState('vulnerabilities');
  const [trendsData, setTrendsData] = useState(null);
  const [categoriesData, setCategoriesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [trendsRes, categoriesRes] = await Promise.all([
          fetch('http://localhost:8000/analytics'),
          fetch('http://localhost:8000/issues-by-category')
        ]);
        
        const trends = await trendsRes.json();
        const categories = await categoriesRes.json();
        
        setTrendsData(trends);
        setCategoriesData(categories);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        // Fallback to default data
        setTrendsData({
          vulnerabilities: {
            label: 'Vulnerabilities Found',
            data: [45, 38, 42, 35, 28, 22],
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            color: 'from-red-500 to-red-400'
          },
          accuracy: {
            label: 'Model Accuracy (%)',
            data: [92, 93, 94, 95, 96, 97],
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            color: 'from-green-500 to-green-400'
          },
          precision: {
            label: 'Precision Rate (%)',
            data: [90, 91, 92, 93, 94, 95],
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            color: 'from-blue-500 to-blue-400'
          },
          recall: {
            label: 'Recall Rate (%)',
            data: [88, 89, 90, 91, 92, 93],
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            color: 'from-purple-500 to-purple-400'
          }
        });
        setCategoriesData({
          categories: [
            { label: 'Injection (SQL/XSS)', count: 45, color: 'from-red-500 to-red-400' },
            { label: 'Broken Authentication', count: 32, color: 'from-orange-500 to-orange-400' },
            { label: 'Sensitive Data Exposure', count: 28, color: 'from-yellow-500 to-yellow-400' },
            { label: 'Security Misconfiguration', count: 15, color: 'from-blue-500 to-blue-400' },
          ],
          total_issues: 120
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading || !trendsData) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </motion.div>
    );
  }

  const currentTrend = trendsData[analyticsTab];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col gap-6"
    >
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Vulnerability Analytics</h2>
        <p className="text-slate-500 text-lg">Insights into your security posture over time.</p>
      </div>

      {/* Trends Tab Navigation */}
      <div className="bg-white border border-slate-200 rounded-xl p-1 shadow-sm flex gap-2 flex-wrap">
        {Object.entries(trendsData).map(([key, data]) => (
          <motion.button
            key={key}
            onClick={() => setAnalyticsTab(key)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-all text-sm",
              analyticsTab === key 
                ? "bg-indigo-600 text-white shadow-md" 
                : "text-slate-700 hover:bg-slate-100"
            )}
          >
            {data.label}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Trends Chart */}
        <motion.div 
          key={analyticsTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <motion.div 
                className="p-2 bg-indigo-100 rounded-lg"
              >
                <TrendingUp className="w-5 h-5 text-indigo-500" />
              </motion.div>
              Latest Trends - {currentTrend.label}
            </h3>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-slate-400 hover:text-slate-600"
            >
              <MoreVertical className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="h-80 flex items-end justify-between gap-1 px-2 pb-4">
            {currentTrend.data.map((h, i) => {
              const maxValue = Math.max(...currentTrend.data);
              const minValue = Math.min(...currentTrend.data);
              const range = maxValue - minValue || 1;
              const normalized = ((h - minValue) / range) * 90 + 10; // Scale to 10-100%
              return (
                <motion.div 
                  key={i} 
                  className="flex-1 flex flex-col items-center gap-2 h-full"
                  onHoverStart={() => setSelectedMetric(i)}
                  onHoverEnd={() => setSelectedMetric(null)}
                >
                  <motion.div 
                    className={cn("w-full rounded-t-lg transition-colors relative group cursor-pointer bg-gradient-to-t", currentTrend.color)}
                    initial={{ height: 0 }}
                    animate={{ 
                      height: `${normalized}%`,
                    }}
                    whileHover={{ 
                      boxShadow: '0 0 20px rgba(79, 70, 229, 0.3)',
                      scaleY: 1.1,
                    }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
                  >
                    <AnimatePresence>
                      {selectedMetric === i && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-2 px-3 rounded-lg font-semibold whitespace-nowrap z-10"
                        >
                          {h}
                          <div className="absolute bottom--2 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 transform rotate-45" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <span className="text-xs text-slate-400 font-medium mt-2">{currentTrend.months[i]}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <motion.div 
                className="p-2 bg-red-100 rounded-lg"
              >
                <Bug className="w-5 h-5 text-red-500" />
              </motion.div>
              Issues by Category
            </h3>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-slate-400 hover:text-slate-600"
            >
              <RefreshCw className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="space-y-4">
            {categoriesData?.categories?.map((cat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="group cursor-pointer"
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-700 font-medium group-hover:text-slate-900 transition-colors">{cat.label}</span>
                  <motion.span 
                    className="text-slate-500 font-bold"
                    animate={{ scale: selectedMetric === i ? 1.2 : 1 }}
                  >
                    {cat.count}
                  </motion.span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-sm">
                  <motion.div 
                    className={cn("h-full bg-gradient-to-r", cat.color)}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.count}%` }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const SettingsView = () => {
  const [settings, setSettings] = useState({
    realTimeScanning: true,
    deepDependencyCheck: false,
    secretDetection: true,
    autoFixSuggestions: true,
  });
  const [extensionMessage, setExtensionMessage] = useState('');
  const [githubMessage, setGithubMessage] = useState('');
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto w-full"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500 text-lg">Configure your security analysis preferences.</p>
      </div>

      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-indigo-600" />
              Analysis Configuration
            </h3>
          </div>
          <div className="p-6 space-y-5">
            {[
              { key: 'realTimeScanning', label: 'Real-time Scanning', desc: 'Analyze code as you type', icon: Activity },
              { key: 'deepDependencyCheck', label: 'Deep Dependency Check', desc: 'Scan imported libraries for vulnerabilities', icon: Zap },
              { key: 'secretDetection', label: 'Secret Detection', desc: 'Check for hardcoded API keys and tokens', icon: Lock },
              { key: 'autoFixSuggestions', label: 'Auto-Fix Suggestions', desc: 'Propose automatic patches for common issues', icon: Sparkles },
            ].map((setting, i) => {
              const Icon = setting.icon;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-slate-50/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="p-2 bg-indigo-100 rounded-lg"
                    >
                      <Icon className="w-4 h-4 text-indigo-600" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-slate-900">{setting.label}</p>
                      <p className="text-sm text-slate-500">{setting.desc}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSetting(setting.key)}
                    className={cn(
                      "relative w-14 h-7 rounded-full p-1 transition-colors flex items-center",
                      settings[setting.key] ? "bg-gradient-to-r from-indigo-600 to-indigo-500" : "bg-slate-200"
                    )}
                  >
                    <motion.div
                      layout
                      className="w-5 h-5 rounded-full bg-white shadow-lg flex items-center justify-center"
                      animate={{ x: settings[setting.key] ? 28 : 0 }}
                      transition={{ type: "spring", damping: 20 }}
                    >
                      {settings[setting.key] && <Check className="w-3 h-3 text-indigo-600" />}
                    </motion.div>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              Integrations & Plugins
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Terminal className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <p className="font-semibold text-slate-900">GitHub Actions</p>
                  <p className="text-sm text-slate-500">Automate scanning in your CI/CD pipeline</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (!githubConnected) {
                      setGithubConnected(true);
                      setGithubMessage('✅ GitHub Actions connected successfully!');
                      setTimeout(() => setGithubMessage(''), 4000);
                    }
                  }}
                  className={cn(
                    "px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2",
                    githubConnected 
                      ? "bg-green-100 text-green-700 border border-green-300" 
                      : "border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                  )}
                >
                  {githubConnected ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Connected
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Connect
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            <AnimatePresence>
              {githubMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {githubMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Code2 className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <p className="font-semibold text-slate-900">VSCode Extension</p>
                  <p className="text-sm text-slate-500">Real-time security analysis in your editor</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (!extensionInstalled) {
                      setExtensionInstalled(true);
                      setExtensionMessage('✅ VSCode Extension installed successfully! Restart your editor to activate.');
                      setTimeout(() => setExtensionMessage(''), 5000);
                    }
                  }}
                  className={cn(
                    "px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2",
                    extensionInstalled 
                      ? "bg-green-100 text-green-700 border border-green-300" 
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  {extensionInstalled ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Installed
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Install Now
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            <AnimatePresence>
              {extensionMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <div>
                    <p className="font-semibold">{extensionMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scansCount, setScansCount] = useState(128); // Mock stats
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState({ name: 'John Doe', title: 'Security Engineer', email: 'john@example.com', avatar: 'JD' });

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Simulate a bit of "processing" time for effect if response is too fast
      const startTime = Date.now();
      const response = await axios.post('http://localhost:8000/analyze', { code });
      const elapsedTime = Date.now() - startTime;
      
      if (elapsedTime < 800) {
        await new Promise(resolve => setTimeout(resolve, 800 - elapsedTime));
      }

      setResult(response.data);
      setScansCount(prev => prev + 1);
    } catch (err) {
      setError(err.message || 'Failed to connect to the analysis engine.');
    } finally {
      setLoading(false);
    }
  };

  const handleInstallExtension = () => {
    // Create a downloadable extension file
    const extensionData = {
      name: "SecureMind VSCode Extension",
      version: "1.0.0",
      description: "AI-powered code vulnerability detection for VSCode",
      publisher: "SecureMind",
      displayName: "SecureMind - AI Code Security",
      main: "./out/extension.js",
      contributes: {
        commands: [
          {
            command: "securemind.analyze",
            title: "Analyze Code for Vulnerabilities",
            category: "SecureMind"
          },
          {
            command: "securemind.applyFix",
            title: "Apply Suggested Fix",
            category: "SecureMind"
          }
        ],
        keybindings: [
          {
            command: "securemind.analyze",
            key: "ctrl+shift+s",
            mac: "cmd+shift+s",
            when: "editorTextFocus"
          }
        ]
      },
      activationEvents: [
        "onCommand:securemind.analyze",
        "onLanguage:python",
        "onLanguage:javascript",
        "onLanguage:typescript",
        "onLanguage:java",
        "onLanguage:cpp"
      ]
    };

    // Create the extension zip file
    const manifestContent = JSON.stringify(extensionData, null, 2);
    const blob = new Blob([manifestContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'securemind-extension-1.0.0.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Show success message
    alert('📦 SecureMind VSCode Extension Downloaded!\n\nTo install:\n1. Open VSCode\n2. Go to Extensions (Ctrl+Shift+X)\n3. Click "..." menu > "Install from VSIX..."\n4. Select the downloaded file\n\nFeatures:\n✓ Real-time vulnerability detection\n✓ Auto-fix suggestions\n✓ Inline security warnings\n✓ AI hallucination detection');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'snippets', label: 'Saved Snippets', icon: FileCode },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <DashboardView 
                  code={code} 
                  setCode={setCode} 
                  result={result} 
                  loading={loading} 
                  error={error} 
                  handleAnalyze={handleAnalyze} 
                  scansCount={scansCount}
               />;
      case 'history': return <HistoryView />;
      case 'snippets': return <SnippetsView />;
      case 'analytics': return <AnalyticsView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <>
      {showLanding ? (
        <Landing 
          onGetStarted={() => setShowLanding(false)}
          onInstall={() => {
            handleInstallExtension();
            // Optionally auto-show landing or navigate
          }}
        />
      ) : (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30 flex overflow-hidden">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="relative z-20 bg-white/80 backdrop-blur-xl border-r border-slate-200 flex-col hidden md:flex transition-all duration-300 shadow-sm"
      >
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20"></div>
            <Shield className="w-8 h-8 text-indigo-600 relative z-10" />
          </div>
          {sidebarOpen && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600"
            >
              SecureMind
            </motion.h1>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-1.5">
          <AnimatePresence>
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  activeTab === item.id 
                    ? "bg-indigo-50 text-indigo-600 shadow-md" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <motion.div 
                  animate={activeTab === item.id ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                </motion.div>
                
                {sidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="font-medium flex-1 text-left"
                  >
                    {item.label}
                  </motion.span>
                )}
                
                {activeTab === item.id && sidebarOpen && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-r-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </nav>

        <motion.div 
          className="p-4 border-t border-slate-200 bg-gradient-to-t from-slate-50 to-slate-50/0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProfileModal(true)}
            className={cn("w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 transition-colors group cursor-pointer", sidebarOpen ? "justify-start" : "justify-center")}
            title="Click to edit profile"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-bold shadow-lg">
              {profile.avatar}
            </div>
            {sidebarOpen && (
              <motion.div 
                className="overflow-hidden flex-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm font-semibold text-slate-900">{profile.name}</p>
                <p className="text-xs text-slate-500">{profile.title}</p>
              </motion.div>
            )}
          </motion.button>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-16 border-b border-slate-200 bg-white/50 backdrop-blur-md flex items-center justify-between px-4 md:px-6 lg:px-8 sticky top-0 z-50"
        >
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 hover:bg-slate-100 rounded-lg md:block hidden transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </motion.button>
            <motion.h2 
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-semibold text-slate-800"
            >
              {navItems.find(i => i.id === activeTab)?.label}
            </motion.h2>
          </div>

          <div className="flex items-center gap-4">
            {/* CI/CD Integration Status Mock */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full"
            >
              <motion.div 
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs font-semibold text-green-700">CI/CD Connected</span>
            </motion.div>

            <div className="hidden sm:block w-px h-8 bg-slate-200" />
            
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors group"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-500 group-hover:text-slate-700" />
              <motion.span 
                className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-lg"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
          </div>
        </motion.header>

        {/* Scrollable Content Area */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 lg:p-8"
        >
          <motion.div 
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
          
          <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center text-slate-400 text-sm py-6"
          >
            <p>&copy; 2026 SecureMind AI. Enterprise Security Platform.</p>
          </motion.footer>
        </motion.div>

      </main>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            >
              <div className="bg-linear-to-r from-indigo-600 to-indigo-700 px-6 py-5 flex items-center justify-between border-b border-indigo-500">
                <h3 className="text-2xl font-bold text-white">Edit Profile</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProfileModal(false)}
                  className="p-2 hover:bg-indigo-500 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {profile.avatar}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Title/Role</label>
                  <input
                    type="text"
                    value={profile.title}
                    onChange={(e) => setProfile({...profile, title: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowProfileModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex-1"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowProfileModal(false)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </div>
      )}
    </>
  );
}

export default App;
