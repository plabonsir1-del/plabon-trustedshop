import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Check, 
  Flame,
  Mic,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Product {
  id: string;
  image: string;
  title: string;
  description: string;
  originalPrice: string;
  discountPrice: string;
  discountPercent: string;
  likes: string;
  rating: string;
  reviewsCount: string;
  category: string;
  seller: {
    avatar: string;
    name: string;
    username: string;
    verified: boolean;
  };
  isHot?: boolean;
}

const CATEGORIES = [
  { key: 'all', labelBn: 'সব ক্যাটাগরি', labelEn: 'All Categories' },
  { key: 'panjabi', labelBn: 'পাঞ্জাবি', labelEn: 'Panjabi' },
  { key: 'shari', labelBn: 'শাড়ি', labelEn: 'Shari' },
  { key: 'kids', labelBn: 'বাচ্চাদের পোশাক', labelEn: 'Kids Wear' },
  { key: 'electronics', labelBn: 'ইলেকট্রনিক্স', labelEn: 'Electronics' }
];

const SUGGESTIONS_LIST = [
  "কালো পাঞ্জাবি", 
  "সাদা পাঞ্জাবি", 
  "নীল পাঞ্জাবি", 
  "সুতি পাঞ্জাবি",
  "কাতান শাড়ি", 
  "জামদানি শাড়ি", 
  "কালো চশমা", 
  "কালো জুতো",
  "Netflix Premium", 
  "Spotify Family", 
  "YouTube Premium", 
  "Canva Pro"
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'netflix-premium',
    image: 'https://images.unsplash.com/photo-1611593733186-2d6852fd7e0b?w=400&h=240&fit=crop',
    title: 'Netflix Premium 4K UHD Account - 1 Month Warranty',
    description: 'ফুল HD 4K স্ট্রিমিং, অ্যাড ফ্রি, ৪ ডিভাইস সাপোর্ট। মাসিক রিনিউ অটোমেটিক।',
    originalPrice: '৳১,৯৯৯',
    discountPrice: '৳৫৯৯',
    discountPercent: '70% OFF',
    likes: '1.2K',
    rating: '4.9',
    reviewsCount: '247',
    category: 'electronics',
    isHot: true,
    seller: {
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=55&h=55&fit=crop&crop=face',
      name: 'Premium Seller Pro',
      username: '@premiumseller',
      verified: true
    }
  },
  {
    id: 'spotify-family',
    image: 'https://images.unsplash.com/photo-1571169272042-6d6b6b48c34f?w=400&h=240&fit=crop',
    title: 'Spotify Premium Family Plan - Private Membership',
    description: '৬ জনের ফ্যামিলি প্ল্যান, অফলাইন ডাউনলোড, হাই কোয়ালিটি অডিও। সবচেয়ে পছন্দের প্ল্যান।',
    originalPrice: '৳১,৪৯৯',
    discountPrice: '৳৩৭৪',
    discountPercent: '75% OFF',
    likes: '987',
    rating: '4.8',
    reviewsCount: '189',
    category: 'electronics',
    isHot: true,
    seller: {
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=55&h=55&fit=crop&crop=face',
      name: 'Music Master BD',
      username: '@musicmaster',
      verified: true
    }
  },
  {
    id: 'youtube-premium',
    image: 'https://images.unsplash.com/photo-1615466566597-2c4c2c607412?w=400&h=240&fit=crop',
    title: 'YouTube Premium (No Ads) - Background Play + Music',
    description: 'অ্যাড ফ্রি ইউটিউব, ব্যাকগ্রাউন্ড প্লে, অফলাইন ডাউনলোড। সবচেয়ে ডিমান্ডিং ফিচার।',
    originalPrice: '৳১,১৯৯',
    discountPrice: '৳২৩৯',
    discountPercent: '80% OFF',
    likes: '2.1K',
    rating: '4.9',
    reviewsCount: '456',
    category: 'electronics',
    isHot: true,
    seller: {
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=55&h=55&fit=crop&crop=face',
      name: 'Video King Pro',
      username: '@videoking',
      verified: true
    }
  },
  {
    id: 'canva-pro',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=240&fit=crop',
    title: 'Canva Pro Lifetime Access - Teams Invitation',
    description: 'ডিজাইন করুন প্রফেশনাল লেভেলে, আনলিমিটেড টেমপ্লেট এবং হাই-রেজুলেশন এক্সপোর্ট সুবিধা।',
    originalPrice: '৳৯৯৯',
    discountPrice: '৳১৯৯',
    discountPercent: '80% OFF',
    likes: '1.5K',
    rating: '4.9',
    reviewsCount: '312',
    category: 'electronics',
    isHot: false,
    seller: {
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=55&h=55&fit=crop&crop=face',
      name: 'Design Hub',
      username: '@designpro',
      verified: true
    }
  },
  {
    id: 'punjabi-black',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=240&fit=crop',
    title: 'প্রিমিয়াম কারচুপি কাজ করা কালো পাঞ্জাবি (Royal Black Punjabi)',
    description: 'লাক্সারি কটন কাপড়ে আকর্ষণীয় নিখুঁত কারচুপি কলার কাজ করা ডিজাইনার পাঞ্জাবি। উৎসবের আমেজে সেরা আকর্ষণ।',
    originalPrice: '৳৩,৫০০',
    discountPrice: '৳১,৯৮০',
    discountPercent: '43% OFF',
    likes: '842',
    rating: '4.9',
    reviewsCount: '64',
    category: 'panjabi',
    isHot: true,
    seller: {
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=55&h=55&fit=crop&crop=face',
      name: 'Royal Heritage BD',
      username: '@royal_heritage',
      verified: true
    }
  },
  {
    id: 'punjabi-white',
    image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?w=400&h=240&fit=crop',
    title: 'ক্লাসিক সাদা সুতি চিকনকারি পাঞ্জাবি (Classic White Cotton Panjabi)',
    description: 'বিশুদ্ধ সুতি খাদি কাপড়ে আধুনিক চিকনকারি হ্যান্ডলুম কলার ডিজাইনের ট্র্যাডিশনাল এবং প্রশান্তিদায়ক পাঞ্জাবি।',
    originalPrice: '৳২,৮০০',
    discountPrice: '৳১,৪৫০',
    discountPercent: '48% OFF',
    likes: '512',
    rating: '4.8',
    reviewsCount: '38',
    category: 'panjabi',
    isHot: false,
    seller: {
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=55&h=55&fit=crop&crop=face',
      name: 'Heritage Wear BD',
      username: '@heritage_wear',
      verified: true
    }
  },
  {
    id: 'punjabi-blue',
    image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=400&h=240&fit=crop',
    title: 'রয়েল ব্লু লাক্সারি সিল্ক পাঞ্জাবি (Royal Blue Luxury Silk Punjabi)',
    description: 'ঝকমকে সিল্ক ও সেমি-ফিটেড কমফোর্ট ফেব্রিক যা যেকোনো বিয়ে বা বড় উৎসব অনুষ্ঠানে পরিধানের জন্য অত্যন্ত মানানসই।',
    originalPrice: '৳৪,২০০',
    discountPrice: '৳২,৫০০',
    discountPercent: '40% OFF',
    likes: '735',
    rating: '4.9',
    reviewsCount: '92',
    category: 'panjabi',
    isHot: true,
    seller: {
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=55&h=55&fit=crop&crop=face',
      name: 'Royal Heritage BD',
      username: '@royal_heritage',
      verified: true
    }
  },
  {
    id: 'punjabi-cotton',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=240&fit=crop',
    title: 'আरामদায়ক সুতি খাদি পাঞ্জাবি (Comfort Cotton Khadi Punjabi)',
    description: 'খাঁটি আরামদায়ক হ্যান্ডলুম কটন সুতা নির্মিত প্রতিদিনের ব্যবহারে ক্যাজুয়াল ডিজাইনের সেরা বাজেট পাঞ্জাবি।',
    originalPrice: '৳১,৯৯৯',
    discountPrice: '৳৯৯৯',
    discountPercent: '50% OFF',
    likes: '410',
    rating: '4.7',
    reviewsCount: '25',
    category: 'panjabi',
    isHot: false,
    seller: {
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=55&h=55&fit=crop&crop=face',
      name: 'Style Studio',
      username: '@stylestudio',
      verified: false
    }
  },
  {
    id: 'shari-katan',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=240&fit=crop',
    title: 'বেনারসি কাতান শাড়ি রানি গোলাপি (Royal Banarasi Katan Silk Shari)',
    description: 'খাঁটি কাঞ্চিপুরম বেনারসি কাতান সিল্ক শাড়ি। চোখ ধাঁধানো ট্র্যাডিশনাল গোল্ডেন জরির সুনিপুণ কারুকাজ।',
    originalPrice: '৳১২,৫০০',
    discountPrice: '৳৫,৯০০',
    discountPercent: '52% OFF',
    likes: '2.4K',
    rating: '5.0',
    reviewsCount: '198',
    category: 'shari',
    isHot: true,
    seller: {
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=55&h=55&fit=crop&crop=face',
      name: 'Plabon Shari Bithi',
      username: '@shari_house',
      verified: true
    }
  },
  {
    id: 'shari-jamdani',
    image: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?w=400&h=240&fit=crop',
    title: 'ঢাকা ইউনিক হাফ-সিল্ক জামদানি শাড়ি (Authentic Dhakai Jamdani Saree)',
    description: 'শতভাগ ঐতিহ্যবাহী হাতে বোনা ঢাকার লাল-সোনালী প্রিমিয়াম হাফ-সিল্ক জামদানি শাড়ি। আভিজাত্য প্রকাশে অতুলনীয়।',
    originalPrice: '৳৮,৫০০',
    discountPrice: '৳৪,২৫০',
    discountPercent: '50% OFF',
    likes: '1.8K',
    rating: '4.9',
    reviewsCount: '142',
    category: 'shari',
    isHot: true,
    seller: {
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=55&h=55&fit=crop&crop=face',
      name: 'Plabon Shari Bithi',
      username: '@shari_house',
      verified: true
    }
  },
  {
    id: 'kids-clothing',
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&h=240&fit=crop',
    title: 'বাচ্চাদের স্টাইলিশ রঙ্গিন ফ্যাশন ফ্রক সেট (Vibrant Kids Designer Dress)',
    description: 'অত্যন্ত মোলায়েম ও আরামদায়ক শতভাগ কটন ম্যাটেরিয়ালে তৈরি প্রিমিয়াম ডিজাইনার পার্টি ফ্রক বাচ্চাদের জন্য।',
    originalPrice: '৳১,৯৫০',
    discountPrice: '৳৯৯০',
    discountPercent: '49% OFF',
    likes: '340',
    rating: '4.8',
    reviewsCount: '29',
    category: 'kids',
    isHot: false,
    seller: {
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=55&h=55&fit=crop&crop=face',
      name: 'Junior Fashion',
      username: '@junior_kids',
      verified: true
    }
  },
  {
    id: 'glasses-black',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=240&fit=crop',
    title: 'ক্লাসিক ডার্ক ব্ল্যাক সানগ্লাস বা রোদচশমা (Premium Black Aviator Glasses)',
    description: 'উন্নত অ্যালয় মেটাল ফ্রেমের আল্ট্রা-লাইট ক্লাসিক কালো রোদচশমা। ১০০% পোলারাইজড এবং ডার্ক UV-400 প্রোটেকশন।',
    originalPrice: '৳২,২০০',
    discountPrice: '৳৭৯৯',
    discountPercent: '64% OFF',
    likes: '1.1K',
    rating: '4.9',
    reviewsCount: '167',
    category: 'electronics',
    isHot: false,
    seller: {
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=55&h=55&fit=crop&crop=face',
      name: 'Visual Eye Bangladesh',
      username: '@visual_eyes',
      verified: true
    }
  },
  {
    id: 'shoes-black',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=240&fit=crop',
    title: 'প্রিমিয়াম লাক্সারি চামড়ার কালো জুতো (Pure Handcrafted Leather Shoes)',
    description: 'নিখুঁত ফিনিশিং ও কমফোর্টেবল সোলের জেনুইন ব্ল্যাক কাউহাইডের হ্যান্ডমেড লেদার ফরমাল ও ম্যারেজ শু।',
    originalPrice: '৳৪,৫০০',
    discountPrice: '৳২,৪৯০',
    discountPercent: '45% OFF',
    likes: '812',
    rating: '4.8',
    reviewsCount: '74',
    category: 'electronics',
    isHot: true,
    seller: {
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=55&h=55&fit=crop&crop=face',
      name: 'Classy Steps BD',
      username: '@classy_steps',
      verified: true
    }
  }
];

