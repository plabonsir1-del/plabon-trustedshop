import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  ShoppingBag, 
  Boxes, 
  LogOut, 
  Camera, 
  Store, 
  Edit2
} from 'lucide-react';
import { motion } from 'motion/react';

interface EditorPanelProps {
  onBack: () => void;
}

export function EditorPanel({ onBack }: EditorPanelProps) {
  const [userName, setUserName] = useState('');
  const [userBio, setUserBio] = useState('');
  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/80?text=👤');
  const [activeMenu, setActiveMenu] = useState('home');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('userName') || '';
    const savedBio = localStorage.getItem('userBio') || '';
    const savedPic = localStorage.getItem('profilePic') || 'https://via.placeholder.com/80?text=👤';
    setUserName(savedName);
    setUserBio(savedBio);
    setProfilePic(savedPic);
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserName(val);
    localStorage.setItem('userName', val);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setUserBio(val);
    localStorage.setItem('userBio', val);
  };

  const uploadProfilePic = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePic(result);
        localStorage.setItem('profilePic', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-white/80 backdrop-blur-xl shadow-2xl flex flex-col border-r border-gray-200/50">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Store className="w-8 h-8" />
            Plabon Touch Shop
          </h1>
        </div>

        {/* Profile Section */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="relative mb-4 flex justify-center">
            <img src={profilePic || null} alt="Profile" className="profile-pic-pts" />
            <div className="camera-overlay-pts" onClick={uploadProfilePic}>
              <Camera size={16} />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload} 
            />
          </div>
          
          <div className="text-center">
            <input 
              type="text" 
              placeholder="আপনার নাম" 
              value={userName}
              onChange={handleNameChange}
              className="w-full text-xl font-bold text-gray-800 text-center bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 mb-1"
            />
            <textarea 
              placeholder="আপনার বায়ো..." 
              value={userBio}
              onChange={handleBioChange}
              className="w-full text-sm text-gray-600 text-center bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1 resize-none" 
              rows={2}
            />
            <div className="text-xs text-blue-600 font-semibold mt-2">@plabon_biswas</div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 space-y-1 px-2">
          <div 
            className={`sidebar-item-pts ${activeMenu === 'home' ? 'active-menu' : ''}`}
            onClick={() => setActiveMenu('home')}
          >
            <Home size={20} />
            <span>হোম</span>
          </div>
          <div 
            className={`sidebar-item-pts ${activeMenu === 'order' ? 'active-menu' : ''}`}
            onClick={() => setActiveMenu('order')}
          >
            <ShoppingBag size={20} />
            <span>অর্ডার</span>
          </div>
          <div 
            className={`sidebar-item-pts ${activeMenu === 'product' ? 'active-menu' : ''}`}
            onClick={() => setActiveMenu('product')}
          >
            <Boxes size={20} />
            <span>প্রোডাক্ট</span>
          </div>
        </nav>

        {/* Logout/Back Button */}
        <div className="p-4 mt-auto border-t border-gray-200/50">
          <div 
            onClick={onBack}
            className="sidebar-item-pts text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold"
          >
            <LogOut size={20} />
            <span>লগআউট</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <Edit2 size={64} className="mx-auto mb-4 opacity-20" />
              <p className="text-xl font-bold">Editor Panel is Empty</p>
              <p>আপনার কন্টেন্ট এখানে যোগ করুন</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
