import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, Check, Package, Truck, CheckCircle, Clock, 
  MapPin, Search, RefreshCw, AlertCircle, Sparkles, Send, Play
} from 'lucide-react';

interface ProfileDashboardProps {
  t: any;
}

interface TrackingHistoryItem {
  status: string;
  time: string;
  location: string;
}

interface Order {
  orderId: string;
  date: string;
  product: string;
  image: string;
  price: string;
  status: string;
  customerEmail: string;
  tracking?: {
    courierName: string;
    trackingId: string;
    lastUpdate: string;
    history: TrackingHistoryItem[];
  };
}

export function ProfileDashboard({ t }: ProfileDashboardProps) {
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=140&h=140');
  const [isUpdated, setIsUpdated] = useState(false);
  
  // Real orders system
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorText, setErrorText] = useState('');
  
  // Live Simulator fields for user testing
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simStatus, setSimStatus] = useState('Shipped');
  const [simCourier, setSimCourier] = useState('Pathao Courier');
  const [simLocation, setSimLocation] = useState('Dhaka Central Warehouse');
  const [isTrackingRefreshing, setIsTrackingRefreshing] = useState(false);

  // Load orders and profile pic on mount
  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) setProfileImage(savedImage);

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Fetch orders for current customer plabon@example.com
      const res = await fetch('/api/orders?email=plabon@example.com');
      const result = await res.json();
      if (result.success && result.data && result.data.length > 0) {
        setOrders(result.data);
        // Default select the first pending or shipped order to showcase the tracking stepper
        const activeOrder = result.data.find((o: Order) => o.status !== 'Delivered' && o.status !== 'Cancelled') || result.data[0];
        setSelectedOrder(activeOrder);
      } else {
        // Fallback to initial seeds (will automatically use local memory if first load)
        const mockRes = await fetch('/api/orders');
        const mockResult = await mockRes.json();
        if (mockResult.success && mockResult.data) {
          setOrders(mockResult.data);
          setSelectedOrder(mockResult.data[1] || mockResult.data[0]); // Default to second order (Shipped)
        }
      }
    } catch (e) {
      console.error("Failed to load live orders, using default seeds", e);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        localStorage.setItem('profileImage', result);
        setIsUpdated(true);
        setTimeout(() => setIsUpdated(false), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Live query-tracker for matching search barcodes
  const handleTrackingSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setErrorText('');
    setLoading(true);
    
    try {
      const match = orders.find(
        o => o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) || 
             (o.tracking?.trackingId && o.tracking.trackingId.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      if (match) {
        // Fetch detailed real-time state from server
        const res = await fetch(`/api/orders/${encodeURIComponent(match.orderId)}/track`);
        const item = await res.json();
        if (item.success) {
          setSelectedOrder(item);
          document.getElementById('tracking-stepper-view')?.scrollIntoView({ behavior: 'smooth' });
        } else {
          setSelectedOrder(match);
        }
      } else {
        setErrorText('দুঃখিত! এই অর্ডার আইডি বা ট্র্যাকিং নম্বরটি পাওয়া যায়নি।');
      }
    } catch (err) {
      setErrorText('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
    } finally {
      setLoading(false);
    }
  };

  // Live trigger refresh tracking details
  const refreshCurrentOrderTracking = async () => {
    if (!selectedOrder) return;
    setIsTrackingRefreshing(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.orderId}/track`);
      const item = await res.json();
      if (item.success) {
        setSelectedOrder(item);
        // Refresh master list
        await fetchOrders();
      }
    } catch (err) {
      console.log("Error refreshing order track:", err);
    } finally {
      setTimeout(() => setIsTrackingRefreshing(false), 800);
    }
  };

  // Submit test webhook simulated courier update to API live
  const handleTriggerSimulatedWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const trackingId = selectedOrder.tracking?.trackingId || 'PT-' + Date.now().toString().slice(-6);
      
      const payload = {
        orderId: selectedOrder.orderId,
        status: simStatus,
        trackingId: trackingId,
        courierName: simCourier,
        location: simLocation
      };

      const res = await fetch('/api/update-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const responseData = await res.json();
      if (responseData.success) {
        // Success feedback
        setIsSimulatorOpen(false);
        // Refresh state values instantly
        await fetchOrders();
        // Load target
        const postRes = await fetch(`/api/orders/${selectedOrder.orderId}/track`);
        const postItem = await postRes.json();
        if (postItem.success) {
          setSelectedOrder(postItem);
        }
      } else {
        alert(responseData.message || "Webhook trigger failed");
      }
    } catch (err: any) {
      alert("Error sending update: " + err.message);
    }
  };

  // Mapping state strings into indexes for visual timeline steps
  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  const activeIndex = selectedOrder ? getStepIndex(selectedOrder.status) : 0;

  // Render proper badges depending on state
  const getBadgeClass = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/25 text-xs px-2.5 py-1 rounded-full';
      case 'Shipped': return 'bg-cyan-500/10 text-cyan-405 border border-cyan-500/25 text-xs px-2.5 py-1 rounded-full';
      case 'Processing': return 'bg-amber-500/10 text-amber-405 border border-amber-500/25 text-xs px-2.5 py-1 rounded-full';
      case 'Cancelled': return 'bg-rose-500/10 text-rose-455 border border-rose-500/25 text-xs px-2.5 py-1 rounded-full';
      default: return 'bg-slate-500/10 text-slate-405 border border-slate-500/25 text-xs px-2.5 py-1 rounded-full';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-8 select-none text-slate-200"
    >
      
      {/* 1. Profile Dashboard Header Summary */}
      <div id="profile-user-card" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 blur-3xl rounded-full" />
        
        {/* Profile Avatar Frame Upload */}
        <div className="relative group flex-shrink-0">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-indigo-500/30 group-hover:border-indigo-400 transition shadow-inner">
            <img src={profileImage} alt="User Dashboard Profile" className="w-full h-full object-cover" />
          </div>
          <input 
            type="file" 
            id="avatarFileInput" 
            hidden 
            accept="image/*"
            onChange={handleImageUpload}
          />
          <label 
            htmlFor="avatarFileInput" 
            className={`absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all ${
              isUpdated ? 'bg-emerald-500 text-white' : 'bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-350'
            }`}
          >
            {isUpdated ? <Check size={14} /> : <Camera size={14} />}
          </label>
        </div>

        {/* Profile identity info */}
        <div className="text-center md:text-left flex-grow space-y-2 z-10">
          <span className="bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
            💎 {t.premiumClient || "Platinum Buyer"}
          </span>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">MD Plabon Biswas</h2>
          <p className="text-slate-400 text-xs font-mono">plabonbiswas130@gmail.com</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-3">
            <div className="bg-slate-950/60 border border-slate-850 rounded-2xl px-4 py-2 text-center min-w-[90px]">
              <span className="block text-indigo-400 text-lg font-black">{orders.length}</span>
              <span className="text-[9px] text-slate-500 uppercase font-black">{t.totalOrders || "অর্ডার"}</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-850 rounded-2xl px-4 py-2 text-center min-w-[90px]">
              <span className="block text-emerald-400 text-lg font-black">৳{orders.reduce((acc, o) => acc + (parseInt(o.price.replace(/[^\d]/g, '')) || 0), 0).toLocaleString()}</span>
              <span className="text-[9px] text-slate-500 uppercase font-black">{t.totalSpent || "মোট খরচ"}</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-850 rounded-2xl px-4 py-2 text-center min-w-[90px]">
              <span className="block text-pink-420 text-lg font-black">Dhaka</span>
              <span className="text-[9px] text-slate-500 uppercase font-black">ঠিকানা</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Shopify-Style Order Tracker Panel */}
      <div id="tracking-stepper-view" className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="border-b border-slate-800/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/15 border border-indigo-500/25 rounded-2xl text-indigo-400">
              <Package size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-tight uppercase">Shopify-Style Order Tracking</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">রিয়েল-টাইম কুরিয়ার আপডেট গেটওয়ে (Pathao / RedX / AfterShip)</p>
            </div>
          </div>

          {/* Search tracker Bar */}
          <form onSubmit={handleTrackingSearch} className="flex items-center gap-1.5 w-full sm:max-w-xs">
            <div className="relative flex-grow">
              <input 
                type="text"
                placeholder="অর্ডার নং বা ট্র্যাকিং আইডি লিখুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 pl-8 pr-3 py-1.5 rounded-xl text-xs text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500/80 transition"
              />
              <Search className="absolute left-2.5 top-2.5 text-slate-550" size={13} />
            </div>
            <button 
              type="submit"
              className="p-2 bg-indigo-600 hover:bg-slate-800 text-white border border-indigo-500/25 rounded-xl text-xs font-bold transition flex items-center justify-center shrink-0 cursor-pointer"
            >
              খুঁজুন
            </button>
          </form>
        </div>

        {errorText && (
          <div className="mx-6 mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center gap-2 text-xs">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorText}</span>
          </div>
        )}

        {selectedOrder ? (
          <div className="p-6 md:p-8 space-y-8">
            
            {/* Header info of selected active order page */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
              <div className="space-y-1.5">
                <div className="flex items-center flex-wrap gap-2.5">
                  <span className="text-white text-base font-black tracking-tight">{selectedOrder.orderId}</span>
                  <span className={getBadgeClass(selectedOrder.status)}>
                    {selectedOrder.status === 'Pending' ? t.statusPending || 'অপেক্ষমান' :
                     selectedOrder.status === 'Processing' ? 'প্রসেসিং' :
                     selectedOrder.status === 'Shipped' ? 'ডেলিভারিতে আছে' :
                     selectedOrder.status === 'Delivered' ? t.statusDelivered || 'ডেলিভারড' : selectedOrder.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                  <span>তারিখ: {selectedOrder.date}</span>
                  <span>•</span>
                  <span>পণ্য: <span className="text-slate-200 font-bold">{selectedOrder.product}</span></span>
                </div>
                {selectedOrder.tracking?.trackingId && (
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <span>কুরিয়ার: <span className="text-indigo-400 font-bold">{selectedOrder.tracking.courierName}</span></span>
                    <span>•</span>
                    <span>ট্র্যাকিং নং: <span className="text-pink-420 font-bold select-all cursor-copy">{selectedOrder.tracking.trackingId}</span></span>
                  </div>
                )}
              </div>

              {/* Refresh tracking details live trigger */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSimulatorOpen(true)}
                  className="px-3.5 py-1.5 border border-cyan-500/35 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer select-none"
                >
                  <Sparkles size={11} className="animate-pulse" />
                  সিম্যুলেট আপডেট
                </button>
                <button
                  type="button"
                  disabled={isTrackingRefreshing}
                  onClick={refreshCurrentOrderTracking}
                  className="p-1.5 px-3 bg-slate-955 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white rounded-xl text-xs font-extrabold flex items-center gap-1 transition cursor-pointer select-none disabled:opacity-40"
                >
                  <RefreshCw size={12} className={isTrackingRefreshing ? 'animate-spin' : ''} />
                  রিফ্রেস ট্র্যাকিং
                </button>
              </div>
            </div>

            {/* Stepper progress bar line */}
            <div className="relative pt-6 pb-12">
              
              {/* Central connection track fill line */}
              <div className="absolute top-[50px] left-8 right-8 h-1 bg-slate-800 rounded-full select-none">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-pink-500 transition-all duration-700 rounded-full"
                  style={{ width: `${(activeIndex / 3) * 100}%` }}
                />
              </div>

              {/* 4 Steps Stepper structure bubbles */}
              <div className="relative flex justify-between select-none">
                
                {/* Step 1: Pending */}
                <div className="flex flex-col items-center group text-center shrink-0 w-16">
                  <div className={`w-12 h-12 rounded-full relative z-10 flex items-center justify-center transition ${
                    activeIndex >= 0 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-110' 
                      : 'bg-slate-950 text-slate-550 border-2 border-slate-800'
                  }`}>
                    {activeIndex > 0 ? <CheckCircle size={18} /> : <Clock size={18} />}
                  </div>
                  <span className={`text-[10px] uppercase font-black mt-3 transition ${activeIndex >= 0 ? 'text-indigo-400' : 'text-slate-500'}`}>
                    Pending
                  </span>
                  <span className="text-[8px] text-slate-500 font-mono mt-0.5">অর্ডার গৃহীত</span>
                </div>

                {/* Step 2: Processing */}
                <div className="flex flex-col items-center group text-center shrink-0 w-16">
                  <div className={`w-12 h-12 rounded-full relative z-10 flex items-center justify-center transition ${
                    activeIndex >= 1 
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20 scale-110' 
                      : 'bg-slate-950 text-slate-550 border-2 border-slate-800'
                  }`}>
                    {activeIndex > 1 ? <CheckCircle size={18} /> : <Package size={18} />}
                  </div>
                  <span className={`text-[10px] uppercase font-black mt-3 transition ${activeIndex >= 1 ? 'text-purple-400' : 'text-slate-500'}`}>
                    Processing
                  </span>
                  <span className="text-[8px] text-slate-500 font-mono mt-0.5">হ্যান্ডওভার সম্পন্ন</span>
                </div>

                {/* Step 3: Shipped */}
                <div className="flex flex-col items-center group text-center shrink-0 w-16">
                  <div className={`w-12 h-12 rounded-full relative z-10 flex items-center justify-center transition-all ${
                    activeIndex >= 2 
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/25 scale-110 animate-pulse' 
                      : 'bg-slate-950 text-slate-550 border-2 border-slate-800'
                  }`}>
                    {activeIndex > 2 ? <CheckCircle size={18} /> : <Truck size={18} />}
                  </div>
                  <span className={`text-[10px] uppercase font-black mt-3 transition ${activeIndex >= 2 ? 'text-cyan-405' : 'text-slate-500'}`}>
                    Shipped
                  </span>
                  <span className="text-[8px] text-slate-500 font-mono mt-0.5">কুরিয়ারে আছে</span>
                </div>

                {/* Step 4: Delivered */}
                <div className="flex flex-col items-center group text-center shrink-0 w-16">
                  <div className={`w-12 h-12 rounded-full relative z-10 flex items-center justify-center transition ${
                    activeIndex >= 3 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-110' 
                      : 'bg-slate-950 text-slate-550 border-2 border-slate-800'
                  }`}>
                    <CheckCircle size={20} />
                  </div>
                  <span className={`text-[10px] uppercase font-black mt-3 transition ${activeIndex >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                    Delivered
                  </span>
                  <span className="text-[8px] text-slate-500 font-mono mt-0.5">গ্রাহক গ্রহণ করেছেন</span>
                </div>

              </div>
            </div>

            {/* 3. Real-time courier checkpoint timeline history list logs */}
            <div className="bg-slate-950/45 border border-slate-850 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <MapPin size={13} className="text-pink-420 animate-bounce" />
                  ট্র্যাকিং হিস্ট্রি এবং অবস্থান লক (Tracking Logs)
                </span>
                <span className="text-[9px] font-mono text-slate-500 uppercase font-black">
                  সর্বশেষ আপডেট: {selectedOrder.tracking?.lastUpdate ? new Date(selectedOrder.tracking.lastUpdate).toLocaleTimeString() : 'এখনই'}
                </span>
              </div>

              {selectedOrder.tracking?.history && selectedOrder.tracking.history.length > 0 ? (
                <div className="relative border-l-2 border-slate-800 pl-5 space-y-6 py-2 ml-2">
                  {selectedOrder.tracking.history.map((log, lIdx) => (
                    <div key={lIdx} className="relative space-y-1">
                      {/* Interactive timing dots */}
                      <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-indigo-500/80 flex items-center justify-center z-10">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[11.5px] font-black text-white">{log.status}</span>
                        <span className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md font-mono text-slate-400 flex items-center gap-1">
                          <MapPin size={9} /> {log.location}
                        </span>
                        <span className="text-[9.5px] font-mono text-slate-500">
                          {new Date(log.time).toLocaleString('bn-BD', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs font-bold">
                  কোনো কুরিয়ার হিস্ট্রি লগ পাওয়া যায়নি। আপডেট ট্র্যাকিং বাটনে চাপুন।
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs font-bold flex flex-col items-center gap-2">
            <AlertCircle size={24} className="text-indigo-400" />
            <span>অর্ডার ট্র্যাকিং করার জন্য ডানদিকের হিস্ট্রি তালিকা থেকে যেকোনো অর্ডার সিলেক্ট করুন বা উপরে সার্চ করুন।</span>
          </div>
        )}
      </div>

      {/* 3. Detailed Client-Side Orders Table lists */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-cyan-405" />
            <h3 className="text-sm font-black text-white tracking-tight uppercase">আমার বর্তমান ক্রয় ও অর্ডারসমূহ ({orders.length})</h3>
          </div>
          <button 
            onClick={fetchOrders}
            className="p-1 px-2 border border-slate-800 text-slate-400 hover:text-white rounded-lg bg-slate-950 hover:bg-slate-850 cursor-pointer text-xs font-bold transition flex items-center gap-1"
          >
            <RefreshCw size={11} />
            রিফ্রেশ
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center gap-2 text-xs text-slate-400">
            <RefreshCw size={14} className="animate-spin text-indigo-400" />
            <span>অর্ডার তালিকা রিফ্রেশ হচ্ছে...</span>
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-800/40">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/40 border-b border-slate-800/80 text-slate-400">
                  <th className="p-4 font-black uppercase text-[10px]">{t.orderId || "অর্ডার আইডি"}</th>
                  <th className="p-4 font-black uppercase text-[10px]">{t.dateTime || "তারিখ"}</th>
                  <th className="p-4 font-black uppercase text-[10px]">{t.product || "পণ্য বিবরণ"}</th>
                  <th className="p-4 font-black uppercase text-[10px]">{t.price || "মূল্য"}</th>
                  <th className="p-4 font-black uppercase text-[10px]">{t.status || "অবস্থা"}</th>
                  <th className="p-4 font-black uppercase text-[10px] text-right">{t.action || "অ্যাকশন"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 font-mono text-slate-300">
                {orders.map((order, index) => {
                  const isSelected = selectedOrder?.orderId === order.orderId;
                  return (
                    <tr 
                      key={index} 
                      className={`hover:bg-slate-850/30 transition ${
                        isSelected ? 'bg-indigo-500/5 border-l-2 border-indigo-500/80' : ''
                      }`}
                    >
                      <td className="p-4 font-black text-white">{order.orderId}</td>
                      <td className="p-4 text-slate-400 text-[11px] font-mono">{order.date}</td>
                      <td className="p-4 font-sans text-slate-250 font-bold max-w-xs truncate">
                        <div className="flex items-center gap-2.5">
                          {order.image && (
                            <img src={order.image} alt={order.product} className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-800" />
                          )}
                          <span className="truncate">{order.product}</span>
                        </div>
                      </td>
                      <td className="p-4 font-black text-emerald-400">{order.price}</td>
                      <td className="p-4">
                        <span className={getBadgeClass(order.status)}>
                          {order.status === 'Pending' ? t.statusPending || 'Pending' :
                           order.status === 'Processing' ? 'Processing' :
                           order.status === 'Shipped' ? 'Shipped' :
                           order.status === 'Delivered' ? t.statusDelivered || 'Delivered' : order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-sans">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className={`px-3 py-1 rounded-xl font-black text-[10px] uppercase transition cursor-pointer select-none border ${
                            isSelected 
                              ? 'bg-indigo-600 border-indigo-550 text-white shadow-md' 
                              : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-350 hover:text-white'
                          }`}
                        >
                          {isSelected ? 'ট্র্যাক করা হচ্ছে' : 'ট্র্যাক করুন 📦'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 text-xs font-bold">
            কোনো সম্পন্ন অর্ডার পাওয়া যায়নি প্রিয়।
          </div>
        )}
      </div>

      {/* 4. Live Webhook Simulated Interactive Modal */}
      <AnimatePresence>
        {isSimulatorOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-750 rounded-3xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 blur-2xl rounded-full" />
              
              <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-pink-500/15 rounded-xl border border-pink-500/20 text-pink-405">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white uppercase select-none">কুরিয়ার স্ট্যাটাস হালনাগাদ</h3>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">রিয়েল-টাইম এপিআই ট্র্যাকিং সিগন্যাল</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSimulatorOpen(false)}
                  className="p-1 border border-slate-800 text-slate-400 hover:text-white rounded-lg bg-slate-950 hover:bg-slate-850 cursor-pointer text-xs font-bold transition"
                >
                  বন্ধ
                </button>
              </div>

              <form onSubmit={handleTriggerSimulatedWebhook} className="space-y-4 text-xs">
                
                {/* Status Field Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">নতুন স্ট্যাটাস নির্বাচন করুন</label>
                  <select 
                    value={simStatus}
                    onChange={(e) => setSimStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/80 transition"
                  >
                    <option value="Pending">Pending (অপেক্ষমান)</option>
                    <option value="Processing">Processing (প্রসেসিং)</option>
                    <option value="Shipped">Shipped (ডেলিভারিতে প্রেরিত)</option>
                    <option value="Delivered">Delivered (ডেলিভারি সম্পন্ন)</option>
                  </select>
                </div>

                {/* Courier Field Choice */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">কুরিয়ার সার্ভিসের নাম</label>
                  <select 
                    value={simCourier}
                    onChange={(e) => setSimCourier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500/80 transition"
                  >
                    <option value="Pathao Courier">Pathao Courier (পাঠাও)</option>
                    <option value="RedX Delivery">RedX Delivery (রেডএক্স)</option>
                    <option value="Steadfast Courier">Steadfast Courier (স্টেডফাস্ট)</option>
                    <option value="AfterShip Simulator">AfterShip Global Tracker (আফটারশিপ)</option>
                  </select>
                </div>

                {/* Current Location tracking log text */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">বর্তমান অবস্থান বা হাব ঠিকানা</label>
                  <input 
                    type="text"
                    value={simLocation}
                    onChange={(e) => setSimLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-text placeholder-slate-650 focus:outline-none focus:border-purple-500/80 transition"
                    required
                  />
                </div>

                {/* Footer buttons with triggers */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-855">
                  <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 p-2 rounded-xl text-[8.5px] leading-tight text-slate-400 max-w-[200px]">
                    <AlertCircle size={12} className="shrink-0 text-yellow-505" />
                    <span><b>'Shipped'</b> নির্বাচন করলে Nodemailer কনফিগার থাকলে জিমেইলে অটো ইমেইল যাবে।</span>
                  </div>

                  <button 
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition cursor-pointer select-none flex items-center justify-center gap-1 shadow-lg"
                  >
                    <Play size={11} />
                     webhook পাঠান
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
