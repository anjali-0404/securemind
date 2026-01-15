import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Bug, CheckCircle, AlertTriangle, BarChart3, TrendingUp, Zap,
  Info, Target, Gauge, Percent, Brain, AlertCircle, Lightbulb, ChevronDown
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const MLResultsPanel = ({ result, loading, error, activeIssueIndex, setActiveIssueIndex }) => {
  const [expandedIssue, setExpandedIssue] = useState(null);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="h-full flex flex-col items-center justify-center gap-6"
      >
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-indigo-100 rounded-full blur-md" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-lg font-bold text-slate-800">ML Model Processing</p>
          <p className="text-sm text-slate-500">Running code classification analysis...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full flex flex-col items-center justify-center text-center p-6"
      >
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Analysis Failed</h3>
        <p className="text-slate-500">{error}</p>
      </motion.div>
    );
  }

  if (!result) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="h-full flex flex-col items-center justify-center text-slate-400 gap-4"
      >
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center animate-pulse">
          <Brain className="w-10 h-10 text-slate-300" />
        </div>
        <p className="font-medium">Ready to analyze code with ML model...</p>
      </motion.div>
    );
  }

  // ML Model Results Display
  const hasClassification = result.classification;
  const category = hasClassification?.category;
  const confidence = hasClassification?.confidence;
  const probabilities = hasClassification?.probabilities;
  const riskScore = result.risk_score;
  const issues = result.issues || result.vulnerabilities || [];
  const metrics = result.metrics || result.model_metrics || {};

  // Determine colors based on classification
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'vulnerable':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100' };
      case 'hallucinated':
        return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100' };
      case 'safe':
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100' };
      default:
        return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100' };
    }
  };

  const colors = getCategoryColor(category);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Classification Card */}
      <div className={cn("border rounded-xl p-6", colors.border, colors.bg)}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Classification Result</h3>
            <p className="text-sm text-slate-600">ML Model Analysis</p>
          </div>
          <div className={cn("px-3 py-1.5 rounded-full font-bold text-xs uppercase", colors.badge, colors.text)}>
            {category}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/50 rounded-lg p-3">
            <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Confidence</div>
            <div className={cn("text-2xl font-bold", colors.text)}>
              {(confidence * 100).toFixed(1)}%
            </div>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Risk Score</div>
            <div className={cn("text-2xl font-bold", riskScore > 7 ? 'text-red-600' : riskScore > 4 ? 'text-orange-600' : 'text-green-600')}>
              {riskScore.toFixed(1)}/10
            </div>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Analysis Type</div>
            <div className="text-sm font-bold text-slate-700">{result.analysis_type}</div>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Issues Found</div>
            <div className="text-sm font-bold text-slate-700">{result.total_issues || 0}</div>
          </div>
        </div>
      </div>

      {/* Accuracy Metrics */}
      {metrics && (Object.keys(metrics).length > 0) && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Model Performance Metrics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="text-xs text-blue-600 uppercase font-bold mb-1">Accuracy</div>
              <div className="text-2xl font-bold text-blue-700">
                {(metrics.accuracy * 100 || metrics.accuracy || 0).toFixed(1)}%
              </div>
              <p className="text-xs text-blue-600 mt-1">Overall correctness</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="text-xs text-green-600 uppercase font-bold mb-1">Precision</div>
              <div className="text-2xl font-bold text-green-700">
                {(metrics.precision * 100 || metrics.precision || 0).toFixed(1)}%
              </div>
              <p className="text-xs text-green-600 mt-1">True positive rate</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="text-xs text-orange-600 uppercase font-bold mb-1">Recall</div>
              <div className="text-2xl font-bold text-orange-700">
                {(metrics.recall * 100 || metrics.recall || 0).toFixed(1)}%
              </div>
              <p className="text-xs text-orange-600 mt-1">Coverage rate</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="text-xs text-purple-600 uppercase font-bold mb-1">F1 Score</div>
              <div className="text-2xl font-bold text-purple-700">
                {(metrics.f1_score || 0).toFixed(3)}
              </div>
              <p className="text-xs text-purple-600 mt-1">Harmonic mean</p>
            </div>
          </div>
        </div>
      )}

      {/* Probability Distribution */}
      {probabilities && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Classification Probabilities
          </h4>
          <div className="space-y-3">
            {[
              { label: 'Vulnerable', key: 'vulnerable', color: 'bg-red-500' },
              { label: 'Safe', key: 'safe', color: 'bg-green-500' },
              { label: 'Hallucinated', key: 'hallucinated', color: 'bg-orange-500' },
            ].map((item) => (
              <div key={item.key} className="flex items-center gap-3">
                <div className="w-24 text-sm font-medium text-slate-700">{item.label}</div>
                <div className="flex-1 bg-slate-200 rounded-full h-6 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(probabilities[item.key] || 0) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={cn("h-full flex items-center justify-end pr-2 text-white text-xs font-bold", item.color)}
                  >
                    {((probabilities[item.key] || 0) * 100).toFixed(1)}%
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Analysis */}
      {result.detailed_analysis && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Detailed Analysis
          </h4>
          <div className="space-y-3">
            <div>
              <h5 className="font-semibold text-slate-800">{result.detailed_analysis.type}</h5>
              <p className="text-sm text-slate-600 mt-1">{result.detailed_analysis.description}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700">{result.detailed_analysis.recommendation}</p>
              </div>
            </div>
            {result.detailed_analysis.action_items && result.detailed_analysis.action_items.length > 0 && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                <h6 className="text-xs font-bold text-indigo-700 mb-2">ACTION ITEMS</h6>
                <ul className="space-y-1">
                  {result.detailed_analysis.action_items.map((item, idx) => (
                    <li key={idx} className="text-xs text-indigo-700 flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Issues if any */}
      {issues && issues.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Bug className="w-4 h-4" />
            Detected Issues ({issues.length})
          </h4>
          <div className="space-y-3">
            {issues.map((issue, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <motion.button
                  onClick={() => setExpandedIssue(expandedIssue === idx ? null : idx)}
                  className="w-full text-left p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors"
                >
                  <AlertCircle className={cn(
                    "w-5 h-5 mt-0.5 flex-shrink-0",
                    issue.severity === 'critical' ? 'text-red-600' :
                    issue.severity === 'high' ? 'text-orange-600' :
                    issue.severity === 'medium' ? 'text-yellow-600' :
                    'text-blue-600'
                  )} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-semibold text-slate-800">{issue.type}</h5>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-bold uppercase",
                        getSeverityColor(issue.severity)
                      )}>
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{issue.description}</p>
                    {issue.confidence && (
                      <div className="flex items-center gap-2 mt-2">
                        <Percent className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">
                          Confidence: {(issue.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: expandedIssue === idx ? 180 : 0 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </motion.div>
                </motion.button>

                {/* Expanded details */}
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedIssue === idx ? 'auto' : 0,
                    opacity: expandedIssue === idx ? 1 : 0
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-slate-200"
                >
                  <div className="p-4 bg-slate-50 space-y-3">
                    {issue.fix_suggestion && (
                      <div>
                        <p className="text-xs font-bold text-slate-600 mb-1">FIX SUGGESTION</p>
                        <p className="text-sm text-slate-700 bg-white border border-blue-200 rounded p-2">
                          {issue.fix_suggestion}
                        </p>
                      </div>
                    )}
                    {(issue.original_code || issue.fixed_code_suggestion) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {issue.original_code && (
                          <div>
                            <p className="text-xs font-bold text-red-600 mb-1">VULNERABLE CODE</p>
                            <pre className="text-xs bg-red-50 border border-red-200 rounded p-2 overflow-x-auto max-h-32">
                              {issue.original_code}
                            </pre>
                          </div>
                        )}
                        {issue.fixed_code_suggestion && (
                          <div>
                            <p className="text-xs font-bold text-green-600 mb-1">FIXED CODE</p>
                            <pre className="text-xs bg-green-50 border border-green-200 rounded p-2 overflow-x-auto max-h-32">
                              {issue.fixed_code_suggestion}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Safe Code Message */}
      {category === 'safe' && !issues?.length && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
          <p className="text-green-800 font-medium">Code appears secure</p>
          <p className="text-green-600/80 text-sm">No vulnerabilities or suspicious patterns detected by the ML model.</p>
        </div>
      )}
    </motion.div>
  );
};

export default MLResultsPanel;

