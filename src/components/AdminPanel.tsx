import React, { useState, useEffect } from 'react';
import { AutopilotControlPanel } from './AutopilotControlPanel';
import { EditorManagementPanel } from './EditorManagementPanel';
import { AiMonitorPanel } from './AiMonitorPanel';
import { EcommerceDashboard } from './EcommerceDashboard';
import { translations } from '../translations';
import { 
  Crown, 
  Settings, 
  Globe, 
  Edit, 
  Key, 
  Calendar, 
  Calculator, 
  ChartLine, 
  Database, 
  Bot as Robot, 
  Users,
  LogIn as SignInAlt,
  Mail as Envelope,
  Lock,
  LogOut,
  Crown as CrownIcon,
  AtSign,
  PlusCircle,
  Store,
  Send,
  Zap,
  Video,
  Music,
  Trash2,
  Volume2,
  Disc,
  Mic,
  ShieldCheck,
  Clipboard,
  Wallet,
  Percent,
  DollarSign,
  CheckCircle,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPanelProps {
  onBack: () => void;
  onOpenEditor: () => void;
  registrationRequests?: any[];
  onBypassLogin?: (user: any, token: string) => void;
  t?: any;
}

export function AdminPanel({ onBack, onOpenEditor, registrationRequests = [], onBypassLogin, t }: AdminPanelProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMasterSwitchActive, setIsMasterSwitchActive] = useState(false);
  const [isWebsiteOnline, setIsWebsiteOnline] = useState<boolean>(() => {
    const saved = localStorage.getItem('isWebsiteOnline');
    return saved !== 'false';
  });
  const [showAccessCodeDetails, setShowAccessCodeDetails] = useState(false);
  const [activeAccessType, setActiveAccessType] = useState('shop-details');
  const [isLoading, setIsLoading] = useState(false);
  const [showTaxVatPanel, setShowTaxVatPanel] = useState(false);
  const [showAllAccountsPanel, setShowAllAccountsPanel] = useState(false);
  const [showAutopilotPanel, setShowAutopilotPanel] = useState(false);
  const [showEditorManagementPanel, setShowEditorManagementPanel] = useState(false);
  const [showAiMonitorPanel, setShowAiMonitorPanel] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const savedAdminLogin = localStorage.getItem('adminLoggedIn');
    if (savedAdminLogin === 'true') {
      setIsLoggedIn(true);
      const savedUser = localStorage.getItem('adminUser');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {
          // fallback
        }
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success && (data.user.role === 'Admin' || data.user.role === 'Editor')) {
        setIsLoggedIn(true);
        setCurrentUser(data.user);
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        localStorage.setItem('pts_token', data.token);
      } else {
        alert('❌ Access Denied! Please check your credentials.');
      }
    } catch (error) {
      alert('❌ Connection failed. Is the server running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
  };

  const toggleMasterSwitch = () => {
    setIsMasterSwitchActive(!isMasterSwitchActive);
  };

  const toggleWebsiteStatus = () => {
    const nextVal = !isWebsiteOnline;
    setIsWebsiteOnline(nextVal);
    localStorage.setItem('isWebsiteOnline', String(nextVal));
    window.dispatchEvent(new Event('website-online-changed'));
  };

  const editorPermissions = {
    role: "Editor",
    allowedPanels: [
      "New Account Access Code UI", // এক্সেস কোড ডিটেইলস
      "Register & Accounts Create",  // শপ এবং ওয়ারহাউজ অ্যাকাউন্ট ক্রিয়েশন
      "AirDrop System (Logs)",       // এয়ারড্রপ সিস্টেম দেখা ও কাজ করানো
      "Video Upload Control",        // ভিডিও ও লিংক আপলোড প্যানেল
      "Auto AI Monitor (View Only)"  // ২৪ ঘণ্টা এআই এরর এবং হেল্প সিস্টেমের রিপোর্ট দেখা
    ],
    hiddenPanels: [
      "Core Auto-Pilot Mode",        // মেইন অটো পাইলট মোড দেখতে পারবে না
      "Music Control",               // মিউজিক কন্ট্রোল (এটি সরিয়ে দেওয়া হয়েছে)
      "CEO Settings & Core Fin",     // এডমিন পাসওয়ার্ড ও মেইন ওনারশিপ সেটিংস্
      "Editor Ban/Remove Module"     // নিজেরা নিজেদের বা অন্য কোনো এডিটরকে বাদ দিতে পারবে না
    ]
  };

  const renderPanelForUser = (panelName: string) => {
    const role = currentUser?.role || 'Admin';
    if (role === 'Admin') return true;
    if (role === 'Editor') {
      return editorPermissions.allowedPanels.includes(panelName);
    }
    return false;
  };

  // Control Panel Functions
  const openEditor = () => alert('🖋️ Editor Panel Opened!');
  const generateAccessCode = () => setShowAccessCodeDetails(true);
  const openSchedule = () => alert('📅 Schedule Manager: এয়ারড্রপ কার্যাবলী সফলভাবে লোড করা হয়েছে!');
  const openTaxPanel = () => {
    if (!renderPanelForUser("CEO Settings & Core Fin")) {
      return alert("দুঃখিত, আপনার এই প্যানেল দেখার কোনো অনুমতি নেই!");
    }
    setShowTaxVatPanel(true);
  };
  const showProfit = () => {
    if (!renderPanelForUser("CEO Settings & Core Fin")) {
      return alert("দুঃখিত, আপনার এই প্যানেল দেখার কোনো অনুমতি নেই!");
    }
    alert('💵 Total Profit: $1,247,893.45');
  };
  const openDetails = () => alert('📊 System Details Panel Opened!');
  const openAIMonitor = () => {
    if (!renderPanelForUser("Core Auto-Pilot Mode")) {
      return alert("দুঃখিত, আপনার কোর অটো-পাইলট মোড এডিট করার অনুমতি নেই!");
    }
    setShowAutopilotPanel(true);
  };
  const openAllAccounts = () => setShowAllAccountsPanel(true);
  const openEditorManagement = () => setShowEditorManagementPanel(true);
  const openAiMonitorPanelTrigger = () => setShowAiMonitorPanel(true);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md border border-gray-100"
        >
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-8 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
              <CrownIcon size={32} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-widest">Admin Control</h2>
            <p className="text-pink-100 text-sm font-light mt-1">CEO Access Portal</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <Envelope size={14} className="text-pink-500" /> Admin Email
              </label>
              <input 
                type="email" 
                placeholder="ceo@ptsglobal.com" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:bg-white outline-none transition-all text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <Lock size={14} className="text-pink-500" /> Secure Password
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:bg-white outline-none transition-all text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-pink-200 transition-all flex items-center justify-center gap-2 uppercase tracking-wide disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : (
                <>
                  <SignInAlt size={18} /> Access Dashboard
                </>
              )}
            </button>
          </form>
          
          <div className="p-6 bg-gray-50 text-center border-t border-gray-100">
            <button 
              onClick={onBack}
              className="text-xs font-bold text-gray-400 hover:text-pink-600 transition-colors uppercase tracking-widest"
            >
              Back to Store
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`admin-dashboard ${!isWebsiteOnline ? 'website-offline' : ''}`}>
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <div className="ceo-title flex items-center gap-3">
            <CrownIcon size={32} />
            <span>CEO PTS</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="settings-toggle" onClick={toggleMasterSwitch}>
              <Settings size={20} />
              Website Settings
            </button>
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors p-2"
              title="Logout Admin"
            >
              <LogOut size={24} />
            </button>
            <button 
              onClick={onBack}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold transition-all"
            >
              Store View
            </button>
          </div>
        </div>
      </header>

      {/* Master Switch Overlay */}
      <AnimatePresence>
        {isMasterSwitchActive && (
          <motion.div 
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="master-switch active"
          >
            <h4 className="flex items-center gap-3"><Globe size={20} /> Master Website Control</h4>
            <div className="switch-container mt-4">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={isWebsiteOnline} 
                  onChange={toggleWebsiteStatus}
                />
                <span className="slider"></span>
              </label>
              <span className={`status-text ${isWebsiteOnline ? 'text-green-500' : 'text-red-500'}`}>
                Website: {isWebsiteOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <small className="block mt-4 text-gray-300">
              Toggle to enable/disable entire platform
            </small>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="dashboard-content">
        <AnimatePresence mode="wait">
          {showTaxVatPanel ? (
            <motion.div
              key="tax-vat-panel"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="w-full max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-4 mb-6">
                <button 
                  onClick={() => setShowTaxVatPanel(false)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all border border-white/10 cursor-pointer flex items-center gap-2"
                >
                  &larr; Back to Dashboard
                </button>
                <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">Monthly Tax, VAT & Store Fee Dashboard</h2>
              </div>
              <TaxVatControlPanel />
            </motion.div>
          ) : showAllAccountsPanel ? (
            <motion.div
              key="all-accounts-panel"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="w-full max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-4 mb-6">
                <button 
                  onClick={() => setShowAllAccountsPanel(false)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all border border-white/10 cursor-pointer flex items-center gap-2"
                >
                  &larr; Back to Dashboard
                </button>
                <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">All Account Access Dashboard</h2>
              </div>
              <AllAccountAccessPanel onBypassLogin={onBypassLogin} />
            </motion.div>
          ) : showAutopilotPanel ? (
            <motion.div
              key="autopilot-panel"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="w-full max-w-6xl mx-auto"
            >
              <div className="flex items-center gap-4 mb-6">
                <button 
                  onClick={() => setShowAutopilotPanel(false)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all border border-white/10 cursor-pointer flex items-center gap-2"
                >
                  &larr; Back to Dashboard
                </button>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">AI Assistant & Auto-Pilot Dashboard</h2>
              </div>
              <AutopilotControlPanel />
            </motion.div>
          ) : showEditorManagementPanel ? (
            <motion.div
              key="editor-management-panel"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="w-full max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-4 mb-6">
                <button 
                  onClick={() => setShowEditorManagementPanel(false)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all border border-white/10 cursor-pointer flex items-center gap-2"
                >
                  &larr; Back to Dashboard
                </button>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">Editor Control Board</h2>
              </div>
              <EditorManagementPanel setIsLoadingParent={setIsLoading} />
            </motion.div>
          ) : showAiMonitorPanel ? (
            <motion.div
              key="ai-monitor-panel"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="w-full max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-4 mb-6">
                <button 
                  onClick={() => setShowAiMonitorPanel(false)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all border border-white/10 cursor-pointer flex items-center gap-2"
                >
                  &larr; Back to Dashboard
                </button>
                <h2 className="text-xl font-bold bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text text-transparent">AI Real-time Monitoring</h2>
              </div>
              <AiMonitorPanel 
                setIsLoadingParent={setIsLoading} 
                userRole={currentUser?.role || 'Admin'} 
                onBypassLogin={onBypassLogin}
              />
            </motion.div>
          ) : !showAccessCodeDetails ? (
            <motion.div 
              key="main-grid"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="control-grid"
            >
              {renderPanelForUser("Register & Accounts Create") && (
                <>
                  <ControlCard 
                    icon={<Building size={48} />} 
                    title="১. শপের অ্যাকাউন্ট রেজিস্টার ডিটেইলস" 
                    desc="সকল দোকান রেজিস্ট্রেশন রিকোয়েস্ট দেখুন ও অনুমোদন করুন" 
                    color="#3b82f6"
                    onClick={() => { setShowAccessCodeDetails(true); setActiveAccessType('shop-details'); }}
                  />
                  <ControlCard 
                    icon={<Store size={48} />} 
                    title="২. ড্রপশিপিং অ্যাকাউন্ট শপ ক্রিয়েট" 
                    desc="নতুন রিটেইল শপ বা ড্রপশিপিং স্টোর খোলার প্যানেল" 
                    color="#10b981"
                    onClick={() => { setShowAccessCodeDetails(true); setActiveAccessType('dropshipping-create'); }}
                  />
                  <ControlCard 
                    icon={<Globe size={48} />} 
                    title="২.১ ড্রপ শিপিং স্টোর ডেমো" 
                    desc="লাইভ শপ ডেমো, কাস্টমাইজেশন ও কাস্টমার সেটিংস কন্টেন্ট" 
                    color="#6366f1"
                    onClick={() => { setShowAccessCodeDetails(true); setActiveAccessType('dropshipping-store-demo'); }}
                  />
                  <ControlCard 
                    icon={<Database size={48} />} 
                    title="৩. ওয়্যারহাউজ শপিং অ্যাকাউন্ট ক্রিয়েট" 
                    desc="স্টোর ভিত্তিক ওয়্যারহাউজ ডেমো ও স্টক সেটিংস" 
                    color="#f59e0b"
                    onClick={() => { setShowAccessCodeDetails(true); setActiveAccessType('warehouse-create'); }}
                  />
                </>
              )}

              {currentUser?.role === 'Admin' && (
                <ControlCard 
                  icon={<Users size={48} />} 
                  title="৪. এডিটর অ্যাকাউন্ট ক্রিয়েট" 
                  desc="সহযোগী প্যানেল মডারেটর বা এডিটর তৈরি করুন" 
                  color="#ec4899"
                  onClick={() => { setShowAccessCodeDetails(true); setActiveAccessType('editor-create'); }}
                />
              )}

              {renderPanelForUser("New Account Access Code UI") && (
                <ControlCard 
                  icon={<Key size={48} />} 
                  title="৫. নিউ অ্যাকাউন্ট অ্যাকসেস কোড" 
                  desc="অ্যাকাউন্ট ভেরিফিকেশন জেনারেটর প্যানেল" 
                  color="#eab308"
                  onClick={() => { setShowAccessCodeDetails(true); setActiveAccessType('account-access-codes'); }}
                />
              )}

              {renderPanelForUser("Video Upload Control") && (
                <ControlCard 
                  icon={<Video size={48} />} 
                  title="৬. ভিডিও ও মিউজিক কন্ট্রোল" 
                  desc="ভিডিও আপলোড ও ব্যাকগ্রাউন্ড অডিও প্লেলিস্ট" 
                  color="#a855f7"
                  onClick={() => { setShowAccessCodeDetails(true); setActiveAccessType('video-music'); }}
                />
              )}

              {currentUser?.role === 'Admin' && (
                <ControlCard 
                  icon={<Settings size={48} />} 
                  title="🔄 ৭. নতুন এডমিন আপডেট প্যানেল" 
                  desc="থিম কালার, পেমেন্ট চ্যানেল ও ইভেন্ট অফার সেটিংস" 
                  color="#ef4444"
                  onClick={() => { setShowAccessCodeDetails(true); setActiveAccessType('admin-new-sections'); }}
                />
              )}

              {renderPanelForUser("AirDrop System (Logs)") && (
                <ControlCard 
                  icon={<Send size={48} />} 
                  title="AirDrop System" 
                  desc="Manage automated tasks & cron jobs" 
                  color="#00D4FF"
                  onClick={openSchedule}
                />
              )}
              {renderPanelForUser("Core Auto-Pilot Mode") && (
                <ControlCard 
                  icon={<Zap size={48} />} 
                  title="Core Auto-Pilot Mode" 
                  desc="Direct code diagnostics & safe overwrites" 
                  color="#FF4500"
                  onClick={openAIMonitor}
                />
              )}
              {renderPanelForUser("CEO Settings & Core Fin") && (
                <>
                  <ControlCard 
                    icon={<Calculator size={48} />} 
                    title="Monthly Tax & VAT" 
                    desc="Tax calculations & compliance reports" 
                    color="#FF6B6B"
                    onClick={openTaxPanel}
                  />
                  <ControlCard 
                    icon={<ChartLine size={48} />} 
                    title="Total Profit" 
                    desc="Revenue analytics & profit tracking" 
                    color="#00C851"
                    onClick={showProfit}
                  />
                  <ControlCard 
                    icon={<Database size={48} />} 
                    title="Details" 
                    desc="System statistics & user database" 
                    color="#9C27B0"
                    onClick={openDetails}
                  />
                </>
              )}
              {renderPanelForUser("Auto AI Monitor (View Only)") && (
                <ControlCard 
                  icon={<Robot size={48} />} 
                  title="Auto Monitor (AI)" 
                  desc="24/7 AI-powered complaint list & reallogs" 
                  color="#27ae60"
                  isWide
                  onClick={openAiMonitorPanelTrigger}
                />
              )}
              {currentUser?.role === 'Admin' && (
                <>
                  <ControlCard 
                    icon={<Users size={48} />} 
                    title="Editor Management" 
                    desc="Manage editor roles, details & access bounds" 
                    color="#3b82f6"
                    onClick={openEditorManagement}
                  />
                  <ControlCard 
                    icon={<Users size={48} />} 
                    title="All Account Access" 
                    desc="Complete user management & permissions" 
                    color="#FF9800"
                    onClick={openAllAccounts}
                  />
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="access-code-details"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`mt-6 w-full mx-auto ${activeAccessType === 'dropshipping-store-demo' ? 'max-w-[96%] lg:max-w-7xl xl:max-w-[1450px] px-2 lg:px-4' : 'max-w-4xl px-4'}`}
            >
              <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => setShowAccessCodeDetails(false)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all border border-white/10 cursor-pointer flex items-center gap-2"
                >
                  &larr; Back to Dashboard
                </button>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FF1493] to-[#FF69B4] bg-clip-text text-transparent">
                  {(() => {
                    switch (activeAccessType) {
                      case 'shop-details':
                        return "১. শপের অ্যাকাউন্ট রেজিস্টার ডিটেইলস";
                      case 'dropshipping-create':
                        return "২. ড্রপশিপিং অ্যাকাউন্ট শপ ক্রিয়েট";
                      case 'dropshipping-store-demo':
                        return "২.১ ড্রপ শিপিং স্টোর ডেমো";
                      case 'warehouse-create':
                        return "৩. ওয়্যারহাউজ শপিং অ্যাকাউন্ট ক্রিয়েট";
                      case 'editor-create':
                        return "৪. এডিটর অ্যাকাউন্ট ক্রিয়েট";
                      case 'account-access-codes':
                        return "৫. নিউ অ্যাকাউন্ট অ্যাকসেস কোড";
                      case 'video-music':
                        return "৬. ভিডিও ও মিউজিক কন্ট্রোল";
                      case 'admin-new-sections':
                        return "🔄 ৭. নতুন এডমিন আপডেট প্যানেল";
                      default:
                        return "New Account Access Code";
                    }
                  })()}
                </h2>
              </div>

              {activeAccessType === 'dropshipping-store-demo' ? (
                <div className="w-full mt-4 text-left">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeAccessType}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <AccessDetailsContent 
                        type={activeAccessType} 
                        requests={registrationRequests} 
                        setIsLoading={setIsLoading}
                        userRole={currentUser?.role || 'Admin'}
                        t={t}
                        setActiveAccessType={setActiveAccessType}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : (
                <div className="display-box-access" style={{ margin: '30px 0' }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeAccessType}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <AccessDetailsContent 
                        type={activeAccessType} 
                        requests={registrationRequests} 
                        setIsLoading={setIsLoading}
                        userRole={currentUser?.role || 'Admin'}
                        t={t}
                        setActiveAccessType={setActiveAccessType}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AccessDetailsContent({ type, requests = [], setIsLoading, userRole, t, setActiveAccessType }: { type: string, requests?: any[], setIsLoading: (val: boolean) => void, userRole: string, t?: any, setActiveAccessType?: (type: string) => void }) {
  const [localRequests, setLocalRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Merge probe requests with potential demo data or just use existing ones
    // and ensure they have a status
    if (requests.length > 0 || localRequests.length === 0) {
      const merged = requests.map((r, idx) => ({
        id: idx + 1,
        ...r,
        status: r.status || 'pending'
      }));
      
      // If we don't have any requests yet, add some demo ones as requested in the HTML snippet
      if (merged.length === 0) {
         const demoData = [
            { id: 101, type: 'warehouse', name: 'আবুল ফ্লাওয়ার্স', email: 'abul@flower.com', phone: '01711223344', idNumber: '1995123456789', district: 'Dhaka', city: 'Dhaka', status: 'pending' },
            { id: 102, type: 'dropshipping', name: 'করিম ইলেকট্রনিক্স', email: 'karim@elec.com', phone: '01811223344', idNumber: '1992987654321', district: 'Chittagong', city: 'Chittagong', status: 'pending' },
            { id: 103, type: 'warehouse', name: 'রহমান ট্রেডার্স', email: 'rahman@trade.com', phone: '01911223344', idNumber: '1988556677889', district: 'Sylhet', city: 'Sylhet', status: 'completed' }
         ];
         setLocalRequests(demoData);
      } else {
         setLocalRequests(merged);
      }
    }
  }, [requests]);

  const viewDetails = (req: any) => {
    setSelectedRequest(req);
    setShowModal(true);
  };

  const copyDetails = (req: any) => {
    const textToCopy = `ক্যাটাগরি: ${req.type || 'dropshipping'}
নাম: ${req.name || ''}
ইমেইল: ${req.email || ''}
ফোন: ${req.phone || req.whatsapp || ''}
ID: ${req.idNumber || ''}
ব্যবহারকারী নাম: ${req.usernameVerify || req.username || ''}
ঠিকানা: ${(req.city || '') + (req.city && req.district ? ', ' : '') + (req.district || '')}
দেশ: ${req.country || 'BD'}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert(`"${req.name}" এর সব তথ্য কপি হয়েছে! এখন আপনি "ড্রপশিপিং অ্যাকাউন্ট শপ ক্রিয়েট" এ বাটন ক্লিক করে পেস্ট করতে পারবেন।`);
    });
  };

  const createAccount = (id: number) => {
    const req = localRequests.find(r => r.id === id);
    if (req) {
        const confirmAction = window.confirm(`আপনি কি "${req.name}" এর ইউজারনেম, ইমেইল ও পাসওয়ার্ড দিয়ে ভেরিফিকেশন কোড পাঠাতে চান? অ্যাকাউন্ট খোলা হলে এটি নিচে চলে যাবে।`);
        if(confirmAction) {
            setLocalRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'completed' } : r));
        }
    }
  };

  const pendingRequests = localRequests.filter(r => r.status === 'pending');
  const completedRequests = localRequests.filter(r => r.status === 'completed');

  switch(type) {
    case 'shop-details':
      return (
        <div className="registration-details-container">
          <div className="section-title-pts">নতুন রেজিস্ট্রেশন রিকোয়েস্ট (উপরে থাকবে)</div>
          <div className="file-list">
            {pendingRequests.length > 0 ? (
              pendingRequests.map((req) => (
                <div key={req.id} className="file-card">
                  <div className="file-info" onClick={() => viewDetails(req)}>
                    <span className={`badge-pts ${req.type === 'warehouse' ? 'badge-warehouse-pts' : 'badge-dropship-pts'}`}>
                      {req.type}
                    </span>
                    <div className="user-name-pts">📁 {req.name}</div>
                  </div>
                  <div className="action-btns-pts">
                    <button className="btn-pts btn-copy-pts" onClick={() => copyDetails(req)}>📋 কপি</button>
                    <button className="btn-pts btn-action-pts" onClick={() => createAccount(req.id)}>✅ অ্যাকাউন্ট খুলুন</button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#777', padding: '10px', textAlign: 'left' }}>কোনো নতুন রিকোয়েস্ট নেই।</p>
            )}
          </div>

          <hr style={{ border: '0', borderTop: '2px dashed #ccc', margin: '30px 0' }} />

          <div className="section-title-pts">অ্যাকাউন্ট তৈরি সম্পন্ন হয়েছে (নিচে আলাদা থাকবে)</div>
          <div className="file-list completed-list-pts">
            {completedRequests.length > 0 ? (
              completedRequests.map((req) => (
                <div key={req.id} className="file-card">
                  <div className="file-info" onClick={() => viewDetails(req)}>
                    <span className={`badge-pts ${req.type === 'warehouse' ? 'badge-warehouse-pts' : 'badge-dropship-pts'}`}>
                      {req.type}
                    </span>
                    <div className="user-name-pts">📁 {req.name}</div>
                  </div>
                  <div className="action-btns-pts">
                    <button className="btn-pts btn-copy-pts" onClick={() => copyDetails(req)}>📋 কপি</button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#777', padding: '10px', textAlign: 'left' }}>এখনো কোনো অ্যাকাউন্ট তৈরি করা হয়নি।</p>
            )}
          </div>

          {/* Details Modal */}
          {showModal && selectedRequest && (
            <div className="modal-pts">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="modal-content-pts"
              >
                <span className="close-modal-pts" onClick={() => setShowModal(false)}>&times;</span>
                <h3 style={{ marginBottom: '20px', color: '#007bff', fontWeight: 'bold', fontSize: '20px' }}>রেজিস্ট্রেশন সম্পূর্ণ তথ্য</h3>
                <div className="modal-body-pts">
                  <div className="modal-data-item-pts"><strong>ক্যাটাগরি:</strong> {selectedRequest.type?.toUpperCase()}</div>
                  <div className="modal-data-item-pts"><strong>নাম:</strong> {selectedRequest.name}</div>
                  <div className="modal-data-item-pts"><strong>ইমেইল:</strong> {selectedRequest.email}</div>
                  <div className="modal-data-item-pts"><strong>মোবাইল নম্বর:</strong> {selectedRequest.phone || selectedRequest.whatsapp || 'N/A'}</div>
                  <div className="modal-data-item-pts"><strong>ID নম্বর:</strong> {selectedRequest.idNumber || 'N/A'}</div>
                  <div className="modal-data-item-pts"><strong>ব্যবহারকারী নাম:</strong> {selectedRequest.usernameVerify || selectedRequest.username || 'N/A'}</div>
                  <div className="modal-data-item-pts"><strong>ঠিকানা:</strong> {selectedRequest.city}, {selectedRequest.district}</div>
                  <div className="modal-data-item-pts"><strong>স্ট্যাটাস:</strong> {selectedRequest.status === 'pending' ? 'পেন্ডিং' : 'সম্পন্ন'}</div>
                  <div className="modal-data-item-pts"><strong>তারিখ:</strong> {selectedRequest.date || 'N/A'}</div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      );
    case 'dropshipping-create':
      return <DropshipStoreCreator setIsLoadingParent={setIsLoading} />;
    case 'dropshipping-store-demo':
      return <DropshipStoreDemoManager setIsLoadingParent={setIsLoading} t={t} />;
    case 'warehouse-create':
      return (
        <>
          <h4>৩. ওয়্যারহাউজ শপিং অ্যাকাউন্ট ক্রিয়েট</h4>
          <p>
            ওয়্যারহাউজ শপিং অ্যাকাউন্ট ক্রিয়েট প্যানেলটি লোড হচ্ছে।<br /><br />
            <strong>ফিচার:</strong> ইনভেন্টরি ম্যানেজমেন্ট + স্টক ট্র্যাকিং
          </p>
        </>
      );
    case 'editor-create':
      return (
        <>
          <h4>৪. এডিটর অ্যাকাউন্ট ক্রিয়েট</h4>
          <p>
            এডিটর অ্যাকাউন্ট ক্রিয়েট প্যানেল।<br /><br />
            এখানে এডিটররা নির্দিষ্ট কিছু এক্সেস পাবে।<br />
            <strong>স্ট্যাটাস:</strong> <span style={{ color: '#f39c12', fontWeight: 'bold' }}>Pending ⏳</span>
          </p>
        </>
      );
    case 'video-music':
      return <VideoMusicControlPanel setIsLoadingParent={setIsLoading} userRole={userRole} />;
    case 'account-access-codes':
      return <AccountAccessCodePanel setIsLoadingParent={setIsLoading} />;
    case 'admin-new-sections':
      return <AdminNewSectionsPanel t={t} setActiveAccessType={setActiveAccessType} />;
    default:
      return null;
  }
}

function AdminNewSectionsPanel({ t, setActiveAccessType }: { t?: any, setActiveAccessType?: (type: string) => void }) {
  const [eventMessage, setEventMessage] = useState(() => localStorage.getItem('pts_event_message') || 'ঈদ স্পেশাল ড্রপশিপিং অফার! মাত্র ১০,০০০ টাকায় নিজের শপ লাইভ করুন।');
  const [selectedTheme, setSelectedTheme] = useState(() => localStorage.getItem('pts_theme_color') || 'pink');
  const [gateways, setGateways] = useState(() => {
    return {
      bkash: localStorage.getItem('pts_gateway_bkash') !== 'disabled',
      nagad: localStorage.getItem('pts_gateway_nagad') !== 'disabled',
      rocket: localStorage.getItem('pts_gateway_rocket') === 'enabled'
    };
  });

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pts_event_message', eventMessage);
    alert('📢 ইভেন্ট মেসেজ সফলভাবে আপডেট করা হয়েছে!');
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    localStorage.setItem('pts_theme_color', theme);
    alert(`🎨 থিম কালার ${theme.toUpperCase()} এ সেট করা হয়েছে!`);
    window.location.reload();
  };

  const toggleGateway = (key: 'bkash' | 'nagad' | 'rocket') => {
    const updated = { ...gateways, [key]: !gateways[key] };
    setGateways(updated);
    localStorage.setItem(`pts_gateway_${key}`, updated[key] ? 'enabled' : 'disabled');
  };

  return (
    <div className="admin-sections-container text-left">
      {/* Card 1: Dropshipping Store Demo */}
      <div className="panel-card text-left">
        <div className="card-header">
          <h3>Dropshipping Store Demo</h3>
          <span className="status-badge bg-emerald-500 text-white font-bold px-3 py-1 text-xs rounded">Ready</span>
        </div>
        <div className="card-body">
          <p className="section-desc">ড্রপশিপিং স্টোর ডেমো ম্যানেজমেন্ট এবং কনফিগারেশন প্যানেল। এখানে কাস্টমার সেটিংস কন্ট্রোল করুন।</p>
          <div className="placeholder-area rounded-xl p-4 bg-slate-900 border border-slate-700 text-slate-300">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-xs font-mono text-left">🔍 ডেমো ক্রিয়েশন, ইউজার ইমেইল কাস্টমাইজেশন ও ফুল সাপোর্ট লিংক রেডি আছে।</span>
              <button 
                onClick={() => {
                  if (setActiveAccessType) setActiveAccessType('dropshipping-store-demo');
                }}
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
              >
                প্যানেলে প্রবেশ করুন &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Warehouse Store Demo */}
      <div className="panel-card text-left">
        <div className="card-header">
          <h3>Warehouse Store Demo</h3>
          <span className="status-badge bg-emerald-500 text-white font-bold px-3 py-1 text-xs rounded">Ready</span>
        </div>
        <div className="card-body">
          <p className="section-desc">ওয়্যারহাউজ স্টোর ডেমো ট্র্যাকিং এবং ইনভেন্টরি সেটিংস।</p>
          <div className="placeholder-area rounded-xl p-4 bg-slate-900 border border-slate-700 text-slate-300">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-xs font-mono text-left">📦 স্টক লোডার, ইম্পোর্ট-এক্সপোর্ট ড্যাশবোর্ড ও ইনভেন্টরি মনিটর রেডি আছে।</span>
              <button 
                onClick={() => {
                  if (setActiveAccessType) setActiveAccessType('warehouse-create');
                }}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
              >
                প্যানেলে প্রবেশ করুন &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Event Update */}
      <div className="panel-card text-left">
        <div className="card-header">
          <h3>Event Update</h3>
          <span className="status-badge bg-amber-500 text-white font-bold px-3 py-1 text-xs rounded">Active</span>
        </div>
        <div className="card-body">
          <p className="section-desc">স্টোরের লাইভ ইভেন্ট, প্রোমোশন এবং অফার আপডেট।</p>
          <div className="placeholder-area rounded-xl p-4 bg-slate-900 border border-slate-700 text-slate-300">
            <form onSubmit={handleSaveEvent} className="space-y-3">
              <label className="block text-xs font-bold text-slate-400">লাইভ প্রমোশন ব্যানার টেক্সট পরিবর্তন করুন:</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={eventMessage}
                  onChange={(e) => setEventMessage(e.target.value)}
                  className="bg-slate-800 text-white text-xs border border-slate-700 rounded-lg px-3 py-2 flex-grow outline-none focus:border-amber-500"
                  placeholder="বিজ্ঞাপন বার্তা লিখুন..."
                />
                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg transition">
                  আপডেট
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Card 4: Theme Update */}
      <div className="panel-card text-left">
        <div className="card-header">
          <h3>Theme Update</h3>
          <span className="status-badge bg-indigo-500 text-white font-bold px-3 py-1 text-xs rounded">System</span>
        </div>
        <div className="card-body">
          <p className="section-desc">ওয়েবসাইট ডিজাইন লেআউট এবং থিম কাস্টমাইজেশন কন্ট্রোল।</p>
          <div className="placeholder-area rounded-xl p-4 bg-slate-900 border border-slate-700 text-slate-300">
            <p className="text-xs mb-3 text-slate-400">পছন্দসই কালার সিলেক্ট করুন (এটি পুরো স্টোরের প্রধান বাটন বা বর্ডার হাইলাইটে প্রাধান্য পাবে):</p>
            <div className="flex gap-4 items-center">
              {[
                { name: 'pink', tw: 'bg-pink-600' },
                { name: 'emerald', tw: 'bg-emerald-600' },
                { name: 'blue', tw: 'bg-blue-600' },
                { name: 'amber', tw: 'bg-amber-600' },
                { name: 'purple', tw: 'bg-purple-600' }
              ].map(color => (
                <button 
                  key={color.name}
                  onClick={() => handleThemeChange(color.name)}
                  className={`color-btn w-8 h-8 rounded-full ${color.tw} border-2 transition-all transform hover:scale-110 ${selectedTheme === color.name ? 'border-white scale-110 ring-2 ring-indigo-500' : 'border-transparent'}`}
                  title={color.name.toUpperCase()}
                  type="button"
                />
              ))}
              <span className="text-xs font-bold text-indigo-400 ml-2 uppercase">Active: {selectedTheme}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 5: Payment Gateway System */}
      <div className="panel-card text-left">
        <div className="card-header">
          <h3>Payment Gateway System</h3>
          <span className="status-badge bg-blue-500 text-white font-bold px-3 py-1 text-xs rounded">Secure</span>
        </div>
        <div className="card-body">
          <p className="section-desc">পেমেন্ট মেথড গেটওয়ে সেটিংস এবং ট্রানজেকশন মনিটর।</p>
          <div className="placeholder-area rounded-xl p-4 bg-slate-900 border border-slate-700 text-slate-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-700">
                <span className="text-xs font-bold text-pink-500">bKash (বিকাশ)</span>
                <button 
                  onClick={() => toggleGateway('bkash')}
                  className={`text-[10px] font-black px-2.5 py-1.5 rounded uppercase transition-colors ${gateways.bkash ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'}`}
                >
                  {gateways.bkash ? 'Active' : 'Disabled'}
                </button>
              </div>
              <div className="flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-700">
                <span className="text-xs font-bold text-orange-500">Nagad (নগদ)</span>
                <button 
                  onClick={() => toggleGateway('nagad')}
                  className={`text-[10px] font-black px-2.5 py-1.5 rounded uppercase transition-colors ${gateways.nagad ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'}`}
                >
                  {gateways.nagad ? 'Active' : 'Disabled'}
                </button>
              </div>
              <div className="flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-700">
                <span className="text-xs font-bold text-indigo-400">Rocket (রকেট)</span>
                <button 
                  onClick={() => toggleGateway('rocket')}
                  className={`text-[10px] font-black px-2.5 py-1.5 rounded uppercase transition-colors ${gateways.rocket ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'}`}
                >
                  {gateways.rocket ? 'Active' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountAccessCodePanel({ setIsLoadingParent }: { setIsLoadingParent: (loading: boolean) => void }) {
  const [accountType, setAccountType] = useState('shop_register');
  const [accessCode, setAccessCode] = useState('');

  const submitAccessCode = async () => {
    if (!accessCode) return alert('কোড লিখুন!');
    setIsLoadingParent(true);
    try {
      const res = await fetch('/api/admin/generate-access-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_type: accountType, access_code: accessCode })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ অ্যাকসেস কোড সফলভাবে আলাদাভাবে সেভ হয়েছে!');
        setAccessCode('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingParent(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 text-left">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Key className="text-yellow-500" /> 🔑 নিউ অ্যাকাউন্ট অ্যাকসেস কোড
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-black text-gray-600 uppercase tracking-widest">অ্যাকাউন্টের ধরন সিলেক্ট করুন</label>
          <select 
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            <option value="shop_register">শপের অ্যাকাউন্ট রেজিস্টার ডিটেইলস</option>
            <option value="dropshipping">ড্রপশিপিং অ্যাকাউন্ট শপ ক্রিয়েট</option>
            <option value="warehouse">ওয়্যারহাউজ শপিং অ্যাকাউন্ট ক্রিয়েট</option>
            <option value="editor">এডিটর অ্যাকাউন্ট ক্রিয়েট</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-black text-gray-600 uppercase tracking-widest">সিক্রেট অ্যাকসেস কোড</label>
          <input 
            type="text" 
            placeholder="কোড লিখুন..." 
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
          />
        </div>
      </div>
      <button 
        onClick={submitAccessCode}
        className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center gap-2"
      >
        <ShieldCheck size={20} /> অ্যাকসেস কোড সেভ করুন
      </button>
    </div>
  );
}

function VideoMusicControlPanel({ setIsLoadingParent, userRole }: { setIsLoadingParent: (loading: boolean) => void, userRole: string }) {
  const [playMode, setPlayMode] = useState<'loop' | 'once'>('loop');
  const [videoLink, setVideoLink] = useState('');
  const [uploadedSongs, setUploadedSongs] = useState<any[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<any[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchUploadedSongs = async () => {
    try {
      const res = await fetch('/api/admin/music-list');
      const data = await res.json();
      if (data.success) {
        setUploadedSongs(data.musicFiles || []);
      }
    } catch (e) {
      console.error("Error fetching uploaded songs", e);
    }
  };

  const fetchUploadedVideos = async () => {
    try {
      const res = await fetch('/api/global/videos');
      const data = await res.json();
      setUploadedVideos(data || []);
    } catch (e) {
      console.error("Error fetching uploaded videos", e);
    }
  };

  useEffect(() => {
    fetchUploadedSongs();
    fetchUploadedVideos();
  }, []);

  const getFileName = (url: string) => {
    if (!url) return '';
    const parts = url.split('/');
    const rawName = parts[parts.length - 1];
    return rawName.replace(/^\d+-/, ''); // Strip unique numerical prefixes if any
  };

  const uploadMobileMusic = async () => {
    if (!fileInputRef.current?.files || fileInputRef.current.files.length === 0) {
      return alert('আপনার মোবাইল থেকে অন্তত একটি গান সিলেক্ট করুন!');
    }

    const formData = new FormData();
    formData.append('play_mode', playMode);
    for (let i = 0; i < fileInputRef.current.files.length; i++) {
        formData.append('music_files', fileInputRef.current.files[i]);
    }

    setIsLoadingParent(true);
    try {
      const res = await fetch('/api/admin/upload-local-music', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ ' + data.message);
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchUploadedSongs();
        window.dispatchEvent(new CustomEvent('reload-music-config'));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingParent(false);
    }
  };

  const deleteSong = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই গানটি ডিলিট করতে চান?")) return;
    setIsLoadingParent(true);
    try {
      const res = await fetch(`/api/admin/delete-music/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ গানটি সফলভাবে ডিলিট করা হয়েছে!");
        fetchUploadedSongs();
        window.dispatchEvent(new CustomEvent('reload-music-config'));
      } else {
        alert("ভুল: " + data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingParent(false);
    }
  };

  const uploadVideoLink = async () => {
    if (!videoLink) return alert('ভিডিও লিংক দিন!');
    setIsLoadingParent(true);
    try {
      const res = await fetch('/api/admin/upload-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: videoLink, channel_url: 'https://youtube.com' })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ ভিডিওটি সফলভাবে অ্যাড ও সরাসরি ওয়েবসাইটে লাইভ করা হয়েছে!');
        setVideoLink('');
        fetchUploadedVideos();
      } else {
        alert('ত্রুটি: ' + (data.message || 'Error'));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingParent(false);
    }
  };

  const deleteVideo = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ভিডিওটি ডিলিট করতে চান? এটি ওয়েবসাইট থেকে মুছে ফেলা হবে।")) return;
    setIsLoadingParent(true);
    try {
      const res = await fetch(`/api/admin/delete-video/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ ভিডিওটি সফলভাবে ডিলিট করা হয়েছে!");
        fetchUploadedVideos();
      } else {
        alert("ভুল: " + data.message);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingParent(false);
    }
  };

  const triggerGlobalMute = (mute: boolean) => {
    window.dispatchEvent(new CustomEvent('set-global-mute', { detail: { mute } }));
  };

  return (
    <div className="space-y-10 text-left">
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Music className="text-indigo-600" /> 🎵 ভিডিও ও মিউজিক কন্ট্রোল প্যানেল
        </h2>
        
        {userRole !== 'Editor' ? (
          <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 mb-8">
            <h3 className="text-sm font-black text-indigo-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Mic size={18} /> 📱 মোবাইল থেকে অডিও ফাইল আপলোড করুন (মাল্টিপল গান)
            </h3>
            <div className="space-y-6">
              <div className="relative group">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="audio/*" 
                  multiple 
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer transition-all"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center bg-white/55 p-4 rounded-xl">
                <label className="inline-flex items-center cursor-pointer group">
                  <input 
                    type="radio" 
                    name="play_mode" 
                    value="loop" 
                    checked={playMode === 'loop'} 
                    onChange={() => setPlayMode('loop')}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 transition-all" 
                  />
                  <span className="ml-3 text-sm font-bold text-gray-700 group-hover:text-indigo-600">বারবার লুপে চলবে (Loop)</span>
                </label>
                <label className="inline-flex items-center cursor-pointer group">
                  <input 
                    type="radio" 
                    name="play_mode" 
                    value="once" 
                    checked={playMode === 'once'} 
                    onChange={() => setPlayMode('once')}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 transition-all" 
                  />
                  <span className="ml-3 text-sm font-bold text-gray-700 group-hover:text-indigo-600">একবার চলে বন্ধ হবে (Play Once)</span>
                </label>
              </div>
              <button 
                onClick={uploadMobileMusic}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer active:scale-95"
              >
                <Disc size={20} /> মোবাইলের ফাইল আপলোড ও প্লে করুন
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-8 text-slate-500 font-medium text-xs">
            🔒 নিরাপত্তা পলিসি অনুযায়ী মিউজিক আপলোড কন্ট্রোল প্যানেল শুধুমাত্র প্রধান অ্যাডমিনের জন্য দৃশ্যমান।
          </div>
        )}

        {/* Dynamic List & Multi Player Controls */}
        <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Music size={17} className="text-indigo-600" /> 📂 আপনার আপলোডকৃত গানসমূহ ({uploadedSongs.length})
          </h3>
          
          {uploadedSongs.length === 0 ? (
            <div className="text-center py-7 text-gray-400 text-xs italic bg-white rounded-xl border border-gray-150">
              কোনো গান পাওয়া যায়নি। মোবাইল ফাইলে ক্লিক করে এখনই ডাবল বা মাল্টিপল গান আপলোড করুন প্রিয়।
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                <span className="text-[11px] text-indigo-950 font-black flex items-center gap-1.5 leading-none">
                  📣 কুইক গ্লোবাল সাউন্ড কন্ট্রোল:
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => triggerGlobalMute(false)} 
                    className="flex-1 sm:flex-none py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-1 min-h-[36px]"
                  >
                    🔊 গান প্লে করো (Play)
                  </button>
                  <button 
                    onClick={() => triggerGlobalMute(true)} 
                    className="flex-1 sm:flex-none py-1.5 px-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-1 min-h-[36px]"
                  >
                    🔇 গান বন্ধ করো (Stop)
                  </button>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
                {uploadedSongs.map((song, idx) => (
                  <div key={song.id || idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-xs hover:border-indigo-300 transition duration-300">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs font-black shrink-0 font-mono">
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-gray-800 truncate" title={getFileName(song.file_path_or_url)}>
                          {getFileName(song.file_path_or_url)}
                        </p>
                        <p className="text-[9px] font-mono text-gray-400 mt-0.5">
                          মোড: <span className="text-indigo-600 font-bold">{song.play_mode === 'loop' ? 'বারবার (Loop)' : 'একবার (Play Once)'}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end gap-2 shrink-0 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-gray-100 w-full sm:w-auto">
                      <button 
                        onClick={() => {
                          const updateAndPlay = async () => {
                            setIsLoadingParent(true);
                            try {
                              await fetch('/api/admin/upload-music', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ source_type: 'file', source_url: song.file_path_or_url, play_mode: song.play_mode })
                              });
                              window.dispatchEvent(new CustomEvent('reload-music-config'));
                              setTimeout(() => {
                                triggerGlobalMute(false);
                              }, 150);
                            } catch(e) { console.error(e); }
                            finally { setIsLoadingParent(false); }
                          };
                          updateAndPlay();
                        }}
                        className="flex-1 sm:flex-none font-bold text-[10px] py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-100 transition-all cursor-pointer active:scale-95"
                      >
                        ▶️ প্লে করুন
                      </button>
                      <button 
                        onClick={() => deleteSong(song.id)}
                        className="flex-1 sm:flex-none font-bold text-[10px] py-1.5 px-3 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-100 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1"
                      >
                        <Trash2 size={12} /> ডিলিট করুন
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-pink-50 rounded-2xl border border-pink-100">
          <h3 className="text-sm font-black text-pink-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Video size={18} /> 📺 ইউটিউব ভিডিও লিংক যুক্ত করুন
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="ইউটিউব ভিডিও ইউআরএল দিন" 
              className="flex-1 p-3.5 border border-pink-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-500 outline-none bg-white transition-all shadow-sm"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
            />
            <button 
              type="button"
              onClick={uploadVideoLink}
              className="bg-pink-600 text-white px-8 py-3.5 rounded-xl font-black hover:bg-pink-700 transition shadow-lg shadow-pink-100 uppercase tracking-wide whitespace-nowrap cursor-pointer active:scale-95"
            >
              ভিডিও লাইভ করুন
            </button>
          </div>

          {/* Secure Video Directory List folder for Admin Panel only */}
          <div className="mt-8 pt-6 border-t border-pink-200/50">
            <h4 className="text-xs font-black text-pink-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
              <Video size={15} /> 📂 আপনার লাইভকৃত ভিডিওসমূহ ({uploadedVideos.length})
            </h4>
            
            {uploadedVideos.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-xs italic bg-white rounded-xl border border-pink-100/50">
                কোনো ভিডিও লিংক পাওয়া যায়নি। উপরে লিংক দিয়ে ভিডিও লাইভ করুন।
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
                {uploadedVideos.map((video, idx) => (
                  <div key={video.id || idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border border-pink-100 rounded-xl shadow-xs hover:border-pink-300 transition duration-300">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-7 h-7 rounded-full bg-pink-50 text-pink-700 flex items-center justify-center text-xs font-black shrink-0 font-mono">
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-black text-gray-800 truncate" title={video.video_url}>
                          {video.video_url}
                        </p>
                        <p className="text-[9px] font-mono text-gray-400 mt-0.5">
                          চ্যানেল: <span className="text-pink-600 font-bold">{video.channel_url || 'https://youtube.com'}</span>
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => deleteVideo(video.id)}
                      className="w-full sm:w-auto font-black text-[10px] py-1.5 px-3 rounded-lg bg-pink-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-pink-150 hover:border-rose-600 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Trash2 size={12} /> ডিলিট করুন
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoMusicManager({ setIsLoadingParent }: { setIsLoadingParent: (loading: boolean) => void }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [channelUrl, setChannelUrl] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  
  const [musicType, setMusicType] = useState<'file' | 'link'>('file');
  const [musicUrl, setMusicUrl] = useState('');
  const [musicMode, setMusicMode] = useState<'loop' | 'once'>('loop');

  useEffect(() => {
    fetchVideos();
    fetchMusicConfig();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/global/videos');
      const data = await res.json();
      setVideos(data);
    } catch (e) { console.error(e); }
  };

  const fetchMusicConfig = async () => {
    try {
      const res = await fetch('/api/global/music');
      const data = await res.json();
      if (data) {
        setMusicType(data.source_type);
        setMusicUrl(data.source_url);
        setMusicMode(data.play_mode);
      }
    } catch (e) { console.error(e); }
  };

  const handleVideoSubmit = async () => {
    if (!videoUrl || !channelUrl) return alert("সবগুলো ঘর পূরণ করুন");
    setIsLoadingParent(true);
    try {
      const res = await fetch('/api/admin/upload-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: videoUrl, channel_url: channelUrl })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ ভিডিও লাইভ হয়েছে!');
        setVideoUrl('');
        setChannelUrl('');
        fetchVideos();
      }
    } catch (e) { console.error(e); }
    finally { setIsLoadingParent(false); }
  };

  const deleteVideo = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ভিডিওটি ডিলিট করতে চান?")) return;
    setIsLoadingParent(true);
    try {
      const res = await fetch(`/api/admin/delete-video/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchVideos();
    } catch (e) { console.error(e); }
    finally { setIsLoadingParent(false); }
  };

  const handleMusicSubmit = async () => {
    if (!musicUrl) return alert("মিউজিক লিংক বা ফাইল দিন");
    setIsLoadingParent(true);
    try {
      const res = await fetch('/api/admin/upload-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_type: musicType, source_url: musicUrl, play_mode: musicMode })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ সারা ওয়েবসাইটের জন্য মিউজিক সেটআপ সম্পন্ন!');
        window.dispatchEvent(new CustomEvent('reload-music-config'));
      }
    } catch (e) { console.error(e); }
    finally { setIsLoadingParent(false); }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Video Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Video className="text-pink-600" /> ভিডিও আপলোড ও ডিলিট প্যানেল
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input 
            type="text" 
            placeholder="ইউটিউব ভিডিও লিংক" 
            className="p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-500 outline-none"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="ইউটিউব চ্যানেল লিংক" 
            className="p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-500 outline-none"
            value={channelUrl}
            onChange={(e) => setChannelUrl(e.target.value)}
          />
        </div>
        <button 
          onClick={handleVideoSubmit}
          className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-pink-700 transition mb-6 shadow-md shadow-pink-100"
        >
          ভিডিও পাবলিশ করুন
        </button>
        
        <h3 className="text-sm font-black text-gray-700 mb-3 uppercase tracking-wider">বর্তমান লাইভ ভিডিওসমূহ:</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {videos.length === 0 ? (
            <p className="text-gray-400 text-sm italic">কোনো ভিডিও পাওয়া যায়নি।</p>
          ) : (
            videos.map(v => (
              <div key={v.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-600 truncate max-w-[70%] font-medium">{v.video_url}</span>
                <button 
                  onClick={() => deleteVideo(v.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-black flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={14} /> DELETE
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Music Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Music className="text-indigo-600" /> গ্লোবাল মিউজিক কন্ট্রোল প্যানেল
        </h2>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">মিউজিক সোর্স টাইপ</label>
            <select 
              value={musicType}
              onChange={(e) => setMusicType(e.target.value as any)}
              className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="file">অডিও ফাইল ইউআরএল (MP3/Direct Link)</option>
              <option value="link">ইউটিউব মিউজিক/ভিডিও লিংক</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">লিংক বা ফাইল পাথ</label>
            <input 
              type="text" 
              placeholder="https://.../music.mp3 অথবা ইউটিউব লিংক" 
              className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={musicUrl}
              onChange={(e) => setMusicUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">প্লেব্যাক মোড (Play Mode)</label>
            <select 
              value={musicMode}
              onChange={(e) => setMusicMode(e.target.value as any)}
              className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="loop">একই গান বারবার চলবে (Looping)</option>
              <option value="once">একবার চলে বন্ধ হয়ে যাবে (Play Once)</option>
            </select>
          </div>
          <button 
            onClick={handleMusicSubmit}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
          >
            <Volume2 size={20} /> ব্যাকগ্রাউন্ড মিউজিক সেট করুন
          </button>
        </div>
      </div>
    </div>
  );
}

function DropshipStoreCreator({ setIsLoadingParent }: { setIsLoadingParent: (loading: boolean) => void }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('BD');
  const [usernameStatus, setUsernameStatus] = useState({ text: '', color: '' });

  const validateUsername = (val: string) => {
    if (val === '') {
      setUsernameStatus({ text: '', color: '' });
      return;
    }

    if (val.includes(' ')) {
      setUsernameStatus({ text: '❌ ইউজারনেমে স্পেস দেওয়া যাবে না!', color: 'text-red-500' });
    } else if (val.length < 4) {
      setUsernameStatus({ text: '❌ ন্যূনতম ৪ অক্ষর লাগবে!', color: 'text-yellow-500' });
    } else {
      setUsernameStatus({ text: '✅ ইউজারনেম উপলব্ধ!', color: 'text-green-500' });
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.readText !== 'function') {
        throw new Error();
      }
      const text = await navigator.clipboard.readText();
      if (!text) {
        alert("ক্লিপবোর্ডে কোনো লেখা পাওয়া যায়নি। প্রথমে 'শপের অ্যাকাউন্ট রেজিস্টার ডিটেইলস' থেকে 'কপি' বাটনে ক্লিক করে কপি করে নিন।");
        return;
      }
      applyParsedData(text);
    } catch {
      const text = prompt("ক্লিপবোর্ড রিড করার অনুমতি পাওয়া যায়নি। দয়া করে নিচে কপি করা ডিটেইলস পেস্ট (Ctrl+V) করুন:");
      if (text) {
        applyParsedData(text);
      }
    }
  };

  const applyParsedData = (text: string) => {
    const lines = text.split('\n');
    let hasParsedAny = false;
    
    lines.forEach(line => {
      const colIdx = line.indexOf(':');
      if (colIdx !== -1) {
        const key = line.substring(0, colIdx).trim().toLowerCase();
        const val = line.substring(colIdx + 1).trim();
        if (!val) return;
        
        hasParsedAny = true;
        if (key === 'ক্যাটাগরি' || key === 'category') {
          // Ignore
        } else if (key === 'নাম' || key === 'name') {
          setName(val);
        } else if (key === 'ইমেইল' || key === 'email') {
          setEmail(val);
        } else if (key === 'ফোন' || key === 'phone' || key === 'whatsapp' || key === 'মোবাইল') {
          setWhatsapp(val);
        } else if (key === 'id' || key === 'id নম্বর') {
          setIdNumber(val);
        } else if (key === 'ব্যবহারকারী নাম' || key === 'username') {
          setUsername(val);
          validateUsername(val);
        } else if (key === 'ঠিকানা' || key === 'address') {
          const parts = val.split(',');
          if (parts.length >= 2) {
            setCity(parts[0].trim());
            setDistrict(parts[1].trim());
          } else {
            setCity(val);
          }
        } else if (key === 'দেশ' || key === 'country') {
          setCountry(val === 'Bangladesh' || val === 'BD' || val === 'BGD' ? 'BD' : val);
        }
      }
    });
    
    if (hasParsedAny) {
      alert("✅ ক্লিপবোর্ড থেকে চমৎকারভাবে ডেটা পেস্ট করা হয়েছে!");
    } else {
      alert("⚠️ ফরম্যাটটি সঠিক নয়! দয়া করে কপি বাটনে ক্লিক করে পাওয়া টেক্সট পেস্ট করুন।");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !name) {
      alert("ইউজারনেম, ইমেইল, পাসওয়ার্ড এবং পুরো নাম ঘরগুলো পূরণ করুন!");
      return;
    }
    
    setIsLoadingParent(true);
    try {
      const response = await fetch('/api/admin/activate-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          email, 
          password, 
          display_name: name,
          idNumber,
          whatsapp,
          district,
          city,
          country
        })
      });
      const data = await response.json();
      if (data.success) {
        alert(`✅ সফল হয়েছে!\n@${username} ইউজারনেমে নতুন স্টোরটি এক্টিভ করা হয়েছে।`);
        setUsername('');
        setEmail('');
        setPassword('');
        setName('');
        setIdNumber('');
        setWhatsapp('');
        setDistrict('');
        setCity('');
        setCountry('BD');
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      alert('❌ Server connection failed.');
    } finally {
      setIsLoadingParent(false);
    }
  };

  return (
    <div id="dropshipping-demo-section" className="panel-section-container text-left space-y-8 bg-[#f4f6f9] p-6 rounded-3xl" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      
      <div className="section-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            📦 Dropshipping Account Shop Creator
          </h2>
          <p className="text-slate-500 text-xs mt-1">এখানে কাস্টমারের কপি করা ডিটেইলস পেস্ট করে বা ম্যানুয়ালি ফর্ম পূরণ করে ড্রপশিপার অ্যাকাউন্ট তৈরি করুন ও স্টোর অ্যাক্টিভ করুন।</p>
        </div>

        <button 
          type="button"
          onClick={handlePasteFromClipboard}
          className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Clipboard size={14} /> Paste Client Details
        </button>
      </div>

      <div className="form-card bg-white p-6 rounded-2xl shadow-md border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-3 mb-6 flex items-center gap-2">
          🛠️ স্টোর অ্যাকাউন্ট ক্রিয়েশন ফর্ম (Store Account Creation Form)
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="form-group">
              <label className="block text-xs font-black text-slate-500 mb-2 uppercase">ইউজারনেম (Username):</label>
              <input 
                type="text" 
                placeholder="Ex: plabon99" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold focus:border-pink-500 focus:bg-white transition-all text-slate-800"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  validateUsername(e.target.value);
                }}
                required 
              />
              {usernameStatus.text && (
                <p className={`text-xs font-bold mt-1.5 ${usernameStatus.color}`}>{usernameStatus.text}</p>
              )}
            </div>

            <div className="form-group">
              <label className="block text-xs font-black text-slate-500 mb-2 uppercase">কাস্টমার ইমেইল (User Email):</label>
              <input 
                type="email" 
                placeholder="customer@email.com" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold focus:border-pink-500 focus:bg-white transition-all text-slate-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label className="block text-xs font-black text-slate-500 mb-2 uppercase">পাসওয়ার্ড (Password):</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold focus:border-pink-500 focus:bg-white transition-all text-slate-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label className="block text-xs font-black text-slate-500 mb-2 uppercase">পুরো নাম (Full Name):</label>
              <input 
                type="text" 
                placeholder="Ex: S.M. Plabon" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold focus:border-pink-500 focus:bg-white transition-all text-slate-800"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label className="block text-xs font-black text-slate-500 mb-2 uppercase">এনআইডি / আইডি নম্বর (ID Number):</label>
              <input 
                type="text" 
                placeholder="NID / ID Number" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold focus:border-pink-500 focus:bg-white transition-all text-slate-800"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="block text-xs font-black text-slate-500 mb-2 uppercase">হোয়াটসঅ্যাপ নম্বর (WhatsApp Call/Chat):</label>
              <input 
                type="text" 
                placeholder="Ex: +8801700000000" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold focus:border-pink-500 focus:bg-white transition-all text-slate-800"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="block text-xs font-black text-slate-500 mb-2 uppercase">জেলা (District):</label>
              <input 
                type="text" 
                placeholder="Ex: Dhaka" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold focus:border-pink-500 focus:bg-white transition-all text-slate-800"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="block text-xs font-black text-slate-500 mb-2 uppercase">শহর / গ্রাম (City / Area):</label>
              <input 
                type="text" 
                placeholder="Ex: Mirpur" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold focus:border-pink-500 focus:bg-white transition-all text-slate-800"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="block text-xs font-black text-slate-500 mb-2 uppercase">দেশ (Country):</label>
              <select 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold focus:border-pink-500 focus:bg-white bg-white transition-all text-slate-800"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="BD">Bangladesh</option>
                <option value="IN">India</option>
                <option value="PK">Pakistan</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>

          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/10 cursor-pointer text-center flex items-center justify-center gap-2"
          >
            <Store size={18} /> নতুন স্টোর অ্যাকাউন্ট তৈরি ও সক্রিয় করুন
          </button>
        </form>
      </div>

    </div>
  );
}

function DropshipStoreDemoManager({ setIsLoadingParent, t }: { setIsLoadingParent: (loading: boolean) => void; t?: any }) {
  const [activeSubTab, setActiveSubTab] = useState<'stores' | 'dashboard' | 'preview'>('stores');
  const [selectedStore, setSelectedStore] = useState<any>(() => {
    return { id: 'temp', storeName: 'এমডি আরিয়ান', customerEmail: 'ariyan_dropship@gmail.com', problemNote: 'স্বাগতম! এটি আমার ড্রপশিপিং স্টোরের বায়ো সেকশন। এখানে ওয়েবসাইট সংক্রান্ত তথ্য বা সংক্ষিপ্ত বিবরণ প্রদর্শন করা হবে।' };
  });
  const [stores, setStores] = useState<any[]>(() => {
    const saved = localStorage.getItem('dropship_stores');
    return saved ? JSON.parse(saved) : [
      { id: '1', storeName: 'Demo Store 1', customerEmail: 'user1@gmail.com', storeTheme: 'default', storeStatus: 'demo', supportLink: 'https://wa.me/8801700000000', problemNote: 'First demo setup for client' },
      { id: '2', storeName: 'Super Dropship Tech', customerEmail: 'plabon@example.com', storeTheme: 'modern', storeStatus: 'live', supportLink: 'https://wa.me/8801811223344', problemNote: 'Active high-value VIP account' }
    ];
  });

  const [storeName, setStoreName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [storeTheme, setStoreTheme] = useState('default');
  const [storeStatus, setStoreStatus] = useState('demo');
  const [supportLink, setSupportLink] = useState('');
  const [problemNote, setProblemNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // AI Live Mode states (Lifted up to manage globally)
  const [isAiLiveActive, setIsAiLiveActive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [aiCodeLog, setAiCodeLog] = useState(`// এআই আপনার ভয়েস কমান্ড শুনছে...\n// কাস্টম ক্যাটাগরি বার এড করার নির্দেশ চেক করা হচ্ছে।`);
  const [showAiCategories, setShowAiCategories] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');

  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const triggerGlobalToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Real-time microphone listening & voice commands
  useEffect(() => {
    if (!isAiLiveActive || isMicMuted) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'bn-BD';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      if (text) {
        setSpeechTranscript(text);
        setAiCodeLog(`[ইউজার ভয়েস]: "${text}"\n\n// ভয়েস প্রসেস করা হচ্ছে...`);
        const cleanText = text.toLowerCase();
        
        if (cleanText.includes('ক্যাটাগরি') || cleanText.includes('category') || cleanText.includes('মেনু') || cleanText.includes('বাটন')) {
          setTimeout(() => {
            setAiCodeLog(`[AI Voice Detected]: "ইউজার ক্যাটাগরি মেনু যুক্ত করার নির্দেশ দিয়েছেন।"\n\n[সংশোধন]: <div id="ai-generated-categories"> মডিউল যুক্ত করা হলো।\n\n[লাইভ স্ট্যাটাস]: কোড সফলভাবে লাইভ সাইটে পুশ করা হয়েছে!`);
            setShowAiCategories(true);
            triggerGlobalToast('এআই দ্বারা সংশোধিত লেআউট সচল করা হয়েছে!');
          }, 1500);
        } else if (cleanText.includes('নাম') || cleanText.includes('প্রোফাইল') || cleanText.includes('নাম পরিবর্তন')) {
          setTimeout(() => {
            setAiCodeLog(`[AI Voice Detected]: "ইউজার প্রোফাইল নাম আপডেট করতে বলেছেন।"\n\n[সংশোধন]: storeName পরিবর্তন করে "এমডি আরিয়ান - কাস্টম এআই শপ" করা হলো।\n\n[লাইভ স্ট্যাটাস]: আপডেট সফল!`);
            window.dispatchEvent(new CustomEvent('ai-rename-store', { detail: 'এমডি আরিয়ান - কাস্টম এআই শপ' }));
            triggerGlobalToast('স্টোর প্রোফাইলের নাম পরিবর্তিত করা হয়েছে!');
          }, 1500);
        } else if (cleanText.includes('দাম') || cleanText.includes('কমাও')) {
          setTimeout(() => {
            setAiCodeLog(`[AI Voice Detected]: "ইউজার সব প্রোডাক্টের দাম ৫০০ টাকা কমানোর নির্দেশনা দিয়েছেন।"\n\n[সংশোধন]: products.map(p => p.price - 500)\n\n[লাইভ স্ট্যাটাস]: প্রোডাক্ট গ্যালারি আপডেট করা হয়েছে!`);
            window.dispatchEvent(new CustomEvent('ai-price-down'));
            triggerGlobalToast('সব প্রোডাক্টের দাম ৫০০ টাকা কমানো হয়েছে!');
          }, 1500);
        } else if (cleanText.includes('টেক') || cleanText.includes('বায়ো')) {
          setTimeout(() => {
             setAiCodeLog(`[AI Voice Detected]: "ইউজার বায়ো সেকশনে নতুন ট্যাগ লাইন যুক্ত করতে বলেছেন।"\n\n[সংশোধন]: bio আপডেট করা হলো।\n\n[লাইভ স্ট্যাটাস]: বায়ো সেকশন সফলভাবে সফল করা হয়েছে!`);
             window.dispatchEvent(new CustomEvent('ai-change-bio', { detail: 'স্বাগতম! এআই ইন্টিগ্রেটেড ড্রপশিপিং স্টোরে আপনাকে স্বাগতম। আমরা দিচ্ছি ১০০% কোয়ালিটি নিশ্চয়তা।' }));
             triggerGlobalToast('নতুন বায়ো কন্টেন্ট যুক্ত করা হয়েছে!');
          }, 1500);
        }
      }
    };

    recognition.onerror = (e: any) => {
      console.warn("Speech recognition error:", e);
    };

    recognition.onend = () => {
      if (isAiLiveActive && !isMicMuted) {
        try { recognition.start(); } catch (err) {}
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.warn(e);
    }

    return () => {
      recognition.stop();
    };
  }, [isAiLiveActive, isMicMuted]);

  // Real-time camera user media streaming
  useEffect(() => {
    if (isAiLiveActive && !isCamOff) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          setCameraStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.warn("Camera access failed or blocked:", err);
        });
    } else {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
    }
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isAiLiveActive, isCamOff]);

  // Prevent SpeechRecognition collisions by muting the other when one is active
  useEffect(() => {
    const handleVoiceToggleExternal = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail === true) {
        setIsAiLiveActive(false); // Turn off Speech-to-Code helper when Conversational Maira mode starts
      }
    };
    window.addEventListener('global-avatar-voice-toggle', handleVoiceToggleExternal);
    return () => {
      window.removeEventListener('global-avatar-voice-toggle', handleVoiceToggleExternal);
    };
  }, []);

  useEffect(() => {
    if (isAiLiveActive) {
      // If user enables Speech-to-Code, turn off conversational avatar voice chat immediately to hand over mic focus safely
      window.dispatchEvent(new CustomEvent('global-avatar-voice-toggle', { detail: false }));
    }
  }, [isAiLiveActive]);

  const handleSimulateCommand = (voiceStr: string) => {
    setAiCodeLog(`// এআই আপনার ভয়েস সংকেত গ্রহণ করছে...\n🗣️ ইউজার বলছেন: "${voiceStr}"`);
    
    setTimeout(() => {
      setAiCodeLog(`[ইউজার ভয়েস সনাক্তকৃত]: "${voiceStr}"\n\n// ভয়েস প্রসেস করা হচ্ছে...`);
    }, 1200);

    setTimeout(() => {
      if (voiceStr.includes('ক্যাটাগরি') || voiceStr.includes('ক্যাটাগরি বার এড করো')) {
        setAiCodeLog(`[AI Voice Detected]: "ইউজার সার্চ বারের নিচে ক্যাটাগরি মেনু যুক্ত করার নির্দেশনা দিয়েছেন।"\n\n[সংশোধন]: <div id="ai-generated-categories"> মডিউল যুক্ত করা হলো।\n\n[লাইভ স্ট্যাটাস]: কোড সফলভাবে লাইভ সাইটে পুশ করা হয়েছে!`);
        setShowAiCategories(true);
        triggerGlobalToast('এআই দ্বারা সংশোধিত লেআউট সচল করা হয়েছে!');
      } else if (voiceStr.includes('প্রোফাইল নাম') || voiceStr.includes('পরিবর্তন')) {
        setAiCodeLog(`[AI Voice Detected]: "ইউজার প্রোফাইলের নাম কাস্টমাইজ করার নির্দেশনা দিয়েছেন।"\n\n[সংশোধন]: storeName পরিবর্তন করে "এমডি আরিয়ান - কাস্টম এআই শপ" করা হলো।\n\n[লাইভ স্ট্যাটাস]: আপডেট সফল!`);
        window.dispatchEvent(new CustomEvent('ai-rename-store', { detail: 'এমডি আরিয়ান - কাস্টম এআই শপ' }));
        triggerGlobalToast('স্টোর প্রোফাইলের নাম পরিবর্তিত করা হয়েছে!');
      } else if (voiceStr.includes('দাম') || voiceStr.includes('কমাও')) {
        setAiCodeLog(`[AI Voice Detected]: "ইউজার সব প্রোডাক্টের দাম ৫০০ টাকা কমানোর নির্দেশনা দিয়েছেন।"\n\n[সংশোধন]: products.map(p => p.price - 500)\n\n[লাইভ স্ট্যাটাস]: প্রোডাক্ট গ্যালারি আপডেট করা হয়েছে!`);
        window.dispatchEvent(new CustomEvent('ai-price-down'));
        triggerGlobalToast('সব প্রোডাক্টের দাম ৫০০ টাকা কমানো হয়েছে!');
      } else if (voiceStr.includes('নতুন টেক')) {
        setAiCodeLog(`[AI Voice Detected]: "ইউজার বায়ো সেকশনে নতুন ট্যাগ লাইন যুক্ত করতে বলেছেন।"\n\n[সংশোধন]: bio আপডেট করা হলো।\n\n[লাইভ স্ট্যাটাস]: বায়ো সেকশন সফলভাবে সফল করা হয়েছে!`);
        window.dispatchEvent(new CustomEvent('ai-change-bio', { detail: 'স্বাগতম! এআই ইন্টিগ্রেটেড ড্রপশিপিং স্টোরে আপনাকে স্বাগতম। আমরা দিচ্ছি ১০০% কোয়ালিটি নিশ্চয়তা।' }));
        triggerGlobalToast('নতুন বায়ো কন্টেন্ট যুক্ত করা হয়েছে!');
      }
    }, 3005);
  };

  const saveStoresToStorage = (updatedList: any[]) => {
    setStores(updatedList);
    localStorage.setItem('dropship_stores', JSON.stringify(updatedList));
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.readText !== 'function') {
        throw new Error();
      }
      const text = await navigator.clipboard.readText();
      if (!text) {
        alert("ক্লিপবোর্ডে কোনো লেখা পাওয়া যায়নি। প্রথমে 'শপের অ্যাকাউন্ট রেজিস্টার ডিটেইলস' থেকে 'কপি' বাটনে ক্লিক করে কপি করে নিন।");
        return;
      }
      applyParsedData(text);
    } catch {
      const text = prompt("ক্লিপবোর্ড রিড করার অনুমতি পাওয়া যায়নি। দয়া করে নিচে কপি করা ডিটেইলস পেস্ট (Ctrl+V) করুন:");
      if (text) {
        applyParsedData(text);
      }
    }
  };

  const applyParsedData = (text: string) => {
    const lines = text.split('\n');
    let hasParsedAny = false;
    
    lines.forEach(line => {
      const colIdx = line.indexOf(':');
      if (colIdx !== -1) {
        const key = line.substring(0, colIdx).trim().toLowerCase();
        const val = line.substring(colIdx + 1).trim();
        if (!val) return;
        
        hasParsedAny = true;
        if (key === 'নাম' || key === 'name' || key === 'ব্যবহারকারী নাম' || key === 'username') {
          setStoreName(prev => prev || val + " Store");
        } else if (key === 'ইমেইল' || key === 'email') {
          setCustomerEmail(val);
        } else if (key === 'ফোন' || key === 'phone' || key === 'whatsapp' || key === 'মোবাইল') {
          setSupportLink('https://wa.me/' + val.replace(/\+/g, '').replace(/[^0-9]/g, ''));
        }
      }
    });
    
    if (hasParsedAny) {
      alert("✅ ক্লিপবোর্ড থেকে চমৎকারভাবে ডেটা পেস্ট করা হয়েছে!");
    } else {
      alert("⚠️ ফরম্যাটটি সঠিক নয়! দয়া করে কপি করা টেক্সট পেস্ট করুন।");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !customerEmail) {
      alert("স্টোরের নাম এবং কাস্টমার ইমেইল অবশ্যই পূরণ করতে হবে!");
      return;
    }

    setIsLoadingParent(true);
    setTimeout(() => {
      if (editingId) {
        // Edit existing store
        const updated = stores.map(s => s.id === editingId ? {
          ...s,
          storeName,
          customerEmail,
          storeTheme,
          storeStatus,
          supportLink,
          problemNote
        } : s);
        saveStoresToStorage(updated);
        setEditingId(null);
        alert("✅ ডেমো স্টোর সফলভাবে এডিট ও আপডেট করা হয়েছে!");
      } else {
        // Create new store
        const newStore = {
          id: Date.now().toString(),
          storeName,
          customerEmail,
          storeTheme,
          storeStatus,
          supportLink,
          problemNote
        };
        saveStoresToStorage([newStore, ...stores]);
        alert("✅ নতুন ড্রপশিপিং ডেমো স্টোর সফলভাবে তৈরি ও আপডেট হয়েছে!");
      }

      // Reset form fields
      setStoreName('');
      setCustomerEmail('');
      setStoreTheme('default');
      setStoreStatus('demo');
      setSupportLink('');
      setProblemNote('');
      setIsLoadingParent(false);
    }, 800);
  };

  const handleEdit = (store: any) => {
    setEditingId(store.id);
    setStoreName(store.storeName);
    setCustomerEmail(store.customerEmail);
    setStoreTheme(store.storeTheme || 'default');
    setStoreStatus(store.storeStatus || 'demo');
    setSupportLink(store.supportLink || '');
    setProblemNote(store.problemNote || '');
    // Scroll smoothly to form setup
    document.getElementById('storeCustomizerForm')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিতভাবে এই ডেমো স্টোরটি মুছে ফেলতে চান?")) {
      const filtered = stores.filter(s => s.id !== id);
      saveStoresToStorage(filtered);
      alert("🗑️ ডেমো স্টোর সফলভাবে তালিকা থেকে ডিলিট করা হয়েছে।");
    }
  };

  return (
    <div id="dropshipping-store-demo-section" className="panel-section-container text-left space-y-8 bg-[#f4f6f9] p-6 rounded-3xl" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      
      {/* Tab Controls to switch between setup, dashboard & live-preview */}
      <div className="flex bg-slate-200 p-1 rounded-xl w-fit gap-1 mb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('stores')}
          className={`px-4 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${activeSubTab === 'stores' ? 'bg-white text-slate-800 shadow-sm font-extrabold' : 'text-slate-600 hover:bg-slate-350/50'}`}
        >
          🛠️ ডেমো স্টোর সেটআপ ও তালিকা (Store Setup)
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('dashboard')}
          className={`px-4 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${activeSubTab === 'dashboard' ? 'bg-pink-600 text-white shadow-sm font-extrabold' : 'text-slate-600 hover:bg-slate-350/50'}`}
        >
          📊 কাস্টমার ড্যাশবোর্ড ও শপ কন্ট্রোল (Shop Dashboard)
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('preview')}
          className={`px-4 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${activeSubTab === 'preview' ? 'bg-indigo-600 text-white shadow-sm font-extrabold' : 'text-slate-600 hover:bg-slate-350/50'}`}
        >
          🛍️ শপ ইন্টারফেস লাইভ প্রিভিউ (Store Interface)
        </button>
      </div>

      {activeSubTab === 'dashboard' ? (
        <div className="bg-white p-2 rounded-2xl shadow-md border border-slate-100">
          <EcommerceDashboard onBack={() => setActiveSubTab('stores')} t={t || translations['bn']} />
        </div>
      ) : activeSubTab === 'preview' ? (
        <div className="bg-white p-2 rounded-2xl shadow-md border border-slate-100">
          <DropshipStoreInterface 
            store={selectedStore} 
            onBack={() => setActiveSubTab('stores')} 
            isAiLiveActive={isAiLiveActive}
            setIsAiLiveActive={setIsAiLiveActive}
            showAiCategories={showAiCategories}
            setShowAiCategories={setShowAiCategories}
          />
        </div>
      ) : (
        <>
          <div className="section-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div>
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                📦 Dropshipping Store Demo Management 
              </h2>
              <p className="text-slate-500 text-xs mt-1">এখানে কাস্টমারদের জন্য নতুন ডেমো স্টোর তৈরি, কাস্টমাইজেশন এবং সাপোর্ট ম্যানেজ করুন।</p>
            </div>

            <button 
              type="button"
              onClick={handlePasteFromClipboard}
              className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Clipboard size={14} /> Paste Client Details
            </button>
          </div>

          {/* Form Card */}
          <div className="form-card bg-white p-6 rounded-2xl shadow-md border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-3 mb-6 flex items-center gap-2">
              🛠️ {editingId ? 'স্টোর কাস্টমাইজেশন এডিট করুন' : 'কাস্টমার স্টোর তৈরি ও কাস্টমাইজ করুন'}
            </h3>
            
            <form id="storeCustomizerForm" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="storeName" className="block text-xs font-black text-slate-500 mb-2 uppercase">স্টোরের নাম (Store Name):</label>
                  <input 
                    type="text" 
                    id="storeName" 
                    placeholder="উদা: My Dropship Store" 
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold focus:border-pink-500 focus:bg-white transition-all text-slate-800"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customerEmail" className="block text-xs font-black text-slate-500 mb-2 uppercase">কাস্টমারের ইমেইল (Customer Email):</label>
                  <input 
                    type="email" 
                    id="customerEmail" 
                    placeholder="customer@email.com" 
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold focus:border-pink-500 focus:bg-white transition-all text-slate-800"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="storeTheme" className="block text-xs font-black text-slate-500 mb-2 uppercase">স্টোর থিম/ডিজাইন নির্বাচন করুন:</label>
                  <select 
                    id="storeTheme" 
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold focus:border-pink-500 focus:bg-white transition-all text-slate-800 bg-white"
                    value={storeTheme}
                    onChange={(e) => setStoreTheme(e.target.value)}
                  >
                    <option value="default">Default E-commerce Theme</option>
                    <option value="modern">Modern Dark Theme</option>
                    <option value="minimal">Minimalist Clean Theme</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="storeStatus" className="block text-xs font-black text-slate-500 mb-2 uppercase">স্টোর স্ট্যাটাস:</label>
                  <select 
                    id="storeStatus" 
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold focus:border-pink-500 focus:bg-white transition-all text-slate-800 bg-white"
                    value={storeStatus}
                    onChange={(e) => setStoreStatus(e.target.value)}
                  >
                    <option value="demo">Demo Mode (ডেমো)</option>
                    <option value="live">Live/Active</option>
                  </select>
                </div>
              </div>

              {/* Nested Support Section */}
              <div className="nested-section bg-slate-50 p-5 border-l-4 border-pink-500 rounded-xl space-y-4">
                <h4 className="text-sm font-black text-pink-700 flex items-center gap-1.5">
                  🎯 সাপোর্ট ও প্রবলেম কন্ট্রোল (Support & Problem Setup)
                </h4>
                
                <div className="form-group">
                  <label htmlFor="supportLink" className="block text-xs font-bold text-slate-600 mb-2">হেল্পডেস্ক / সাপোর্ট লিংক (Support WhatsApp/Telegram):</label>
                  <input 
                    type="url" 
                    id="supportLink" 
                    placeholder="https://wa.me/yourlink" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none text-xs font-semibold focus:border-pink-500 transition-all text-slate-800"
                    value={supportLink}
                    onChange={(e) => setSupportLink(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="problemNote" className="block text-xs font-bold text-slate-600 mb-2">কোনো সমস্যা বা বিশেষ নোট (Problem/Admin Note):</label>
                  <textarea 
                    id="problemNote" 
                    rows={3} 
                    placeholder="কাস্টমারের কোনো প্রবলেম থাকলে বা বিশেষ কোনো নির্দেশনাবলী থাকলে এখানে লিখুন..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none text-xs font-semibold focus:border-pink-500 transition-all text-slate-800"
                    value={problemNote}
                    onChange={(e) => setProblemNote(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-submit-store w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/10 cursor-pointer text-center"
              >
                {editingId ? 'এডিট করা তথ্য সেভ করুন' : 'স্টোর তৈরি ও কাস্টমারকে পাঠান'}
              </button>
            </form>
          </div>

          {/* Table Card */}
          <div className="table-card bg-white p-6 rounded-2xl shadow-md border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-3 mb-6">
              📋 তৈরি করা ডেমো স্টোরসমূহের তালিকা ({stores.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="store-list-table w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-extrabold border-b">
                    <th className="p-4 rounded-tl-xl">স্টোরের নাম</th>
                    <th className="p-4">কাস্টমার ইমেইল</th>
                    <th className="p-4">থিম / ডিজাইন</th>
                    <th className="p-4 text-center">স্ট্যাটাস</th>
                    <th className="p-4">সাপোর্ট লিংক</th>
                    <th className="p-4 rounded-tr-xl text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-semibold text-slate-700">
                  {stores.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-extrabold text-sm text-slate-800">{s.storeName}</td>
                      <td className="p-4 text-slate-500 font-mono text-xs">{s.customerEmail}</td>
                      <td className="p-4">
                        <span className="bg-pink-50 text-pink-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg">
                          {s.storeTheme || 'default'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`badge px-3 py-1 rounded-full text-[10px] font-black ${
                          s.storeStatus === 'live' 
                            ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/20' 
                            : 'bg-amber-500/15 text-amber-700 border border-amber-500/20'
                        }`}>
                          {s.storeStatus === 'live' ? 'Live / Active' : 'Demo'}
                        </span>
                      </td>
                      <td className="p-4 text-pink-600">
                        {s.supportLink ? (
                          <a href={s.supportLink} target="_blank" rel="noopener noreferrer" className="hover:underline font-bold text-xs inline-flex items-center gap-1">
                            🚀 Link
                          </a>
                        ) : (
                          <span className="text-slate-400">ব্যবহৃত হয়নি</span>
                        )}
                      </td>
                      <td className="p-4 text-center space-x-1 flex items-center justify-center min-w-[210px] gap-1">
                        <button 
                          onClick={() => {
                            setSelectedStore(s);
                            setActiveSubTab('preview');
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer"
                          type="button"
                        >
                          Preview
                        </button>
                        <button 
                          onClick={() => setActiveSubTab('dashboard')}
                          className="bg-pink-600 hover:bg-pink-700 text-white px-2 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer"
                          type="button"
                        >
                          Dashboard
                        </button>
                        <button 
                          onClick={() => handleEdit(s)}
                          className="btn-edit bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer"
                          type="button"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(s.id)}
                          className="btn-delete bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer"
                          type="button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {stores.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400 font-medium text-xs">
                        কোনো ডেমো স্টোর পাওয়া যায়নি। ওপরের ফর্ম ব্যবহার করে প্রথম স্টোর সেটআপ করুন!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

function ControlCard({ icon, title, desc, color, isWide, onClick }: any) {
  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      className={`control-card ${isWide ? 'auto-monitor' : ''}`}
      onClick={onClick}
    >
      <div className="card-icon" style={{ color }}>{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </motion.div>
  );
}

function TaxVatControlPanel() {
  const [storeFee, setStoreFee] = useState<number>(200);
  const [vatTaxRate, setVatTaxRate] = useState<number>(20);
  const [payoutMethod, setPayoutMethod] = useState<string>('stripe');
  const [accountHolder, setAccountHolder] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [msg, setMsg] = useState<{ text: string; success: boolean } | null>(null);

  useEffect(() => {
    fetch('/api/admin/tax-settings')
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          setStoreFee(result.data.storeFee || 200);
          setVatTaxRate(result.data.vatTaxRate || 20);
          setPayoutMethod(result.data.payoutMethod || 'stripe');
          setAccountHolder(result.data.accountHolder || '');
          setAccountNumber(result.data.accountNumber || '');
        }
      })
      .catch(err => console.error("Error loaded tax config:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg(null);
    try {
      const response = await fetch('/api/admin/update-tax-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeFee,
          vatTaxRate,
          payoutMethod,
          accountHolder,
          accountNumber
        })
      });
      const result = await response.json();
      if (result.success) {
        setMsg({ text: 'System Updated Globally! (সিস্টেমটি বিশ্বব্যাপী আপডেট করা হয়েছে)', success: true });
      } else {
        setMsg({ text: 'Error: ' + result.error, success: false });
      }
    } catch (err) {
      setMsg({ text: 'Network Error occurred.', success: false });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-card-admin rounded-3xl shadow-2xl overflow-hidden border-t-8 border-pink-500 text-left">
      <div className="header-gradient-admin p-8 text-center text-white">
        <DollarSign size={48} className="mx-auto mb-4" />
        <h2 className="text-2xl font-black uppercase tracking-widest mb-1">Monthly Tax, VAT & Store Fee Control</h2>
        <p className="text-pink-100 text-sm font-medium">ড্যাশবোর্ড ফি এবং ট্যাক্স নির্ধারণ প্যানেল</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {msg && (
          <div className={`p-4 rounded-xl text-sm font-bold ${msg.success ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Store Fee Input */}
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg">
            <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Store size={18} className="text-pink-500" /> Monthly Store Fee
            </label>
            <div className="relative rounded-xl shadow-sm">
              <input 
                type="number" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm font-semibold transition-all pr-12 text-gray-800 font-medium" 
                placeholder="Ex: 200" 
                value={storeFee}
                onChange={(e) => setStoreFee(parseFloat(e.target.value) || 0)}
                required
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500 font-bold text-sm">
                USD
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1 font-medium">
              • Auto-debit from vendor if inactive.
            </p>
          </div>

          {/* VAT/Tax Rate Input */}
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg">
            <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Percent size={18} className="text-pink-500" /> VAT / Tax Rate (%)
            </label>
            <div className="relative rounded-xl shadow-sm">
              <input 
                type="number" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm font-semibold transition-all pr-12 text-gray-800 font-medium" 
                placeholder="Ex: 20" 
                min="0" 
                max="100" 
                value={vatTaxRate}
                onChange={(e) => setVatTaxRate(parseFloat(e.target.value) || 0)}
                required
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500 font-bold text-sm">
                %
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1 font-medium">
              • Auto-cut profit from every sale.
            </p>
          </div>
        </div>

        {/* Payment Method Configuration */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Wallet size={20} className="text-pink-500" /> Payout Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide">Gateway Type</label>
              <select 
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm font-semibold transition-all bg-white text-gray-800"
              >
                <option value="stripe">Stripe Connect</option>
                <option value="paypal">PayPal Business</option>
                <option value="bank">Direct Bank Transfer</option>
              </select>
            </div>

            {/* Sensitive Data Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-2">Account Holder Name</label>
                <input 
                  type="text" 
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm font-semibold transition-all text-gray-800" 
                  placeholder="Your Business Name"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-2">Account ID / Card Number</label>
                <input 
                  type="text" 
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm font-semibold transition-all text-gray-800" 
                  placeholder={payoutMethod === 'stripe' ? 'acct_1Gq2...' : payoutMethod === 'paypal' ? 'business@paypal.com' : 'IBAN / Acc Number'}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-auto bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-black px-8 py-4 rounded-xl shadow-lg shadow-pink-100 transition duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle size={20} />
            {isSubmitting ? 'Updating...' : 'Confirm & Connect'}
          </button>
        </div>
      </form>
    </div>
  );
}

interface AllAccountAccessPanelProps {
  onBypassLogin?: (user: any, token: string) => void;
}

export function AllAccountAccessPanel({ onBypassLogin }: AllAccountAccessPanelProps) {
  const [usernameInput, setUsernameInput] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [suspendDuration, setSuspendDuration] = useState('24');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch('/api/security/status');
      const data = await response.json();
      if (response.ok && data.success) {
        setAuditLogs((data.logs || []).slice(0, 8));
      }
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [searchResult]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = usernameInput.replace(/^@/, '').trim();
    if (!query) {
      alert("দয়া করে একটি সঠিক ইউজারনেম লিখুন!");
      return;
    }

    setIsSearching(true);
    setErrorMsg(null);
    setSearchResult(null);

    try {
      const response = await fetch(`/api/admin/search-store/${query}`);
      const data = await response.json();
      if (response.ok && data.success) {
        setSearchResult(data.user);
      } else {
        setErrorMsg(data.error || 'এই ইউজারনেমে কোনো অ্যাকাউন্ট পাওয়া যায়নি!');
      }
    } catch (err) {
      setErrorMsg('সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsSearching(false);
    }
  };

  const handleApproveStore = async () => {
    if (!searchResult) return;
    const isConfirmed = window.confirm(`আপনি কি নিশ্চিতভাবে @${searchResult.username} অ্যাকাউন্টটি অ্যাপ্রুভ ও সক্রিয় করতে চান?`);
    if (!isConfirmed) return;

    setIsApproveLoading(true);
    try {
      const response = await fetch('/api/admin/approve-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: searchResult.username })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert(`✅ @${searchResult.username} অ্যাকাউন্টটি সফলভাবে অ্যাপ্রুভ এবং অ্যাক্টিভেট করা হয়েছে!`);
        setSearchResult(data.user);
        fetchAuditLogs();
      } else {
        alert(`❌ ত্রুটি: ${data.error || 'অ্যাপ্রুভাল ব্যর্থ হয়েছে।'}`);
      }
    } catch (err) {
      alert('⚠️ সার্ভার এরর! দয়া করে ইন্টারনেট কানেকশন চেক করুন।');
    } finally {
      setIsApproveLoading(false);
    }
  };

  const bypassAccessAccount = async () => {
    if (!searchResult) return;
    const isConfirmed = window.confirm(`নিশ্চিত তো? কোনো পাসওয়ার্ড ছাড়াই সরাসরি @${searchResult.username} এর অ্যাকাউন্ট অ্যাক্সেস করতে যাচ্ছেন।`);
    if (!isConfirmed) return;

    try {
      const response = await fetch('/api/admin/bypass-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: searchResult.username })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert(`সরাসরি অ্যাক্সেস টোকেন তৈরি হচ্ছে...\nকোনো পাসওয়ার্ড ছাড়াই আপনি এখন @${searchResult.username} এর স্টোরে প্রবেশ করছেন।`);
        if (onBypassLogin) {
          onBypassLogin(data.user, data.token);
        }
      } else {
        alert(`❌ ত্রুটি: ${data.error || 'অ্যাক্সেস টোকেন তৈরি ব্যর্থ হয়েছে।'}`);
      }
    } catch (err) {
      alert('⚠️ সার্ভার এরর! দয়া করে ইন্টারনেট কানেকশন চেক করুন।');
    }
  };

  const confirmAction = async () => {
    if (!searchResult) return;
    setIsActionLoading(true);
    try {
      const response = await fetch('/api/admin/suspend-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: searchResult.username, duration: suspendDuration })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert(suspendDuration === 'lifetime' 
          ? `সফলভাবে @${searchResult.username} কে আজীবন বহিষ্কার (Lifetime Blacklist) করা হয়েছে!` 
          : `সফলভাবে @${searchResult.username} এর অ্যাকাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে!`
        );
        setShowActionModal(false);
        setSearchResult(data.user);
        fetchAuditLogs();
      } else {
        alert(`❌ ত্রুটি: ${data.error || 'অ্যাকশন সম্পন্ন করতে ব্যর্থ হয়েছে।'}`);
      }
    } catch (err) {
      alert('⚠️ সার্ভার এরর! দয়া করে ইন্টারনেট কানেকশন চেক করুন।');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-card-admin rounded-3xl shadow-2xl overflow-hidden border-t-8 border-emerald-500 text-left bg-white text-gray-800">
      <div className="header-gradient-admin bg-gradient-to-r from-emerald-600 to-teal-500 p-8 text-center text-white">
        <Users size={48} className="mx-auto mb-4" />
        <h2 className="text-2xl font-black uppercase tracking-widest mb-1">Admin - All Account Access & Impersonation</h2>
        <p className="text-emerald-100 text-sm font-medium">যেকোনো স্টোর সার্চ করে অডিট লগের মাধ্যমে ওয়ান-ক্লিক বাইপাস অ্যাক্সেস বা অ্যাপ্রুভ করুন।</p>
      </div>

      <div className="p-8 space-y-6 bg-white">
        {/* Search Input Box */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-md">
          <label className="block text-sm font-bold text-gray-700 mb-2">স্টোর ইউজারনেম দিয়ে খুঁজুন</label>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }} 
            className="flex gap-3"
          >
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 font-bold">@</span>
              <input 
                type="text" 
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="যেমন: myshop24" 
                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition shadow-sm font-medium"
              />
            </div>
            <button 
              type="submit" 
              disabled={isSearching}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Send size={16} /> 
              {isSearching ? 'অনুসন্ধান হচ্ছে...' : 'সার্চ করুন'}
            </button>
          </form>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold rounded-xl text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Result UI */}
        {searchResult && (
          <div className="animate-fadeIn mt-4 space-y-3 bg-white p-2 rounded-2xl">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">অনুসন্ধানের ফলাফল:</h3>
            <div className="bg-gray-50 border-l-4 border-emerald-500 rounded-r-2xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 border border-gray-100">
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center font-black text-xl shadow-inner">
                  {searchResult.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-800 text-lg">@{searchResult.username}</h4>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold mr-1 uppercase">
                    {searchResult.account_type || 'Dropshipping'}
                  </span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2.5 py-1 rounded-full font-bold">Vendor ID: {searchResult.id || 'N/A'}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {searchResult.status?.toLowerCase() === 'pending' || (searchResult.is_active === 0 && searchResult.status?.toLowerCase() !== 'blacklisted' && searchResult.status?.toLowerCase() !== 'suspended') ? (
                  <span className="px-3.5 py-1 rounded-full font-bold text-xs bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wide">
                    Pending Approval
                  </span>
                ) : searchResult.is_active === 1 ? (
                  <span className="px-3.5 py-1 rounded-full font-bold text-xs bg-green-100 text-green-700 border border-green-200 uppercase tracking-wide">
                    Active
                  </span>
                ) : (
                  <span className="px-3.5 py-1 rounded-full font-bold text-xs bg-rose-100 text-rose-700 border border-rose-200 uppercase tracking-wide">
                    {searchResult.status || 'Suspended'}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={() => setShowDetailsModal(true)} 
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5"
                >
                  <Clipboard size={14} /> ভিউ (View)
                </button>

                {(searchResult.status?.toLowerCase() === 'pending' || searchResult.is_active === 0) && (
                  <button 
                    onClick={handleApproveStore} 
                    disabled={isApproveLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-md animate-pulse"
                  >
                    <CheckCircle size={14} /> {isApproveLoading ? 'অ্যাপ্রুভ হচ্ছে...' : 'অ্যাপ্রুভ'}
                  </button>
                )}

                <button 
                  onClick={bypassAccessAccount} 
                  disabled={searchResult.status?.toLowerCase() === 'pending' || searchResult.is_active === 0}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-md"
                  title={searchResult.status?.toLowerCase() === 'pending' ? 'অ্যাকাউন্টটি প্রথমে অ্যাপ্রুভ করুন!' : 'সরাসরি প্রবেশ করুন'}
                >
                  <SignInAlt size={14} /> অ্যাকাউন্ট অ্যাক্সেস
                </button>

                <button 
                  onClick={() => setShowActionModal(true)} 
                  className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5"
                >
                  <Lock size={14} /> সাসপেন্ড / ব্লক
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Real-time Impersonation & Audit Logs section */}
        <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-inner border border-slate-800 mt-6 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              অডিট লগিং সিস্টেম (Real-time Audit Trail Logs)
            </h3>
            <button 
              onClick={fetchAuditLogs}
              className="text-xs text-slate-400 hover:text-white transition bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
            >
              রিফ্রেস লগ
            </button>
          </div>
          <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
            {auditLogs.length > 0 ? (
              auditLogs.map((log: any) => (
                <div key={log.id} className="text-[11px] leading-relaxed border-l-2 pl-3 pb-1 border-slate-800 hover:border-emerald-500 transition">
                  <div className="flex items-center justify-between gap-2 text-slate-400">
                    <span className="text-emerald-500 font-extrabold">{log.type}</span>
                    <span className="bg-slate-800 text-[10px] text-slate-300 px-1.5 py-0.5 rounded font-bold uppercase">
                      {log.severity || 'INFO'}
                    </span>
                    <span className="text-[10px]">{new Date(log.timestamp).toLocaleString('bn-BD')}</span>
                  </div>
                  <p className="font-extrabold text-slate-200 mt-1">{log.message}</p>
                  {log.explanation && <p className="text-slate-500 text-[10px] italic">{log.explanation}</p>}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">কোনো অডিট লগ এখনো রেকর্ড করা হয়নি।</p>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && searchResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fadeIn">
          <div className="bg-white border border-gray-100 rounded-3xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl text-left">
            <h3 className="text-xl font-black text-emerald-600 mb-6 border-b pb-3 flex items-center gap-2">
              <Clipboard size={22} /> রেজিস্ট্রেশন ডিটেইলস
            </h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">স্ট্যাটাস (Status)</p>
                <p className="font-extrabold text-emerald-600 uppercase">{(searchResult.status || 'Active')}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">স্টোর টাইপ</p>
                <p className="font-extrabold text-gray-800 uppercase">{searchResult.account_type || 'dropshipping'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">মোবাইল / হোয়াটসঅ্যাপ নম্বর</p>
                <p className="font-extrabold text-gray-800">{searchResult.whatsapp || 'Not Provided'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">ইমেইল অ্যাড্রেস</p>
                <p className="font-extrabold text-gray-800">{searchResult.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">জাতীয় পরিচয়পত্র / পাসপোর্ট / NID</p>
                <p className="font-extrabold text-gray-800">{searchResult.idNumber || 'Not Provided'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">ঠিকানা</p>
                <p className="font-extrabold text-gray-800">
                  {searchResult.city ? `${searchResult.city}, ${searchResult.district || ''}, ${searchResult.country || 'BD'}` : 'Not Provided'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">স্টোর তৈরি হয়েছে</p>
                <p className="font-extrabold text-gray-800">{searchResult.joined || 'Not Provided'}</p>
              </div>
              
              {/* Fully dynamic JSON presentation of exact user registration data as requested */}
              {searchResult.registration_data && (
                <div className="bg-gray-900 text-emerald-400 p-4 rounded-xl border border-slate-800 font-mono">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">RAW REGISTRATION DATA (JSON)</p>
                  <pre className="text-[10px] overflow-x-auto max-h-[150px] whitespace-pre-wrap">
                    {JSON.stringify(searchResult.registration_data, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <button 
              onClick={() => setShowDetailsModal(false)} 
              className="mt-6 w-full bg-gray-800 hover:bg-gray-900 text-white py-3.5 rounded-xl font-bold transition-colors cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* Action Modal (Suspend/Blacklist) */}
      {showActionModal && searchResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fadeIn">
          <div className="bg-white border border-rose-100 rounded-3xl w-full max-w-md p-8 relative shadow-2xl text-left">
            <h3 className="text-xl font-black text-rose-600 mb-6 border-b pb-3 flex items-center gap-2">
              <Lock size={22} className="text-rose-600" /> অ্যাকাউন্ট অ্যাকশন প্যানেল
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">অ্যাকশন টাইপ সিলেক্ট করুন</label>
                <select 
                  value={suspendDuration}
                  onChange={(e) => setSuspendDuration(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 font-semibold text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="24">২৪ ঘণ্টা সাসপেন্ড</option>
                  <option value="72">৭২ ঘণ্টা সাসপেন্ড</option>
                  <option value="lifetime">লাইফটাইম ব্ল্যাকলিস্ট (আজীবন বহিষ্কার)</option>
                </select>
              </div>
              
              <div className="text-xs text-rose-700 bg-rose-50/70 p-4 rounded-xl border border-rose-100 leading-relaxed font-semibold">
                <strong>সতর্কতা:</strong> লাইফটাইম ব্ল্যাকলিস্ট করলে ওই ইউজারের পাসপোর্ট, এনআইডি এবং ডাটা চিরতরে লক হয়ে যাবে এবং তার বর্তমান ইউজারনেমটি অন্য কেউ নতুন করে ব্যবহার করতে পারবে না।
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowActionModal(false)} 
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3.5 rounded-xl font-bold transition-colors cursor-pointer text-center text-sm"
              >
                বাতিল
              </button>
              <button 
                onClick={confirmAction} 
                disabled={isActionLoading}
                className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white py-3.5 rounded-xl font-bold transition-colors cursor-pointer text-center text-sm"
              >
                {isActionLoading ? 'প্রক্রিয়াধীন...' : 'কনফার্ম করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DropshipStoreInterface({ 
  store, 
  onBack,
  isAiLiveActive,
  setIsAiLiveActive,
  showAiCategories,
  setShowAiCategories
}: { 
  store: any; 
  onBack: () => void;
  isAiLiveActive: boolean;
  setIsAiLiveActive: (v: boolean) => void;
  showAiCategories: boolean;
  setShowAiCategories: (v: boolean) => void;
}) {
  // Navigation & Core States
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'inventory' | 'collections' | 'gift-cards' | 'ai-tools' | 'add-product' | 'customer-control' | 'upgrade-system' | 'mail-box' | 'analytics' | 'edit-interface'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileName, setProfileName] = useState(store?.storeName || 'এমডি আরিয়ান');
  const [profileUsername, setProfileUsername] = useState(store?.customerEmail ? store.customerEmail.split('@')[0] : 'ariyan_dropship');
  const [profileBio, setProfileBio] = useState(store?.problemNote || 'স্বাগতম! এটি আমার ড্রপশিপিং স্টোরের বায়ো সেকশন। এখানে ওয়েবসাইট সংক্রান্ত তথ্য বা সংক্ষিপ্ত বিবরণ প্রদর্শন করা হবে।');
  
  // Modals status
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(profileName);
  const [editUsername, setEditUsername] = useState(profileUsername);
  const [editBio, setEditBio] = useState(profileBio);
  
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [isIssueGiftCardOpen, setIsIssueGiftCardOpen] = useState(false);

  // Lists & State management
  const [products, setProducts] = useState([
    { id: '1', title: 'Summer T-Shirt', price: '29.00', available: 120, status: 'Active', bg: 'from-orange-400 to-amber-500', emoji: '👕' },
    { id: '2', title: 'Denim Jacket', price: '45.00', available: 45, status: 'Draft', bg: 'from-sky-500 to-indigo-600', emoji: '🧥' },
    { id: '3', title: 'Smart Watch Ultra', price: '99.00', available: 15, status: 'Active', bg: 'from-pink-500 to-rose-600', emoji: '⌚' },
    { id: '4', title: 'Premium Headphones', price: '59.00', available: 78, status: 'Active', bg: 'from-purple-500 to-violet-600', emoji: '🎧' }
  ]);

  const [collections, setCollections] = useState([
    { id: '1', name: 'Summer Sale', count: 25, badge: 'Hot Deal' },
    { id: '2', name: 'New Arrivals', count: 12, badge: 'Seasonal' },
    { id: '3', name: 'Winter Warmup', count: 8, badge: 'Standard' }
  ]);

  const [giftCards, setGiftCards] = useState([
    { id: '1', code: 'EID-SUMMER-VAL25', value: '৫০০', status: 'Active', date: '09 Jun 2026' },
    { id: '2', code: 'LAUNCH-GIFT-VAL50', value: '১,০০০', status: 'Active', date: '08 Jun 2026' }
  ]);

  // Form states
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('19.00');
  const [newProdStock, setNewProdStock] = useState(60);
  const [newProdStatus, setNewProdStatus] = useState<'Active' | 'Draft'>('Active');
  
  const [newCollName, setNewCollName] = useState('');
  const [newCollBadge, setNewCollBadge] = useState('General');
  
  const [newGiftValue, setNewGiftValue] = useState('1500');

  // Search filter
  const [filterQuery, setFilterQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Inline edit state
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlineStockVal, setInlineStockVal] = useState('');

  // AI Live Mode states & feedback log
  const [localCodeLog, setLocalCodeLog] = useState(`// এআই ভয়েস অ্যাসিস্ট্যান্ট সচল রয়েছে...\n// "ক্যাটাগরি মেনু দেখাও" অথবা "প্রোফাইল নাম পরিবর্তন করো" বলুন।`);

  // @@REPLACE_REMAINING_DASHBOARD_BODY_AND_VIEWS@@

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Voice simulation triggers
  const executeVoiceSim = (command: string) => {
    setLocalCodeLog(`// এআই আপনার ভয়েস সংকেত গ্রহণ করছে...\n🗣️ ইউজার বলছেন: "${command}"`);
    setTimeout(() => {
      const clean = command.toLowerCase();
      if (clean.includes('ক্যাটাগরি') || clean.includes('ক্যাটাগরি বার')) {
        setShowAiCategories(true);
        setLocalCodeLog(`[AI Voice Success]: "সার্চ বারের নিচে ক্যাটাগরি মেনু যুক্ত করা হলো।"\n\n[স্ট্যাটাস]: আপডেট সফল!`);
        triggerToast('সার্চ বারের নিচে ক্যাটাগরি বার যুক্ত হয়েছে!');
      } else if (clean.includes('নাম') || clean.includes('প্রোফাইল')) {
        setProfileName('এমডি আরিয়ান - কাস্টম এআই শপ');
        setLocalCodeLog(`[AI Voice Success]: storeName পরিবর্তন করে "এমডি আরিয়ান - কাস্টম এআই শপ" করা হলো।`);
        triggerToast('প্রোফাইলের নাম পরিবর্তিত করা হয়েছে!');
      } else if (clean.includes('দাম') || clean.includes('কমাও')) {
        const discounted = products.map(p => ({
          ...p,
          price: (parseFloat(p.price) - 5 > 0 ? (parseFloat(p.price) - 5).toFixed(2) : p.price)
        }));
        setProducts(discounted);
        setLocalCodeLog(`[AI Voice Success]: products.map(p => p.price - $5) দাম কমানো হয়েছে।`);
        triggerToast('সব প্রোডাক্টের দাম কমানো হয়েছে!');
      } else if (clean.includes('বায়ো') || clean.includes('ট্যাগ')) {
        setProfileBio('স্বাগতম! এআই ইন্টিগ্রেটেড ড্রপশিপিং স্টোরে আপনাকে স্বাগতম। আমরা দিচ্ছি ১০০% কোয়ালিটি নিশ্চয়তা।');
        setLocalCodeLog(`[AI Voice Success]: bio কন্টেন্ট আপডেট করা হয়েছে।`);
        triggerToast('বায়ো কন্টেন্ট আপডেট করা হয়েছে!');
      }
    }, 1500);
  };

  // Handle Voice triggers from global window
  useEffect(() => {
    const handleRename = (e: any) => setProfileName(e.detail);
    const handleChangeBio = (e: any) => setProfileBio(e.detail);
    const handleCategory = (e: any) => setShowAiCategories(e.detail !== false);
    
    window.addEventListener('ai-rename-store', handleRename);
    window.addEventListener('ai-change-bio', handleChangeBio);
    window.addEventListener('ai-category-toggle', handleCategory);
    return () => {
      window.removeEventListener('ai-rename-store', handleRename);
      window.removeEventListener('ai-change-bio', handleChangeBio);
      window.removeEventListener('ai-category-toggle', handleCategory);
    };
  }, []);

  // Filtered products list
  const filteredProducts = products.filter(p => p.title.toLowerCase().includes(filterQuery.toLowerCase()));

  // Core Actions
  const toggleProductStatus = (id: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, status: p.status === 'Active' ? 'Draft' : 'Active' } : p));
    triggerToast('প্রোডাক্ট স্ট্যাটাস সফলভাবে পরিবর্তন করা হয়েছে!');
  };

  const handleEditProfileSave = () => {
    setProfileName(editName);
    setProfileUsername(editUsername);
    setProfileBio(editBio);
    setIsEditModalOpen(false);
    triggerToast('প্রোফাইল সেটিংস আপডেট সম্পন্ন হয়েছে!');
  };

  const handleAddProduct = () => {
    if (!newProdName.trim() || !newProdPrice) {
      alert('দয়া করে নাম ও দাম সঠিক ইনপুট দিন');
      return;
    }
    const newId = (products.length + 1).toString();
    const newP = {
      id: newId,
      title: newProdName,
      price: parseFloat(newProdPrice).toFixed(2),
      available: Math.max(0, newProdStock),
      status: newProdStatus,
      bg: 'from-pink-500 to-indigo-600',
      emoji: '🎁'
    };
    setProducts([...products, newP]);
    setNewProdName('');
    setIsAddProductOpen(false);
    triggerToast('নতুন প্রোডাক্ট সফলভাবে যুক্ত করা হয়েছে!');
  };

  const handleAddCollection = () => {
    if (!newCollName.trim()) return;
    const newCol = {
      id: (collections.length + 1).toString(),
      name: newCollName,
      count: 0,
      badge: newCollBadge
    };
    setCollections([...collections, newCol]);
    setNewCollName('');
    setIsAddCollectionOpen(false);
    triggerToast('কালেকশন যুক্ত করা হয়েছে!');
  };

  const handleIssueGiftCard = () => {
    const randomCode = 'SHOP-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const newCard = {
      id: (giftCards.length + 1).toString(),
      code: randomCode,
      value: newGiftValue,
      status: 'Active',
      date: '09 Jun 2026'
    };
    setGiftCards([newCard, ...giftCards]);
    setIsIssueGiftCardOpen(false);
    triggerToast('নতুন গিফট কুপন জেনারেট সম্পন্ন!');
  };

  const saveInlineStock = (id: string) => {
    const parsed = parseInt(inlineStockVal);
    if (!isNaN(parsed)) {
      setProducts(products.map(p => p.id === id ? { ...p, available: Math.max(0, parsed) } : p));
      triggerToast('ইনভেন্টরি স্টক লেভেল পরিবর্তন করা হয়েছে।');
    }
    setInlineEditId(null);
  };

  return (
    <div className="w-full bg-gray-50 border border-gray-200 rounded-3xl min-h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-2xl mr-auto ml-auto text-left relative" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      
      {/* Toast notifications rendering */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-3.5 px-6 rounded-full shadow-2xl z-50 flex items-center gap-2 border border-gray-700/80"
          >
            <span className="text-emerald-400">⚡</span> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* @@REPLACE_REMAINING_DASHBOARD_VIEWS@@ */}

      {/* STEP 1: Main Sidebar Left Panel & Topbar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-5 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-pink-600 bg-clip-text text-transparent flex items-center gap-1.5">
                🛍️ <span>My Store</span>
              </h1>
              <p className="text-[10px] text-gray-405 font-mono font-bold tracking-widest mt-0.5 uppercase">Shopify Engine v3</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Connected to server"></span>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('home')} 
              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${activeTab === 'home' ? 'bg-gray-100 text-gray-900 border-l-4 border-pink-500 pl-2' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              🏠 <span>Home Layout</span>
            </button>

            <div className="pt-4 pb-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1.5">Products & Inventory</p>
              
              <button 
                onClick={() => setActiveTab('products')} 
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${activeTab === 'products' ? 'bg-gray-100 text-gray-900 border-l-4 border-pink-500 pl-2' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                🏷️ <span>All Products</span>
              </button>

              <button 
                onClick={() => setActiveTab('add-product')} 
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${activeTab === 'add-product' ? 'bg-gray-100 text-gray-900 border-l-4 border-pink-500 pl-2' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                ➕ <span>Add Product</span>
              </button>

              <button 
                onClick={() => setActiveTab('inventory')} 
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${activeTab === 'inventory' ? 'bg-gray-100 text-gray-900 border-l-4 border-pink-500 pl-2' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                📦 <span>Inventory Panel</span>
              </button>

              <button 
                onClick={() => setActiveTab('collections')} 
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${activeTab === 'collections' ? 'bg-gray-100 text-gray-900 border-l-4 border-pink-500 pl-2' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                📂 <span>Collections</span>
              </button>

              <button 
                onClick={() => setActiveTab('gift-cards')} 
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${activeTab === 'gift-cards' ? 'bg-gray-100 text-gray-900 border-l-4 border-pink-500 pl-2' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                💝 <span>Gift Cards</span>
              </button>
            </div>

            <div className="pt-4 pb-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1.5">Management</p>

              <button 
                onClick={() => setActiveTab('customer-control')} 
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${activeTab === 'customer-control' ? 'bg-gray-100 text-gray-900 border-l-4 border-pink-500 pl-2' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                👥 <span>Customers</span>
              </button>

              <button 
                onClick={() => setActiveTab('mail-box')} 
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${activeTab === 'mail-box' ? 'bg-gray-100 text-gray-900 border-l-4 border-pink-500 pl-2' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                ✉️ <span>Mail Box Logs</span>
              </button>

              <button 
                onClick={() => setActiveTab('analytics')} 
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${activeTab === 'analytics' ? 'bg-gray-100 text-gray-900 border-l-4 border-pink-500 pl-2' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                📈 <span>Analytics</span>
              </button>
            </div>

            <div className="pt-4 pb-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1.5">System Tools</p>
              
              <button 
                onClick={() => setActiveTab('ai-tools')} 
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${activeTab === 'ai-tools' ? 'bg-gray-100 text-gray-900 border-l-4 border-pink-500 pl-2' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                🎙️ <span>AI Voice Config</span>
              </button>

              <button 
                onClick={() => setActiveTab('upgrade-system')} 
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${activeTab === 'upgrade-system' ? 'bg-gray-100 text-gray-900 border-l-4 border-pink-500 pl-2' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                ⚡ <span>Upgrade System</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom panel state backtrigger */}
        <div className="pt-4 border-t border-gray-100 mt-auto">
          <button 
            onClick={onBack}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
          >
            &larr; Exit Store Panel
          </button>
        </div>
      </aside>

      {/* Main Content Area Right Panel */}
      <main className="flex-1 flex flex-col p-6 sm:p-8 overflow-y-auto max-h-[85vh]">
        
        {/* Topbar of the Store Area */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-gray-200 mb-8 shadow-sm gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-pink-50 border border-pink-100 text-pink-600 font-extrabold px-2.5 py-1 rounded-md">Live Store Mode Demo</span>
              <span className="text-[11px] text-gray-400 font-medium">@{profileUsername}_substore</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mt-1">{profileName} এর ড্রপশিপিং স্টোর</h2>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => {
                setEditName(profileName);
                setEditUsername(profileUsername);
                setEditBio(profileBio);
                setIsEditModalOpen(true);
              }}
              className="bg-gray-100 hover:bg-gray-205 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl transition"
            >
              ✎ Edit Profile Info
            </button>

            <button 
              onClick={() => setIsAiLiveActive(!isAiLiveActive)}
              className={`text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 ${isAiLiveActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}
            >
              {isAiLiveActive ? '🎙️ Mic Active' : '🔇 Mic Off'}
            </button>
          </div>
        </div>

        {/* AI Categories Inject banner if state active */}
        {showAiCategories && (
          <div className="mb-6 bg-blue-50 border border-blue-150 p-4 rounded-xl flex flex-wrap gap-2 items-center justify-between">
            <span className="text-xs font-bold text-blue-700">⚡ এআই জেনারেটেড কুইক ক্যাটাগরি মেনু:</span>
            <div className="flex gap-1.5 flex-wrap">
              {['মোবাইল', 'চশমা', 'ইয়ারফোন', 'ঘড়ি', 'ফ্যাশন'].map((cat) => (
                <span key={cat} className="bg-white text-gray-700 text-[11px] font-bold px-3 py-1 border border-gray-200 rounded-full hover:bg-pink-600 hover:text-white cursor-pointer transition">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* TAB 1: Home Dashboard View */}
        {activeTab === 'home' && (
          <div className="space-y-6 text-left">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative text-center">
              <div className="absolute top-4 left-4 bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
                Active Storefront
              </div>
              
              <div className="w-20 h-20 bg-gradient-to-tr from-pink-100 to-rose-200 text-pink-650 text-4xl rounded-full flex items-center justify-center mx-auto mb-4 font-bold shadow-sm select-none">
                👤
              </div>

              <h2 className="text-xl font-bold text-gray-800">{profileName}</h2>
              <p className="text-sm font-mono text-pink-600 font-bold mb-3">@{profileUsername}_substore</p>
              
              <div className="max-w-xl mx-auto bg-gray-50 border border-gray-200 rounded-xl p-4 mt-2">
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  "{profileBio}"
                </p>
              </div>

              <button 
                onClick={() => {
                  setEditName(profileName);
                  setEditUsername(profileUsername);
                  setEditBio(profileBio);
                  setIsEditModalOpen(true);
                }}
                className="mt-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Edit Profile Settings
              </button>
            </div>

            {/* Quick overview metric widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left animate-fade-in">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm col-span-1">
                <span className="text-gray-400 text-2xl">💰</span>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-2">Total Sales (Today)</p>
                <p className="text-2xl font-black text-slate-800 mt-1">৭,৬০০ টাকা</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm col-span-1">
                <span className="text-gray-400 text-2xl">⚡</span>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-2">Products Published</p>
                <p className="text-2xl font-black text-slate-800 mt-1">{products.length} টি আইটেম</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm col-span-1">
                <span className="text-gray-400 text-2xl">📊</span>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-2">Conversion Status</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">৪.৫% পেইড</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: All Products Grid View */}
        {activeTab === 'products' && (
          <div className="space-y-6 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-800">All Products</h3>
                <p className="text-xs text-gray-400">আপলোড করা ড্রপশিপিং ক্যাটালগ প্রোডাক্টস</p>
              </div>
              <button 
                onClick={() => setIsAddProductOpen(true)}
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
              >
                + Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition flex flex-col justify-between group">
                  <div className={`h-40 bg-gradient-to-tr ${item.bg || 'from-gray-100 to-gray-200'} p-4 relative flex items-center justify-center`}>
                    <span className="text-5xl group-hover:scale-110 transition duration-350 select-none">{item.emoji || '🎁'}</span>
                    
                    <button 
                      onClick={() => {
                        setProducts(products.filter(p => p.id !== item.id));
                        triggerToast('প্রোডাক্ট সফলভাবে ডিলিস্ট করা হয়েছে।');
                      }}
                      className="absolute top-3 right-3 w-7 h-7 bg-white/95 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center text-xs text-gray-600 font-bold transition shadow-sm cursor-pointer border border-gray-100"
                      title="ডিলিট করুন"
                    >
                      ✕
                    </button>

                    <span className={`absolute bottom-3 left-3 text-[10px] uppercase tracking-wide font-extrabold px-2.5 py-1 rounded-full ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-gray-800 text-sm group-hover:text-pink-600 transition">{item.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 font-semibold">স্টক: {item.available} Available</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-base font-black text-slate-900">${item.price}</span>
                      <button 
                        onClick={() => triggerToast(`"${item.title}" successfully bought via demo storefront!`)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div 
                onClick={() => setIsAddProductOpen(true)}
                className="border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-100/70 hover:border-pink-300 rounded-2xl h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 cursor-pointer transition gap-1.5"
              >
                <span className="text-3xl text-gray-300 font-bold">＋</span>
                <span className="text-xs font-bold text-gray-500">নতুন প্রোডাক্ট সরাসরি ক্যাটালগে যুক্ত করুন</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Inventory Table and Management View */}
        {activeTab === 'inventory' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Inventory Management</h3>
                <p className="text-xs text-gray-400">স্টক আপডেট, রানিং স্ট্যাটাস মডিউল এবং এক্সপোর্ট কন্ট্রোল</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <input 
                  type="text" 
                  placeholder="Filter products..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-pink-500 outline-none w-full sm:w-48 text-gray-700 bg-slate-50 font-semibold"
                />
                
                <button 
                  onClick={() => alert(`CSV Format Export Successful!\n\nExported: ${products.length} Items successfully.`)}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold px-3.5 py-2.5 rounded-xl transition"
                >
                  Export CSV
                </button>

                <button 
                  onClick={() => {
                    const promptText = prompt('ইনপুট করুন নতুন প্রোডাক্টের নাম:');
                    if (promptText) {
                      setProducts([...products, {
                        id: (products.length + 1).toString(),
                        title: promptText,
                        price: '39.00',
                        available: 100,
                        status: 'Active',
                        bg: 'from-green-400 to-teal-500',
                        emoji: '📦'
                      }]);
                      triggerToast('সরাসরি ইম্পোর্ট সফল সম্পন্ন হলো!');
                    }
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition"
                >
                  Import CSV
                </button>
              </div>
            </div>

            {/* Structured Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 text-[10px] tracking-wider uppercase font-bold">
                    <th className="pb-3.5 font-bold">Product Details</th>
                    <th className="pb-3.5 font-bold text-center">Status Toggle</th>
                    <th className="pb-3.5 font-bold text-center">Available Stock</th>
                    <th className="pb-3.5 font-bold text-right">State Pill</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                  {filteredProducts.map((p) => {
                    const isLow = p.available <= 20 && p.available > 0;
                    const isOutName = p.available === 0;
                    
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition duration-150">
                        <td className="py-4 flex items-center gap-2.5">
                          <span className="text-xl select-none">{p.emoji || '🎁'}</span>
                          <div>
                            <span className="font-extrabold text-gray-800 block text-sm">{p.title}</span>
                            <span className="text-[10px] text-gray-450 font-mono">${p.price} per unit</span>
                          </div>
                        </td>

                        <td className="py-4 text-center">
                          <button 
                            type="button"
                            onClick={() => toggleProductStatus(p.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${p.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'} transition cursor-pointer`}
                            title="ক্লিক করুন স্ট্যাটাস চেঞ্জ করতে"
                          >
                            {p.status}
                          </button>
                        </td>

                        <td className="py-4 text-center">
                          {inlineEditId === p.id ? (
                            <div className="flex items-center justify-center gap-1 max-w-[120px] mx-auto">
                              <input 
                                type="number" 
                                value={inlineStockVal}
                                onChange={(e) => setInlineStockVal(e.target.value)}
                                className="w-16 p-1 border border-gray-300 rounded text-center text-xs font-bold outline-none text-gray-800 bg-white"
                                min="0"
                                autoFocus
                              />
                              <button 
                                onClick={() => saveInlineStock(p.id)}
                                className="bg-emerald-600 text-white px-2 py-1 rounded hover:bg-emerald-700 font-bold"
                              >
                                ✓
                              </button>
                            </div>
                          ) : (
                            <div 
                              onClick={() => {
                                setInlineEditId(p.id);
                                setInlineStockVal(p.available.toString());
                              }}
                              className="inline-flex items-center gap-1 bg-gray-50 hover:bg-gray-105 px-4 py-1.5 rounded-lg border border-gray-100 cursor-pointer text-xs font-bold text-slate-800 hover:border-pink-300 transition"
                              title="ক্লিক করে স্টক এডিট করুন"
                            >
                              <span>{p.available}</span>
                              <span className="text-[10px] text-gray-400 font-bold">✎</span>
                            </div>
                          )}
                        </td>

                        <td className="py-4 text-right">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-wide inline-block ${
                            isOutName ? 'bg-red-50 text-red-700 border border-red-100' : isLow ? 'bg-orange-50 text-orange-700 border border-orange-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}>
                            {isOutName ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 font-medium">কোনো ইনফরমেশন পাওয়া যায়নি!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* @@REPLACE_REMAINING_MODALS_AND_TABS@@ */}

        {/* TAB 4: Collections screen view */}
        {activeTab === 'collections' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 text-left animate-fade-in animate-duration-300">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Collections</h3>
                <p className="text-xs text-gray-400">পণ্য সাজানোর কাস্টম ক্যাটাগরি প্যানেল</p>
              </div>
              <button 
                onClick={() => setIsAddCollectionOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                + Create Collection
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collections.map((col) => (
                <div key={col.id} className="border border-gray-200 rounded-2xl p-5 hover:shadow-md cursor-pointer transition relative group bg-gray-50/50">
                  <span className="absolute top-4 right-4 bg-pink-100 text-pink-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                    {col.badge}
                  </span>
                  
                  <span className="text-3xl select-none">📂</span>
                  <h4 className="font-extrabold text-gray-800 text-base mt-4 group-hover:text-pink-600 transition">{col.name}</h4>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">{col.count} Products linked to this collection</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Gift Cards & Voucher System */}
        {activeTab === 'gift-cards' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 text-left animate-fade-in animate-duration-300">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Gift Cards & Promo Code</h3>
              <p className="text-xs text-gray-400">স্টোরের ক্রেতাদের জন্য ডিসকাউন্ট ও গিফট কুপন জенারেটর</p>
            </div>

            <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 flex flex-col items-center justify-center max-w-xl mx-auto">
              <span className="text-4xl select-none">🎁</span>
              <p className="text-gray-600 text-sm font-semibold mt-3 mb-4">Manage your gift cards or generate special customer discount credentials here.</p>
              <button 
                onClick={() => setIsIssueGiftCardOpen(true)}
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md shadow-pink-600/10 cursor-pointer"
              >
                Issue Gift Card Code
              </button>
            </div>

            <div className="pt-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3.5">Active Discount Codes ({giftCards.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {giftCards.map((card) => (
                  <div key={card.id} className="bg-slate-900 text-white rounded-2xl p-4 flex justify-between items-center shadow-lg border border-slate-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-pink-600/10 rounded-full blur-xl"></div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase mb-1">Store Gift Code</p>
                      <span className="font-mono text-pink-400 font-extrabold text-sm tracking-wider uppercase select-all block">{card.code}</span>
                      <span className="text-[10px] text-gray-500 font-bold block mt-1.5">Issued on {card.date}</span>
                    </div>

                    <div className="text-right z-10">
                      <span className="text-xl font-black text-white block">{card.value} টাকা</span>
                      <span className="bg-emerald-500/25 text-emerald-400 text-[9px] font-black tracking-wider uppercase border border-emerald-500/10 px-2 py-0.5 rounded">
                        {card.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AI Tools & Live Voice Output Panel */}
        {activeTab === 'ai-tools' && (
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6 text-left animate-fade-in animate-duration-300">
            <div>
              <span className="bg-emerald-950 text-emerald-400 text-[9px] font-black uppercase px-2.5 py-1 rounded-full border border-emerald-900/30">Gemini Live Automation</span>
              <h3 className="text-lg font-bold mt-2 font-mono">AI Live Voice Assistant Remote Console</h3>
              <p className="text-xs text-slate-400 font-semibold">এআই লাইভ ভয়েস কোডার অ্যাসিস্ট্যান্ট সেটিং ও সিমুলেশন</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Mic & Wave animation element */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 text-center flex flex-col items-center justify-center py-8">
                <div className="flex items-center gap-1.5 mb-4 justify-center">
                  <span className="w-1.5 h-4 bg-pink-500 rounded animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-1.5 h-8 bg-indigo-500 rounded animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                  <span className="w-1.5 h-12 bg-pink-500 rounded animate-bounce" style={{ animationDelay: '0.5s' }}></span>
                  <span className="w-1.5 h-6 bg-indigo-500 rounded animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-3 bg-pink-500 rounded animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>

                <p className="text-xs font-bold text-pink-400 animate-pulse">এআই সিস্টেম আপনার রিয়েল-টাইম ভয়েস শুনছে...</p>
                <p className="text-[10px] text-gray-500 mt-1 font-medium">(Chrome ব্রাউজার এ বাংলায় সরাসরি কথা বলুন)</p>
                
                <div className="mt-5 w-full max-h-36 overflow-y-auto bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-300 text-left whitespace-pre-wrap leading-relaxed">
                  {localCodeLog}
                </div>
              </div>

              {/* Simulation commands block */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest font-sans">ভয়েস কমান্ড সিমুলেটর (টেস্ট করুন):</h4>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => executeVoiceSim('সার্চ বারের নিচে ক্যাটাগরি মেনু যুক্ত করো')}
                    className="bg-slate-850 hover:bg-slate-800 text-xs font-bold p-3 rounded-xl text-left border border-slate-755 transition active:scale-95 cursor-pointer text-white"
                  >
                    🎙️ "ক্যাটাগরি বার এড করো"
                  </button>
                  
                  <button 
                    onClick={() => executeVoiceSim('স্টোর প্রোফাইল নাম পরিবর্তন করো')}
                    className="bg-slate-850 hover:bg-slate-800 text-xs font-bold p-3 rounded-xl text-left border border-slate-755 transition active:scale-95 cursor-pointer text-white"
                  >
                    🎙️ "নাম পরিবর্তন করে নতুন এআই শপ দাও"
                  </button>
                  
                  <button 
                    onClick={() => executeVoiceSim('প্রোডাক্ট গুলোর দাম কমাও')}
                    className="bg-slate-850 hover:bg-slate-800 text-xs font-bold p-3 rounded-xl text-left border border-slate-755 transition active:scale-95 cursor-pointer text-white"
                  >
                    🎙️ "সব প্রোডাক্টের দাম ৫০ টাকা কমাও"
                  </button>
                  
                  <button 
                    onClick={() => executeVoiceSim('বায়ো আপডেট করো')}
                    className="bg-slate-850 hover:bg-slate-800 text-xs font-bold p-3 rounded-xl text-left border border-slate-755 transition active:scale-95 cursor-pointer text-white"
                  >
                    🎙️ "বায়ো ট্যাগ লাইন আপডেট করো"
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Mobile Sidebar Slider Drawer */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden animate-fade-in" onClick={() => setIsSidebarOpen(false)}>
            <div 
              className="fixed inset-y-0 left-0 w-72 bg-slate-900 overflow-y-auto shadow-2xl p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
                  <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">মোবাইল শপ কন্ট্রোল</span>
                  <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white text-xl" type="button">✕</button>
                </div>

                <nav className="space-y-1.5 text-left font-sans">
                  <button 
                    onClick={() => { setActiveTab('home'); setIsSidebarOpen(false); }} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'home' ? 'bg-pink-600 text-white font-extrabold shadow-md' : 'text-slate-300 hover:bg-slate-850 hover:text-white font-medium'}`}
                    type="button"
                  >
                    🏠 <span className="text-slate-200">Home Layout</span>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'products' ? 'bg-pink-600 text-white font-extrabold shadow-md' : 'text-slate-300 hover:bg-slate-850 hover:text-white font-medium'}`}
                    type="button"
                  >
                    🏷️ <span className="text-slate-200">All Products</span>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('inventory'); setIsSidebarOpen(false); }} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'inventory' ? 'bg-pink-600 text-white font-extrabold shadow-md' : 'text-slate-300 hover:bg-slate-850 hover:text-white font-medium'}`}
                    type="button"
                  >
                    📦 <span className="text-slate-200">Inventory Panel</span>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('collections'); setIsSidebarOpen(false); }} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'collections' ? 'bg-pink-600 text-white font-extrabold shadow-md' : 'text-slate-300 hover:bg-slate-850 hover:text-white font-medium'}`}
                    type="button"
                  >
                    📂 <span className="text-slate-200">Collections</span>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('gift-cards'); setIsSidebarOpen(false); }} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'gift-cards' ? 'bg-pink-600 text-white font-extrabold shadow-md' : 'text-slate-300 hover:bg-slate-850 hover:text-white font-medium'}`}
                    type="button"
                  >
                    💝 <span className="text-slate-200">Gift Cards</span>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('add-product'); setIsSidebarOpen(false); }} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'add-product' ? 'bg-pink-600 text-white font-extrabold shadow-md' : 'text-slate-300 hover:bg-slate-850 hover:text-white font-medium'}`}
                    type="button"
                  >
                    ➕ <span className="text-emerald-400">নতুন প্রোডাক্ট অ্যাড</span>
                  </button>
                  
                  <button 
                    onClick={() => { setActiveTab('customer-control'); setIsSidebarOpen(false); }} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'customer-control' ? 'bg-pink-600 text-white font-extrabold shadow-md' : 'text-slate-300 hover:bg-slate-850 hover:text-white font-medium'}`}
                    type="button"
                  >
                    👥 <span className="text-purple-400">কাস্টমার ড্যাশবোর্ড</span>
                  </button>
                  
                  <button 
                    onClick={() => { setActiveTab('upgrade-system'); setIsSidebarOpen(false); }} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'upgrade-system' ? 'bg-pink-600 text-white font-extrabold shadow-md' : 'text-slate-300 hover:bg-slate-850 hover:text-white font-medium'}`}
                    type="button"
                  >
                    ⚡ <span className="text-blue-400">সিস্টেম আপগ্রেড</span>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('mail-box'); setIsSidebarOpen(false); }} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'mail-box' ? 'bg-pink-600 text-white font-extrabold shadow-md' : 'text-slate-300 hover:bg-slate-850 hover:text-white font-medium'}`}
                    type="button"
                  >
                    ✉️ <span className="text-indigo-400">মেইল বক্স সিস্টেম</span>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('analytics'); setIsSidebarOpen(false); }} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'analytics' ? 'bg-pink-600 text-white font-extrabold shadow-md' : 'text-slate-300 hover:bg-slate-850 hover:text-white font-medium'}`}
                    type="button"
                  >
                    📈 <span className="text-rose-400">শপ অ্যানালীটিক্স</span>
                  </button>
                </nav>
              </div>
              
              <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 text-center bg-slate-950/50">
                শপ কন্ট্রোল প্যানেল v৩.০
              </div>
            </div>
          </div>
        )}

      {/* Back Button to main Admin view */}
      <button 
        onClick={onBack} 
        className="absolute top-4 right-4 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition duration-200 shadow-md border border-slate-200 flex items-center gap-1.5 cursor-pointer z-10 hover:translate-y-[-1px]"
        type="button"
      >
        &larr; ব্যাক টু প্যানেল
      </button>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto mt-6">
        
        {/* Header: Hamburger + Search */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-2xl text-slate-700 hover:text-pink-600 focus:outline-none p-2.5 bg-white rounded-xl shadow-md border border-slate-150 hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-center gap-1.5" 
            title="মেনু খুলুন" 
            type="button"
          >
            <span className="text-slate-650 font-extrabold text-sm px-0.5">☰ Menu</span>
          </button>
          
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="স্টোরের প্রোডাক্ট বা ক্যাটাগরি সার্চ করুন..." 
              className="w-full py-2.5 px-5 pr-12 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white text-sm"
              disabled
            />
            <button className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600" type="button">
              🔍
            </button>
          </div>
        </div>

        {/* AI Generated Categories Bar */}
        {showAiCategories && (
          <div className="mb-6 bg-blue-50/75 p-4 rounded-2xl border border-blue-150 text-left transition-all duration-500">
            <div className="text-xs font-bold text-blue-700 mb-2.5 flex items-center gap-1.5 font-sans">
              ✨ <span>এআই লাইভ দ্বারা সংশোধিত লেআউট:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white text-slate-750 text-xs px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm font-medium cursor-pointer hover:bg-pink-600 hover:text-white transition">স্মার্টফোন</span>
              <span className="bg-white text-slate-750 text-xs px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm font-medium cursor-pointer hover:bg-pink-600 hover:text-white transition">স্মার্ট ওয়াচ</span>
              <span className="bg-white text-slate-750 text-xs px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm font-medium cursor-pointer hover:bg-pink-600 hover:text-white transition">ইয়ারফোন</span>
              <span className="bg-white text-slate-755 text-xs px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm font-medium cursor-pointer hover:bg-pink-600 hover:text-white transition">ক্যামেরা অ্যাক্সেসরিজ</span>
            </div>
          </div>
        )}

        {/* Content Render based on activeTab */}
        {activeTab === 'home' && (
          <div>
            {/* Profile Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 mb-8 text-center shadow-sm relative">
              <div className="absolute top-4 left-4 bg-emerald-500/10 text-emerald-600 font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                ● Live View
              </div>
              <div className="w-24 h-24 rounded-full bg-pink-105 mx-auto mb-4 overflow-hidden border-2 border-pink-300 flex items-center justify-center text-4xl text-pink-500 font-bold shadow-sm transition-transform hover:scale-105">
                👤
              </div>
              <h1 className="text-xl font-bold text-slate-800">{profileName} (স্টোর প্রোফাইল নাম)</h1>
              <p className="text-sm text-pink-600 font-semibold mb-3">@{profileUsername}_live</p>
              
              <div className="relative mx-auto max-w-md">
                <p className="w-full text-slate-600 text-sm leading-relaxed text-center bg-slate-50 p-4 rounded-xl border border-slate-200/60 font-semibold">
                  "{profileBio}"
                </p>
                <button 
                  onClick={() => {
                    setEditName(profileName);
                    setEditUsername(profileUsername);
                    setEditBio(profileBio);
                    setActiveTab('edit-interface');
                  }}
                  className="mt-3 inline-flex items-center gap-1 text-[11px] font-black text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100/80 px-3 py-1.5 rounded-lg transition"
                >
                  ✎ এডিট করুন
                </button>
              </div>
            </div>

            {/* Products Section Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                📦 শপ প্রোডাক্ট গ্যালারি
              </h2>
              <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
                {products.length}টি আইটেম প্রদর্শিত
              </span>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition group">
                  <div>
                    <div className="aspect-square bg-slate-50 rounded-xl mb-3 flex items-center justify-center text-slate-400 text-3xl border border-slate-100 relative group-hover:bg-pink-50/20 transition">
                      🎁
                      <button 
                        onClick={() => {
                          setProducts(products.filter(item => item.id !== p.id));
                          triggerToast('প্রোডাক্ট সফলভাবে ডিলিট করা হয়েছে');
                        }}
                        className="absolute top-2 right-2 bg-red-50 text-red-600 hover:bg-red-100 text-[10px] w-6 h-6 flex items-center justify-center rounded-full font-bold transition-all cursor-pointer"
                        title="ডিলিট"
                        type="button"
                      >
                        ✕
                      </button>
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1 text-sm group-hover:text-pink-600 transition">{p.title}</h3>
                  </div>
                  <div className="mt-2 text-left">
                    <div className="text-base font-black text-pink-600 mb-3">{p.price} টাকা</div>
                    <button 
                      onClick={() => triggerToast(`"${p.title}" সফলভাবে অর্ডার কার্টে যোগ হয়েছে!`)}
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer" 
                      type="button"
                    >
                      🛒 বাই নাও
                    </button>
                  </div>
                </div>
              ))}

              <div 
                onClick={() => setActiveTab('add-product')}
                className="bg-slate-100/60 p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-pink-400 hover:bg-pink-50/10 cursor-pointer flex flex-col items-center justify-center text-center gap-2 transition"
              >
                <span className="text-3xl text-slate-400 font-bold">➕</span>
                <span className="text-xs font-bold text-slate-500">নতুন প্রোডাক্ট যুক্ত করুন</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'edit-interface' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
              ✏️ কাস্টম স্টোর ইনফরমেশন এডিট
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">স্টোরের প্রোফাইল নাম:</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">ইউজারনেম / হ্যান্ডেল:</label>
                <div className="flex">
                  <span className="bg-slate-150 border border-slate-200 border-r-0 rounded-l-xl px-3 flex items-center text-xs font-bold text-slate-500">@</span>
                  <input 
                    type="text" 
                    value={editUsername} 
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-r-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">স্টোর ডেমো বায়ো সেকশন:</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full text-slate-700 text-xs bg-slate-50 p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none font-semibold text-gray-700"
                  rows={4}
                  placeholder="স্টোরের উদ্দেশ্যে কিছু তথ্য বা সংক্ষিপ্ত বর্ণনা লিখুন..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => {
                    setProfileName(editName);
                    setProfileUsername(editUsername);
                    setProfileBio(editBio);
                    triggerToast('স্টোর প্রোফাইল সফলভাবে সংরক্ষণ করা হয়েছে!');
                    setActiveTab('home');
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
                  type="button"
                >
                  সংরক্ষণ করুন
                </button>
                <button 
                  onClick={() => setActiveTab('home')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
                  type="button"
                >
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add-product' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
              ➕ নতুন প্রোডাক্ট অ্যাড রিমোট সিমুলেটর
            </h2>
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">প্রোডাক্টের নাম:</label>
                <input 
                  type="text" 
                  placeholder="যেমন: স্মার্ট ওয়াচ আল্ট্রা ২"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">দাম (টাকা):</label>
                <input 
                  type="text" 
                  placeholder="যেমন: ৩,৫০০"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-500 text-slate-800"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => {
                    if (!newProdName || !newProdPrice) {
                      triggerToast('দয়া করে নাম ও দাম লিখুন!');
                      return;
                    }
                    setProducts([...products, { 
                      id: Date.now().toString(), 
                      title: newProdName, 
                      price: newProdPrice,
                      available: 50,
                      status: 'Active',
                      bg: 'from-indigo-400 to-pink-505',
                      emoji: '🎁'
                    }]);
                    setNewProdName('');
                    setNewProdPrice('19.00');
                    triggerToast('নতুন প্রোডাক্ট লাইভ গ্যালারিতে যোগ করা হয়েছে!');
                    setActiveTab('home');
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition cursor-pointer"
                  type="button"
                >
                  প্রোডাক্ট পাবলিশ করুন &rarr;
                </button>
                <button 
                  onClick={() => setActiveTab('home')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                  type="button"
                >
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customer-control' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left">
            <h2 className="text-lg font-bold text-slate-800 mb-1.5 flex items-center gap-2 pb-2 border-b border-slate-100">
              👥 কাস্টমার ড্যাশবোর্ড ও শপ কন্ট্রোল
            </h2>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed font-semibold">
              স্টোরে ইতিমধ্যে রেজিস্টার করা কাস্টমারদের অর্ডার এবং মেম্বারশিপ ট্যাকিং প্যানেল।
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-slate-700 text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-left font-bold uppercase tracking-wider">
                    <th className="p-3">ক্রেতার নাম</th>
                    <th className="p-3">ইমেইল</th>
                    <th className="p-3">অর্ডার হিস্টোরি</th>
                    <th className="p-3">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-bold text-slate-800">জামিল আহমেদ</td>
                    <td className="p-3 font-mono">jamil@gmail.com</td>
                    <td className="p-3 font-semibold">১টি (মোট ২,৫০০ টাকা)</td>
                    <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded font-extrabold text-[10px]">পেইড</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800">রাকিব হাসান</td>
                    <td className="p-3 font-mono">rakib10@hotmail.com</td>
                    <td className="p-3 font-semibold">২টি (মোট ৪,৭০০ টাকা)</td>
                    <td className="p-3"><span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded font-extrabold text-[10px]">প্রসেসিং</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button 
              onClick={() => setActiveTab('home')}
              className="mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              type="button"
            >
              &larr; স্টোর ভিউতে ফিরুন
            </button>
          </div>
        )}

        {activeTab === 'upgrade-system' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left max-w-xl mx-auto">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
              ⚡ সিস্টেম আপগ্রেড ড্যাশবোর্ড
            </h2>
            <div className="space-y-4 font-semibold text-xs text-slate-600">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-150">
                <div>
                  <p className="font-bold text-slate-800">রিসোর্স লিমিট</p>
                  <p className="text-[10px] text-slate-400">প্রতি সেকেন্ড রিকোয়েস্ট লিমিট</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-pink-600 text-sm">১০০ req/sec</p>
                  <span className="bg-indigo-100 text-indigo-800 text-[9px] font-bold uppercase py-0.5 px-1.5 rounded">STANDARD</span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-150">
                <div>
                  <p className="font-bold text-slate-800">ভার্সন কনফিগারেশন</p>
                  <p className="text-[10px] text-slate-400">চলতি সার্ভার ইঞ্জিন</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-slate-800">v3.0.1 Stable</p>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase py-0.5 px-1.5 rounded">ACTIVE</span>
                </div>
              </div>

              <div className="bg-pink-50 border border-pink-100 p-4 rounded-xl text-pink-850">
                <span className="font-bold text-pink-900">💡 প্রিমিয়াম ফিচার সচল করুন:</span>
                <p className="mt-1 leading-relaxed text-[11px]">
                  আপনার ড্রপশিপিং স্টੋਰটি আল্ট্রা ফাস্ট করতে এবং রকেট স্পিড বুস্টিং সচল করতে প্রিমিয়াম প্রফেশনাল সাবস্ক্রিপশনে আপগ্রেড করুন।
                </p>
                <button 
                  onClick={() => triggerToast('সুপার বুস্ট সিস্টেম সচল করতে আপনার পার্সোনাল একাউন্ট কোড ভেরিফাই করুন')}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-[10px] px-3 py-2 rounded-lg mt-3 transition"
                >
                  🚀 এখন আপগ্রেড করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mail-box' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left">
            <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2 pb-2 border-b border-slate-100">
              ✉️ মেইল বক্স সিস্টেম (Logs)
            </h2>
            <p className="text-xs text-slate-400 font-semibold mb-4 text-slate-500">
              সার্ভার থেকে ক্রেতাদের পাঠানো ওর্ডার ইমেইল কনফার্মেশন এবং পেমেন্ট রিসিট।
            </p>
            <div className="space-y-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs">
                <div className="flex justify-between items-center mb-1 text-[11px] text-slate-400 font-bold">
                  <span>To: jamil@gmail.com</span>
                  <span>১০ মিনিট আগে</span>
                </div>
                <p className="font-bold text-slate-800 text-slate-700">অনলাইন পেমেন্ট কনফার্মেশন রিসিভড</p>
                <p className="text-[11px] text-slate-500 mt-1">"প্রিয় জামিল, আপনার ড্রপশিপিং শপ থেকে ২,৫০০ টাকা মূল্যের অর্ডারটি সফলভাবে প্রসেস করা হয়েছে।"</p>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-extrabold text-[9px] mt-2 inline-block">SMTP SENT</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs">
                <div className="flex justify-between items-center mb-1 text-[11px] text-slate-400 font-bold">
                  <span>To: System Admins</span>
                  <span>১ ঘণ্টা আগে</span>
                </div>
                <p className="font-bold text-slate-800 text-slate-700">নতুন শপ রেজিস্ট্রেশন নোটিফিকেশন</p>
                <p className="text-[11px] text-slate-500 mt-1">"এমডি আরিয়ান তার ডেমো ড্রপশিপিং প্যানেল সচল করেছে।"</p>
                <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-extrabold text-[9px] mt-2 inline-block">DISPATCHED</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left">
            <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2 pb-2 border-b border-slate-100">
              📈 শপ অ্যানালিটিক্স এবং ভিজিটর রিপোর্ট
            </h2>
            <p className="text-xs text-slate-500 font-semibold mb-6">
              স্টোরে কাস্টমার এনগেজমেন্ট ও ব্রাউজিং গতিবিধি মনিটর।
            </p>
            
            {/* Visual Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-900 text-white p-4 rounded-xl shadow-sm border border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">আজকের মোট সেল</p>
                <p className="text-xl font-black mt-1 text-pink-500">৭,৬০০ টাকা</p>
              </div>
              <div className="bg-slate-900 text-white p-4 rounded-xl shadow-sm border border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">লাইভ ভিজিটরস</p>
                <p className="text-xl font-black mt-1 text-emerald-400 animate-pulse">৩ জন ব্রাউজ করছেন</p>
              </div>
              <div className="bg-slate-900 text-white p-4 rounded-xl shadow-sm border border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">অর্ডার কনভার্সন রেট</p>
                <p className="text-xl font-black mt-1 text-sky-400">৪.৫%</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-250 text-center py-8">
              <span className="text-2xl">📊</span>
              <p className="text-xs font-bold text-slate-600 mt-2">লাইভ ট্রাফিকের রিয়েল-টাইম গ্রাফ রেডি হচ্ছে...</p>
              <p className="text-[10px] text-slate-400 mt-1">পরবর্তী পেইড অর্ডারের সাথে ডাটা আপডেট হবে।</p>
            </div>
          </div>
        )}

      </div>
    </main>

      {/* Floating AI Bubble Button */}
      <div 
        onClick={() => {
          setIsAiLiveActive(!isAiLiveActive);
          triggerToast(isAiLiveActive ? 'এআই লাইভ অ্যাসিস্ট্যান্ট বন্ধ করা হয়েছে' : 'এআই লাইভ অ্যাসিস্ট্যান্ট চালু করা হয়েছে');
        }} 
        className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-tr from-indigo-600 to-pink-600 text-white rounded-full flex items-center justify-center text-xl shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 z-50 ${
          isAiLiveActive ? 'ring-4 ring-pink-300 ring-offset-2 animate-bounce' : ''
        }`}
        title="এআই লাইভ ভয়েস অ্যাসিস্ট্যান্ট"
        id="floating-ai-bubble-btn"
      >
        <span className="text-2xl">{isAiLiveActive ? '🎙️' : '🔇'}</span>
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${isAiLiveActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
        </span>
      </div>

      {/* Floating AI Live Information Panel */}
      {isAiLiveActive && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden transition-all duration-300 z-50 text-left">
          <div className="bg-slate-950 p-4 flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-extrabold text-[10px] tracking-wider text-indigo-400 uppercase">GEMINI LIVE AUTOMATION</span>
            </div>
            <button 
              onClick={() => setIsAiLiveActive(false)} 
              className="text-slate-400 hover:text-white hover:bg-slate-800 text-xs p-1.5 rounded-lg cursor-pointer transition"
              type="button"
            >
              ✕
            </button>
          </div>

          <div className="p-4 bg-slate-900 border-b border-slate-800 relative">
            <div className="w-full h-36 bg-slate-950 rounded-xl overflow-hidden relative flex flex-col items-center justify-center border border-slate-800">
              
              {/* Voice Waver Animation */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-1.5 h-4 bg-pink-500 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-1.5 h-8 bg-indigo-500 rounded animate-pulse" style={{ animationDelay: '0.3s' }}></span>
                <span className="w-1.5 h-12 bg-pink-500 rounded animate-pulse" style={{ animationDelay: '0.5s' }}></span>
                <span className="w-1.5 h-6 bg-indigo-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-3 bg-pink-500 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></span>
              </div>
              <p className="text-[10px] text-indigo-300 font-bold tracking-wide animate-pulse">
                এআই আপনার রিয়েল-টাইম ভয়েস শুনছে...
              </p>
              <p className="text-[9px] text-slate-500 mt-1 font-semibold">
                (Chrome ব্রাউজার এ বাংলায় সরাসরি কথা বলুন)
              </p>
            </div>

            {/* Quick Simulation Commands */}
            <div className="mt-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">💡 কুইক ভয়েস সিমুলেশন (ক্লিক করুন):</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button 
                  onClick={() => executeVoiceSim('সার্চ বারের নিচে ক্যাটাগরি মেনু যুক্ত করো')}
                  className="bg-slate-850 hover:bg-slate-800 text-[10px] text-left p-1.5 py-2 rounded-lg border border-slate-750 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap active:scale-95 transition"
                  type="button"
                >
                  🎙️ ক্যাটাগরি বার এড করুন
                </button>
                <button 
                  onClick={() => executeVoiceSim('স্টোর প্রোফাইল নাম পরিবর্তন করো')}
                  className="bg-slate-850 hover:bg-slate-800 text-[10px] text-left p-1.5 py-2 rounded-lg border border-slate-750 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap active:scale-95 transition"
                  type="button"
                >
                  🎙️ প্রোফাইল নাম বদলান
                </button>
                <button 
                  onClick={() => executeVoiceSim('প্রোডাক্ট গুলোর দাম কমাও')}
                  className="bg-slate-850 hover:bg-slate-800 text-[10px] text-left p-1.5 py-2 rounded-lg border border-slate-750 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap active:scale-95 transition"
                  type="button"
                >
                  🎙️ প্রোডাক্টের দাম কমান
                </button>
                <button 
                  onClick={() => executeVoiceSim('বায়ো আপডেট করো')}
                  className="bg-slate-850 hover:bg-slate-800 text-[10px] text-left p-1.5 py-2 rounded-lg border border-slate-750 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap active:scale-95 transition"
                  type="button"
                >
                  🎙️ নতুন বায়ো ট্যাগ দিন
                </button>
              </div>
            </div>
          </div>

          {/* AI Code modification log workspace output */}
          <div className="p-4 bg-slate-950 max-h-44 overflow-y-auto font-mono text-[11px]">
            <div className="text-[9px] font-bold text-slate-400 mb-1.5 flex justify-between tracking-wide">
              <span>⚡ এআই কোড আর্কিটেক্ট লগ:</span>
              <span className="text-emerald-400 font-bold">রিয়েল-টাইম</span>
            </div>
            <pre className="p-2 py-2.5 rounded-lg bg-slate-900 border border-slate-850 whitespace-pre-wrap leading-relaxed text-slate-300 font-semibold select-none text-[10px]">
              {localCodeLog}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
}

