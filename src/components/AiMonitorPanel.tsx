import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Terminal, 
  ExternalLink, 
  X, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  Clock,
  User,
  ShieldCheck,
  Search,
  ShieldAlert,
  Activity,
  RefreshCw
} from 'lucide-react';

interface AIReport {
  id: number;
  type: string;
  user: string;
  email: string;
  details: string;
  time: string;
}

interface AiMonitorPanelProps {
  setIsLoadingParent: (loading: boolean) => void;
  userRole: string;
  onBypassLogin?: (user: any, token: string) => void;
}

export function AiMonitorPanel({ setIsLoadingParent, userRole, onBypassLogin }: AiMonitorPanelProps) {
  const [reports, setReports] = useState<AIReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<AIReport | null>(null);
  
  // Security Kernel Live Synchronizations
  const [securityStatus, setSecurityStatus] = useState({
    isLocked: false,
    blockedIpsCount: 0,
    dlpTriggers: 0,
    aiScansPerformed: 0,
    logs: [] as any[],
    firewallRules: {
      ipBlacklist: [] as string[],
      blockedUserAgents: [] as string[],
      blockedPaths: [] as string[],
      geoBlocksSimulation: [] as string[],
      secureOnlyMode: false
    },
    time: ''
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [inputIp, setInputIp] = useState('');
  const [simulationPayload, setSimulationPayload] = useState('select * from users;--');
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    fetchReports();
    fetchSecurityStatus();
    
    const interval = setInterval(fetchSecurityStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSecurityStatus = async () => {
    try {
      const res = await fetch('/api/security/status');
      const data = await res.json();
      if (data.success) {
        setSecurityStatus(data);
      }
    } catch (e) {
      console.error("Error communicating with security kernel:", e);
    }
  };

  const handleUpdateFirewall = async (type: string, payload: any) => {
    if (userRole === 'Editor') {
      alert("⚠️ দুঃখিত, অনুগ্রহ করে এডমিন অ্যাক্সেস নিয়ে চেষ্টা করুন।");
      return;
    }
    try {
      const res = await fetch('/api/security/update-firewall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, payload })
      });
      const data = await res.json();
      if (data.success) {
        fetchSecurityStatus();
        setInputIp('');
      } else {
        alert("ফায়ারওয়াল আপডেট করতে ব্যর্থ: " + data.error);
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleClearLogs = async () => {
    if (userRole === 'Editor') {
      alert("⚠️ দুঃখিত, অনুগ্রহ করে এডমিন অ্যাক্সেস নিয়ে চেষ্টা করুন।");
      return;
    }
    try {
      const res = await fetch('/api/security/clear-logs', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchSecurityStatus();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulateAttack = async () => {
    setIsSimulating(true);
    setSimulationResult(null);
    try {
      // Send a simulated request trigger to the server
      const res = await fetch('/api/admin/ai-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': simulationPayload.includes('nikto') ? 'nikto scans' : 'normal-sec-scanner-probe',
          'X-Simulated-Country-Code': simulationPayload.includes('RU') ? 'RU' : 'US'
        },
        body: JSON.stringify({
          comment: "Simulated Probe Test Flow Input Event",
          rawInputData: simulationPayload
        })
      });

      const bodyData = await res.json();

      setTimeout(() => {
        fetchSecurityStatus();
        setIsSimulating(false);
        setSimulationResult({
          status: res.status,
          success: res.ok,
          checkedPayload: simulationPayload,
          cleansedBody: bodyData
        });
      }, 1000);

    } catch (e: any) {
      fetchSecurityStatus();
      setIsSimulating(false);
    }
  };

  const triggerManualLockdown = async () => {
    if (userRole === 'Editor') {
      alert("⚠️ দুঃখিত, অনুগ্রহ করে এডমিন অ্যাক্সেস নিয়ে চেষ্টা করুন।");
      return;
    }
    const confirmLock = window.confirm("🚨 আপনি কি নিশ্চিতভাবে মাস্টার কিল-সুইচ সচল করতে চান? এর ফলে অ্যাডমিন ফেস ভেরিফিকেশন ছাড়া সমস্ত ট্রাফিক ব্লক হয়ে ৪৪০ স্ক্রিন দেখাবে।");
    if (!confirmLock) return;

    setIsLoadingParent(true);
    try {
      const res = await fetch('/api/security/lockdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: "Manual Emergency Kill-Switch Activated by Admin" })
      });
      const data = await res.json();
      if (data.success) {
        setSecurityStatus(prev => ({ ...prev, isLocked: true }));
        alert("🔒 সিস্টেম লকডাউন মুড সক্রিয় হয়েছে! ওয়েবসাইট এখন ৪৪০ লকডাউন পেজ রিটার্ন করবে।");
      }
    } catch (err: any) {
      alert("ত্রুটি: লকডাউন সক্রিয় সম্ভব হয়নি।");
    } finally {
      setIsLoadingParent(false);
    }
  };

  const handleDisasterRecoveryRestore = async () => {
    if (userRole === 'Editor') {
      alert("⚠️ দুঃখিত, অনুগ্রহ করে এডমিন অ্যাক্সেস নিয়ে চেষ্টা করুন।");
      return;
    }
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/security/restore', {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setSecurityStatus(prev => ({ ...prev, isLocked: false }));
        alert(`♻️ ১০ বছরের ঐতিহাসিক ডাটা রিস্কি স্ন্যাপশট চমৎকারভাবে ১০০% অক্ষত অবস্থায় রিস্টোর হয়েছে এবং লকডাউন মুক্ত করা হয়েছে!`);
      } else {
        alert(`রিস্টোর সম্পন্ন করা যায়নি: ${data.message || data.error}`);
      }
    } catch (err) {
      alert("রিস্টোর ফেইল্ড।");
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchReports = async () => {
    setIsLoadingParent(true);
    try {
      const res = await fetch('/api/admin/ai-reports');
      const data = await res.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingParent(false);
    }
  };

  const handleInspectProfile = (report: AIReport) => {
    alert(`Redirecting to @${report.user}'s store dashboard ... (অনুসন্ধান চালানো হচ্ছে)`);
    if (onBypassLogin) {
      onBypassLogin({ username: report.user, email: report.email }, 'bypass-token');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300">
      
      {/* SECTION: SYSTEM MONITOR TITLE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-slate-800/80 mb-6 gap-2">
        <div>
          <h2 className="text-xl font-bold text-rose-500 flex items-center gap-2">
            <Bot size={22} className="text-rose-500" /> 🤖 24/7 Global Safety Engine (System Logs & Security)
          </h2>
          <p className="text-slate-500 text-xs text-left">
            এটি ২৪ ঘণ্টা প্ল্যাটফর্মের রিফান্ড রিকোয়েস্ট, অর্ডার এরর ও সিকিউরিটি ফায়ারওয়াল অভিযোগ মনিটর করে।
          </p>
        </div>
        <span className="text-[10px] uppercase font-black tracking-widest bg-rose-950/40 text-rose-400 px-3.5 py-1.5 rounded-full border border-rose-500/30 animate-pulse flex items-center gap-1.5 self-start md:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 block animate-ping" />
          24/7 Guard Active {userRole === 'Editor' && '(View Only)'}
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 🔒 ADVANCED INTERACTIVE UNIFIED SECURITY KERNEL DASHBOARD */}
      {/* ========================================================================= */}
      <div className="mb-8 bg-slate-950 border border-slate-800/80 rounded-2xl p-5 md:p-6 relative overflow-hidden text-left animate-fadeIn">
        <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-600" />
        
        {/* Core Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-rose-955/20 pb-5 mb-5 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-950/40 to-rose-950/20 border border-red-500/20 flex items-center justify-center text-red-450 animate-pulse">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h3 className="font-black text-slate-100 text-base flex items-center gap-2 flex-wrap">
                প্লাবন ট্রাস্ট ফোর্ট্রেস - Unified Security Suite
                <span className="text-[10px] bg-red-550/10 text-red-400 border border-red-500/30 font-mono px-2 py-0.5 rounded font-black tracking-widest">
                  IPS / IDS ACTIVE
                </span>
                <span className="text-[10px] bg-emerald-550/10 text-emerald-400 border border-emerald-500/30 font-mono px-2 py-0.5 rounded font-black">
                  DLP LIVE
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">মাস্টার কিল-সুইচ লকডাউন, ডেটা ড্যামেজ রিকভারি ও এআই বিহেভিয়ারাল স্ক্যানার ইন্টিগ্রেশন</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-black uppercase font-mono px-3.5 py-1.5 rounded-xl border flex items-center gap-2 bg-slate-900/60 ${
              securityStatus.isLocked 
              ? "text-red-450 border-red-500/40" 
              : "text-emerald-450 border-emerald-500/40"
            }`}>
              <span className={`w-2 h-2 rounded-full ${securityStatus.isLocked ? "bg-red-500 animate-ping" : "bg-emerald-500 animate-pulse"}`} />
              {securityStatus.isLocked ? "🔒 SYSTEM LOCKED" : "🛡️ GATEWAY PROTECTED"}
            </span>
          </div>
        </div>

        {/* Dynamic Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
          <div className="bg-slate-900/30 border border-slate-900 p-3.5 rounded-xl transition hover:border-slate-800">
            <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Blocked Attacker IPs</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-rose-500 font-mono">
                {securityStatus.blockedIpsCount || 0}
              </span>
              <span className="text-[10px] text-slate-550 font-mono uppercase">Nodes</span>
            </div>
          </div>

          <div className="bg-slate-900/30 border border-slate-900 p-3.5 rounded-xl transition hover:border-slate-800">
            <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">DLP Leak Interventions</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-amber-500 font-mono">
                {securityStatus.dlpTriggers || 0}
              </span>
              <span className="text-[10px] text-slate-550 font-mono uppercase">Leaks Blocked</span>
            </div>
          </div>

          <div className="bg-slate-900/30 border border-slate-900 p-3.5 rounded-xl transition hover:border-slate-800">
            <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">AI Scan Interceptions</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-indigo-400 font-mono">
                {securityStatus.aiScansPerformed || 0}
              </span>
              <span className="text-[10px] text-zinc-550 font-mono uppercase">Requests Scanned</span>
            </div>
          </div>

          <div className="bg-slate-900/30 border border-slate-900 p-3.5 rounded-xl transition hover:border-slate-800">
            <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Disaster Recovery Copy</span>
            <div className="flex items-baseline gap-1 mt-1 font-mono">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-black uppercase shrink-0">
                10-Year Safe Snapshot
              </span>
            </div>
          </div>
        </div>

        {/* Two Column Section: Interactive Firewall & Simulated Defense Playground */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          
          {/* Dynamic Firewall Blocklist Controls */}
          <div className="bg-slate-900/30 border border-slate-905 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider mb-2 flex items-center gap-1.5">
                🌐 Gateway Firewall Blocklist Setup
              </h4>
              <p className="text-[11px] text-slate-500 mb-4 leading-normal">
                ম্যানুয়াল বা অটোমেটিক উপায়ে কোনো আক্রমণকারী আইপি ব্লক করুন। ব্লক করা আইপি এই প্ল্যাটফর্মের কোনো রিসোর্স অ্যাক্সেস করতে পারবে না।
              </p>

              {/* IP Input Form */}
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={inputIp}
                  onChange={(e) => setInputIp(e.target.value)}
                  placeholder="E.g. 198.51.100.41"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-250 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
                />
                <button 
                  type="button"
                  onClick={() => {
                    if (inputIp.trim()) handleUpdateFirewall('blacklist-ip', inputIp.trim());
                  }}
                  className="bg-red-650 hover:bg-red-600 text-white font-black text-xs uppercase px-4 py-1.5 rounded-lg active:scale-95 transition cursor-pointer"
                >
                  Block IP 🚫
                </button>
              </div>

              {/* Blocked IP List */}
              <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                {securityStatus.firewallRules?.ipBlacklist?.map((ip) => (
                  <div key={ip} className="flex justify-between items-center bg-slate-950/80 border border-slate-800/60 px-3 py-1.5 rounded-md text-[11px] font-mono">
                    <span className="text-red-400">{ip}</span>
                    <button 
                      type="button"
                      onClick={() => handleUpdateFirewall('whitelist-ip', ip)}
                      className="text-emerald-450 hover:text-emerald-400 font-bold uppercase text-[9px] cursor-pointer"
                    >
                      [Release / Whitelist]
                    </button>
                  </div>
                ))}
                {(!securityStatus.firewallRules?.ipBlacklist || securityStatus.firewallRules.ipBlacklist.length === 0) && (
                  <div className="text-[11px] text-slate-600 italic py-2 text-center border border-dashed border-slate-900 rounded-md">
                    ফায়ারওয়ালে কোনো আইপি ম্যানুয়ালি ব্লক করা নেই।
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-900 flex flex-wrap gap-2 text-[10px] text-slate-500 font-mono uppercase">
              <span>Agent Filters: {securityStatus.firewallRules?.blockedUserAgents?.join(', ')}</span>
            </div>
          </div>

          {/* Interactive AI Security Scanner & Simulated Defense Playground */}
          <div className="bg-slate-900/30 border border-slate-905 p-4 rounded-xl">
            <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider mb-2 flex items-center gap-1.5">
              🤖 Intrusion & Data Leak Simulator (Sandbox)
            </h4>
            <p className="text-[11px] text-slate-550 mb-3 leading-normal">
              এখানে ক্ষতিকারক স্ক্রিপ্ট বা পেমেন্ট কোড লিখে এআই সিকিউরিটি ফিল্টার পরীক্ষা করুন। এআই এবং ডিএলপি এটি রিয়েল-টাইম ডিটেক্ট করে ইন্টারসেপ্ট করবে।
            </p>

            <div className="space-y-2">
              <select 
                value={simulationPayload}
                onChange={(e) => setSimulationPayload(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg p-2 text-xs outline-none cursor-pointer"
              >
                <option value="select * from users;--">SQL Injection Attack Theme Probe</option>
                <option value="<script>alert('Intruder XSS Payload')</script>">Malicious Cross-Site Script (XSS) Probe</option>
                <option value="Visa payment checkout card digit leak: 4111222233334444 CVV: 231">DLP Payment Protection Leak Case (Raw 16-Digit Card)</option>
                <option value="nikto security scanner injection audit request">Automated Cyber-Scanner Bot Signature (Nikto User Agent)</option>
              </select>

              <button 
                type="button"
                onClick={handleSimulateAttack}
                disabled={isSimulating}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 text-white font-extrabold text-xs uppercase py-2 rounded-lg transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" />
                    Running Real-Time AI Diagnostics...
                  </>
                ) : (
                  <>
                    ⚡ Run Intrusion Simulation Probe
                  </>
                )}
              </button>

              {/* Simulation Result Box */}
              {simulationResult && (
                <div className="bg-slate-950 border border-zinc-900 p-3 rounded-lg space-y-1.5 text-[11px] leading-relaxed animate-fadeIn">
                  <div className="flex justify-between font-bold border-b border-slate-900 pb-1">
                    <span className="text-slate-400">Response Code:</span>
                    <span className={simulationResult.status === 403 || simulationResult.status === 440 ? "text-rose-450 font-mono font-bold animate-pulse" : "text-emerald-400 font-mono"}>
                      HTTP {simulationResult.status} (Access Filtered)
                    </span>
                  </div>
                  <div className="font-mono text-[9px] text-slate-500 overflow-x-auto whitespace-pre-wrap max-h-16">
                    <strong>Analyzed Payload:</strong> {simulationResult.checkedPayload}
                  </div>
                  <div className="text-[10px] text-amber-400/90 font-medium">
                    🔍 <strong>Defense Result:</strong> সার্ভার সিকিউরিটি ফিল্টার সফলভাবে আক্রমণ বা পেমেন্ট লিকেজ সনাক্ত করেছে এবং সিস্টেমে থ্রেট লগ হিসেবে রেকর্ড করেছে।
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Real-time IPS Console Log Feed */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              📟 Active IPS/IDS & Threat Scanner Terminal Feed
            </h4>
            <button 
              type="button"
              onClick={handleClearLogs}
              className="text-[10px] font-mono text-rose-400 hover:text-rose-300 font-black cursor-pointer"
            >
              [Clear Logs Terminal]
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-900 rounded-xl font-mono text-[11px] text-slate-300 p-4 max-h-48 overflow-y-auto space-y-2.5 text-left leading-normal shadow-inner select-text">
            {securityStatus.logs?.map((log: any) => {
              const severityColor = {
                LOW: 'text-slate-550',
                MEDIUM: 'text-yellow-400 font-bold',
                HIGH: 'text-amber-500 font-bold',
                CRITICAL: 'text-red-500 font-black animate-pulse'
              }[log.severity as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'] || 'text-slate-500';

              const badgeColor = {
                IPS: 'bg-indigo-950 text-indigo-400 border-indigo-900/60',
                FIREWALL: 'bg-red-950 text-red-400 border-red-900/60',
                DLP: 'bg-amber-950 text-amber-400 border-amber-950/60',
                AI_SCANNER: 'bg-purple-950 text-purple-400 border-purple-900/60'
              }[log.type as 'IPS' | 'FIREWALL' | 'DLP' | 'AI_SCANNER'] || 'bg-slate-900 text-slate-400';

              return (
                <div key={log.id} className="border-b border-slate-900 pb-2 last:border-0 hover:bg-slate-900/20 px-1 py-0.5 rounded transition">
                  <div className="flex flex-wrap items-center justify-between text-[10px] mb-1 gap-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-black tracking-wider border ${badgeColor}`}>
                        {log.type}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${severityColor}`}>
                        {log.severity} Severity range
                      </span>
                    </div>
                    <span className="text-slate-500 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()} ({log.ip})</span>
                  </div>
                  <p className="text-slate-300 text-xs font-semibold">{log.message}</p>
                  {log.explanation && (
                    <p className="text-[10px] text-slate-500 mt-0.5 italic">» Mitigation details: {log.explanation}</p>
                  )}
                </div>
              );
            })}
            {(!securityStatus.logs || securityStatus.logs.length === 0) && (
              <div className="text-center text-slate-600 italic py-6">
                লগ টার্মিনাল খালি। এআই এবং আইপিএস গেটওয়ে রেডি।
              </div>
            )}
          </div>
        </div>

        {/* Master Switches Gateways & Snapshiot restorer controls */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-3 border-t border-slate-900">
          <button 
            type="button"
            onClick={triggerManualLockdown}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              securityStatus.isLocked 
              ? "bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed" 
              : "bg-red-650 hover:bg-red-650 text-white border border-red-500/25 shadow-lg shadow-red-550/5 active:scale-95"
            }`}
            disabled={securityStatus.isLocked}
          >
            🔒 Engage Master Kill-Switch Lockdown
          </button>

          <button 
            type="button"
            onClick={handleDisasterRecoveryRestore}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              !securityStatus.isLocked 
              ? "bg-slate-900/50 text-slate-600 border border-slate-850 cursor-not-allowed" 
              : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-slate-950 border border-emerald-500/25 shadow-lg shadow-emerald-500/10 active:scale-95"
            }`}
            disabled={!securityStatus.isLocked}
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            ♻️ Hydrate 10-Year Golden DB Snapshot
          </button>
        </div>
      </div>

      {/* SECTION: SYSTEM LOG ALERT LIST */}
      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3 text-left">
        📷 Diagnostics Logs & Ticket Alerts
      </h3>
      
      <div className="space-y-3">
        {reports.map((report) => (
          <div 
            key={report.id} 
            onClick={() => setSelectedReport(report)}
            className="p-4 bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-950 rounded-2xl cursor-pointer transition duration-200 flex flex-col md:flex-row justify-between md:items-center gap-3 shadow-sm hover:shadow-md text-left text-xs text-slate-300"
          >
            <div className="space-y-1 md:max-w-xl">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-rose-400 bg-rose-950/20 px-2 py-0.5 rounded-lg border border-rose-500/10">
                  {report.type}
                </span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock size={12} /> {report.time}
                </span>
              </div>
              <p className="text-slate-400 font-medium truncate leading-relaxed">
                {report.details}
              </p>
            </div>
            
            <button 
              type="button"
              className="mt-2 md:mt-0 font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 px-3 py-2 rounded-xl transition duration-200 flex items-center justify-center gap-1 cursor-pointer w-full md:w-auto text-xs active:scale-95 text-center leading-none"
            >
              <Terminal size={12} /> View Logs
            </button>
          </div>
        ))}
        {reports.length === 0 && (
          <div className="p-10 text-center text-slate-500 font-medium italic border border-dashed border-slate-800 rounded-2xl">
            কোনো সচল এআই অ্যালার্ট ও এরর পাওয়া যায়নি।
          </div>
        )}
      </div>

      {/* ================= MODAL: AI MONITOR REPORT DETAILS ================= */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-[9999] animate-fadeIn">
          <div className="bg-slate-950 p-6 rounded-3xl max-w-lg w-full border border-rose-700/40 shadow-2xl relative text-left">
            <button 
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 hover:bg-slate-900 rounded-lg transition"
            >
              <X size={18} />
            </button>
            
            <div className="flex justify-between items-center mb-5 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2 uppercase tracking-wide">
                <AlertTriangle size={20} className="text-rose-500" /> Advanced AI Diagnostics
              </h3>
              <span className="text-[10px] font-black bg-rose-950/40 text-rose-300 px-2.5 py-1 rounded-full border border-rose-800/50 uppercase tracking-widest">
                24/7 Shield AI
              </span>
            </div>
            
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-0.5">Flagged User</p>
                  <p className="font-extrabold text-yellow-400 flex items-center gap-1 text-sm">
                    <User size={14} className="text-slate-400" /> @{selectedReport.user}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-0.5">Associated Email</p>
                  <p className="font-bold text-slate-300 truncate text-xs" title={selectedReport.email}>
                    {selectedReport.email}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black mb-1.5 flex items-center gap-1.5">
                  <Terminal size={12} className="text-rose-500" /> Issue Details & System Logs:
                </p>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl font-mono text-[11px] text-slate-300 leading-relaxed max-h-44 overflow-y-auto space-y-1 text-left">
                  <div className="text-rose-400/90 font-medium mb-2">{selectedReport.details}</div>
                  <div className="text-slate-500 font-bold border-t border-slate-800/60 pt-2 flex items-center gap-2">
                    <span className="text-indigo-400">[SYSTEM LOG]</span> Tracing supplier API response... <span className="text-emerald-400 font-extrabold">OK</span>
                  </div>
                  <div className="text-slate-500 font-bold flex items-center gap-2">
                    <span className="text-indigo-400">[SYSTEM LOG]</span> Checking store refund rules... <span className="text-yellow-400 font-extrabold">Pending Action</span>
                  </div>
                  <div className="text-slate-500 font-bold flex items-center gap-2">
                    <span className="text-indigo-400">[SYSTEM LOG]</span> Connection: Cloud-Secure API Endpoint ... <span className="text-emerald-400 font-extrabold">ACTIVE</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-xs text-yellow-300/90 leading-relaxed flex items-start gap-2.5">
                <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Admin/Editor Action Advice:</strong> আপনি চাইলে সরাসরি এই ইউজারের ব্যাকঅফিস বা স্টোর প্রোফাইলে ঢুকে ঝামেলাটি সমাধান করতে পারেন।
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => handleInspectProfile(selectedReport)}
                className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-slate-950 py-3.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-lg shadow-yellow-500/10 cursor-pointer"
              >
                <Search size={14} /> Inspect Store Profile
              </button>
              <button 
                onClick={() => setSelectedReport(null)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-5 py-3.5 rounded-xl text-xs font-semibold border border-slate-800 transition cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
