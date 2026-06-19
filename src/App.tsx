/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Home, 
  Linkedin, 
  ChevronDown,
  Crown,
  Users,
  Star,
  Globe2,
  LogOut,
  Settings,
  UserCircle as User,
  Facebook,
  Youtube,
  CloudLightning as TikTok,
  Truck,
  Warehouse,
  ShieldCheck,
  Lock,
  Mail,
  Volume2,
  VolumeX,
  Mic,
  Disc,
  LayoutGrid,
  CreditCard,
  Menu,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations, languageList, LanguageCode } from './translations';
import { RegistrationForm } from './components/RegistrationForm';
import { AdminPanel } from './components/AdminPanel';
import { EditorPanel } from './components/EditorPanel';
import { BottomNav } from './components/BottomNav';
import { MarketView } from './components/MarketView';
import { RoyalPalaceBD } from './components/RoyalPalaceBD';
import { ProfileDashboard } from './components/ProfileDashboard';
import { VideoGallery } from './components/VideoGallery';
import { AccountAccess } from './components/AccountAccess';
import { AccountVerification } from './components/AccountVerification';
import { EcommerceDashboard } from './components/EcommerceDashboard';
import { MaintenanceScreen } from './components/MaintenanceScreen';
import { SubscriptionCheckout } from './components/SubscriptionCheckout';
import { EventZone } from './components/EventZone';
import { MailSystem } from './components/MailSystem';

