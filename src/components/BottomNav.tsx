import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Settings, 
  PlayCircle,
  Trophy,
  Mail
} from 'lucide-react';

interface BottomNavProps {
  t: any;
  currentLang: string;
  onHome: () => void;
  onProfile: () => void;
  onVideos: () => void;
  onMail: () => void;
  onEvent: () => void;
  currentView: string;
}

export function BottomNav({ t, currentLang, onHome, onProfile, onVideos, onMail, onEvent, currentView }: BottomNavProps) {
  const [activeItem, setActiveItem] = useState('home');

  useEffect(() => {
    if (currentView === 'main') setActiveItem('home');
    else if (currentView === 'profile') setActiveItem('profile');
    else if (currentView === 'videos') setActiveItem('videos');
    else if (currentView === 'mail') setActiveItem('mail');
    else if (currentView === 'event') setActiveItem('event');
    else if (currentView === 'dropshipping' || currentView === 'warehouse') setActiveItem('home');
  }, [currentView]);

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-gray-200 px-6 py-2 flex justify-around items-center z-40 max-w-7xl mx-auto rounded-t-2xl shadow-lg">
      <button 
        onClick={() => { setActiveItem('home'); onHome(); }}
        className={`flex flex-col items-center space-y-0.5 transition ${activeItem === 'home' ? 'text-pink-600' : 'text-gray-400 hover:text-pink-600'}`}
      >
        <Home size={22} strokeWidth={activeItem === 'home' ? 3 : 2} />
        <span className={`text-[10px] ${activeItem === 'home' ? 'font-bold' : 'font-medium'}`}>Home</span>
      </button>

      <button 
        onClick={() => { setActiveItem('mail'); onMail(); }}
        className={`flex flex-col items-center space-y-0.5 transition ${activeItem === 'mail' ? 'text-pink-600' : 'text-gray-400 hover:text-pink-600'}`}
      >
        <Mail size={22} strokeWidth={activeItem === 'mail' ? 3 : 2} />
        <span className={`text-[10px] ${activeItem === 'mail' ? 'font-bold' : 'font-medium'}`}>Mail</span>
      </button>

      <button 
        onClick={() => { setActiveItem('videos'); onVideos(); }}
        className={`flex flex-col items-center space-y-0.5 transition ${activeItem === 'videos' ? 'text-pink-600' : 'text-gray-400 hover:text-pink-600'}`}
      >
        <div className={`p-2 rounded-full -mt-5 shadow-md border-2 border-white transition-all ${activeItem === 'videos' ? 'bg-pink-100' : 'bg-white'}`}>
          <PlayCircle size={28} className={activeItem === 'videos' ? 'text-pink-600' : 'text-gray-400'} />
        </div>
        <span className={`text-[10px] ${activeItem === 'videos' ? 'font-bold' : 'font-medium'}`}>Videos</span>
      </button>

      <button 
        onClick={() => { setActiveItem('event'); onEvent(); }}
        className={`flex flex-col items-center space-y-0.5 transition ${activeItem === 'event' ? 'text-pink-600' : 'text-gray-400 hover:text-pink-600'}`}
      >
        <Trophy size={22} strokeWidth={activeItem === 'event' ? 3 : 2} className={activeItem === 'event' ? 'text-pink-600' : 'text-gray-400'} />
        <span className={`text-[10px] ${activeItem === 'event' ? 'font-bold' : 'font-medium'}`}>Event</span>
      </button>

      <button 
        onClick={() => { setActiveItem('profile'); onProfile(); }}
        className={`flex flex-col items-center space-y-0.5 transition ${activeItem === 'profile' ? 'text-pink-600' : 'text-gray-400 hover:text-pink-600'}`}
      >
        <Settings size={22} strokeWidth={activeItem === 'profile' ? 3 : 2} />
        <span className={`text-[10px] ${activeItem === 'profile' ? 'font-bold' : 'font-medium'}`}>Profile</span>
      </button>
    </nav>
  );
}
