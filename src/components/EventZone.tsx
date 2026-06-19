import React, { useState } from 'react';
import { 
  Trophy, 
  Gift, 
  Sparkles, 
  Gamepad2, 
  Bell, 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Users, 
  ChevronRight, 
  Volume2,
  Copy,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type TabType = 'airdrop' | 'update' | 'tournament';

interface EventZoneProps {
  t?: any;
}

export function EventZone({ t }: EventZoneProps) {
  const [activeTab, setActiveTab] = useState<TabType>('airdrop');
  const [claimedDrops, setClaimedDrops] = useState<number[]>([]);
  const [joiningTournament, setJoiningTournament] = useState<number | null>(null);
  const [joinedTournaments, setJoinedTournaments] = useState<number[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Mini actions
  const handleClaimDrop = (id: number) => {
    if (claimedDrops.includes(id)) return;
    setClaimedDrops(prev => [...prev, id]);
  };

  const handleJoinTournament = (id: number) => {
    if (joinedTournaments.includes(id)) return;
    setJoiningTournament(id);
    setTimeout(() => {
      setJoinedTournaments(prev => [...prev, id]);
      setJoiningTournament(null);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Static Data
  const airdrops = [
    {
      id: 1,
      title: "Royal Palace Free Coin Airdrop",
      titleBn: "রয়্যাল প্যালেস ফ্রি কয়েন এয়ারড্রপ",
      reward: "500 RCoins",
      timeLeft: "১ দিন ১২ ঘন্টা বাকি",
      tasks: [
        "আমাদের ভিডিও গ্যালারির যেকোনো ২ টি ভিডিও সম্পূর্ণ দেখুন",
        "প্রোফাইল থেকে ফেসবুক অথবা ইউটিউব চ্যানেল সাবস্ক্রাইব করুন"
      ],
      difficulty: "সহজ",
      participants: "১.২K জন যুক্ত হয়েছেন"
    },
    {
      id: 2,
      title: "Weekly Active User Reward",
      titleBn: "সাপ্তাহিক সক্রিয় ইউজার পুরস্কার",
      reward: "1500 RCoins",
      timeLeft: "৪ দিন বাকি",
      tasks: [
        "টানা ৫ দিন দৈনিক লগইন করুন",
        "যেকোনো গেম খেলে ১০০০+ স্কোর করুন"
      ],
      difficulty: "মাঝারি",
      participants: "৩৫০ জন যুক্ত হয়েছেন"
    },
    {
      id: 3,
      title: "New Member Welcome Gift",
      titleBn: "নতুন মেম্বারদের জন্য বিশেষ উপহার",
      reward: "100 RCoins + Elite Badge",
      timeLeft: "সীমিত সুযোগ",
      tasks: [
        "আপনার প্রথম অ্যাকাউন্ট ভেরিফিকেশন সম্পূর্ণ করুন",
      ],
      difficulty: "অতি সহজ",
      participants: "সর্বোচ্চ ৩কে ইউজার"
    }
  ];

  const updates = [
    {
      version: "v2.5.0",
      date: "৩ জুন, ২০২৬",
      title: "Event Center & Audio Connection Upgrades",
      titleBn: "ইভেন্ট সেন্টার ও অডিও কানেকশন আপগ্রেড",
      badge: "সর্বশেষ সংস্করণ",
      type: "major",
      changes: [
        "নতুন 'ইভেন্ট জোন' যুক্ত করা হয়েছে যেখানে এয়ারড্রপ, লেটেস্ট আপডেট এবং টুর্নামেন্ট দেখতে পাবেন।",
        "রয়্যাল প্যালেস লাইভ ভয়েস কানেকশন আরও নিরবচ্ছিন্ন ও নিখুঁত করা হয়েছে।",
        "থ্রিডি মিনার সহায়ক সিস্টেমের স্পর্শ অনুভূতিশীলতা বাড়ানো হয়েছে।"
      ]
    },
    {
      version: "v2.4.2",
      date: "২৪ মে, ২০২৬",
      title: "Premium Store Integration & Dashboard Optimizations",
      titleBn: "প্রিমিয়াম স্টোর ইন্টিগ্রেশন এবং ড্যাশবোর্ড অপ্টিমাইজেশন",
      badge: "আপডেট",
      type: "minor",
      changes: [
        "গ্লোবাল ও রয়্যাল প্যালেস স্টোরে সহজে কেনাকাটার সিস্টেম যুক্ত করা হয়েছে।",
        "রয়্যাল লাইভ ক্লক ও গেমসের গতি বৃদ্ধি করা হয়েছে এবং ল্যাগ দূর করা হয়েছে।"
      ]
    },
    {
      version: "v2.3.0",
      date: "১০ মে, ২০২৬",
      title: "Full-scale Mobile Adaptations",
      titleBn: "পরিপূর্ণ মোবাইল অ্যাডাপ্টেশন",
      badge: "স্থির সংস্করণ",
      type: "minor",
      changes: [
        "মোবাইলের জন্য নিচে উন্নত ডক স্টাইল ন্যাভিগেশন বার ডিজাইন করা হয়েছে।",
        "অফলাইন মোড সাপোর্ট এবং দ্রুত ডাটা লোডিং প্রসেস যুক্ত করা হয়েছে।"
      ]
    }
  ];

  const tournaments = [
    {
      id: 101,
      title: "Ludo King Palace Championship",
      titleBn: "লুডু কিং প্যালেস চ্যাম্পিয়নশিপ",
      prize: "৳৫,০০০ পুরস্কার পুল",
      entryFee: "ফ্রি (সীমিত আসন)",
      date: "১২ জুন, ২০২৬",
      time: "রাত ৯:০০ টা",
      slots: "৬৪ টি দলের মধ্যে ৪২ টি বুকড",
      gameMode: "৪ প্লেয়ার নকআউট",
      status: "open"
    },
    {
      id: 102,
      title: "Royal Free Fire Solo Match",
      titleBn: "রয়্যাল ফ্রি ফায়ার সোলো স্কোয়াশ",
      prize: "৩০০০ ডায়মন্ড + বিশেষ ট্রফি",
      entryFee: "৫০ কয়েন",
      date: "১৮ জুন, ২০২৬",
      time: "বিকাল ৪:০০ টা",
      slots: "৪৮ জনের মধ্যে ১২ জন বুকড",
      gameMode: "ক্লাসিক সোলো ম্যাপ",
      status: "open"
    },
    {
      id: 103,
      title: "Palace Memory Master Match",
      titleBn: "প্যালেস মেমোরি মাস্টার প্রতিযোগিতা",
      prize: "৳১,৫০০ ক্যাশ প্রাইজ",
      entryFee: "ফ্রি",
      date: "০৫ জুন, ২০২৬",
      time: "রাত ৮:৩০ টা",
      slots: "১০০ জনের মধ্যে ৮০ জন বুকড",
      gameMode: "টাইম ট্রায়াল",
      status: "nearly-full"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-24 rounded-3xl overflow-hidden shadow-sm border border-slate-200">
      
      {/* Dynamic Announcement Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-4 py-3 text-center text-xs font-semibold flex items-center justify-center gap-2 shadow-sm relative overflow-hidden">
        <span className="animate-bounce"><Volume2 size={16} /></span>
        <span>আমাদের নতুন টুর্নামেন্ট রেজিস্ট্রেশন শুরু হয়েছে! এখনই যুক্ত হয়ে লুফে নিন আকর্ষণীয় ক্যাশ প্রাইজ।</span>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full transform translate-x-12 -translate-y-12"></div>
      </div>

      {/* Main Container */}
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        
        {/* Event Banner Card */}
        <div className="mb-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-pink-950 p-6 md:p-10 text-white relative overflow-hidden shadow-xl border border-slate-700/50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
          <div className="relative z-10 max-w-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25 text-[11px] px-3.5 py-1.5 rounded-xl font-black uppercase tracking-widest inline-flex items-center gap-1.5 border border-pink-400">
                <Trophy size={13} className="animate-bounce" /> RPB LOGO
              </span>
              <span className="bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[11px] px-3 py-1 bg-white/5 backdrop-blur-sm rounded-xl font-bold uppercase tracking-wider inline-flex items-center gap-1.5 matches-glow">
                <Sparkles size={11} className="text-pink-400" /> Event Zone
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3">
              রয়্যাল ইভেন্ট ও এক্সক্লুসিভ রিওয়ার্ডস
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
              এয়ার ড্রপ ও লাইভ টুর্নামেন্টে অংশগ্রহণ করে জিতে নিন আকর্ষণীয় রয়্যাল ফ্রি কয়েন, প্রিমিয়াম সদস্যপদ এবং আকর্ষণীয় ক্যাশ রিওয়ার্ড!
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono">
              <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
                <span>০৩টি লাইভ এয়ারড্রপ</span>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/5 flex items-center gap-2">
                <Award size={14} className="text-yellow-400" />
                <span>৳৯,৫০০+ প্রাইজ কাপ</span>
              </div>
            </div>
          </div>
          <div className="absolute right-8 bottom-4 md:right-16 md:bottom-8 opacity-10 md:opacity-30 transform hover:scale-110 transition duration-300">
            <Trophy size={180} className="text-yellow-400 drop-shadow-[0_10px_10px_rgba(251,191,36,0.3)]" />
          </div>
        </div>

        {/* Outer Split Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Menu Panel (Selection Cards) */}
          <div className="md:col-span-4 flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-none">
            
            {/* Tab: Airdrop */}
            <button 
              onClick={() => setActiveTab('airdrop')}
              className={`flex-1 md:flex-initial text-left p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 group min-w-[140px] md:min-w-0 ${activeTab === 'airdrop' ? 'bg-white border-pink-500 shadow-md translate-y-[-2px] md:translate-x-[4px]' : 'bg-white/65 hover:bg-white border-slate-200 hover:border-slate-300'}`}
            >
              <div className={`p-3 rounded-xl transition ${activeTab === 'airdrop' ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                <Gift size={20} />
              </div>
              <div className="hidden md:block">
                <h4 className="font-bold text-sm text-slate-900">এয়ার ড্রপ (Air Drop)</h4>
                <p className="text-xs text-slate-500 mt-0.5">ফ্রি কয়েন ও মেম্বারশিপ টাস্ক</p>
              </div>
              <div className="md:hidden text-center mx-auto">
                <span className="block font-bold text-xs mt-1 text-slate-900">এয়ার ড্রপ</span>
              </div>
              <ChevronRight size={16} className={`ml-auto hidden md:block transition ${activeTab === 'airdrop' ? 'text-pink-600 translate-x-1' : 'text-slate-300'}`} />
            </button>

            {/* Tab: New Update */}
            <button 
              onClick={() => setActiveTab('update')}
              className={`flex-1 md:flex-initial text-left p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 group min-w-[140px] md:min-w-0 ${activeTab === 'update' ? 'bg-white border-pink-500 shadow-md translate-y-[-2px] md:translate-x-[4px]' : 'bg-white/65 hover:bg-white border-slate-200 hover:border-slate-300'}`}
            >
              <div className={`p-3 rounded-xl transition ${activeTab === 'update' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                <Sparkles size={20} />
              </div>
              <div className="hidden md:block">
                <h4 className="font-bold text-sm text-slate-900">নিউ আপডেট (New Update)</h4>
                <p className="text-xs text-slate-500 mt-0.5">রিলিজ নোট ও মেম্বারশিপ চেঞ্জলগ</p>
              </div>
              <div className="md:hidden text-center mx-auto">
                <span className="block font-bold text-xs mt-1 text-slate-900">নিউ আপডেট</span>
              </div>
              <ChevronRight size={16} className={`ml-auto hidden md:block transition ${activeTab === 'update' ? 'text-indigo-600 translate-x-1' : 'text-slate-300'}`} />
            </button>

            {/* Tab: Tournament */}
            <button 
              onClick={() => setActiveTab('tournament')}
              className={`flex-1 md:flex-initial text-left p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 group min-w-[140px] md:min-w-0 ${activeTab === 'tournament' ? 'bg-white border-pink-500 shadow-md translate-y-[-2px] md:translate-x-[4px]' : 'bg-white/65 hover:bg-white border-slate-200 hover:border-slate-300'}`}
            >
              <div className={`p-3 rounded-xl transition ${activeTab === 'tournament' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                <Gamepad2 size={20} />
              </div>
              <div className="hidden md:block">
                <h4 className="font-bold text-sm text-slate-900">টুর্নামেন্ট (Tournament)</h4>
                <p className="text-xs text-slate-500 mt-0.5">গেম চ্যাম্পিয়নশিপ ও প্রাইজ পুল</p>
              </div>
              <div className="md:hidden text-center mx-auto">
                <span className="block font-bold text-xs mt-1 text-slate-900">টুর্নামেন্ট</span>
              </div>
              <ChevronRight size={16} className={`ml-auto hidden md:block transition ${activeTab === 'tournament' ? 'text-green-600 translate-x-1' : 'text-slate-300'}`} />
            </button>

            {/* Side Static Helper */}
            <div className="hidden md:block bg-gradient-to-br from-indigo-50 to-pink-50 p-5 rounded-2xl border border-pink-100/40 text-xs text-slate-600 leading-relaxed mt-4">
              <span className="font-bold text-pink-600 block mb-1">গুরুত্বপূর্ণ নির্দেশনা:</span>
              রয়্যাল প্যালেস বিডি ইভেন্টগুলোর সমস্ত রিওয়ার্ড আপনার নিজস্ব অ্যাকাউন্টের ওয়ালেটে সরাসরি যুক্ত হবে। যেকোনো তথ্যের জন্য সাপোর্ট টিমে যোগাযোগ রাখুন।
            </div>

          </div>

          {/* Right Display Panel */}
          <div className="md:col-span-8">
            <AnimatePresence mode="wait">
              
              {/* AIRDROP PORTAL */}
              {activeTab === 'airdrop' && (
                <motion.div
                  key="airdrop"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="font-extrabold text-lg flex items-center gap-2 text-slate-900">
                        <Gift className="text-pink-500" size={22} /> সচল এয়ারড্রপ সমূহ
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">টাস্ক সম্পন্ন করে সরাসরি রয়্যাল কয়েন রিক্লেম করুন</p>
                    </div>
                    <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200/50">৩টি উপলব্ধ</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {airdrops.map((drop) => {
                      const isClaimed = claimedDrops.includes(drop.id);
                      return (
                        <div key={drop.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-pink-300/40 transition duration-300">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                            <div>
                              <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mb-1 bg-slate-50 px-2 py-0.5 w-max rounded-md">
                                <Clock size={12} /> {drop.timeLeft}
                              </span>
                              <h4 className="font-bold text-slate-900 text-base">{drop.titleBn}</h4>
                              <p className="text-xs text-slate-400 font-mono mt-0.5">{drop.title}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs block text-slate-400">পুরস্কার মান</span>
                              <span className="font-extrabold text-pink-600 text-lg">{drop.reward}</span>
                            </div>
                          </div>

                          <div className="my-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-2">
                            <span className="font-bold text-slate-700 block">সম্পন্ন করার টাস্ক:</span>
                            {drop.tasks.map((task, idx) => (
                              <div key={idx} className="flex gap-2 text-slate-600 leading-relaxed">
                                <span className="text-pink-500 font-extrabold">{idx + 1}.</span>
                                <span>{task}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                            <span className="text-xs text-slate-500 flex items-center gap-1.5">
                              <Users size={13} className="text-purple-500" />
                              {drop.participants}
                            </span>
                            <button
                              onClick={() => handleClaimDrop(drop.id)}
                              disabled={isClaimed}
                              className={`text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${isClaimed ? 'bg-green-100 text-green-700 pointer-events-none' : 'bg-pink-600 hover:bg-pink-700 text-white shadow-sm hover:shadow active:scale-95'}`}
                            >
                              {isClaimed ? (
                                <>
                                  <CheckCircle2 size={14} /> Claimed (ক্লেমড)
                                </>
                              ) : (
                                <>
                                  টাস্ক করুন ও ক্লেম করুন <ArrowRight size={14} />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* NEW UPDATE SECTION */}
              {activeTab === 'update' && (
                <motion.div
                  key="update"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="font-extrabold text-lg flex items-center gap-2 text-slate-900">
                        <Sparkles className="text-indigo-500" size={22} /> সিস্টেম রিলিজ নোট ও আপডেট
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">রয়্যাল প্যালেস বিডি-এর সাম্প্রতিক আপডেটের তালিকা</p>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200/50">নতুন v2.5.0</span>
                  </div>

                  <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200 before:py-10">
                    {updates.map((up, i) => (
                      <div key={up.version} className="relative pl-10 md:pl-12 group">
                        
                        {/* Timeline node */}
                        <div className={`absolute left-2.5 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ring-4 transition duration-300 ${i === 0 ? 'bg-indigo-600 ring-indigo-200 scale-125' : 'bg-slate-400 ring-slate-100'}`}></div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm group-hover:border-indigo-200 transition duration-300">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900 text-base">{up.version}</span>
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${up.type === 'major' ? 'bg-pink-100 text-pink-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {up.badge}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                              <Calendar size={12} /> {up.date}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-slate-800 mb-3">{up.titleBn}</h4>

                          <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside leading-relaxed pl-1">
                            {up.changes.map((change, idx) => (
                              <li key={idx} className="marker:text-indigo-500 leading-relaxed">{change}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TOURNAMENT SECTION */}
              {activeTab === 'tournament' && (
                <motion.div
                  key="tournament"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="font-extrabold text-lg flex items-center gap-2 text-slate-900">
                        <Gamepad2 className="text-green-600" size={22} /> গেম চ্যাম্পিয়নশিপ টুর্নামেন্ট
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">মজার গেম খেলুন ও বড় ক্যাশ প্রাইজ জয়ী হন</p>
                    </div>
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200/50">১টি আসন্ন</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tournaments.map((tour) => {
                      const isJoined = joinedTournaments.includes(tour.id);
                      const isJoining = joiningTournament === tour.id;

                      return (
                        <div key={tour.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-green-300 transition duration-300 relative overflow-hidden">
                          {tour.status === 'nearly-full' && (
                            <div className="absolute top-0 right-0 bg-yellow-500 text-white text-[9px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                              Fast Filling
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-1 text-xs text-slate-400 mb-2">
                              <Calendar size={13} className="text-green-600" />
                              <span className="font-semibold">{tour.date}</span>
                              <span className="mx-1">•</span>
                              <span>{tour.time}</span>
                            </div>

                            <h4 className="font-bold text-slate-900 text-base mb-1">{tour.titleBn}</h4>
                            <p className="text-xs text-slate-400 font-mono mb-4">{tour.title}</p>

                            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs mb-4">
                              <div>
                                <span className="text-slate-400 block text-[9px] uppercase tracking-wider">পুরস্কার</span>
                                <span className="font-extrabold text-green-600 text-sm">{tour.prize}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-slate-400 block text-[9px] uppercase tracking-wider">এন্ট্রি ফি</span>
                                <span className="font-bold text-slate-700 text-xs">{tour.entryFee}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-4">
                            <span className="text-[11px] text-slate-500 font-mono">{tour.slots}</span>
                            <button
                              onClick={() => handleJoinTournament(tour.id)}
                              disabled={isJoined || isJoining}
                              className={`text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${isJoined ? 'bg-green-100 text-green-700 pointer-events-none' : 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow active:scale-95'}`}
                            >
                              {isJoining ? (
                                <span className="flex items-center gap-1"><span className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin"></span> বুকিং হচ্ছে...</span>
                              ) : isJoined ? (
                                <><CheckCircle2 size={14} /> Registered (যুক্ত)</>
                              ) : (
                                <>যুক্ত হোন</>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tournament Code Showcase Card */}
                  <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-5 rounded-2xl text-white mt-8 border border-indigo-800">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider block mb-1">টুর্নামেন্ট হোস্ট কোড</span>
                        <h4 className="font-bold text-sm mb-1">কাস্টম জয়েনিং কোড</h4>
                        <p className="text-xs text-indigo-200 mb-4">গেম লবিতে ডাইরেক্ট এক্সেস করার জন্য নিচের কোডটি ব্যবহার করুন</p>
                        <div className="bg-indigo-950/80 px-4 py-2.5 rounded-xl border border-indigo-800/80 flex items-center justify-between font-mono text-xs w-48 shadow-inner select-all">
                          <span className="text-indigo-400">RPB-LUDO-74A</span>
                          <button onClick={() => copyToClipboard('RPB-LUDO-74A')} className="text-indigo-300 hover:text-white transition">
                            {copiedCode === 'RPB-LUDO-74A' ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                      <Trophy size={48} className="text-indigo-400 opacity-30 mt-1" />
                    </div>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