export default function App() {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isWebsiteOnline, setIsWebsiteOnline] = useState<boolean>(() => {
    const saved = localStorage.getItem('isWebsiteOnline');
    return saved !== 'false';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [currentView, setCurrentView] = useState<'main' | 'dropshipping' | 'warehouse' | 'admin' | 'admin-editor' | 'profile' | 'videos' | 'ecom-dashboard' | 'event'>('main');
  const [activeDashboardTab, setActiveDashboardTab] = useState<'global' | 'royal'>('global');
  const [registrationRequests, setRegistrationRequests] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [musicConfig, setMusicConfig] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const leftMenuRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const ytPlayerRef = useRef<any>(null);

  // 3D Avatar Global Synced States
  const [isVoiceActive, setIsVoiceActive] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isVoiceActive') === 'true';
    }
    return false;
  });
  const [isAutopilotActive, setIsAutopilotActive] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAutopilotActive') !== 'false';
    }
    return true;
  });
  const [modelUrl, setModelUrl] = useState('avatar.glb');
  const [modelScale, setModelScale] = useState(1.0);
  const [modelHeight, setModelHeight] = useState(0.0);
  const [isBreathingEnabled, setIsBreathingEnabled] = useState(true);
  const globalIframeRef = useRef<HTMLIFrameElement>(null);

  // 3D Avatar Global Synced Engine
  useEffect(() => {
    const handleVoiceToggle = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsVoiceActive(customEvent.detail);
      localStorage.setItem('isVoiceActive', String(customEvent.detail));
    };
    const handleAutopilotToggle = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsAutopilotActive(customEvent.detail);
      localStorage.setItem('isAutopilotActive', String(customEvent.detail));
    };
    const handleConfigChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { modelUrl, modelScale, modelHeight, isBreathingEnabled } = customEvent.detail;
      if (modelUrl !== undefined) setModelUrl(modelUrl);
      if (modelScale !== undefined) setModelScale(modelScale);
      if (modelHeight !== undefined) setModelHeight(modelHeight);
      if (isBreathingEnabled !== undefined) setIsBreathingEnabled(isBreathingEnabled);
    };
    const handleControl = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (globalIframeRef.current && globalIframeRef.current.contentWindow) {
        globalIframeRef.current.contentWindow.postMessage(customEvent.detail, '*');
      }
    };

    window.addEventListener('global-avatar-voice-toggle', handleVoiceToggle);
    window.addEventListener('global-avatar-autopilot-toggle', handleAutopilotToggle);
    window.addEventListener('global-avatar-config', handleConfigChange);
    window.addEventListener('global-avatar-control', handleControl);

    return () => {
      window.removeEventListener('global-avatar-voice-toggle', handleVoiceToggle);
      window.removeEventListener('global-avatar-autopilot-toggle', handleAutopilotToggle);
      window.removeEventListener('global-avatar-config', handleConfigChange);
      window.removeEventListener('global-avatar-control', handleControl);
    };
  }, []);

  // Post changes into iframe window reactively to ensure WebGL state stays in pristine condition
  useEffect(() => {
    if (globalIframeRef.current && globalIframeRef.current.contentWindow) {
      globalIframeRef.current.contentWindow.postMessage({ type: 'setLiveMode', isLiveMode: isVoiceActive }, '*');
    }
  }, [isVoiceActive]);

  // --- Persistent Background Voice Assistant Connection ---
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  const playAudio = async (base64Audio: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }
      const audioCtx = audioContextRef.current;
      
      // Resume context if browser autoplay controls have paused it
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      const binary = window.atob(base64Audio);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      // Convert raw PCM to a standard, browser-decodable WAV format wrapper on the fly
      const pcmToWav = (pcmBuffer: ArrayBuffer, sampleRate: number = 24000): ArrayBuffer => {
        const length = pcmBuffer.byteLength;
        const b = new ArrayBuffer(44 + length);
        const view = new DataView(b);

        const writeString = (v: DataView, offset: number, string: string) => {
          for (let i = 0; i < string.length; i++) {
            v.setUint8(offset + i, string.charCodeAt(i));
          }
        };

        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + length, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // PCM format format
        view.setUint16(22, 1, true); // Mono channel
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, length, true);

        const pcmArray = new Uint8Array(pcmBuffer);
        const wavArray = new Uint8Array(b, 44);
        wavArray.set(pcmArray);

        return b;
      };

      const wavBuffer = pcmToWav(bytes.buffer, 24000);

      // Decode the generated WAV on-the-fly and play via Web Audio scheduler
      audioCtx.decodeAudioData(wavBuffer, (audioBuffer) => {
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);

        const currentTime = audioCtx.currentTime;
        let playTime = nextStartTimeRef.current;
        if (playTime < currentTime) {
          playTime = currentTime + 0.04;
        }
        source.start(playTime);
        nextStartTimeRef.current = playTime + audioBuffer.duration;
      }, (decodeErr) => {
        console.warn("[App] WebAudio decodeAudioData failed, playing raw fallback", decodeErr);
        // Fallback: direct Float32 assignment
        const int16Array = new Int16Array(bytes.buffer);
        const float32Array = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
          float32Array[i] = int16Array[i] / 32768.0;
        }
        const fallbackBuffer = audioCtx.createBuffer(1, float32Array.length, 24000);
        fallbackBuffer.getChannelData(0).set(float32Array);

        const source = audioCtx.createBufferSource();
        source.buffer = fallbackBuffer;
        source.connect(audioCtx.destination);

        const currentTime = audioCtx.currentTime;
        let playTime = nextStartTimeRef.current;
        if (playTime < currentTime) {
          playTime = currentTime + 0.04;
        }
        source.start(playTime);
        nextStartTimeRef.current = playTime + fallbackBuffer.duration;
      });
    } catch (err) {
      console.error("[App] Audio pipeline processing fault:", err);
    }
  };

  const globalRecognitionRef = useRef<any>(null);
  const isSpeakingGlobalRef = useRef<boolean>(false);

  const speakInBengaliFemaleGlobal = (phrase: string) => {
    // Animate the lips of the 3D avatar iframe if it is active
    if (globalIframeRef.current && globalIframeRef.current.contentWindow) {
      globalIframeRef.current.contentWindow.postMessage({ type: 'speak', phrase }, '*');
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'bn-BD';
      utterance.pitch = 1.15; // sweet pitch
      utterance.rate = 0.95;  // slow affectionate speed
      
      // Explicitly filter and lock the voice array to a clean Google/Natural Female profile
      const voices = window.speechSynthesis.getVoices();
      const geminiLiveVoice = voices.find(voice => 
        (voice.name.includes("Google") || voice.name.includes("Natural")) && 
        voice.lang.includes("bn") && 
        voice.name.toLowerCase().includes("female")
      ) || voices.find(voice => 
        (voice.name.includes("Google") || voice.name.includes("Natural")) && 
        voice.lang.includes("en") && 
        voice.name.toLowerCase().includes("female")
      ) || voices.find(voice => 
        voice.lang.includes("bn") && 
        !voice.name.toLowerCase().includes("male")
      ) || voices.find(voice => 
        voice.lang.includes("en") && 
        voice.name.toLowerCase().includes("female")
      ) || voices.find(voice => 
        voice.name.toLowerCase().includes("female") || 
        voice.name.toLowerCase().includes("zira") || 
        voice.name.toLowerCase().includes("kalpana") || 
        voice.name.toLowerCase().includes("swara") || 
        voice.name.toLowerCase().includes("sravana")
      ) || voices[0];

      if (geminiLiveVoice) {
        utterance.voice = geminiLiveVoice;
      }
      
      isSpeakingGlobalRef.current = true;
      utterance.onend = () => {
        isSpeakingGlobalRef.current = false;
      };
      utterance.onerror = () => {
        isSpeakingGlobalRef.current = false;
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleConversationalVoiceChatGlobal = async (messageText: string) => {
    // Notify control panel of new user message
    window.dispatchEvent(new CustomEvent('global-chat-append', { 
      detail: { sender: 'user', text: messageText } 
    }));

    try {
      const response = await fetch('/api/autopilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText, 
          model: localStorage.getItem('selectedModel') || 'gemini-3.5-flash'
        })
      });

      if (!response.ok) return;

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let fullReply = "";

      // Add streaming placeholder in active chat list
      window.dispatchEvent(new CustomEvent('global-chat-append', { 
        detail: { sender: 'ai', text: '...', isStreaming: true } 
      }));

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const cleanLine = line.trim();
          if (cleanLine.startsWith("data: ")) {
            const dataStr = cleanLine.substring(6).trim();
            if (dataStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                fullReply = parsed.error;
                window.dispatchEvent(new CustomEvent('global-chat-stream-update', { 
                  detail: { text: fullReply } 
                }));
                break;
              }
              if (parsed.text) {
                fullReply += parsed.text;

                // Update text typing animation dynamically
                window.dispatchEvent(new CustomEvent('global-chat-stream-update', { 
                  detail: { text: fullReply } 
                }));
              }
            } catch {}
          }
        }
      }

      // Voice output the answer warmly
      speakInBengaliFemaleGlobal(fullReply);

    } catch (e) {
      console.warn("Global background conversation loop error:", e);
    }
  };

  useEffect(() => {
    if (!isVoiceActive) {
      if (globalRecognitionRef.current) {
        try {
          globalRecognitionRef.current.stop();
        } catch {}
        globalRecognitionRef.current = null;
      }
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Global background: Speech recognition is not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'bn-BD';
    globalRecognitionRef.current = recognition;

    let shouldAutoRestart = true;
    let restartTimer: any = null;
    let speechTimer: any = null;
    let accumulatedText = '';

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

      const text = (finalTranscript || interimTranscript).trim();
      if (text) {
        // Human speech detected. Instantly stop AI talk synthesis (Barge-in VAD)
        if (isSpeakingGlobalRef.current) {
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
          isSpeakingGlobalRef.current = false;
        }

        accumulatedText = text;

        if (speechTimer) clearTimeout(speechTimer);
        speechTimer = setTimeout(() => {
          if (accumulatedText && !isSpeakingGlobalRef.current && isVoiceActive) {
            const queryToSend = accumulatedText;
            accumulatedText = '';
            console.log("Global Background User voice input detected:", queryToSend);
            
            // Trigger background streaming speech answer
            handleConversationalVoiceChatGlobal(queryToSend);
          }
        }, 1200);
      }
    };

    recognition.onerror = (e: any) => {
      console.warn("Global Speech Recognition Error:", e.source, e.error);
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        shouldAutoRestart = false;
      }
    };

    recognition.onend = () => {
      if (isVoiceActive && shouldAutoRestart) {
        if (restartTimer) clearTimeout(restartTimer);
        restartTimer = setTimeout(() => {
          if (isVoiceActive && shouldAutoRestart && globalRecognitionRef.current) {
            try {
              globalRecognitionRef.current.start();
            } catch {}
          }
        }, 1500);
      }
    };

    try {
      recognition.start();
    } catch {}

    return () => {
      shouldAutoRestart = false;
      if (restartTimer) clearTimeout(restartTimer);
      try {
        recognition.stop();
      } catch {}
      globalRecognitionRef.current = null;
    };
  }, [isVoiceActive]);

  useEffect(() => {
    if (globalIframeRef.current && globalIframeRef.current.contentWindow) {
      globalIframeRef.current.contentWindow.postMessage({ type: 'setScale', scale: modelScale }, '*');
    }
  }, [modelScale]);

  useEffect(() => {
    if (globalIframeRef.current && globalIframeRef.current.contentWindow) {
      globalIframeRef.current.contentWindow.postMessage({ type: 'setPosy', posy: modelHeight }, '*');
    }
  }, [modelHeight]);

  useEffect(() => {
    if (globalIframeRef.current && globalIframeRef.current.contentWindow) {
      globalIframeRef.current.contentWindow.postMessage({ type: 'setBreathing', enabled: isBreathingEnabled }, '*');
    }
  }, [isBreathingEnabled]);

  useEffect(() => {
    if (globalIframeRef.current && globalIframeRef.current.contentWindow) {
      globalIframeRef.current.contentWindow.postMessage({ type: 'loadModel', url: modelUrl }, '*');
    }
  }, [modelUrl]);

  useEffect(() => {
    fetchMusicConfig();
  }, []);

  // Fetch updated music configuration whenever the user returns home (main view) to capture newly uploaded files instant
  useEffect(() => {
    if (currentView === 'main') {
      fetchMusicConfig();
    }
  }, [currentView]);

  // Handle global events for remote audio playback control
  useEffect(() => {
    const handleGlobalMuteEvent = (e: any) => {
      if (typeof e.detail?.mute === 'boolean') {
        const targetMuted = e.detail.mute;
        setIsMuted(targetMuted);
        if (audioRef.current) {
          if (!targetMuted) {
            if (!audioRef.current.src || audioRef.current.src === window.location.href) {
              if (musicConfig?.files && musicConfig.files.length > 0) {
                audioRef.current.src = musicConfig.files[0];
              } else if (musicConfig?.source_url) {
                audioRef.current.src = musicConfig.source_url;
              }
            }
            audioRef.current.play().catch(err => console.log("Event-driven play blocked or pending user interaction", err));
          } else {
            audioRef.current.pause();
          }
        }
      }
    };
    const handleReloadMusicEvent = () => {
      fetchMusicConfig();
    };

    window.addEventListener('set-global-mute', handleGlobalMuteEvent as EventListener);
    window.addEventListener('reload-music-config', handleReloadMusicEvent);

    return () => {
      window.removeEventListener('set-global-mute', handleGlobalMuteEvent as EventListener);
      window.removeEventListener('reload-music-config', handleReloadMusicEvent);
    };
  }, [musicConfig]);

  // Listen for global website online status changes
  useEffect(() => {
    const handleOnlineChange = () => {
      const saved = localStorage.getItem('isWebsiteOnline');
      setIsWebsiteOnline(saved !== 'false');
    };
    window.addEventListener('website-online-changed', handleOnlineChange);

    // Restore admin/editor sessions on mount
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isAdminLoggedIn) {
      setIsLoggedIn(true);
      const savedUser = localStorage.getItem('adminUser');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {}
      }
    }

    return () => {
      window.removeEventListener('website-online-changed', handleOnlineChange);
    };
  }, []);

  const fetchMusicConfig = async () => {
    try {
      const res = await fetch('/api/global/music');
      const data = await res.json();
      setMusicConfig(data);
    } catch (e) {
      console.error("Failed to fetch music config", e);
    }
  };

  const toggleMusic = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    if (musicConfig?.source_type === 'file' && audioRef.current) {
      if (newMuted) {
        audioRef.current.pause();
      } else {
        if (!audioRef.current.src || audioRef.current.src === window.location.href) {
          if (musicConfig.files && musicConfig.files.length > 0) {
            audioRef.current.src = musicConfig.files[0];
          } else if (musicConfig.source_url) {
            audioRef.current.src = musicConfig.source_url;
          }
        }
        audioRef.current.play().catch(e => console.log("Autoplay blocked/no source", e));
      }
    } else if (musicConfig?.source_type === 'link' && ytPlayerRef.current) {
      if (newMuted) {
        ytPlayerRef.current.mute();
      } else {
        ytPlayerRef.current.unMute();
        ytPlayerRef.current.playVideo();
      }
    }
  };

  // Auto-detect and load saved language
  useEffect(() => {
    const savedLang = localStorage.getItem('userLang') as LanguageCode;
    if (savedLang && languageList[savedLang]) {
      setCurrentLang(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0] as LanguageCode;
      if (languageList[browserLang]) {
        setCurrentLang(browserLang);
      }
    }
  }, []);

  const t = translations[currentLang] || translations['en'];

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
      if (leftMenuRef.current && !leftMenuRef.current.contains(event.target as Node)) {
        const toggleButton = document.getElementById('mainLeftMenuBtn');
        if (!toggleButton || !toggleButton.contains(event.target as Node)) {
          setIsLeftMenuOpen(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const togglePanel = () => setIsSignUpActive(!isSignUpActive);

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLang(lang);
    localStorage.setItem('userLang', lang);
    setIsLangDropdownOpen(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(true);
        setCurrentUser(data.user);
        // Save token if needed
        localStorage.setItem('pts_token', data.token);
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      alert('❌ Server connection failed. Make sure the dev server is running.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/activate-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: loginEmail.split('@')[0], 
          email: loginEmail, 
          password: loginPassword, 
          display_name: signUpName || 'New Shop' 
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('✅ Account created! Now please sign in.');
        setIsSignUpActive(false);
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      alert('❌ Server connection failed.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setLoginEmail('');
    setLoginPassword('');
    setSignUpName('');
    setCurrentView('main');
    setIsSettingsOpen(false);
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('pts_token');
  };

  const currentLangData = languageList[currentLang];

  const isUserAdminOrEditor = isLoggedIn && (
    localStorage.getItem('adminLoggedIn') === 'true' ||
    currentUser?.role === 'Admin' ||
    currentUser?.role === 'Editor'
  );

  if (!isWebsiteOnline && !isUserAdminOrEditor) {
    return (
      <MaintenanceScreen 
        onVerifySuccess={(role) => {
          localStorage.setItem('adminLoggedIn', 'true');
          const mockUser = { 
            name: role === 'Admin' ? 'Administrator' : 'Editor User', 
            role: role, 
            email: `${role.toLowerCase()}@pts.com` 
          };
          localStorage.setItem('adminUser', JSON.stringify(mockUser));
          setIsLoggedIn(true);
          setCurrentUser(mockUser);
          setCurrentView('admin');
        }} 
      />
    );
  }

  if (!isLoggedIn) {
    return (
      <div className={`bg-gray-50 font-sans min-h-screen flex flex-col ${currentLang === 'ar' ? 'dir-rtl' : ''}`}>
        <header className="w-full bg-white shadow-sm p-4 px-6 flex justify-between items-center max-w-7xl mx-auto rounded-b-xl my-4">
          <div className="flex items-center space-x-3">
            <div className="bg-pink-100 p-2.5 rounded-xl text-pink-600">
              <Crown size={24} />
            </div>
            <div>
              <span className="font-extrabold text-lg md:text-xl text-pink-600 tracking-wide flex items-center gap-1">
                Royal Palace BD <Home size={16} className="text-pink-500" />
              </span>
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center space-x-2 bg-pink-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm cursor-pointer hover:bg-pink-700 transition"
            >
              <Globe size={16} />
              <span>{currentLangData ? currentLangData.flag : '🇺🇸'} {currentLang.toUpperCase()}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isLangDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 bg-white shadow-2xl rounded-2xl overflow-hidden min-w-[200px] z-[1000] border border-gray-100"
                >
                  {Object.entries(languageList).map(([code, lang]) => (
                    <button
                      key={code}
                      onClick={() => setLanguage(code as LanguageCode)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-pink-50 transition-colors ${currentLang === code ? 'bg-pink-50 text-pink-600 font-semibold' : 'text-gray-700'}`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4 my-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row min-h-[550px]">
            {/* Form Side */}
            <div className={`w-full md:w-1/2 p-8 flex flex-col justify-center items-center bg-white ${isSignUpActive ? 'order-2' : 'order-2 md:order-1'}`}>
              <h2 className="text-3xl font-black text-gray-800 mb-2">
                {isSignUpActive ? t.createAccount : t.signIn}
              </h2>
              
              <div className="flex space-x-3 my-4">
                <button className="w-12 h-12 rounded-full border flex items-center justify-center text-pink-600 font-bold hover:bg-pink-50 transition shadow-sm text-sm">PTS</button>
                <button className="w-12 h-12 rounded-full border flex items-center justify-center text-gray-700 hover:bg-gray-50 transition shadow-sm text-lg">
                  <Linkedin size={20} />
                </button>
              </div>
              
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-6">
                {isSignUpActive ? t.orUseEmailReg : t.orUseAccount}
              </p>
              
              <form onSubmit={isSignUpActive ? handleSignUp : handleLogin} className="w-full max-w-sm space-y-4">
                {isSignUpActive && (
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Users size={18} />
                    </span>
                    <input 
                      type="text" 
                      placeholder={t.name}
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition text-sm"
                      required
                    />
                  </div>
                )}
                
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input 
                    type="email" 
                    placeholder={t.email}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition text-sm"
                    required
                  />
                </div>
                
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Lock size={18} />
                  </span>
                  <input 
                    type="password" 
                    placeholder={t.password}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition text-sm"
                    required
                  />
                </div>
                
                {!isSignUpActive && (
                  <div className="text-center">
                    <a href="#" className="text-xs text-gray-500 hover:text-pink-600 transition">{t.forgotPassword}</a>
                  </div>
                )}
                
                <button 
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl mt-6 transition shadow-md tracking-wide text-sm uppercase"
                >
                  {isSignUpActive ? t.signUp : t.signInBtn}
                </button>
              </form>
            </div>

            {/* Welcome Side */}
            <div className={`w-full md:w-1/2 bg-gradient-to-br from-pink-500 to-rose-600 p-8 flex flex-col justify-center items-center text-center text-white ${isSignUpActive ? 'order-1' : 'order-1 md:order-2'} py-12 md:py-8`}>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                {isSignUpActive ? t.welcomeBack : t.helloFriend}
              </h2>
              <p className="text-sm md:text-base font-light text-pink-100 max-w-xs mb-8 leading-relaxed">
                {isSignUpActive 
                  ? t.loginToStayConnected 
                  : t.enterDetailsJourney}
              </p>
              
              <button 
                onClick={togglePanel}
                className="border-2 border-white hover:bg-white hover:text-pink-600 text-white font-bold py-2.5 px-10 rounded-full transition tracking-wider text-xs uppercase shadow-sm"
              >
                {isSignUpActive ? t.signIn : t.signUp}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

   if (currentView === 'admin') {
     return (
       <AdminPanel 
         onBack={() => setCurrentView('main')} 
         onOpenEditor={() => setCurrentView('admin-editor')} 
         registrationRequests={registrationRequests}
         onBypassLogin={(user, token) => {
           setIsLoggedIn(true);
           setCurrentUser(user);
           localStorage.setItem('pts_token', token);
           setCurrentView('profile');
         }}
         t={t}
       />
     );
   }
   if (currentView === 'admin-editor') {
     return <EditorPanel onBack={() => setCurrentView('admin')} />;
   }
   if (currentView === 'account-access') {
     if (isLoggedIn && (currentUser?.role === 'Admin' || currentUser?.role === 'Editor')) {
       return (
         <AdminPanel 
           onBack={() => setCurrentView('main')} 
           onOpenEditor={() => setCurrentView('admin-editor')} 
           registrationRequests={registrationRequests}
           onBypassLogin={(user, token) => {
             setIsLoggedIn(true);
             setCurrentUser(user);
             localStorage.setItem('pts_token', token);
             setCurrentView('profile');
           }}
           t={t}
         />
       );
     }
     return <AccountAccess onBack={() => setCurrentView('main')} onAdminSuccess={(user, token) => {
        setIsLoggedIn(true);
        setCurrentUser(user);
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUser', JSON.stringify(user));
        localStorage.setItem('pts_token', token);
        setCurrentView('admin');
      }} t={t} />;
   }
   if (currentView === 'ecom-dashboard') {
     return <EcommerceDashboard onBack={() => setCurrentView('main')} t={t} />;
   }

   return (
     <div className={`min-h-screen bg-[#f5f7fa] ${currentLang === 'ar' ? 'dir-rtl' : ''}`}>
        {/* Dashboard Header */}
        <header className="dashboard-header sticky top-0 z-[100] bg-white/95 backdrop-blur-md shadow-lg">
          <div className="max-w-[1400px] mx-auto px-6 py-4">
            <div className="flex items-center gap-3 text-primary">
              <button 
                onClick={() => setIsLeftMenuOpen(!isLeftMenuOpen)}
                className="p-1.5 rounded-xl text-primary hover:bg-pink-50 hover:text-pink-600 transition cursor-pointer flex items-center justify-center mr-0.5 border border-pink-100/50"
                id="mainLeftMenuBtn"
                title="Menu"
              >
                <Menu size={22} />
              </button>
              <Crown size={32} fill="currentColor" />
              <h2 className="text-2xl font-bold">{t.brandName}</h2>

              {/* Left Hamburger Dropdown Menu containing all managers and features */}
              <AnimatePresence>
                {isLeftMenuOpen && (
                  <motion.div 
                    ref={leftMenuRef}
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="absolute left-6 top-[72px] bg-white border border-gray-150 rounded-2xl p-4 w-[280px] z-[1001] shadow-2xl flex flex-col gap-1 text-gray-700 font-sans"
                  >
                    {/* User Mini Profile block */}
                    <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl text-white mb-3 shadow-md">
                      <div className="w-9 h-9 rounded-full bg-white text-pink-600 font-bold flex items-center justify-center text-sm flex-shrink-0">
                        {currentUser?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-xs truncate">{currentUser?.name || "Verified User"}</p>
                        <p className="font-light text-[10px] opacity-90 truncate">{currentUser?.email || "user@email.com"}</p>
                      </div>
                    </div>

                    <div className="text-[10px] uppercase tracking-wider font-extrabold text-pink-500 px-2.5 py-1">MANAGERS</div>

                    <button 
                      onClick={() => {
                        setCurrentView('profile');
                        setIsLeftMenuOpen(false);
                      }}
                      className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-pink-50 transition-colors w-full text-left ${currentView === 'profile' ? 'bg-pink-50/70 text-pink-600 font-bold border-l-4 border-pink-500' : 'text-gray-700'}`}
                    >
                      <User size={16} className="text-pink-500" />
                      <span>My Profile</span>
                    </button>

                    <button 
                      onClick={() => {
                        setCurrentView('ecom-dashboard');
                        setIsLeftMenuOpen(false);
                      }}
                      className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-pink-50 transition-colors w-full text-left ${currentView === 'ecom-dashboard' ? 'bg-pink-50/70 text-pink-600 font-bold border-l-4 border-pink-500 animate-pulse' : 'text-gray-700'}`}
                    >
                      <LayoutGrid size={16} className="text-pink-500" />
                      <span>My Store System (Dashboard)</span>
                    </button>

                    <button 
                      onClick={() => {
                        setCurrentView('checkout');
                        setIsLeftMenuOpen(false);
                      }}
                      className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-pink-50 transition-colors w-full text-left ${currentView === 'checkout' ? 'bg-pink-50/70 text-pink-600 font-bold border-l-4 border-pink-500' : 'text-gray-700'}`}
                    >
                      <CreditCard size={16} className="text-pink-600 animate-pulse" />
                      <span>Reopen Store / Premium Pay</span>
                    </button>

                    <button 
                      onClick={() => {
                        setCurrentView('dropshipping');
                        setIsLeftMenuOpen(false);
                      }}
                      className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-pink-50 transition-colors w-full text-left ${currentView === 'dropshipping' ? 'bg-pink-50/70 text-pink-600 font-bold border-l-4 border-pink-500' : 'text-gray-700'}`}
                    >
                      <Truck size={16} className="text-pink-500" />
                      <span>Drop Shipping Account</span>
                    </button>

                    <button 
                      onClick={() => {
                        setCurrentView('warehouse');
                        setIsLeftMenuOpen(false);
                      }}
                      className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-pink-50 transition-colors w-full text-left ${currentView === 'warehouse' ? 'bg-pink-50/70 text-pink-600 font-bold border-l-4 border-pink-500' : 'text-gray-700'}`}
                    >
                      <Warehouse size={16} className="text-pink-500" />
                      <span>Warehouse</span>
                    </button>

                    <button 
                      onClick={() => {
                        setCurrentView('account-access');
                        setIsLeftMenuOpen(false);
                      }}
                      className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-pink-50 transition-colors w-full text-left ${currentView === 'account-access' ? 'bg-pink-50/70 text-pink-600 font-bold border-l-4 border-pink-500' : 'text-gray-700'}`}
                    >
                      <ShieldCheck size={16} className="text-pink-500" />
                      <span>Account Access</span>
                    </button>

                    <div className="h-px bg-gray-100 my-2" />
                    
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsLeftMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg hover:bg-red-50 text-red-600 transition-colors w-full text-left"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="header-center">
              <div className="royal-place-links">
                <span>{t.royalSocials}</span>
                <SocialLink href="https://facebook.com" icon={<Facebook size={16} />} label="Facebook" />
                <SocialLink href="https://tiktok.com" icon={<TikTok size={16} />} label="TikTok" />
                <SocialLink href="https://youtube.com" icon={<Youtube size={16} />} label="YouTube" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Global Music Control */}
              {currentView === 'main' && (
                <button 
                  onClick={toggleMusic}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${isMuted ? 'bg-gray-100 text-gray-400' : 'bg-primary/10 text-primary shadow-primary/20 ring-4 ring-primary/5'}`}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isMuted ? 'muted' : 'playing'}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} className="animate-pulse" />}
                    </motion.div>
                  </AnimatePresence>
                </button>
              )}

              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full border-2 border-primary/20">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <span className="font-medium text-gray-700">{currentUser?.name || t.welcomeUser}</span>
              </div>

              {/* Language Switcher */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => {
                    setIsLangDropdownOpen(!isLangDropdownOpen);
                    setIsSettingsOpen(false);
                  }}
                  className="lang-toggle outline-none"
                >
                  <div className="flex items-center gap-2">
                    <Globe size={16} />
                    <span>{currentLangData ? currentLangData.flag : '🇺🇸'} {currentLang.toUpperCase()}</span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isLangDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -15, scale: 0.95 }}
                      className="lang-dropdown shadow-2xl"
                    >
                      {Object.entries(languageList).map(([code, lang]) => (
                        <button
                          key={code}
                          onClick={() => setLanguage(code as LanguageCode)}
                          className={`lang-option ${currentLang === code ? 'active' : ''}`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Settings Menu */}
              <div className="relative" ref={settingsRef}>
                <button 
                  onClick={() => {
                    setIsSettingsOpen(!isSettingsOpen);
                    setIsLangDropdownOpen(false);
                  }}
                  className="settings-btn outline-none"
                  title="Settings"
                >
                  <Settings size={20} />
                </button>

                <AnimatePresence>
                  {isSettingsOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -15, scale: 0.95 }}
                      className="settings-dropdown shadow-2xl"
                    >
                      <button onClick={() => { setCurrentView('profile'); setIsSettingsOpen(false); }}>
                        <User size={18} /> {t.myProfile}
                      </button>
                      <button onClick={() => { setCurrentView('checkout'); setIsSettingsOpen(false); }} className="text-pink-600 bg-pink-50/55 hover:bg-pink-100 font-bold">
                        <CreditCard size={18} className="text-pink-600 animate-pulse animate-duration-1000" /> Reopen Store / Premium Pay
                      </button>
                      <button onClick={() => { setCurrentView('dropshipping'); setIsSettingsOpen(false); }}>
                        <Truck size={18} /> {t.dropShippingAccount}
                      </button>
                      <button onClick={() => { setCurrentView('warehouse'); setIsSettingsOpen(false); }}>
                        <Warehouse size={18} /> {t.warehouse}
                      </button>
                      <button onClick={() => { setCurrentView('account-access'); setIsSettingsOpen(false); }}>
                        <ShieldCheck size={18} /> {t.accountAccess}
                      </button>
                      <hr />
                      <button 
                        onClick={handleLogout} 
                        className="logout-btn-item"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto px-6 py-10">
          {currentView === 'profile' ? (
            <ProfileDashboard t={t} />
          ) : currentView === 'videos' ? (
            <VideoGallery />
          ) : currentView === 'mail' ? (
            <MailSystem />
          ) : currentView === 'event' ? (
            <EventZone />
          ) : currentView === 'checkout' ? (
            <SubscriptionCheckout onBack={() => setCurrentView('main')} />
          ) : currentView === 'dropshipping' || currentView === 'warehouse' ? (
            <RegistrationForm 
              t={t} 
              onBack={() => setCurrentView('main')} 
              mode={currentView} 
              currentUser={currentUser}
              onSubmitSuccess={(data: any) => setRegistrationRequests(prev => [...prev, { ...data, date: new Date().toLocaleString() }])}
            />
          ) : (
            <>
              {/* Tabs */}
              <div className="flex gap-4 mb-10 justify-center">
                <DashboardTab 
                  isActive={activeDashboardTab === 'global'} 
                  onClick={() => setActiveDashboardTab('global')}
                  icon={<Globe2 size={32} />}
                  label={t.globalTab}
                />
                <DashboardTab 
                  isActive={activeDashboardTab === 'royal'} 
                  onClick={() => setActiveDashboardTab('royal')}
                  icon={<Crown size={32} />}
                  label={t.royalTab}
                />
              </div>

              <div className="mt-8">
                <AnimatePresence mode="wait">
                  {activeDashboardTab === 'global' ? (
                    <motion.div 
                      key="global"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <GlobalSearchBar 
                        t={t}
                        onSearchResults={(results) => {
                          setSearchResults(results);
                          setIsSearching(true);
                      }} />

                      {isSearching ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {searchResults.length > 0 ? (
                            searchResults.map((product) => (
                              <StoreCard 
                                key={product.id}
                                image={product.image}
                                title={product.title}
                                badge={product.category || "Verified"}
                                users={product.likes}
                                rating={product.rating}
                                items={[
                                  { name: product.title.split(' - ')[0], original: product.originalPrice, discount: product.discountPrice, percent: product.discountPercent }
                                ]}
                                buttonText={t.buyNow}
                              />
                            ))
                          ) : (
                            <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                              <p className="text-gray-500 font-bold text-xl">কোনো পণ্য পাওয়া যায়নি!</p>
                              <button onClick={() => setIsSearching(false)} className="mt-4 text-primary font-bold hover:underline">সকল পণ্য দেখুন</button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          <StoreCard 
                            image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500"
                            title={t.globalStore}
                            badge="Verified"
                            users="2.5K"
                            rating="4.9"
                            items={[
                              { name: "Premium Account", original: "$99.99", discount: "$49.99", percent: "-50%" },
                              { name: "VIP Account", original: "$149.99", discount: "$74.99", percent: "-50%" },
                              { name: "Elite Account", original: "$199.99", discount: "$99.99", percent: "-50%" },
                            ]}
                            buttonText={t.viewMore}
                          />
                          <StoreCard 
                            image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500"
                            title={t.techStore}
                            badge="Hot Sale"
                            badgeClass="bg-yellow-500"
                            users="1.8K"
                            rating="4.8"
                            items={[
                              { name: "Netflix Premium", original: "$19.99", discount: "$9.99", percent: "-50%" },
                              { name: "Spotify Premium", original: "$14.99", discount: "$7.49", percent: "-50%" },
                              { name: "Canva Pro", original: "$12.99", discount: "$6.49", percent: "-50%" },
                            ]}
                            buttonText={t.viewMore}
                          />
                          <StoreCard 
                            image="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500"
                            title="Gaming Hub"
                            badge="New"
                            badgeClass="bg-green-500"
                            users="3.2K"
                            rating="5.0"
                            items={[
                              { name: "GTA V Account", original: "$29.99", discount: "$14.99", percent: "-50%" },
                              { name: "Minecraft Java", original: "$26.99", discount: "$13.49", percent: "-50%" },
                            ]}
                            buttonText={t.viewMore}
                          />
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="royal-palace"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <RoyalPalaceBD 
                        currentUser={currentUser} 
                        t={t} 
                        onProfileClick={() => setCurrentView('profile')} 
                        onLogout={handleLogout} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </main>

        <BottomNav 
          t={t} 
          currentLang={currentLang} 
          onHome={() => setCurrentView('main')}
          onProfile={() => setCurrentView('profile')}
          onVideos={() => setCurrentView('videos')}
          onMail={() => setCurrentView('mail')}
          onEvent={() => setCurrentView('event')}
          currentView={currentView}
        />

        {/* Global Music Engine */}
        <GlobalMusicLoader 
          config={musicConfig} 
          isMuted={isMuted} 
          audioRef={audioRef} 
          ytPlayerRef={ytPlayerRef}
        />

        {/* 3D FLOATING ASSISTANT AVATAR (GLOBAL MULTI-PAGE DRIFTER) */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes globalAvatarFloat {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          .global-avatar-container {
            position: fixed !important;
            bottom: 74px !important;
            right: 20px !important;
            width: 320px !important;
            height: 400px !important;
            z-index: 99999 !important;
            background: transparent !important;
            overflow: visible !important;
            pointer-events: none !important;
          }
          .global-avatar-inner {
            width: 100%;
            height: 100%;
            pointer-events: auto !important;
            animation: globalAvatarFloat 5s ease-in-out infinite;
            background: transparent !important;
          }
        `}} />

        {isVoiceActive && (
          <motion.div 
            drag
            dragMomentum={false}
            className="global-avatar-container cursor-grab active:cursor-grabbing"
            style={{ zIndex: 99999 }}
          >
            <div className="global-avatar-inner relative w-full h-full">
              <iframe 
                ref={globalIframeRef}
                src="/avatar-viewer.html" 
                onLoad={() => {
                  setTimeout(() => {
                    if (globalIframeRef.current && globalIframeRef.current.contentWindow) {
                      globalIframeRef.current.contentWindow.postMessage({ type: 'setLiveMode', isLiveMode: isVoiceActive }, '*');
                      globalIframeRef.current.contentWindow.postMessage({ type: 'setScale', scale: modelScale }, '*');
                      globalIframeRef.current.contentWindow.postMessage({ type: 'setPosy', posy: modelHeight }, '*');
                      globalIframeRef.current.contentWindow.postMessage({ type: 'setBreathing', enabled: isBreathingEnabled }, '*');
                      if (modelUrl) {
                        globalIframeRef.current.contentWindow.postMessage({ type: 'loadAvatar', url: modelUrl }, '*');
                      }
                    }
                  }, 400);
                }}
                className="w-full h-full border-0 select-none bg-transparent"
                title="Global Drifting AI Avatar"
                allow="autoplay"
              />
            </div>
          </motion.div>
        )}
      </div>
    );
}

function GlobalSearchBar({ onSearchResults, t }: { onSearchResults: (results: any[]) => void, t: any }) {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const executeSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!keyword.trim()) return;

    try {
      const response = await fetch(`/api/products/search?keyword=${encodeURIComponent(keyword)}`);
      const result = await response.json();
      if (result.success) {
        onSearchResults(result.data);
        setShowSuggestions(false);
      }
    } catch (e) {
      console.error("Search failed", e);
    }
  };

  const handleInput = async (val: string) => {
    setKeyword(val);
    if (val.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(`/api/products/search?keyword=${encodeURIComponent(val)}`);
      const result = await response.json();
      if (result.success) {
        setSuggestions(result.data);
        setShowSuggestions(true);
      }
    } catch (e) {
      console.error("Fetch suggestions failed", e);
    }
  };

  const selectSuggestion = (name: string) => {
    setKeyword(name);
    setShowSuggestions(false);
    executeSearch();
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-10 px-4">
      <div className="bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 ring-8 ring-gray-100/30">
        <form onSubmit={executeSearch} className="flex gap-3">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={keyword}
              onChange={(e) => handleInput(e.target.value)}
              placeholder={t.searchPlaceholder || "Search..."} 
              className="w-full pl-6 pr-12 py-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium"
            />
            {showSuggestions && suggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 right-0 mt-3 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[1001] max-h-72 overflow-y-auto overflow-x-hidden p-2"
              >
                {suggestions.map((product) => (
                  <div 
                    key={product.id}
                    className="p-4 hover:bg-primary/5 cursor-pointer rounded-xl border-b border-gray-50 last:border-0 text-sm font-bold text-gray-700 flex items-center gap-3 group transition-colors" 
                    onClick={() => selectSuggestion(product.title)}
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={product.image || null} alt="" className="w-full h-full object-cover" />
                    </div>
                    {product.title}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
          <button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 text-white font-black px-10 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-primary/20 active:scale-95 uppercase tracking-widest text-xs"
          >
            {t.searchBtn || "Search"}
          </button>
        </form>
      </div>
    </div>
  );
}

function GlobalMusicLoader({ config, isMuted, audioRef, ytPlayerRef }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const configRef = React.useRef(config);
  const indexRef = React.useRef(currentIndex);
  const isMutedRef = React.useRef(isMuted);

  // Sync refs and manage playlist change reset
  React.useEffect(() => {
    const oldFiles = configRef.current?.files || [];
    const newFiles = config?.files || [];
    const isSame = oldFiles.length === newFiles.length && oldFiles.every((v: string, i: number) => v === newFiles[i]);
    
    configRef.current = config;
    if (!isSame && newFiles.length > 0) {
      setCurrentIndex(0);
      indexRef.current = 0;
    }
  }, [config]);

  React.useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  React.useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  React.useEffect(() => {
    if (!config) return;

    if (config.source_type === 'link') {
      // Load YouTube API
      if (!(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        (window as any).onYouTubeIframeAPIReady = () => {
          initYTPlayer();
        };
      } else {
        initYTPlayer();
      }
    }
  }, [config]);

  // Synchronous ended event listener using mutable state references 
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      const currentConfig = configRef.current;
      const idx = indexRef.current;
      const muted = isMutedRef.current;

      if (currentConfig?.source_type === 'file' && currentConfig.files && currentConfig.files.length > 0) {
        if (currentConfig.files.length > 1) {
          if (idx < currentConfig.files.length - 1) {
            setCurrentIndex(idx + 1);
          } else if (currentConfig.play_mode === 'loop' || !currentConfig.play_mode) {
            setCurrentIndex(0);
          }
        } else if (currentConfig.play_mode === 'loop' || !currentConfig.play_mode) {
          audio.currentTime = 0;
          if (!muted) {
            audio.play().catch((e: any) => console.log("Autoplay loop blocked", e));
          }
        }
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, [audioRef]);

  // Load and play new file when index changes
  React.useEffect(() => {
    if (config?.source_type === 'file' && config.files && config.files[currentIndex] && audioRef.current) {
      const nextSrc = config.files[currentIndex];
      const currentSrc = audioRef.current.getAttribute('src') || '';
      
      if (currentSrc !== nextSrc && !currentSrc.endsWith(nextSrc)) {
        audioRef.current.src = nextSrc;
      }

      if (!isMuted) {
        audioRef.current.play().catch((e: any) => console.log("Playlist play track blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentIndex, config, isMuted, audioRef]);

  // Backward compatibility for single file playback
  React.useEffect(() => {
    if (config?.source_type === 'file' && (!config.files || config.files.length === 0) && audioRef.current) {
      const nextSrc = config.source_url || '';
      const currentSrc = audioRef.current.getAttribute('src') || '';
      
      if (nextSrc && currentSrc !== nextSrc && !currentSrc.endsWith(nextSrc)) {
        audioRef.current.src = nextSrc;
      }
      
      if (!isMuted && nextSrc) {
        audioRef.current.play().catch((e: any) => console.log("Single play blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted, config, audioRef]);

  const extractYTId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const initYTPlayer = () => {
    const videoId = extractYTId(config.source_url);
    if (!videoId) return;

    if (ytPlayerRef.current) {
      ytPlayerRef.current.loadVideoById(videoId);
      return;
    }

    ytPlayerRef.current = new (window as any).YT.Player('yt-player-container', {
      height: '0',
      width: '0',
      videoId: videoId,
      playerVars: { 
        'autoplay': 1, 
        'controls': 0, 
        'loop': config.play_mode === 'loop' ? 1 : 0, 
        'playlist': videoId 
      },
      events: {
        'onReady': (event: any) => {
          if (isMuted) event.target.mute();
          else event.target.unMute();
        }
      }
    });
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        loop={config?.play_mode === 'loop' && (!config.files || config.files.length === 1)} 
        style={{ display: 'none' }}
        src={(config?.source_type === 'file') ? (config.files && config.files.length > 0 ? config.files[currentIndex] : (config.source_url || null)) : null}
      />
      <div id="yt-player-container" style={{ display: 'none' }}></div>
    </>
  );
}

function Input({ type, placeholder, value, onChange }: { type: string; placeholder: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <input 
      type={type} 
      required
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="bg-gray-100 border-none p-3 my-2 w-full rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all"
    />
  );
}

function Button({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <button type="submit" className={`bg-primary text-white rounded-full border border-primary font-bold py-3 px-12 transition-all hover:opacity-90 uppercase tracking-widest text-xs cursor-pointer shadow-lg hover:shadow-primary/30 ${className}`}>
      {children}
    </button>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a 
      href="#" 
      className="border border-gray-200 rounded-full flex items-center justify-center w-12 h-12 text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
    >
      {icon}
    </a>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-primary/10 text-gray-600 hover:text-primary transition-all duration-300 no-underline"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </a>
  );
}

function DashboardTab({ isActive, onClick, icon, label }: { isActive: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center p-6 rounded-3xl transition-all duration-400 min-w-[180px] overflow-hidden border-2
        ${isActive 
          ? 'bg-primary text-white shadow-xl shadow-primary/30 border-primary' 
          : 'bg-white text-gray-600 hover:border-primary hover:-translate-y-2 hover:shadow-2xl border-transparent'}
      `}
    >
      <div className="mb-2 drop-shadow-md">{icon}</div>
      <h3 className="font-bold text-lg">{label}</h3>
      {isActive && (
        <motion.div 
          layoutId="tab-underline"
          className="absolute inset-0 bg-white/10 pointer-events-none"
          initial={false}
        />
      )}
    </button>
  );
}

function StoreCard({ image, title, badge, badgeClass = "bg-primary", users, rating, items, buttonText }: any) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:-translate-y-4 transition-all duration-500 border border-gray-100 group">
      <div className="relative h-56 overflow-hidden">
        <img src={image || null} alt={title} className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700" />
        <div className={`absolute top-4 right-4 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg ${badgeClass}`}>
          {badge}
        </div>
      </div>
      <div className="p-6">
        <h4 className="text-xl font-bold mb-4 text-gray-800">{title}</h4>
        <div className="flex gap-4 mb-6">
          <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
            <Users size={16} /> {users}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
            <Star size={16} fill="currentColor" className="text-yellow-400" /> {rating}
          </span>
        </div>
        <div className="space-y-3 mb-8">
          {items.map((item: any, i: number) => (
            <div key={i} className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0">
              <span className="font-medium text-gray-700">{item.name}</span>
              <div className="flex items-center gap-3">
                <span className="line-through text-gray-400 text-xs">{item.original}</span>
                <span className="font-bold text-primary">{item.discount}</span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-[10px] font-black">{item.percent}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm tracking-widest uppercase hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-95 cursor-pointer">
          {buttonText}
        </button>
      </div>
    </div>
  );
}