export function MarketView({ t }: { t: any }) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const [loadingItems, setLoadingItems] = useState<string[]>([]);

  const recognitionRef = useRef<any>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setShowCategoryMenu(false);
      setShowSuggestions(false);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Filter based on selected category and query keyword
  const products = INITIAL_PRODUCTS.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesQuery = query.trim() === '' || 
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.seller.name.toLowerCase().includes(query.toLowerCase()) ||
      product.seller.username.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const filteredSuggestions = query.trim() === '' 
    ? SUGGESTIONS_LIST 
    : SUGGESTIONS_LIST.filter(item => item.toLowerCase().includes(query.toLowerCase()));

  // Toggle Speech Recognition API for Voice Search
  const toggleVoiceSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("দুঃখিত, আপনার ব্রাউজারে ভয়েস সার্চ সাপোর্ট করে না। অনুগ্রহ করে ক্রোম ব্যবহার করুন।");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = t.navHome === 'Home' ? 'en-US' : 'bn-BD';

    rec.onstart = () => {
      setIsListening(true);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setShowSuggestions(false);
    };

    rec.onerror = (event: any) => {
      console.error("Voice search error: ", event.error);
      setIsListening(false);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const handleBuy = (id: string, name: string) => {
    setLoadingItems(prev => [...prev, id]);
    
    setTimeout(() => {
      setLoadingItems(prev => prev.filter(item => item !== id));
      setAddedItems(prev => [...prev, id]);
      
      setTimeout(() => {
        setAddedItems(prev => prev.filter(item => item !== id));
        alert(`✅ ${name.toUpperCase()} ${t.addedToCart}\nRedirecting to secure checkout...`);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="market-container">
      {/* Discount Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="discount-banner"
        onClick={() => window.open('https://discount-products.com', '_blank')}
      >
        <span className="discount-banner-text">{t.discountBannerText}</span>
      </motion.div>

      {/* Advanced Search Section */}
      <div className="flex flex-col items-center mb-12 w-full max-w-3xl mx-auto px-4 z-40 relative">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-5 text-pink-600 font-extrabold text-lg text-center tracking-wide flex items-center gap-1.5"
        >
          <Sparkles className="text-pink-500 animate-pulse text-left" size={18} />
          {t.royalOnlyBD}
        </motion.div>

        {/* Search Input Box with Category & Microphone */}
        <div className="w-full relative" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col md:flex-row items-stretch md:items-center bg-white border-2 border-gray-100 dark:border-slate-800 rounded-3xl md:rounded-full p-2 shadow-xl focus-within:border-pink-500 focus-within:shadow-2xl focus-within:shadow-pink-500/10 transition-all duration-300 gap-2 md:gap-0">
            
            {/* Voice Search Button */}
            <div className="flex items-center pl-2">
              <button 
                type="button"
                onClick={toggleVoiceSearch}
                className={`w-11 h-11 flex items-center justify-center rounded-full transition-all cursor-pointer ${
                  isListening 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-500'
                }`}
                title={isListening ? "Listening... (বলুন, আমি শুনছি)" : "ভয়েস সার্চ করুন (Voice Search)"}
              >
                {isListening ? <Mic size={20} className="animate-bounce" /> : <Mic size={20} />}
              </button>
            </div>

            {/* Category selection */}
            <div className="relative border-r border-gray-100 md:px-3">
              <button 
                type="button"
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="w-full md:w-auto h-11 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold rounded-full transition-colors flex items-center justify-between gap-1.5 focus:outline-none"
              >
                <span className="truncate">
                  {t.navHome === 'Home' 
                    ? (CATEGORIES.find(c => c.key === activeCategory)?.labelEn) 
                    : (CATEGORIES.find(c => c.key === activeCategory)?.labelBn)}
                </span>
                <ChevronDown size={15} className={`transition-transform duration-300 ${showCategoryMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Category Dropdown Menu */}
              <AnimatePresence>
                {showCategoryMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-gray-50/80"
                  >
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => {
                          setActiveCategory(cat.key);
                          setShowCategoryMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-semibold hover:bg-pink-50 hover:text-pink-600 transition-colors ${
                          activeCategory === cat.key ? 'bg-pink-50/40 text-pink-600 font-extrabold' : 'text-gray-600'
                        }`}
                      >
                        {t.navHome === 'Home' ? cat.labelEn : cat.labelBn}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Advanced Input field */}
            <div className="flex-1 min-w-0 px-2 md:px-4 relative">
              <input 
                type="text" 
                placeholder={isListening 
                  ? (t.navHome === 'Home' ? "Listening... Speak now" : "বলুন, আমি শুনছি...") 
                  : (t.navHome === 'Home' ? "What are you looking for?" : "এখানে খুঁজুন (যেমন: কালো পাঞ্জাবি)...")
                }
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full h-11 bg-transparent text-gray-800 text-sm md:text-base font-semibold border-0 outline-none focus:outline-none focus:ring-0 placeholder-gray-400 font-sans"
                autoComplete="off"
              />
            </div>

            {/* Accent Search Button */}
            <div className="p-1 md:pr-1">
              <button 
                type="button"
                onClick={() => {
                  setShowSuggestions(false);
                  if (!query.trim()) {
                    alert(t.navHome === 'Home' ? "Please type or say something to search!" : "অনুগ্রহ করে কিছু লিখুন বা মুখে বলুন!");
                  }
                }}
                className="w-full md:w-auto h-11 px-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm font-bold rounded-full transition-all active:scale-95 shadow-md shadow-pink-500/20 flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-lg hover:shadow-pink-500/30"
              >
                <Search size={16} />
                <span>{t.navHome === 'Home' ? 'Search' : 'সার্চ'}</span>
              </button>
            </div>

          </div>

          {/* Auto-Suggestion Box */}
          <AnimatePresence>
            {showSuggestions && filteredSuggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 mt-3 bg-white border border-gray-100 rounded-3xl shadow-2xl z-40 max-h-64 overflow-y-auto divide-y divide-gray-50 text-left"
              >
                {filteredSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(item);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-6 py-3.5 text-xs md:text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-pink-600 transition-colors flex items-center gap-2"
                  >
                    <Search size={12} className="text-gray-400 shrink-0" />
                    <span>{item}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      <h2 className="premium-section-title">{t.hotProductsTitle}</h2>

      <div className="products-grid">
        <AnimatePresence>
          {products.map((product) => (
            <motion.div 
              layout
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="premium-product-card group"
            >
              <div className="product-image-container relative overflow-hidden">
                <img src={product.image || null} alt={product.title} className="product-image-market group-hover:scale-110 transition-transform duration-500" />
                
                {/* Overlay Actions */}
                <div className="overlay-actions-market">
                  <div className="flex items-center gap-1.5 hover:text-pink-500 transition-colors">
                    <motion.div whileHover={{ scale: 1.2 }} className="flex items-center gap-1.5 cursor-pointer">
                      <Flame size={16} fill="currentColor" /> {product.likes}
                    </motion.div>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-yellow-500 transition-colors cursor-pointer">
                    ⭐ {product.rating} ({product.reviewsCount})
                  </div>
                </div>
              </div>

              <div className="product-body-market text-left">
                <h3 className="product-title-market text-gray-900 font-extrabold text-base mb-1.5 truncate" title={product.title}>
                  {product.title}
                </h3>
                <p className="product-desc-market text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Seller Profile */}
                <div 
                  className="seller-profile-market cursor-pointer flex items-center gap-4 p-3 rounded-2xl bg-pink-500/5 border border-pink-500/10 hover:bg-pink-500/10 hover:shadow-lg transition-all mb-4" 
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Shop for ${product.seller.name} coming soon!`);
                  }}
                >
                  <div className="relative">
                    <img src={product.seller.avatar || null} alt="Seller" className="seller-avatar-market-large" />
                    {product.seller.verified && (
                      <div className="absolute -right-1 -bottom-1 bg-white rounded-full p-0.5 shadow-sm">
                        <Check size={12} className="text-cyan-500 font-black" />
                      </div>
                    )}
                  </div>
                  <div className="seller-info-market text-left">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-gray-800 text-xs">{product.seller.name}</h4>
                    </div>
                    <span className="seller-username-market font-extrabold text-[10px] text-pink-600">{product.seller.username}</span>
                  </div>
                </div>

                <div className="pricing-market-premium">
                  <div>
                    <div className="original-price-market font-bold">{product.originalPrice}</div>
                    <div className="discount-price-market font-black text-3xl">{product.discountPrice}</div>
                  </div>
                  <div className="discount-tag-market">{product.discountPercent}</div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuy(product.id, product.title);
                  }}
                  disabled={loadingItems.includes(product.id)}
                  className={`buy-btn-market-premium ${addedItems.includes(product.id) ? 'success' : ''}`}
                >
                  {loadingItems.includes(product.id) ? (
                    <><motion.div className="flex items-center" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><ShoppingCart size={20} /></motion.div> {t.addingToCart}</>
                  ) : addedItems.includes(product.id) ? (
                    <><Check size={20} /> {t.addedToCart}</>
                  ) : (
                    <><ShoppingCart size={20} /> {t.buyNow}</>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {products.length === 0 && (
        <div className="text-center py-20 bg-white/50 backdrop-blur-md rounded-3xl border-2 border-dashed border-pink-500/30">
          <p className="text-gray-500 font-bold text-xl">No products found matching your search.</p>
        </div>
      )}
    </div>
  );
}
