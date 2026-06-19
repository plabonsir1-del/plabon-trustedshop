import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  User, 
  Tag, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Inbox, 
  Clock, 
  Sparkles, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface SupportMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export function MailSystem() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchMessages = async () => {
    try {
      setFetching(true);
      const res = await fetch('/api/support/messages');
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error("Error fetching support tickets:", e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!name || !email || !subject || !message) {
      setErrorMsg('দয়া করে প্রতিটি ঘর সঠিক তথ্য দিয়ে পূরণ করুন!');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/support/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        // Clean fields
        setSubject('');
        setMessage('');
        // Re-fetch mail inbox logs
        fetchMessages();
      } else {
        setErrorMsg(data.message || 'মেসেজ পাঠাতে কোনো সমস্যা হয়েছে।');
      }
    } catch (err: any) {
      setErrorMsg('সার্ভারে যোগাযোগ করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="pts-mail-system-hub" className="space-y-8 pb-10">
      {/* Top Banner Accent */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center justify-center pointer-events-none">
          <Mail size={320} className="text-white transform translate-x-12 translate-y-12 rotate-12" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider text-pink-100 border border-white/10">
            <Sparkles size={13} className="animate-pulse" /> Gmail Auto-Trigger Active
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            রিয়েল-টাইম কন্টাক্ট ও জিমেইল সাপোর্ট সিস্টেম
          </h1>
          <p className="text-pink-100 text-sm sm:text-base leading-relaxed">
            আপনার যেকোনো মতামত, অভিযোগ বা হেল্প রিকোয়েস্ট সরাসরি আমাদের সিস্টেমে পাঠিয়ে দিন। এটি স্বয়ংক্রিয়ভাবে আমাদের অফিসিয়াল জিমেইল ইনবক্সে ট্র্যাকিং আইডি সহ পৌঁছে যাবে।
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <span className="flex items-center gap-1.5 text-xs bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
              <ShieldCheck size={14} className="text-emerald-400" /> Secure Database Vault
            </span>
            <span className="flex items-center gap-1.5 text-xs bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
              <Clock size={14} className="text-amber-400" /> Instant SMTP Dispatches
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Left, Inbox/Submitted Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Hand: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Send size={18} className="text-pink-600" /> নতুন সাপোর্ট টিকিট বা মেসেজ পাঠান
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              নিচের ফর্মটি পূরণ করে সাবমিট করুন, কোডটি সরাসরি এডমিনের রিসিভার জিমেইলে পুশ হবে।
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-sm">
                <AlertCircle size={18} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 text-sm font-semibold">
                <CheckCircle size={18} className="shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                <User size={13} className="text-gray-400" /> আপনার সম্পূর্ণ নাম
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: মোঃ সাকিব হাসান"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-500 transition"
                required
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                <Mail size={13} className="text-gray-400" /> ইমেইল এড্রেস
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="যেমন: sakib@domain.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-500 transition"
                required
              />
            </div>

            {/* Subject Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                <Tag size={13} className="text-gray-400" /> মেসেজের বিষয় (Subject)
              </label>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="যেমন: সাবস্ক্রিপশন সংক্রান্ত প্রশ্ন / পেমেন্ট ভেরিফিকেশন"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-500 transition"
                required
              />
            </div>

            {/* Message Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                <FileText size={13} className="text-gray-400" /> আপনার বার্তাটি লিখুন (Message)
              </label>
              <textarea 
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="আপনার সমস্যার কথা এখানে বিস্তারিত উপস্থাপন করুন..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-500 transition resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-pink-500/15 flex items-center justify-center gap-2 transition disabled:opacity-75 focus:outline-none cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>প্রসেসিং হচ্ছে, দয়া করে অপেক্ষা করুন...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>সরাসরি জিমেইলে সাবমিট করুন</span>
                  <ArrowRight size={14} className="ml-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Hand: Submitted Logs & Status */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Inbox size={16} className="text-indigo-600" /> মেসেজ ও টিকেট হিস্ট্রি ({messages.length})
              </h3>
              <button 
                onClick={fetchMessages}
                disabled={fetching}
                className="text-[10px] text-pink-600 font-bold uppercase tracking-wider hover:underline focus:outline-none disabled:opacity-50"
              >
                {fetching ? 'Syncing...' : 'Refresh Logs'}
              </button>
            </div>

            {fetching && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-2">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-gray-400">লোডিং হচ্ছে...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-3">
                <div className="w-12 h-12 bg-pink-50 border border-pink-100 text-pink-500 rounded-full flex items-center justify-center mx-auto">
                  <Mail size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-700">কোনো পাঠানো টিকিট নেই</h4>
                  <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto">
                    আপনার আইডি থেকে এখনো কোনো সাপোর্ট মেসেজ পাঠানো হয়নি। সরাসরি যোগাযোগ করতে বামের ফর্মটি ব্যবহার করুন।
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
                {messages.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 bg-gradient-to-br from-gray-50/70 to-indigo-50/20 rounded-xl border border-gray-100 space-y-2.5 relative hover:border-pink-200 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 truncate max-w-[200px]" title={item.subject}>
                          {item.subject}
                        </h4>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <User size={10} /> {item.name} ({item.email})
                        </p>
                      </div>
                      <span className="shrink-0 inline-flex items-center gap-1 text-[9px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
                        <CheckCircle size={10} /> Saved to DB
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-50 leading-relaxed font-sans whitespace-pre-line">
                      {item.message}
                    </p>

                    <div className="flex items-center justify-between text-[9px] text-gray-400 border-t border-gray-50 pt-1.5">
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {new Date(item.created_at).toLocaleString('bn-BD', { hour12: true })}
                      </span>
                      <span className="font-mono text-gray-300">#{item.id.toString().slice(-6)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Guide Card */}
          <div className="bg-gradient-to-br from-indigo-50/40 text-indigo-950 p-5 rounded-2xl border border-indigo-100 space-y-3">
            <h4 className="text-xs font-bold flex items-center gap-1.5 text-indigo-900">
              <ShieldCheck size={15} /> জিমেইল ও নোটিফিকেশন গাইড
            </h4>
            <p className="text-[11px] text-indigo-900/80 leading-relaxed font-sans">
              ১. <strong>Gmail SMTP ইন্টিগ্রেশন:</strong> আপনি যখন এডমিন ক্রেডেনশিয়াল থেকে ইমেইল <code>EMAIL_USER</code> এবং পাসওয়ার্ড <code>EMAIL_PASSWORD</code> সেটআপ করবেন, মেইলিং সিস্টেমটি সম্পূর্ণ সক্রিয় হয়ে যাবে।
            </p>
            <p className="text-[11px] text-indigo-900/80 leading-relaxed font-sans">
              ২. <strong>নিরাপদ ডাটা স্টোরেজ:</strong> প্রতিটি যোগাযোগ ডাটাবেজে স্থায়ীভাবে সংরক্ষিত থাকবে, যার ফলে জিমেইল নিষ্ক্রিয় থাকলেও কাস্টমার অভিযোগ হারাতে পারবে না।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
