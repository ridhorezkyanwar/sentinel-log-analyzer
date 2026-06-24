"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  FileText,
  Loader2,
  AlertTriangle,
  Download,
  Copy,
  Check,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function LogAnalyzer() {
  const [logData, setLogData] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const analyzeLog = async () => {
    if (!logData.trim()) {
      setError("Masukkan log data terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setError("");
    setAnalysis("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logData }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReport = () => {
    const blob = new Blob([analysis], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `threat-report-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Sample logs untuk demo
  const sampleLogs = `192.168.1.100 - - [24/Jun/2026:10:15:32 +0700] "GET /admin/login.php HTTP/1.1" 404 452
192.168.1.100 - - [24/Jun/2026:10:15:33 +0700] "POST /admin/login.php HTTP/1.1" 401 512
192.168.1.100 - - [24/Jun/2026:10:15:34 +0700] "POST /admin/login.php HTTP/1.1" 401 512
192.168.1.100 - - [24/Jun/2026:10:15:35 +0700] "POST /admin/login.php HTTP/1.1" 401 512
10.0.0.50 - - [24/Jun/2026:10:20:15 +0700] "GET /search?q=<script>alert('XSS')</script> HTTP/1.1" 200 1234
172.16.0.1 - - [24/Jun/2026:10:25:00 +0700] "GET /etc/passwd HTTP/1.1" 403 287
172.16.0.1 - - [24/Jun/2026:10:25:01 +0700] "GET /../../../etc/shadow HTTP/1.1" 403 287`;

  return (
    <section className="min-h-screen py-12 px-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-300">AI-Powered Threat Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sentinel Log{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Analyzer
            </span>
          </h1>
          <p className="text-slate-400 text-lg">
            Analisis log keamanan dengan AI untuk deteksi ancaman real-time
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Input Log Data
              </h2>
              <button
                onClick={() => setLogData(sampleLogs)}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Load Sample Logs
              </button>
            </div>

            <textarea
              value={logData}
              onChange={(e) => setLogData(e.target.value)}
              placeholder="Paste log data di sini... (web server logs, firewall logs, access logs, dll)"
              className="w-full h-96 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm resize-none"
              disabled={isLoading}
            />

            <button
              onClick={analyzeLog}
              disabled={isLoading || !logData.trim()}
              className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white hover:scale-105 transition-transform"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Analyze Threats
                </>
              )}
            </button>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 flex items-center gap-2"
                >
                  <AlertTriangle className="w-5 h-5" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                Threat Intelligence Report
              </h2>
              {analysis && (
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={downloadReport}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              )}
            </div>

            <div className="h-96 bg-slate-900 border border-slate-700 rounded-xl p-4 overflow-y-auto">
              {analysis ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-invert prose-sm max-w-none"
                >
                  <ReactMarkdown>{analysis}</ReactMarkdown>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Hasil analisis akan muncul di sini</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}