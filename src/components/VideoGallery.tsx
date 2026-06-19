import React, { useState, useEffect } from 'react';
import { Play, ExternalLink, Youtube, Trash2, Plus, X, Link, Video as VideoIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Video {
  id: number;
  video_url: string;
  channel_url: string;
}

export function VideoGallery() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('adminLoggedIn') === 'true';
  
  // Link adding states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [channelUrl, setChannelUrl] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/global/videos');
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error("Failed to fetch videos", error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getTikTokId = (url: string) => {
    if (!url) return null;
    const match = url.match(/\/video\/(\d+)/);
    return match ? match[1] : null;
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return alert("ভিডিওর লিংক প্রবেশ করান (ইউটিউব বা টিকটক)!");
    
    setIsPublishing(true);
    try {
      // Auto build or default channel URL if empty
      let finalChannelUrl = channelUrl.trim();
      if (!finalChannelUrl) {
        if (videoUrl.includes('tiktok.com')) {
          finalChannelUrl = 'https://www.tiktok.com';
        } else {
          finalChannelUrl = 'https://www.youtube.com';
        }
      }

      const res = await fetch('/api/admin/upload-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: videoUrl, channel_url: finalChannelUrl })
      });
      const data = await res.json();
      if (data.success) {
        alert('🎉 ভিডিওটি সফলভাবে যুক্ত হয়েছে এবং ওয়েবসাইটে সরাসরি লাইভ করা হয়েছে!');
        setVideoUrl('');
        setChannelUrl('');
        setIsFormOpen(false);
        fetchVideos();
      } else {
        alert('❌ ভিডিও অ্যাড করতে সমস্যা হয়েছে: ' + (data.message || 'Error'));
      }
    } catch (err) {
      console.error("Error publishing video", err);
      alert('❌ নেটওয়ার্ক ত্রুটি। আবার চেষ্টা করুন।');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteVideo = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ভিডিওটি ডিলিট করতে চান? এটি ওয়েবসাইট থেকে মুছে ফেলা হবে।")) return;
    
    try {
      const res = await fetch(`/api/admin/delete-video/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchVideos();
      } else {
        alert("ভিডিও ডিলিট করা যায়নি।");
      }
    } catch (err) {
      console.error("Error deleting video", err);
      alert("❌ ডিলিট করার সময় নেটওয়ার্ক ত্রুটি ঘটেছে।");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 mb-24">
      {/* Title & Add Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Play className="text-pink-600 fill-pink-600 animate-pulse" size={32} /> Watch & Guided Videos
          </h2>
          <p className="text-sm text-gray-500 mt-1">আমাদের ইউটিউব টিউটোরিয়াল এবং টিকটক ভিডিও গাইডলাইনসমূহ</p>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-2 px-5 py-2.5 bg-pink-600 text-white text-xs font-bold rounded-xl hover:bg-pink-700 transition shadow-lg shadow-pink-100 uppercase tracking-widest cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            {isFormOpen ? <X size={15} /> : <Plus size={15} />}
            {isFormOpen ? 'আড়াল করুন' : 'নতুন ভিডিও এড করুন'}
          </button>
        )}
      </div>

      {/* Add New Video Form Inline */}
      <AnimatePresence>
        {isAdmin && isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <form onSubmit={handleAddVideo} className="bg-gradient-to-r from-pink-50 to-indigo-50 p-6 rounded-2xl border border-pink-100 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-pink-900 flex items-center gap-2 uppercase tracking-wide">
                <VideoIcon size={16} /> নতুন ভিডিও লিংক যোগ করুন (সার্ভারে লাইভ ও ডিলিট অপশনসহ)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">ভিডিও ইউআরএল (ইউটিউব/টিকটক)</label>
                  <div className="relative">
                    <Link size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="যেমন: https://www.youtube.com/watch?v=... বা টিকটক লিংক"
                      className="w-full bg-white border border-gray-200 pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 block">ইউটিউব শর্টস বা সাধারণ ভিডিও এবং যেকোনো টিকটক ভিডিও লিংক সরাসরি সাপোর্টেড।</span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">চ্যানেল/প্রোফাইল লিংক (ঐচ্ছিক)</label>
                  <div className="relative">
                    <Sparkles size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="ফাঁকা রাখলে স্বয়ংক্রিয়ভাবে জেনারেট হবে"
                      className="w-full bg-white border border-gray-200 pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                      value={channelUrl}
                      onChange={(e) => setChannelUrl(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-sm text-gray-500 font-bold hover:text-gray-700 transition cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="px-6 py-2 bg-pink-600 text-white text-xs font-black rounded-xl hover:bg-pink-700 transition disabled:opacity-50 cursor-pointer uppercase tracking-wider shadow-md active:scale-95"
                >
                  {isPublishing ? 'পাবলিশ হচ্ছে...' : 'ভিডিও পাবলিশ করুন'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Videos List Grid */}
      {videos.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-gray-100/50">
          <Youtube size={64} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium text-lg">কোনো টিউটোরিয়াল ভিডিও পাওয়া যায়নি।</p>
          <p className="text-xs text-gray-400 mt-2">উপরের বাটনটি দিয়ে যেকোনো ভিডিও লিংক পেস্ট করে পাবলিশ করতে পারেন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {videos.map((video) => {
            const ytId = getYouTubeId(video.video_url);
            const ttId = getTikTokId(video.video_url);
            const isTikTok = video.video_url.includes('tiktok.com');

            return (
              <motion.div 
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col group transition-all duration-300 hover:shadow-xl relative"
              >
                {/* Embed Video in iframe (Does not redirect) */}
                <div className="relative aspect-video w-full bg-black">
                  {ytId ? (
                    <iframe 
                      className="absolute inset-0 w-full h-full" 
                      src={`https://www.youtube.com/embed/${ytId}`} 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      title="YouTube Video Player"
                    ></iframe>
                  ) : isTikTok && ttId ? (
                    <iframe 
                      className="absolute inset-0 w-full h-full" 
                      src={`https://www.tiktok.com/embed/v2/${ttId}`} 
                      frameBorder="0" 
                      allowFullScreen
                      title="TikTok Video Player"
                    ></iframe>
                  ) : isTikTok && video.video_url.includes('vt.tiktok.com') ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-xs p-6 text-center bg-slate-900 gap-2">
                      <span className="text-pink-400 font-bold">TikTok Short URL Detected</span>
                      <p className="text-[10px] text-slate-400 leading-relaxed">টিকটক মোবাইল লিংকের জন্য দয়া করে ক্রোম ব্রাউজারে লিংকটি দিয়ে বড় লিংকটি কপি করে পেস্ট করুন। অথবা নিচের বাটনে ক্লিক করে ভিউ করুন।</p>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-xs p-4 text-center bg-slate-900 gap-2">
                      <span className="text-rose-400 font-bold">Custom Embedded View</span>
                      <iframe 
                        className="absolute inset-0 w-full h-full opacity-40 hover:opacity-100 transition" 
                        src={video.video_url} 
                        frameBorder="0" 
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </div>
                
                {/* Information and Actions Footer */}
                <div className="p-4 bg-white flex flex-col gap-3 border-t border-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-extrabold flex items-center gap-1.5 uppercase tracking-widest">
                      {ytId ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block animate-ping" />
                          <span className="text-red-600">YouTube Video</span>
                        </>
                      ) : isTikTok ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block animate-ping" />
                          <span className="text-cyan-500">TikTok Guide</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                          <span className="text-blue-500">Web Stream</span>
                        </>
                      )}
                    </span>
                    
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="text-gray-400 hover:text-red-600 text-xs font-bold flex items-center gap-1 p-1 rounded hover:bg-red-50 transition-colors uppercase tracking-wider cursor-pointer"
                        title="ভিডিওটি মুছে ফেলুন"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-500 font-medium truncate max-w-[180px] font-mono">
                      {video.video_url}
                    </span>
                    <a 
                      href={video.video_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-black text-pink-600 hover:text-pink-700 flex items-center gap-1 transition-all uppercase tracking-wider"
                    >
                      Visit Video <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
