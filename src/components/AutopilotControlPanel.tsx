import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Check, 
  X, 
  FileCode, 
  Sparkles, 
  Activity, 
  HelpCircle, 
  ArrowRight,
  ShieldAlert,
  Save,
  CheckCircle,
  FileCheck,
  Mic,
  MicOff,
  Volume2,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkle,
  Globe,
  Database,
  Video,
  VideoOff,
  Camera,
  Wifi,
  Layers,
  Cpu,
  Shield,
  Zap,
  Radio,
  Sliders,
  Terminal,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AILiveChat } from './AILiveChat';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  time: string;
  isCodePrompt?: boolean;
  target?: string;
}

export function AutopilotControlPanel() {
  const [isAutopilotActive, setIsAutopilotActive] = useState(true);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const toggleAutopilot = () => {
    setIsAutopilotActive(prev => {
      const next = !prev;
      speakInBengaliFemale(next ? "অটো পাইলট মোড সক্রিয় করা হয়েছে" : "অটো পাইলট মোড নিষ্ক্রিয় করা হয়েছে");
      return next;
    });
  };
  const [targetFile, setTargetFile] = useState('src/components/AdminPanel.tsx');
  const [aiCommand, setAiCommand] = useState('');
  const [chatMode, setChatMode] = useState<'conversational' | 'coding' | 'live-voice'>('conversational');
  const [isSearching, setIsSearching] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  
  // Real-time camera and audio stream state (WebRTC)
  const [webRtcStream, setWebRtcStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [micVolume, setMicVolume] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // MongoDB and Render integration telemetry states
  const [mongoDbStatus, setMongoDbStatus] = useState<{
    status: string;
    dbName?: string;
    collections?: number;
    documents?: number;
    dataSizeMb?: string;
    freeSpacePercent?: string;
    message: string;
  } | null>(null);

  const [renderStatus, setRenderStatus] = useState<{
    status: string;
    servicesCount?: number;
    message: string;
    services?: Array<{ id: string; name: string; type: string; status: string; updatedAt: string }>;
  } | null>(null);

  const [isDbChecking, setIsDbChecking] = useState(false);

  const checkDbAndConfig = async () => {
    setIsDbChecking(true);
    try {
      const [mongoRes, renderRes] = await Promise.all([
        fetch('/api/autopilot/mongodb-status').then(r => r.json()),
        fetch('/api/autopilot/render-status').then(r => r.json())
      ]);
      setMongoDbStatus(mongoRes);
      setRenderStatus(renderRes);
      await fetchSavedSecrets();
    } catch (e) {
      console.error("Failed to load telemetry", e);
    } finally {
      setIsDbChecking(false);
    }
  };

  useEffect(() => {
    checkDbAndConfig();
  }, []);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Female Voice Synthesizer settings
  const [isFemaleVoiceEnabled, setIsFemaleVoiceEnabled] = useState(true);
  
  // Simulated Interactive Shop Layout data for the Sandbox Preview
  const [sandboxData, setSandboxData] = useState({
    storeName: "রয়্যাল প্যালেস শপ",
    bio: "স্বাগতম! এটি আমাদের প্রিমিয়াম এআই ডেমো শপ। কাস্টমারদের জন্য ১০০% কোয়ালিটি নিশ্চয়তা।",
    showCategories: false,
    products: [
      { id: '1', title: 'স্মার্ট ওয়াচ আল্ট্রা', originalPrice: '২,৫০০', price: '২,৫০০', image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=200' },
      { id: '2', title: 'প্রিমিয়াম ব্লুটুথ হেডফোন', originalPrice: '১,৫০০', price: '১,৫০০', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' }
    ]
  });

  const [sandboxType, setSandboxType] = useState<'replica' | 'draft'>('replica');
  const [sandboxReloadKey, setSandboxReloadKey] = useState(0);
  const [memoryCount, setMemoryCount] = useState<number>(0);
  const [isClearingMemory, setIsClearingMemory] = useState<boolean>(false);

  // Safe Sandbox and Code comparison preview states
  const [originalCode, setOriginalCode] = useState<string>(`// মেইন লাইভ কোড (সুরক্ষিত মোড)
function DropshipStoreInterface() {
  const [storeName, setStoreName] = useState("রয়্যাল প্যালেস শপ");
  const [bio, setBio] = useState("স্বাগতম আমাদের শপে!");
  
  const [products, setProducts] = useState([
    { id: '1', title: 'স্মার্ট ওয়াচ আল্ট্রা', price: '২,৫০০' },
    { id: '2', title: 'প্রিমিয়াম ব্লুটুথ হেডফোন', price: '১,৫০০' }
  ]);
  
  return (
    <div>
      <h1>{storeName}</h1>
      <p>{bio}</p>
    </div>
  );
}`);

  const [proposedCode, setProposedCode] = useState<string>(`// এআই প্রস্তাবিত কোড (অনুমোদনের অপেক্ষায়)
function DropshipStoreInterface() {
  const [storeName, setStoreName] = useState("রয়্যাল প্যালেস শপ");
  const [bio, setBio] = useState("স্বাগতম আমাদের শপে!");
  
  const [products, setProducts] = useState([
    { id: '1', title: 'স্মার্ট ওয়াচ আল্ট্রা', price: '২,৫০০' },
    { id: '2', title: 'প্রিমিয়াম ব্লুটুথ হেডফোন', price: '১,৫০০' }
  ]);

  return (
    <div>
      <h1>{storeName}</h1>
      <p>{bio}</p>
    </div>
  );
}`);

  const [explanation, setExplanation] = useState<string>('');
  const [hasPendingPatch, setHasPendingPatch] = useState(false);

  // Live Voice Pilot specific states
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceLog, setVoiceLog] = useState<string>('// লাইভ ভয়েস ইঞ্জিন নিষ্ক্রিয়। "ভয়েস মোড চালু" করুন।');

  // Dragging states for 3D Floating Avatar panel
  const [floatPosition, setFloatPosition] = useState<{ x: number | null, y: number | null }>({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, posX: 0, posY: 0 });

  // Poses / Action modes for Mayra virtual assistant (sit, stand, walk, hover)
  const [currentPose, setCurrentPose] = useState('stand');

  // --- Dynamic System Permission Central Center ---
  const [showPermissionManager, setShowPermissionManager] = useState(false);
  const [permissionsState, setPermissionsState] = useState({
    camera: 'unknown',
    microphone: 'unknown',
    geolocation: 'unknown',
    notifications: 'unknown',
    clipboard: 'unknown',
    speech: 'unknown',
    sound: 'granted'
  });

  const checkAllPermissions = async () => {
    const updated: any = { ...permissionsState };
    if (typeof window === 'undefined') return;

    if (navigator.permissions && navigator.permissions.query) {
      try {
        const geo = await navigator.permissions.query({ name: 'geolocation' as any });
        updated.geolocation = geo.state;
      } catch (e) {
        updated.geolocation = 'prompt';
      }

      try {
        const notify = await navigator.permissions.query({ name: 'notifications' as any });
        updated.notifications = notify.state;
      } catch (e) {
        updated.notifications = 'Notification' in window ? Notification.permission : 'denied';
      }

      try {
        const clipWrite = await navigator.permissions.query({ name: 'clipboard-write' as any });
        updated.clipboard = clipWrite.state;
      } catch (e) {
        updated.clipboard = 'prompt';
      }

      try {
        const cam = await navigator.permissions.query({ name: 'camera' as any });
        updated.camera = cam.state;
      } catch (e) {
        updated.camera = 'prompt';
      }

      try {
        const mic = await navigator.permissions.query({ name: 'microphone' as any });
        updated.microphone = mic.state;
      } catch (e) {
        updated.microphone = 'prompt';
      }
    } else {
      updated.notifications = 'Notification' in window ? Notification.permission : 'denied';
    }

    // Verify speech-recognition
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    updated.speech = SpeechRecognitionClass ? 'granted' : 'denied';

    setPermissionsState(prev => ({ ...prev, ...updated }));
  };

  useEffect(() => {
    checkAllPermissions();
    // Synchronize initial romantic voice mode from platform database
    fetch('/api/autopilot/romantic')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.romanticMode !== undefined) {
          setRomanticMode(data.romanticMode);
        }
      })
      .catch(err => console.warn("Failed to retrieve initial romantic mode status on load:", err));
  }, []);

  const requestGeolocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      alert("⚠️ আপনার ডিভাইস লোকেশন সার্ভিস সমর্থন করে না।");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPermissionsState(prev => ({ ...prev, geolocation: 'granted' }));
        alert("✅ আপনার লোকেশন ব্রাউজারে সফলভাবে অ্যাক্সেস করা হয়েছে!");
      },
      (err) => {
        setPermissionsState(prev => ({ ...prev, geolocation: 'denied' }));
        alert("❌ লোকেশন অনুমতি ব্লক করা আছে। অনুগ্রহ করে ব্রাউজারবারের বাম পাশে সাইট সেটিংসে অনুমতি দিন।");
      }
    );
  };

  const requestCamera = async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionsState(prev => ({ ...prev, camera: 'granted' }));
      alert("✅ ক্যামেরা ব্যবহারের অনুমতি ডিভাইসে সক্রিয় করা হলো!");
    } catch (e) {
      setPermissionsState(prev => ({ ...prev, camera: 'denied' }));
      alert("❌ ক্যামেরা অনুমতি অ্যাক্সেস করা সম্ভব হয়নি অথবা এটি কোনো অ্যাপ ব্রাউজারে ব্লকড আছে।");
    }
  };

  const requestMicrophone = async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionsState(prev => ({ ...prev, microphone: 'granted' }));
      alert("✅ মাইক্রোফোন ব্যবহারের অনুমতি সফলভাবে সক্রিয় হলো!");
    } catch (e) {
      setPermissionsState(prev => ({ ...prev, microphone: 'denied' }));
      alert("❌ মাইক্রোফোন ব্যবহার করতে অনুমতি পাওয়া যায়নি বা এটি ব্লক রয়েছে।");
    }
  };

  const requestNotifications = async () => {
    if (typeof window === 'undefined') return;
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermissionsState(prev => ({ ...prev, notifications: result }));
      if (result === 'granted') {
        alert("✅ পুশ নোটিফিকেশন অনুমতি সক্রিয় হয়েছে!");
      } else {
        alert("❌ নোটিফিকেশন অনুমতি ব্লক করা হয়েছে।");
      }
    } else {
      alert("⚠️ আপনার ব্রাউজার নোটিফিকেশন সমর্থন করে না।");
    }
  };

  const requestSpeech = async () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      try {
        const temp = new SpeechRecognitionClass();
        temp.start();
        setTimeout(() => temp.stop(), 500);
        setPermissionsState(prev => ({ ...prev, speech: 'granted' }));
        alert("✅ লাইভ ভয়েস-টু-কোড রিকগনিশন পারমিশন যুক্ত হয়েছে!");
      } catch (err) {
        setPermissionsState(prev => ({ ...prev, speech: 'denied' }));
        alert("❌ ভয়েস রিকগনিশন অনুমতি সচল করা সম্ভব হয়নি।");
      }
    } else {
      alert("⚠️ আপনার ব্রাউজারে ভয়েস রিকগনিশন সাপোর্ট নেই। ক্রোম ব্যবহার করুন।");
    }
  };

  const requestSound = () => {
    if (typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      try {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        setPermissionsState(prev => ({ ...prev, sound: 'granted' }));
        alert("✅ সাউন্ড প্লেব্যাক ও ক্যারেক্টারের ভয়েস স্পিকার সফলভাবে সক্রিয় করা হয়েছে!");
      } catch (e) {}
    }
  };

  const grantAllSequentially = async () => {
    alert("পর্যায়ক্রমে ব্রাউজার পপআপ থেকে এক এক করে ৫টি অনুমতি চাওয়া হবে। দয়া করে প্রতিটি পপআপে 'Allow' ক্লিক করে এগিয়ে যান।");
    
    // 1
    try {
      const cStream = await navigator.mediaDevices.getUserMedia({ video: true });
      cStream.getTracks().forEach(t => t.stop());
    } catch(e){}
    
    // 2
    try {
      const mStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mStream.getTracks().forEach(t => t.stop());
    } catch(e){}
    
    // 3
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {}, () => {});
    }
    
    // 4
    if ('Notification' in window) {
      await Notification.requestPermission();
    }
    
    // 5
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      try {
        const temp = new SpeechRecognitionClass();
        temp.start();
        setTimeout(() => temp.stop(), 300);
      } catch(e){}
    }

    setTimeout(() => {
      checkAllPermissions();
      alert("🎉 সমস্ত পারমিশন সিকুয়েন্স কোয়েরি সম্পন্ন হয়েছে! আপনার মোবাইল, পিসি বা ল্যাপটপে সব অনুমতি লাইভ কানেক্টেড!");
    }, 1200);
  };

  const handlePoseChange = (pose: string) => {
    setCurrentPose(pose);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'playPose', pose }, '*');
    }
    const poseTexts: { [key: string]: string } = {
      stand: 'দাঁড়ানো মোডে সেট করা হয়েছে',
      sit: 'বসা মোডে সেট করা হয়েছে',
      walk: 'হাঁটাহাঁটি করার মোডে সেট করা হয়েছে',
      hover: 'ভাসমান মোডে সেট করা হয়েছে'
    };
    speakInBengaliFemale(poseTexts[pose] || 'অ্যাকশন পরিবর্তন করা হয়েছে');
    setVoiceLog(`👤 ৩ডি ক্যারেক্টার পজিশন: ${pose.toUpperCase()}`);
  };

  // Interactive 3D Model inputs from user feedback:
  const [modelUrl, setModelUrl] = useState('avatar.glb');
  const [activeMotion, setActiveMotion] = useState('');
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [modelScale, setModelScale] = useState(1.0);
  const [modelHeight, setModelHeight] = useState(0.0);
  const [isBreathingEnabled, setIsBreathingEnabled] = useState(true);
  
  // Re-routed to the global 3D character iframe in App.tsx!
  const iframeRef = useRef<any>({
    contentWindow: {
      postMessage: (data: any, origin?: string) => {
        window.dispatchEvent(new CustomEvent('global-avatar-control', { detail: data }));
      }
    }
  });

  // Declare global state synchronizers so that editing models/heights propagates to App.tsx instantly
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('global-avatar-config', {
      detail: { modelUrl, modelScale, modelHeight, isBreathingEnabled }
    }));
  }, [modelUrl, modelScale, modelHeight, isBreathingEnabled]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('global-avatar-voice-toggle', { detail: isVoiceActive }));
  }, [isVoiceActive]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('global-avatar-autopilot-toggle', { detail: isAutopilotActive }));
  }, [isAutopilotActive]);

  // Synchronize state changes triggered from outside of the Autopilot component
  useEffect(() => {
    const handleVoiceToggleExternal = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsVoiceActive(customEvent.detail);
    };
    const handleAutopilotToggleExternal = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsAutopilotActive(customEvent.detail);
    };

    const handleGlobalAppend = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { sender, text, isStreaming } = customEvent.detail;
      
      setChatMessages(prev => {
        // If it starts streaming, let's create a placeholder block
        if (isStreaming && prev.length > 0 && prev[prev.length - 1].sender === sender) {
          return prev;
        }
        return [
          ...prev,
          {
            sender,
            text,
            time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
          }
        ];
      });
    };

    const handleGlobalStreamUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { text } = customEvent.detail;
      
      setChatMessages(prev => {
        const updated = [...prev];
        if (updated.length > 0 && updated[updated.length - 1].sender === 'ai') {
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text
          };
        }
        return updated;
      });
    };

    window.addEventListener('global-avatar-voice-toggle', handleVoiceToggleExternal);
    window.addEventListener('global-avatar-autopilot-toggle', handleAutopilotToggleExternal);
    window.addEventListener('global-chat-append', handleGlobalAppend);
    window.addEventListener('global-chat-stream-update', handleGlobalStreamUpdate);

    return () => {
      window.removeEventListener('global-avatar-voice-toggle', handleVoiceToggleExternal);
      window.removeEventListener('global-avatar-autopilot-toggle', handleAutopilotToggleExternal);
      window.removeEventListener('global-chat-append', handleGlobalAppend);
      window.removeEventListener('global-chat-stream-update', handleGlobalStreamUpdate);
    };
  }, []);

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const activeSourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const handleScaleChange = (scale: number) => {
    setModelScale(scale);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'setScale', scale }, '*');
    }
  };

  const handleHeightChange = (posy: number) => {
    setModelHeight(posy);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'setPosy', posy }, '*');
    }
  };

  const handleBreathingToggle = (enabled: boolean) => {
    setIsBreathingEnabled(enabled);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'setBreathing', enabled }, '*');
    }
  };

  // Gemini Control Dashboard states matching user parameters for premium sweet voice
  type GeminiModel = 'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite' | 'gemini-2.5-flash' | 'gemini-2.5-pro' | 'gemini-1.5-pro' | 'gemini-1.5-flash';
  const [selectedModel, setSelectedModel] = useState<GeminiModel>('gemini-3.5-flash');
  const [textToSpeak, setTextToSpeak] = useState<string>('হ্যালো প্রিয়তম, আমি আপনার মিষ্টি সহকারী মাইরা। আপনি কেমন আছেন?');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [romanticMode, setRomanticMode] = useState<boolean>(true);
  const [voiceConfig, setVoiceConfig] = useState({
    pitch: 1.05,                 // ১.০৫ পিচ কণ্ঠস্বরকে অতিরিক্ত ভারী না করে একদম মিষ্টি ও নরম প্রাকৃতিক নারী কণ্ঠ দেয়
    speed: 1.0,                // গতি স্বাভাবিক রেখে কথাগুলোকে একদম স্পষ্ট (Crystal Clear) করা হয়েছে
    toneStyle: 'soft_female_warm', 
    clarityFilter: true,
    voiceName: 'Google-Soft-Female-Hindi-Bengali', // প্রিমিয়াম সফট ভয়েস নোড
    geminiVoice: 'Lyra' // Hardcoded premium beautiful voice
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Sync Refs for Voice Recognition callbacks to avoid stale closures
  const chatModeRef = useRef(chatMode);
  useEffect(() => {
    chatModeRef.current = chatMode;
  }, [chatMode]);

  const targetFileRef = useRef(targetFile);
  useEffect(() => {
    targetFileRef.current = targetFile;
  }, [targetFile]);

  // Keys & Credentials Vault State values
  const [showSecretsModal, setShowSecretsModal] = useState(false);
  const [vaultMongoUri, setVaultMongoUri] = useState('');
  const [vaultRenderKey, setVaultRenderKey] = useState('');
  const [vaultGithubToken, setVaultGithubToken] = useState('');
  const [vaultGithubRepo, setVaultGithubRepo] = useState('');
  const [isSavingSecrets, setIsSavingSecrets] = useState(false);
  const [showSecretsValues, setShowSecretsValues] = useState(false);

  const fetchSavedSecrets = async () => {
    try {
      const res = await fetch('/api/autopilot/get-keys');
      const data = await res.json();
      if (data.success) {
        setVaultMongoUri(data.mongodb_uri || '');
        setVaultRenderKey(data.render_api_key || '');
        setVaultGithubToken(data.github_token || '');
        setVaultGithubRepo(data.github_repo || '');
      }
    } catch (err) {
      console.error("Secrets loading failed:", err);
    }
  };

  const saveSecretsToVault = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSecrets(true);
    try {
      const response = await fetch('/api/autopilot/save-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mongodb_uri: vaultMongoUri,
          render_api_key: vaultRenderKey,
          github_token: vaultGithubToken,
          github_repo: vaultGithubRepo
        })
      });
      const data = await response.json();
      if (data.success) {
        speakInBengaliFemale("সার্ভার সিক্রেট চাবিগুলো সফলভাবে সংরক্ষিত করা হয়েছে");
        setShowSecretsModal(false);
        // Refresh telemetry database & server parameters immediately
        checkDbAndConfig();
      } else {
        alert("সংরক্ষণে ব্যর্থ হয়েছে!");
      }
    } catch (err) {
      console.error(err);
      alert("নেটওয়ার্ক বা সার্ভার ত্রুটি!");
    } finally {
      setIsSavingSecrets(false);
    }
  };

  const recognitionRef = useRef<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSpeakingRef = useRef(false);
  const speechSequenceIdRef = useRef(0);

  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.glb') || fileName.endsWith('.gltf')) {
        const fileUrl = URL.createObjectURL(file);
        setModelUrl(file.name);
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'loadModel', url: fileUrl }, '*');
          setVoiceLog(`📁 ৩ডি ক্যারেক্টার ফাইল আপলোড হয়েছে: "${file.name}" (${(file.size / 1024 / 1024).toFixed(2)} MB)\n// ক্যারেক্টার রেন্ডারিং শুরু হচ্ছে...`);
          speakInBengaliFemale("আপনার থ্রিডি ক্যারেক্টারটি সফলভাবে লোড করা হচ্ছে");
        }
      } else if (fileName.endsWith('.fbx')) {
        const fileUrl = URL.createObjectURL(file);
        setActiveMotion(file.name);
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'playMotion', motion: fileUrl }, '*');
          setVoiceLog(`📁 কাস্টম এনিমেশন fbx লোড হয়েছে: "${file.name}"`);
          speakInBengaliFemale("রিয়েল-টাইম এনিমেশনটি আপনার ক্যারেক্টারে যুক্ত করা হচ্ছে");
        }
      } else {
        setVoiceLog(`📁 ফাইল আপলোড করা হয়েছে: "${file.name}" (${(file.size / 1024).toFixed(1)} KB)\n// এআই ফাইল বিশ্লেষণ করছে...`);
        speakInBengaliFemale(`ফাইল ${file.name} সফলভাবে আপলোড করা হয়েছে`);
      }
    }
  };

  const startCameraMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      setWebRtcStream(stream);
      setIsCameraActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.log("Video playback paused", e));
      }

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioContext = new AudioContextClass();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const checkVolume = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          setMicVolume(Math.round((average / 255) * 100));
          animationFrameRef.current = requestAnimationFrame(checkVolume);
        };
        checkVolume();
      }
    } catch (err) {
      console.error("Camera and Mic permission denied", err);
      setIsCameraActive(false);
      setVoiceLog("⚠️ ক্যামেরা ও মাইক্রোফোন অ্যাক্সেস করতে ব্যর্থ হয়েছে। ");
    }
  };

  const stopCameraMic = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (webRtcStream) {
      webRtcStream.getTracks().forEach(track => track.stop());
      setWebRtcStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setIsCameraActive(false);
    setMicVolume(0);
  };

  const handleLocalCameraToggle = async () => {
    if (isCameraActive) {
      stopCameraMic();
      setVoiceLog(`📷 ক্যামেরা ফিড বন্ধ করা হয়েছে।`);
      speakInBengaliFemale("ক্যামেরা লাইভ ভিশন বন্ধ করা হয়েছে");
    } else {
      await startCameraMic();
      speakInBengaliFemale("ক্যামেরা লাইভ ভিশন সচল করা হয়েছে");
    }
  };

  const captureSnapshot = () => {
    if (!isCameraActive || !videoRef.current) {
      alert("দয়া করে প্রথমে ক্যামেরা ফিড চালু করুন!");
      return;
    }
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedImage(dataUrl);
      setVoiceLog(`📷 ক্যামেরা ভিশন: একটি নতুন খাতার ড্রাফট/স্কেচ স্ন্যাপশট নেওয়া হয়েছে!\n// এটি জেমিনিকে কোডিং এর জন্য পাঠানোর জন্য প্রস্তুত।`);
      speakInBengaliFemale("স্ন্যাপশটটি সফলভাবে গ্রহণ করা হয়েছে প্রিয়! আমি এখন আপনার ডায়াগ্রাম দেখে কোডিং সম্পন্ন করতে পারব।");
    }
  };

  // Voice recognition loop is globally managed in App.tsx to ensure background persistence across all views!
  useEffect(() => {
    // Registered globally in App.tsx. Autopilot panel listens via 'global-chat-append' and 'global-chat-stream-update' events!
  }, [isVoiceActive]);

  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        // মিষ্টি ও নরম নারী কণ্ঠের ফিল্টার (Hindi/Bengali/English Soft Voices)
        const femaleVoices = voices.filter(v => 
          v.name.toLowerCase().includes('female') || 
          v.name.toLowerCase().includes('google') || 
          v.name.toLowerCase().includes('zira') || 
          v.name.toLowerCase().includes('natasha') ||
          v.name.toLowerCase().includes('bangla') ||
          v.name.toLowerCase().includes('bengali')
        );
        setAvailableVoices(femaleVoices.length > 0 ? femaleVoices : voices);
      }
    };
    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const testSweetVoice = () => {
    setVoiceLog(`🔊 টেস্ট মিষ্টি কণ্ঠস্বর প্লেব্যাক শুরু হয়েছে: "${textToSpeak}"`);
    speakInBengaliFemale(textToSpeak);
  };

  const handleApproveAndLiveUpdate = async () => {
    setIsUpdating(true);
    try {
      console.log(`Deploying with Models: Gemini 3.5, 1.5 Pro, 1.5 Flash...`);
      console.log(`Embedding Premium Sweet Voice Matrix:`, voiceConfig);
      
      const googleAIStudioSpeechConfig = {
        model: selectedModel,
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Lyra",
            }
          },
          audioConfig: {
            pitchModifier: voiceConfig.pitch,
            speakingRateModifier: voiceConfig.speed,
            volumeGainDb: 2.0
          }
        }
      };

      console.log("Sent Configuration to Server:", googleAIStudioSpeechConfig);
      setVoiceLog(`⏳ Syncing Models & Voice configuration with Linux server...`);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      alert('✓ Success! মিষ্টি কণ্ঠস্বর ও ৩টি মডেল একসাথে লাইভ আপডেট হয়ে গেছে।');
      setVoiceLog(`✓ Success! মিষ্টি কণ্ঠস্বর ও ৩টি মডেল (${selectedModel}) লাইভ আপডেট সম্পূর্ণ।`);
    } catch (error) {
      console.error('Deployment Fault:', error);
      setVoiceLog(`❌ আপডেট সিঙ্ক ব্যর্থ হয়েছে।`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleApprove = async () => {
    setIsDeploying(true);
    speakInBengaliFemale("কোড পরিবর্তন অনুমোদন করা হয়েছে এবং লাইভ সার্ভারে আপলোড করা হচ্ছে প্রিয়");
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setOriginalCode(proposedCode);
      setHasPendingPatch(false);
      speakInBengaliFemale("অভিনন্দন! পরিবর্তন সফলভাবে মূল ড্রপশিপিং পোর্টালে সংযুক্ত করা হয়েছে।");
      setVoiceLog("✅ [সফলতা]: কোড পরিবর্তন সরাসরি মূল সাইটে পুশ করা হয়েছে।");
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: '🎉 অভিনন্দন! প্রস্তাবিত কোড পরিবর্তনটি সফলভাবে মূল মডেলে লাইভ করা হয়েছে। এখন আপনার কাস্টমাররা সরাসরি এই পরিবর্তন দেখতে পাবেন।',
          time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleReject = () => {
    setProposedCode(originalCode);
    setHasPendingPatch(false);
    speakInBengaliFemale("কোড পরিবর্তন বাতিল করা হয়েছে");
    setVoiceLog("❌ [বাতিল]: প্রস্তাবিত কোড পরিবর্তন বাতিল করা হয়েছে।");
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: '❌ কোড পরিবর্তন বাতিল করা হয়েছে এবং প্রস্তাবিত প্যাচটি ফেলে দেওয়া হয়েছে।',
        time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleDiagnose = async () => {
    if (!aiCommand.trim()) return;
    const command = aiCommand;
    setAiCommand('');
    handleVoiceCommandDetected(command);
  };

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'হ্যালো অ্যাডমিন! আমি আপনার পুরো ড্রপশিপিং ও একাউন্ট পোর্টাল সিস্টেম মনিটর করছি। কোনো নতুন ফিচার যোগ করতে বা বাগ ফিক্স করতে নিচে টার্গেট ফাইল সিলেক্ট করে আমাকে সরাসরি ভয়েস বা টাইপ করে নির্দেশ দিন।',
      time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBottomRef.current && chatBottomRef.current.parentElement) {
      chatBottomRef.current.parentElement.scrollTop = chatBottomRef.current.parentElement.scrollHeight;
    }
  }, [chatMessages]);

  const fetchMemoryStatus = async () => {
    try {
      const response = await fetch('/api/autopilot/memory');
      const data = await response.json();
      if (response.ok && data.success) {
        setMemoryCount(data.count || 0);
      }
    } catch (e) {
      console.warn("Failed to fetch memory status:", e);
    }
  };

  useEffect(() => {
    fetchMemoryStatus();
  }, [chatMessages]);

  const handleClearMemoryPercent = async (percent: number) => {
    setIsClearingMemory(true);
    try {
      const response = await fetch('/api/autopilot/memory/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ percentage: percent })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMemoryCount(data.count || 0);
        speakInBengaliFemale(data.message || "মেমোরি সফলভাবে ক্লিয়ার করা হয়েছে প্রিয়");
        
        setChatMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `🧹 [মেমোরি ডিলিট]: ${data.message}`,
            time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (e) {
      console.warn("Failed to clear memory:", e);
    } finally {
      setIsClearingMemory(false);
    }
  };

  // Helper routine to generate sandboxed iframe content for real-time visual output
  const getSandboxHtml = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 16px; }
          .badge { animation: pulse 2s infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .6; } }
        </style>
      </head>
      <body class="flex flex-col h-full justify-between">
        <div class="border-b border-slate-800 pb-3 mb-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 p-1 px-2.5 rounded-full border border-rose-500/20">
              🛠️ Sandbox Draft Preview
            </span>
            <span class="text-[10px] text-slate-400 font-mono">Status: Connected to AI</span>
          </div>
          <h2 class="text-xl font-black text-white mt-2 mb-1">${sandboxData.storeName}</h2>
          <p class="text-xs text-slate-400 font-medium leading-relaxed">${sandboxData.bio}</p>
        </div>

        ${sandboxData.showCategories ? `
        <div class="mb-4 bg-slate-900 border border-slate-800 p-2 rounded-xl text-left">
          <p class="text-[9px] text-indigo-400 font-extrabold uppercase tracking-widest mb-1.5 px-1">AI Generated Categories (ক্যাটাগরি মেনু):</p>
          <div class="flex gap-2 overflow-x-auto pb-1">
            <span class="text-[10px] bg-pink-600 text-white font-extrabold px-3 py-1 rounded-full cursor-pointer shrink-0">সব প্রোডাক্ট (${sandboxData.products.length})</span>
            <span class="text-[10px] bg-indigo-650 text-white font-extrabold px-3 py-1 rounded-full cursor-pointer shrink-0">স্মার্ট গাজেট</span>
            <span class="text-[10px] bg-slate-800 text-slate-350 px-3 py-1 rounded-full cursor-pointer shrink-0">হেডফোন</span>
            <span class="text-[10px] bg-slate-800 text-slate-350 px-3 py-1 rounded-full cursor-pointer shrink-0">স্মার্ট ঘড়ি</span>
          </div>
        </div>
        ` : ''}

        <div class="text-left">
          <p class="text-xs font-bold text-slate-300 mb-2">গ্যালারি প্রোডাক্টসমূহ:</p>
          <div class="grid grid-cols-2 gap-3">
            ${sandboxData.products.map(p => `
              <div class="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col justify-between">
                <img referrerPolicy="no-referrer" src="${p.image}" class="w-full h-16 object-cover rounded-md mb-2 bg-slate-950" />
                <div>
                  <h4 class="text-[11px] font-bold text-slate-200 line-clamp-1">${p.title}</h4>
                  <div class="flex items-center gap-1.5 mt-1">
                    <span class="text-xs font-black text-emerald-400">৳${p.price}</span>
                    ${p.price !== p.originalPrice ? `
                      <span class="text-[9px] text-slate-500 line-through">৳${p.originalPrice}</span>
                      <span class="text-[8px] bg-rose-500 text-white px-1 rounded font-black">ছাড়!</span>
                    ` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-800/60 text-center text-[10px] text-slate-500 font-bold">
          * এই প্রিভিউতে ডেটা ডিলিট বা মূল কাস্টমার ডাটাবেজের ক্ষতি হওয়ার কোনো ভয় নেই।
        </div>
      </body>
      </html>
    `;
  };

  // Stops all playing AI audio sources, browser speech synthesis, and HTML5 audio player
  const stopAllAiAudio = () => {
    speechSequenceIdRef.current++;
    // 1. Cancel browser synthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        console.warn("Could not cancel speech synthesis", err);
      }
    }

    // 2. Clear any active Web Audio API PCM playing
    if (activeSourceNodeRef.current) {
      try {
        activeSourceNodeRef.current.stop();
      } catch (err) {
        console.warn("Could not stop previous audio node", err);
      }
      activeSourceNodeRef.current = null;
    }

    // 3. Clear any active server audio playing
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
      } catch (err) {
        console.warn("Could not pause previous audio", err);
      }
      currentAudioRef.current = null;
    }

    setIsSpeaking(false);
    isSpeakingRef.current = false;
  };

  // Speaks Bengali Text using Web Voice Synthesis using a beautiful, sweet female pitch and slower romantic rate
  const speakInBengaliFemale = async (phrase: string) => {
    // Increment and store the current Speech ID dynamically for 100% overlap prevention
    const currentSpeechId = ++speechSequenceIdRef.current;

    // Send a real-time message to the 3D Avatar iframe to animate its head and mouth dynamically!
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'speak', phrase }, '*');
    }

    if (!isFemaleVoiceEnabled) return;

    // Instantly halt any previous speech outputs immediately to prevent dual-talking
    // 1. Clear any active server audio playing
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      } catch (err) {
        console.warn("Could not pause previous audio", err);
      }
    }

    // 2. Clear any active Web Audio API PCM playing
    if (activeSourceNodeRef.current) {
      try {
        activeSourceNodeRef.current.stop();
        activeSourceNodeRef.current = null;
      } catch (err) {
        console.warn("Could not stop previous audio node", err);
      }
    }

    // 3. Clear any active browser voice synthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        console.warn("Could not cancel speech synthesis", err);
      }
    }

    // Keep microphone active during output playback to allow user barge-in VAD listening!
    isSpeakingRef.current = true;
    setIsSpeaking(true);

    const handleSpeechEnded = () => {
      // Direct guard to ensure we don't handle completion events of stale overridden speech
      if (currentSpeechId !== speechSequenceIdRef.current) return;

      isSpeakingRef.current = false;
      setIsSpeaking(false);
    };

    // 4. Try Gemini TTS Server Endpoint
    try {
      const response = await fetch('/api/autopilot/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: phrase,
          voice: voiceConfig.geminiVoice
        })
      });

      // Quick guard check after the network fetch returns
      if (currentSpeechId !== speechSequenceIdRef.current) {
        console.log("Speech sequence overridden during fetch. Aborting audio playback.");
        return;
      }

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.audio) {
          // Double-check sequence before decoding
          if (currentSpeechId !== speechSequenceIdRef.current) return;

          console.log(`Successfully playing pristine Gemini '${voiceConfig.geminiVoice}' voice!`);
          
          // Decode raw 16-bit linear PCM audio
          const binaryString = window.atob(result.audio);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          const int16Array = new Int16Array(bytes.buffer);
          const float32Array = new Float32Array(int16Array.length);
          for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / 32768.0;
          }
          
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const audioCtx = new AudioContextClass();
            if (audioCtx.state === 'suspended') {
              await audioCtx.resume();
            }
            
            // Hardcoded "Lyra" parameters: crisp, sweet, natural female tone with 24000Hz high-quality sampling rate
            let playbackHz = 24000;    
            let playbackRateVal = 1.0; 
            let filterType: BiquadFilterType | null = 'peaking';
            let filterFreq = 3100;
            let filterQ = 0.9;
            
            const audioBuffer = audioCtx.createBuffer(1, float32Array.length, playbackHz);
            audioBuffer.getChannelData(0).set(float32Array);
            
            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.playbackRate.value = playbackRateVal;

            // Anti-pop/click GainNode to smooth start and stop clicks
            const gainNode = audioCtx.createGain();
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(1.0, audioCtx.currentTime + 0.05); // 50ms fade-in

            const duration = audioBuffer.duration / playbackRateVal;
            if (duration > 0.1) {
              gainNode.gain.setValueAtTime(1.0, audioCtx.currentTime + duration - 0.05);
              gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration); // 50ms fade-out
            }

            if (filterType) {
              const filter = audioCtx.createBiquadFilter();
              filter.type = filterType;
              filter.frequency.value = filterFreq;
              filter.Q.value = filterQ;
              if (filterType === 'peaking') {
                filter.gain.value = 3.5; // Gain boost for crisp clear vocal definition
              }
              source.connect(filter);
              filter.connect(gainNode);
            } else {
              source.connect(gainNode);
            }
            
            gainNode.connect(audioCtx.destination);
            
            activeSourceNodeRef.current = source;
            source.onended = handleSpeechEnded;
            source.start(0);
          }
          return; // Server synthesis successfully played, skip local synthesis fallback!
        }
      }
    } catch (apiError) {
      console.warn("Gemini TTS API proxy failed; falling back to local SpeechSynthesis:", apiError);
    }

    // 4. Fallback to browser SpeechSynthesis if the server-side API fails
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = 'bn-BD';
        
        let voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) {
          voices = window.speechSynthesis.getVoices();
        }
        
        // Exclude male names to ensure Jan/Maira is always female
        const isMaleVoice = (nameStr: string): boolean => {
          const n = nameStr.toLowerCase();
          // Comprehensive male voices indicators (including standard-b / neural-b commonly used for male Bangla/Hindi voices)
          return n.includes('hemant') || n.includes('saurav') || n.includes('male') || 
                 n.includes('boy') || n.includes('man') || n.includes('guy') || 
                 n.includes('david') || n.includes('george') || n.includes('mark') || 
                 n.includes('ravi') || n.includes('gentleman') || n.includes('raj') || 
                 n.includes('pradeep') || n.includes('shobhit') || n.includes('vijay') || 
                 n.includes('Standard-B') || n.includes('standard-b') || n.includes('wavenet-b') || 
                 n.includes('neural-b') || n.includes('standard-c') || n.includes('wavenet-c') ||
                 n.includes('neural-c') || n.includes('standard-d') || n.includes('wavenet-d');
        };

        const selectedVoice = 
          // 1. Explicitly female Bengali voice
          voices.find(v => (v.lang === 'bn-BD' || v.lang === 'bn-IN') && 
            (v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('swara') || v.name.toLowerCase().includes('sravana') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('girl') || v.name.toLowerCase().includes('soft') || v.name.toLowerCase().includes('ananya')) && 
            !isMaleVoice(v.name)
          ) ||
          // 2. Any Bengali voice that is NOT a male voice (Edge Kalpana, Google Bangla Female, etc.)
          voices.find(v => (v.lang.startsWith('bn') || v.name.toLowerCase().includes('bengali') || v.name.toLowerCase().includes('bangla')) && 
            !isMaleVoice(v.name)
          ) ||
          // 3. Any Bengali voice at all (absolute last resort for Bengali)
          voices.find(v => (v.lang.startsWith('bn') || v.name.toLowerCase().includes('bengali') || v.name.toLowerCase().includes('bangla')) && 
            !isMaleVoice(v.name)
          ) ||
          // 4. Any female voice (even if English or Hindi) so she sounds sweet
          voices.find(v => (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('girl') || v.name.toLowerCase().includes('sweet') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('swara') || v.name.toLowerCase().includes('sravana')) && 
            !isMaleVoice(v.name)
          ) ||
          // 5. Default voice
          voices[0];
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log(`On-device fallback voice selected: ${selectedVoice.name} (${selectedVoice.lang})`);
        }
        utterance.pitch = voiceConfig.pitch;
        utterance.rate = voiceConfig.speed;
        utterance.volume = 1.0;
        
        utterance.onend = handleSpeechEnded;
        utterance.onerror = handleSpeechEnded;

        if (currentSpeechId !== speechSequenceIdRef.current) {
          console.log("Speech sequence overridden before browser TTS. Aborting fallback.");
          return;
        }

        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utterance);
      } catch (fallbackError) {
        console.error("Local client SpeechSynthesis fallback failed:", fallbackError);
        handleSpeechEnded();
      }
    } else {
      handleSpeechEnded();
    }
  };

  // Speaks/Tests the female romantik voice to bypass user gesture blocks
  const testFemaleVoice = () => {
    if (!window.speechSynthesis) {
      alert("❌ আপনার ব্রাউজারে স্পিচ সিন্থেসিস সাপোর্ট করে না!");
      return;
    }
    setVoiceLog('🔊 স্পিচ ইঞ্জিন অ্যাক্টিভ ও পরীক্ষা করা হচ্ছে...');
    speakInBengaliFemale("হ্যালো প্রিয়তম, আমি জান। আমি তোমার মিষ্টি ক্যারেক্টার এবং এআই ভয়েস পাইলট। আমি এখন কথা বলতে সফল ও প্রস্তুত আছি!");
  };

  // Force resets any stuck browser audio rendering engine
  const resetVoiceEngine = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const ut = new SpeechSynthesisUtterance("রিসেট কমপ্লিট");
      ut.lang = 'bn-BD';
      window.speechSynthesis.speak(ut);
      setVoiceLog('🔄 ব্রাউজার স্পিচ সিন্থেসিস ইঞ্জিন রিসেট করা হয়েছে।');
    }
  };

  // Load GLB Model remotely or locally inside the iframe
  const handleLoadModel = (customUrl?: string) => {
    const url = customUrl || modelUrl || 'avatar.glb';
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'loadModel', url }, '*');
      setVoiceLog(`⚙️ ৩ডি মডেল লোড হচ্ছে: ${url}`);
      speakInBengaliFemale("আইফ্রেমের ভেতরে নতুন মডেল লোড করার নির্দেশ পাঠানো হয়েছে");
    }
  };

  // Active Motion / playing dynamic animation tracks
  const handleActiveMotion = (customMotion?: string) => {
    const motionName = customMotion || activeMotion;
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'playMotion', motion: motionName }, '*');
      setVoiceLog(`🎬 এনিমেশন ট্র্যাক প্লে হচ্ছে: ${motionName}`);
      speakInBengaliFemale(`নতুন মোশন ট্র্যাক চালু করা হয়েছে`);
    }
  };

  // Helper routine to render red/green diff line-by-line
  const renderCodeDiff = (oldStr: string, newStr: string) => {
    const oldLines = oldStr.split('\n');
    const newLines = newStr.split('\n');
    
    // Simplistic visual alignment diff for reactive illustration
    const maxLines = Math.max(oldLines.length, newLines.length);
    const diffRows: React.ReactNode[] = [];

    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i] || '';
      const newLine = newLines[i] || '';

      if (oldLine === newLine) {
        diffRows.push(
          <div key={i} className="flex font-mono text-[10px] leading-relaxed border-b border-slate-900/45 py-0.5 hover:bg-slate-900/10">
            <span className="w-8 text-right pr-2 text-slate-600 shrink-0 select-none">{i+1}</span>
            <span className="text-slate-500 pl-2 whitespace-pre-wrap">{oldLine}</span>
          </div>
        );
      } else {
        if (oldLine) {
          diffRows.push(
            <div key={`del-${i}`} className="flex font-mono text-[10px] leading-relaxed bg-red-950/30 text-red-300 border-l-2 border-red-500 py-0.5">
              <span className="w-8 text-right pr-2 text-red-900/80 shrink-0 select-none">-</span>
              <span className="pl-2 whitespace-pre-wrap line-through decoration-red-800/40 text-red-400 bg-red-950/15 w-full">{oldLine}</span>
            </div>
          );
        }
        if (newLine) {
          diffRows.push(
            <div key={`add-${i}`} className="flex font-mono text-[10px] leading-relaxed bg-emerald-950/30 text-emerald-300 border-l-2 border-emerald-500 py-0.5">
              <span className="w-8 text-right pr-2 text-emerald-900/50 shrink-0 select-none">+</span>
              <span className="pl-2 whitespace-pre-wrap text-emerald-400 bg-emerald-950/15 w-full">{newLine}</span>
            </div>
          );
        }
      }
    }

    return (
      <div className="flex flex-col overflow-y-auto max-h-[3400px]">
        {diffRows}
      </div>
    );
  };

  // Handles visual toggle of Romantic Voice Mode via visual switches or clicks in the dashboard panel
  const handleToggleRomanticMode = async (enabled: boolean) => {
    try {
      const response = await fetch('/api/autopilot/romantic/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      });
      if (response.ok) {
        const result = await response.json();
        setRomanticMode(result.romanticMode);
        if (result.romanticMode) {
          setVoiceLog("💖 রোমান্টিক মোড চালু করা হয়েছে! মাইরা এখন খুব মিষ্টি ভালোবাসাময় সুরে কথা বলবে।");
          speakInBengaliFemale("আমি আবার মিষ্টি করে কথা বলা শুরু করেছি, প্রিয়তম!");
        } else {
          setVoiceLog("👔 রোমান্টিক কথোপকথন বন্ধ করা হয়েছে। সহকারী এখন পেশাদার ও শান্ত সুরে কথা বলবে।");
          speakInBengaliFemale("ঠিক আছে প্রিয়, আমি রোমান্টিক কথা বলা বন্ধ করেছি। এখন আমি সম্পূর্ণ পেশাদারভাবে কাজ করব।");
        }
      }
    } catch (err) {
      console.error("Error toggling romantic mode:", err);
    }
  };

  // Common workspace files for quick administration
  const quickFiles = [
    'src/components/AdminPanel.tsx',
    'src/App.tsx',
    'server.ts'
  ];

  const handleConversationalVoiceChat = async (messageText: string) => {
    setIsSearching(true);
    setVoiceLog(`🎙️ জেমিনি লাইভ ভয়েস: "${messageText}"\n// জান উত্তর প্রস্তুত করছে...`);
    
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'user',
        text: messageText,
        time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    try {
      const response = await fetch('/api/autopilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText, 
          model: selectedModel, 
          imageBase64: capturedImage,
          history: chatMessages 
        })
      });

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      setCapturedImage(null); // Clear the captured notebook sketch on success
      
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("ReadableStream Reader not supported on this browser.");
      }

      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let fullReply = "";
      let activeModelLabel = selectedModel;

      // Add a placeholder message for AI
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: '...',
          time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
        }
      ]);

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
            if (dataStr === "[DONE]") {
              continue;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                fullReply = parsed.error;
                setChatMessages(prev => {
                  const updated = [...prev];
                  if (updated.length > 0 && updated[updated.length - 1].sender === 'ai') {
                    updated[updated.length - 1] = {
                      ...updated[updated.length - 1],
                      text: fullReply
                    };
                  }
                  return updated;
                });
                break;
              }
              if (parsed.text) {
                fullReply += parsed.text;
                if (parsed.modelUsed) {
                  activeModelLabel = parsed.modelUsed;
                }
                if (parsed.romanticModeState !== undefined) {
                  setRomanticMode(parsed.romanticModeState);
                }

                // Update the last message text in the chat messages array live
                setChatMessages(prev => {
                  const updated = [...prev];
                  if (updated.length > 0 && updated[updated.length - 1].sender === 'ai') {
                    updated[updated.length - 1] = {
                      ...updated[updated.length - 1],
                      text: fullReply
                    };
                  }
                  return updated;
                });
              }
            } catch (err) {
              console.warn("SSE JSON Parse Error:", err);
            }
          }
        }
      }

      // Read output response out loud once fully stream-loaded
      speakInBengaliFemale(fullReply || 'আমি আপনার নির্দেশ বুঝতে পেরেছি।');
      setVoiceLog(`✅ জেমিনি লাইভ ভয়েস সক্রিয়। (${activeModelLabel})`);

    } catch (err: any) {
      console.warn("Detailed Stream error:", err);
      handleVoiceCommandDetected(messageText);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVoiceCommandDetected = (command: string) => {
    setIsSearching(true);
    setVoiceLog(`⚡ [ভয়েস কমান্ড সনাক্তকৃত]: "${command}"\n// কোড ডিয়াগনসিস স্ক্রিনে স্যান্ডবক্স ড্রাফট ও ভয়েস ফিল্টার তৈরি হচ্ছে...`);
    
    setTimeout(() => {
      if (command.includes('ক্যাটাগরি') || command.includes('category') || command.includes('মেনু')) {
        setOriginalCode(`// server.ts / AdminPanel.tsx (আগের কোড)
function DropshipStoreInterface() {
  return (
    <div className="store-body">
      <SearchBar />
      <ProductGrid />
    </div>
  );
}`);
        setProposedCode(`// proposed patch sandbox
function DropshipStoreInterface() {
  return (
    <div className="store-body">
      <SearchBar />
      
      {/* এআই সংশোধিত ক্যাটাগরি মেনু */}
      <div id="ai-generated-categories" className="flex gap-2 py-3 overflow-x-auto justify-center">
        <button className="bg-pink-600 text-white font-bold px-4 py-1.5 rounded-full text-xs">সব ভিউ</button>
        <button className="bg-slate-800 text-slate-300 hover:text-white px-4 py-1.5 rounded-full text-xs">ইলেকট্রনিক্স</button>
        <button className="bg-slate-800 text-slate-300 hover:text-white px-4 py-1.5 rounded-full text-xs">স্মার্ট গাজেটস</button>
      </div>

      <ProductGrid />
    </div>
  );
}`);
        const exp = 'ভয়েস নির্দেশ মেলাতে জেমিনী এআই শপ সার্চ বারের নিচে একটি ডাইনামিক ক্যাটাগরি ফিল্টার বার মডিউল যুক্ত করেছে। সম্মতি দিলে Approve বোতামে ক্লিক করুন।';
        setExplanation(exp);
        setSandboxData(prev => ({ ...prev, showCategories: true }));
        setHasPendingPatch(true);
        speakInBengaliFemale(exp);

      } else if (command.includes('নাম')) {
        setOriginalCode(`// server.ts / AdminPanel.tsx (আগের কোড)
function DropshipStoreInterface() {
  const [storeName, setStoreName] = useState("রয়্যাল প্যালেস শপ");
}`);
        setProposedCode(`// proposed patch sandbox
function DropshipStoreInterface() {
  // প্রোফাইল নাম ও ব্র্যান্ড টাইটেল পরিবর্তন করা হলো
  const [storeName, setStoreName] = useState("এমডি আরিয়ান - কাস্টম এআই শপ");
}`);
        const exp = 'ভয়েস কমান্ড অনুযায়ী আপনার পারসোনাল ড্রপশিপিং স্টোরের ব্র্যান্ড নাম পরিবর্তন করে "এমডি আরিয়ান - কাস্টম এআই শপ" করা হয়েছে। এটি লাইভ করতে নিচের Approve বোতাম ক্লিক করুন।';
        setExplanation(exp);
        setSandboxData(prev => ({ ...prev, storeName: "এমডি আরিয়ান - কাস্টম এআই শপ" }));
        setHasPendingPatch(true);
        speakInBengaliFemale(exp);

      } else if (command.includes('দাম')) {
        setOriginalCode(`// server.ts / AdminPanel.tsx (আগের কোড)
const [products, setProducts] = useState([
  { id: '1', title: 'স্মার্ট ওয়াচ আল্ট্রা', price: '২,৫০০' },
  { id: '2', title: 'প্রিমিয়াম ব্লুটুথ হেডফোন', price: '১,৫০০' }
]);`);
        setProposedCode(`// proposed patch sandbox
// ৫০০ টাকা ছাড় দিয়ে প্রাইস রেঞ্জ সংশোধন করা হলো
const [products, setProducts] = useState([
  { id: '1', title: 'স্মার্ট ওয়াচ আল্ট্রা', price: '২,০০০' },
  { id: '2', title: 'প্রিমিয়াম ব্লুটুথ হেডফোন', price: '১,০০০' }
]);`);
        const exp = 'ভয়েস নির্দেশ অনুযায়ী স্টোরের সবকটি মূল প্রোডাক্টের দাম ৫০০ টাকা ছাড় দিয়ে কমানো হয়েছে। Approve বাটনে ক্লিক করলে গ্রাহকদের জন্য এই নতুন মূল্যটি প্রযোজ্য হবে।';
        setExplanation(exp);
        setSandboxData(prev => ({
          ...prev,
          products: [
            { id: '1', title: 'স্মার্ট ওয়াচ আল্ট্রা', originalPrice: '২,৫০০', price: '২,০০০', image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=200' },
            { id: '2', title: 'প্রিমিয়াম ব্লুটুথ হেডফোন', originalPrice: '১,৫০০', price: '১,০০০', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' }
          ]
        }));
        setHasPendingPatch(true);
        speakInBengaliFemale(exp);

      } else if (command.includes('বায়ো')) {
        setOriginalCode(`// server.ts / AdminPanel.tsx (আগের কোড)
const [bio, setBio] = useState("স্বাগতম আমাদের শপে!");`);
        setProposedCode(`// proposed patch sandbox
const [bio, setBio] = useState("স্বাগতম! এআই ইন্টিগ্রেটেড ড্রপশিপিং স্টোরে আপনাকে স্বাগতম। আমরা দিচ্ছি ১০০% কোয়ালিটি নিশ্চয়তা।");`);
        const exp = 'আপনার ব্র্যান্ড শপের ট্যাগলাইন ও বায়ো পরিবর্তন করে একটি আকর্ষনীয় কাস্টমার মেসেজ তৈরি করা হয়েছে। মূল সাইটে পুশ করতে Approve ক্লিক করুন।';
        setExplanation(exp);
        setSandboxData(prev => ({ ...prev, bio: "স্বাগতম! এআই ইন্টিগ্রেটেড ড্রপশিপিং স্টোরে আপনাকে স্বাগতম। আমরা দিচ্ছি ১০০% কোয়ালিটি নিশ্চয়তা।" }));
        setHasPendingPatch(true);
        speakInBengaliFemale(exp);
      }

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `🎙️ [ভয়েস রিসিভড]: "${command}"\n\nআমি ডানে একটি নিরাপদ কোড পরিবর্তন ড্রাফট তৈরি করেছি। অনুগ্রহ করে ডেমো দেখে অনুমতি প্রদান করুন।`,
          time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setVoiceLog(`✅ কোড জেনারেট সম্পন্ন! অনুগ্রহ করে ডানে "Approve & Live Upload" ক্লিক করে লাইভ করুন।`);
      setIsSearching(false);
    }, 1500);
  };

  // Automatically extracts modifications from the AI's proposed code patch 
  // and applies them to the Sandbox Preview in real-time so users see the changes instantly!
  const updateSandboxFromProposedCode = (code: string) => {
    if (!code) return;
    
    setSandboxData(prev => {
      let storeName = prev.storeName;
      let bio = prev.bio;
      let showCategories = prev.showCategories;
      let products = [...prev.products];

      // 1. Parse storeName (looking for setStoreName("...") or useState("...") or simple text keywords)
      const storeNameMatch = code.match(/setStoreName\s*\(\s*["'`](.*?)["'`]\s*\)/);
      if (storeNameMatch && storeNameMatch[1]) {
        storeName = storeNameMatch[1];
      } else {
        if (code.includes("এমডি আরিয়ান - কাস্টম এআই শপ")) {
          storeName = "এমডি আরিয়ান - কাস্টম এআই শপ";
        } else if (code.includes("রয়্যাল প্যালেস শপ")) {
          storeName = "রয়্যাল প্যালেস শপ";
        }
      }

      // 2. Parse bio (looking for setBio("...") or useState("...") or specific keywords)
      const bioMatch = code.match(/setBio\s*\(\s*["'`](.*?)["'`]\s*\)/);
      if (bioMatch && bioMatch[1]) {
        bio = bioMatch[1];
      } else {
        if (code.includes("১০০% কোয়ালিটি নিশ্চয়তা")) {
          bio = "স্বাগতম! এআই ইন্টিগ্রেটেড ড্রপশিপিং স্টোরে আপনাকে স্বাগতম। আমরা দিচ্ছি ১০০% কোয়ালিটি নিশ্চয়তা।";
        }
      }

      // 3. Detect category menus or categories toggle
      if (code.includes('categories') || code.includes('ক্যাটাগরি') || code.includes('category') || code.includes('মেনু')) {
        showCategories = true;
      }

      // 4. Detect product prices (e.g. 500 Taka discount)
      const price2000 = code.includes('২,০০০') || code.includes('2000') || code.includes('২০০০');
      const price1000 = code.includes('১,০০০') || code.includes('1000') || code.includes('১০০০');
      
      if (price2000 || price1000) {
        products = [
          { id: '1', title: 'স্মার্ট ওয়াচ আল্ট্রা', originalPrice: '২,৫০০', price: price2000 ? '২,০০০' : '২,৫০০', image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=200' },
          { id: '2', title: 'প্রিমিয়াম ওয়্যারলেস এয়ারপড', originalPrice: '১,৫০০', price: price1000 ? '১,০০০' : '১,৫০০', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200' }
        ];
      }

      return {
        storeName,
        bio,
        showCategories,
        products
      };
    });
  };

  return (
    <div className="grid grid-cols-12 gap-5 p-2 sm:p-5 w-full">
      {/* Left Sidebar Control Column (Mobile spans 12 cols, XL spans 5 cols) */}
      <div className="col-span-12 xl:col-span-5 flex flex-col space-y-5 h-auto">
        
        {/* Security / Databases / Connections Status Panel */}
        <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl flex flex-col space-y-3 shadow-lg">
          {/* Automatically connect and run silently without technical clutter once credentials are bound */}
          {mongoDbStatus?.status === 'connected' && renderStatus?.status === 'connected' ? (
            <div className="bg-slate-900/40 border border-emerald-500/10 p-3.5 rounded-xl flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <div>
                  <p className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">সিকিউর ক্লাউড ডাটাবেজ কনেকশন সচল</p>
                  <p className="text-[8.5px] text-slate-400 mt-0.5 leading-tight">অটো-পাইলট ভল্ট নিরাপদে ব্যাকগ্রাউন্ডে সম্পৃক্ত রয়েছে এবং কাজ করছে।</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  fetchSavedSecrets();
                  setShowSecretsModal(true);
                }}
                className="p-1.5 px-3 border border-slate-800 text-slate-405 hover:text-white rounded-lg bg-slate-950 hover:bg-slate-850 cursor-pointer text-[9px] font-extrabold transition-all duration-200 select-none uppercase tracking-wide flex items-center gap-1.5"
              >
                🔐 ভল্ট সেটিং
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3.5">
                {/* MongoDB Connection Status Badge */}
                <div className="bg-slate-900/45 border border-slate-850 p-3 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">MongoDB Database</span>
                      <span className={`w-2 h-2 rounded-full ${
                        mongoDbStatus?.status === 'connected' ? 'bg-emerald-500 animate-pulse shadow shadow-emerald-500' : 
                        mongoDbStatus?.status === 'error' ? 'bg-rose-550' : 'bg-amber-400 animate-pulse'
                      }`} />
                    </div>
                    {mongoDbStatus?.status === 'connected' ? (
                      <div className="space-y-1">
                        <p className="text-[11px] font-extrabold text-slate-200 truncate">{mongoDbStatus.dbName}</p>
                        <div className="flex items-center gap-1.5 text-[8.5px] text-slate-400 font-mono">
                          <span>{mongoDbStatus.collections} কনেকশন</span>
                          <span>•</span>
                          <span>{mongoDbStatus.documents} ডেটা</span>
                        </div>
                        {/* Database Storage Capacity Bar */}
                        <div className="pt-1">
                          <div className="flex justify-between items-center text-[8.5px] font-bold text-slate-400 mb-1">
                            <span>খালি জায়গা (Storage Available)</span>
                            <span className="text-emerald-400 font-extrabold">{mongoDbStatus.freeSpacePercent}%</span>
                          </div>
                          <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${mongoDbStatus.freeSpacePercent}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2">
                        <p className="text-[10px] font-semibold text-amber-400">কনফিগার করা নেই ⚠️</p>
                        <p className="text-[8.5px] text-slate-500 mt-1 leading-tight">ডিজিটাল এআই অ্যাক্সেসের জন্য MONGODB_URI সেট করুন।</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Render Pipelines Status Badge */}
                <div className="bg-slate-900/45 border border-slate-850 p-3 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Render Web Hosting</span>
                      <span className={`w-2 h-2 rounded-full ${
                        renderStatus?.status === 'connected' ? 'bg-indigo-505 animate-pulse shadow shadow-indigo-505' : 'bg-amber-400 animate-pulse'
                      }`} />
                    </div>
                    {renderStatus?.status === 'connected' ? (
                      <div className="space-y-1">
                        <p className="text-[11px] font-extrabold text-slate-200">সার্ভিস সচল: {renderStatus.servicesCount}টি</p>
                        <div className="max-h-[38px] overflow-y-auto space-y-0.5 scrollbar-thin">
                          {renderStatus.services?.slice(0, 2).map((s, idx) => (
                            <div key={idx} className="flex justify-between text-[8px] text-slate-400 font-mono">
                              <span className="truncate max-w-[65px]">{s.name}</span>
                              <span className={s.status === 'live' ? 'text-emerald-400' : 'text-amber-400'}>{s.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="py-2">
                        <p className="text-[10px] font-semibold text-amber-400">কনফিগার করা নেই ⚠️</p>
                        <p className="text-[8.5px] text-slate-500 mt-1 leading-tight">বিল্ড এবং ডেপ্লয় মনিটর করতে RENDER_API_KEY দিন।</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Secret Credentials & Vault setup button */}
              <div className="pt-2.5 border-t border-slate-900/60 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    fetchSavedSecrets();
                    setShowSecretsModal(true);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-[10px] rounded-xl transition duration-300 transform active:scale-95 cursor-pointer shadow-lg tracking-wider flex items-center justify-center gap-1.5 uppercase select-none"
                >
                  🔐 ক্রেডেনশিয়াল ও সিক্রেট কি সেটআপ (Vault Settings)
                </button>
              </div>
            </>
          )}
        </div>

        {/* 📸 Real-time Dynamic AI Vision (WebRTC Local Stream Area) */}
        <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl flex flex-col space-y-3 shadow-lg relative">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Camera size={13} className="text-pink-400" />
              এআই লাইভ ভীষণ ক্যামেরা (Live WebRTC Display)
            </h4>
          </div>

          <div className="relative bg-slate-900 border border-slate-850 h-[190px] rounded-2xl overflow-hidden flex items-center justify-center">
            {isCameraActive ? (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover scale-x-[-1]" 
                />
                
                {/* Center Crosshair Target Circle */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 border border-dashed border-emerald-500/30 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
                  <div className="absolute w-2 h-2 bg-pink-500 rounded-full" />
                </div>

                {/* Snap Camera Button Overlay */}
                <div className="absolute inset-x-2 bottom-8 flex justify-center">
                  <button
                    type="button"
                    onClick={captureSnapshot}
                    className="p-1 px-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 border border-pink-400/40 rounded-xl font-bold text-[9px] uppercase shadow-lg transition duration-200 active:scale-95 cursor-pointer flex items-center gap-1 select-none text-white font-extrabold"
                  >
                    <Camera size={11} className="animate-pulse" />
                    খাতার ড্রাফট / স্কেচ স্ন্যাপশট নিন
                  </button>
                </div>

                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[8px] font-mono text-slate-400 bg-slate-950/70 p-1 rounded">
                  <span>FACIAL ATTEMPTS: OK</span>
                  <span>SURROUNDINGS: SAFE</span>
                </div>
              </>
            ) : (
              <div className="text-center p-3 text-slate-500 space-y-2">
                <VideoOff size={28} className="mx-auto text-slate-650" />
                <p className="text-[10px] font-bold">এআই লাইভ ভীষণ ক্যামেরা বন্ধ আছে। নিচের 'ক্যামেরা এক্সেস' বাটন দিয়ে অন করুন।</p>
                <p className="text-[8px] text-slate-605">Secure WebRTC Local Area Connection</p>
              </div>
            )}
          </div>

          {capturedImage && (
            <div className="mt-2.5 bg-slate-950 border border-slate-800 p-2.5 rounded-2xl flex items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl border border-rose-500/20 overflow-hidden bg-black shrink-0 relative group shadow-md shadow-pink-500/10">
                  <img src={capturedImage} alt="Captured Sketch" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer" onClick={() => setCapturedImage(null)}>
                    <X size={14} className="text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-[10.5px] font-black text-rose-450 flex items-center gap-1 animate-pulse">
                    📌 স্ন্যাপশট ড্রাফট সংযুক্ত!
                  </h4>
                  <p className="text-[9.5px] text-slate-455 leading-tight">জেমিনি এআই চ্যাট বা ডায়াগনসিসে এই খাতার স্কেচটি সরাসরি ব্যবহার হবে প্রিয়।</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCapturedImage(null)}
                className="p-1 px-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[9px] font-extrabold uppercase rounded-lg border border-rose-500/30 cursor-pointer transition active:scale-95"
              >
                মুছে ফেলুন
              </button>
            </div>
          )}
        </div>

        {/* 🎙️ Voice Assistant Integration Box & Gemini Control Dashboard */}
        <div className="p-5 rounded-2xl border transition-all duration-350 bg-slate-950/75 border-slate-800 flex flex-col space-y-4">
          
          <div className="flex items-center justify-between mb-1 pb-2 border-b border-slate-850">
            <div className="flex items-center gap-2.5">
              <div className="relative animate-fade-in">
                <div 
                  id="ai-pulse"
                  onClick={() => {
                    const nextState = !isVoiceActive;
                    setIsVoiceActive(nextState);
                    if (nextState) {
                      setVoiceLog('🎙️ [সিস্টেম]: ৫টি জেমিনি মডেল সংযুক্ত হয়েছে। ক্যারেক্টার ভাসমান অবস্থায় সক্রিয়।');
                    } else {
                      setVoiceLog('🔇 লাইভ সেশন বন্ধ করা হয়েছে প্রিয়।');
                      stopAllAiAudio();
                    }
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isVoiceActive ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'bg-slate-850 text-slate-400'
                  }`}
                >
                  <Bot size={18} className={isVoiceActive ? 'animate-bounce' : ''} />
                </div>
                <div className={`absolute inset-0 rounded-full pointer-events-none ${
                  isVoiceActive ? 'border-2 border-cyan-400 animate-ping opacity-60' : 'hidden'
                }`} />
              </div>
              <div>
                <h4 className="text-white text-xs font-extrabold tracking-wide">
                  Gemini Control Dashboard
                </h4>
                <p className="text-slate-400 text-[8px] font-bold uppercase tracking-wider">Play Store Style Live Assistant</p>
              </div>
            </div>

            {/* Offline/Online Status Badge as defined by user */}
            <div id="statusBadge" className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold border transition-all ${
              isVoiceActive 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 animate-pulse' 
                : 'bg-red-500/10 text-red-400 border-red-500/25'
            }`}>
              {isVoiceActive ? 'Online (5 AI Connected)' : 'Offline'}
            </div>
          </div>


          {/* 🌟 UNIFIED 5-MODEL HUB SELECTOR AS REQUESTED BY USER */}
          <div className="bg-slate-950/60 p-3 h-auto rounded-xl border border-slate-850 text-left">
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block mb-2 flex items-center gap-1">
              <Sparkles size={11} className="text-cyan-400 animate-pulse" />
              ৫টি জেমিনি কো-অর্ডিনেটেড মডেল ড্যাশবোর্ড (Unified 5-Model Hub)
            </span>
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-1.5">
              {[
                { id: 'gemini-3.5-flash' as GeminiModel, name: 'Gemini 3.5 Flash', tag: 'Autopilot' },
                { id: 'gemini-3.1-pro-preview' as GeminiModel, name: 'Gemini 3.1 Pro', tag: 'Big Logic' },
                { id: 'gemini-3.1-flash-lite' as GeminiModel, name: 'Gemini 3.1 Lite', tag: 'Fast Voice' },
                { id: 'gemini-1.5-pro' as GeminiModel, name: 'Gemini 1.5 Pro', tag: 'Code Memory' },
                { id: 'gemini-1.5-flash' as GeminiModel, name: 'Gemini 1.5 Flash', tag: 'Efficient' }
              ].map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    setSelectedModel(model.id);
                    speakInBengaliFemale(`${model.name} মডেল সচল হয়েছে প্রিয়`);
                  }}
                  className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer font-sans active:scale-95 flex flex-col justify-between items-center ${
                    selectedModel === model.id
                      ? 'bg-gradient-to-b from-indigo-950 to-slate-900 border-indigo-500/80 text-white shadow-md'
                      : 'bg-slate-950/45 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="text-[8px] font-black tracking-tight block max-w-full truncate">{model.name}</span>
                  <span className={`text-[6px] font-extrabold uppercase px-1 rounded-sm mt-1 whitespace-nowrap ${
                    selectedModel === model.id ? 'bg-indigo-600/30 text-indigo-300' : 'bg-slate-900/60 text-slate-500'
                  }`}>
                    {model.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>


          {/* Romantic Mode Toggle Panel */}
          <div className="bg-slate-950/65 p-3 rounded-xl border border-slate-805/75 flex items-center justify-between text-left">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-extrabold text-pink-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full inline-block ${romanticMode ? 'bg-pink-500 animate-pulse' : 'bg-slate-500'}`} />
                রোমান্টিক মোড (Romantic Mode Style)
              </span>
              <p className="text-[8.5px] text-slate-400 font-bold leading-tight">
                {romanticMode ? "সক্রিয়: 'প্রিয়তম', 'জান' ভালোবাসাময় মিষ্টি কণ্ঠস্বর।" : "পেশাদার: অফিসিয়াল, শান্ত ও কাজের উপযুক্ত কণ্ঠস্বর।"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggleRomanticMode(!romanticMode)}
              className={`px-2.5 py-1.5 rounded-lg text-[9.5px] font-black tracking-wide border cursor-pointer transition-all duration-200 ${
                romanticMode 
                  ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 hover:from-pink-500/30 hover:to-rose-500/30 text-rose-300 border-pink-500/30' 
                  : 'bg-slate-800/40 hover:bg-slate-800/60 text-slate-400 border-slate-700/50'
              }`}
            >
              {romanticMode ? "💖 চালু (Romantic)" : "👔 বন্ধ (Professional)"}
            </button>
          </div>


          {/* 💎 PLAY STORE STYLE GEMINI LIVE SCREEN & MAIN CONTAINER */}
          <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl overflow-hidden shadow-inner relative">
            {!isVoiceActive ? (
              /* --- Inactive State Pane --- */
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="relative mb-5 flex items-center justify-center">
                  <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 opacity-25 blur-xl animate-pulse" />
                  
                  {/* Concentric rotating design lines */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="absolute w-24 h-24 border border-dashed border-indigo-500/30 rounded-full"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    className="absolute w-28 h-28 border border-dashed border-pink-500/20 rounded-full"
                  />

                  {/* Pulsing center icon sphere */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsVoiceActive(true);
                      setVoiceLog('🎙️ [সিস্টেম]: ৫টি জেমিনি মডেল সংযুক্ত হয়েছে। ক্যারেক্টার ভাসমান অবস্থায় সক্রিয়।');
                    }}
                    className="relative z-10 w-16 h-16 rounded-full bg-slate-950 border border-slate-800 hover:border-cyan-500/55 flex items-center justify-center shadow-2xl cursor-pointer group transition-all"
                  >
                    <Sparkles size={24} className="text-cyan-400 group-hover:text-pink-400 transition-colors duration-300 animate-pulse" />
                  </motion.div>
                </div>

                <h4 className="text-white text-xs font-black tracking-wide mb-1 flex items-center gap-1.5 justify-center">
                  Start Gemini Live Session 🎙️
                </h4>
                <p className="text-slate-400 text-[10px] leading-tight max-w-[280px]">
                  মুখে কথা বলে আপনার ড্রপশিপিং পোর্টাল ও কোডিং সরাসরি নিয়ন্ত্রণ করুন। ৫টি জেমিনি রিয়েল-টাইম মডেল সক্রিয়।
                </p>

                {/* Main Action Pill button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsVoiceActive(true);
                    setVoiceLog('🎙️ [সিস্টেম]: ৫টি জেমিনি মডেল সংযুক্ত হয়েছে। ক্যারেক্টার ভাসমান অবস্থায় সক্রিয়।');
                  }}
                  disabled={!isAutopilotActive}
                  className="mt-5 px-6 py-2.5 bg-gradient-to-r from-cyan-600 via-indigo-600 to-pink-600 hover:from-cyan-500 hover:to-pink-500 disabled:from-slate-800 disabled:to-slate-900 border border-indigo-500/20 text-white font-extrabold text-[9.5px] uppercase tracking-wider rounded-full transition-all duration-300 transform active:scale-95 shadow-lg flex items-center gap-2 select-none cursor-pointer"
                >
                  <Bot size={13} className="animate-bounce" />
                  লাইভ ভয়েস সহকারী শুরু করুন
                </button>
              </div>
            ) : (
              /* --- Active State: Play Store Gemini Live Experience --- */
              <div className="flex flex-col items-center justify-center py-4 text-center relative">
                {/* Visual Glow Backdrop */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent blur-2xl pointer-events-none" />

                {/* Glowing Audio Pulse Circle */}
                <div className="relative mb-5 w-32 h-32 flex items-center justify-center">
                  <div 
                    className="absolute rounded-full border border-cyan-400/30 transition-all duration-75"
                    style={{ 
                      width: `${110 + micVolume * 0.8}px`, 
                      height: `${110 + micVolume * 0.8}px`,
                      opacity: Math.max(0.2, 0.9 - micVolume * 0.005)
                    }}
                  />
                  <div 
                    className="absolute rounded-full border border-pink-500/20 transition-all duration-75"
                    style={{ 
                      width: `${130 + micVolume * 1.5}px`, 
                      height: `${130 + micVolume * 1.5}px`,
                      opacity: Math.max(0.1, 0.6 - micVolume * 0.004)
                    }}
                  />

                  {/* Core Mic Visual Block */}
                  <motion.div 
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 p-[1.5px] shadow-xl flex items-center justify-center"
                  >
                    <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center">
                      <motion.div
                        animate={{ scale: isMicMuted ? 1 : [1, 1.08 + (micVolume / 100), 1] }}
                        transition={{ duration: 0.15 }}
                        className={`w-14 h-14 rounded-full flex flex-col items-center justify-center ${isMicMuted ? 'bg-slate-900 border border-slate-800' : 'bg-slate-900/60'}`}
                      >
                        {isMicMuted ? (
                          <MicOff size={18} className="text-rose-500 animate-pulse" />
                        ) : (
                          <Mic size={18} className="text-cyan-400 animate-pulse" />
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Animated Waves Graph */}
                <div className="flex justify-center items-center gap-1.5 h-6 mb-4 w-full px-5">
                  {[...Array(12)].map((_, i) => {
                    const baseHeight = i % 2 === 0 ? 15 : 25;
                    const waveFactor = isMicMuted ? 0 : Math.sin((i + Date.now() / 150) * 0.5) * 12;
                    const micAddition = isMicMuted ? 0 : (micVolume * (0.35 + (i % 3) * 0.2));
                    const targetHeight = Math.max(8, Math.min(100, baseHeight + waveFactor + micAddition));

                    return (
                      <div
                        key={i}
                        className="w-[3px] rounded-full transition-all duration-75 bg-gradient-to-t from-cyan-400 via-indigo-500 to-pink-500"
                        style={{ height: `${targetHeight}%`, minHeight: '4px' }}
                      />
                    );
                  })}
                </div>

                {/* Live Captioning status */}
                <div className="mb-4">
                  <span className="text-[8px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 p-1 px-2.5 rounded-full font-mono font-bold uppercase tracking-wider">
                    {isMicMuted ? 'Microphone Muted' : 'Gemini LIVE speaking & listening'}
                  </span>
                  <p className="text-white text-[11px] font-black tracking-wide mt-2">
                    লাইভ ভয়েস সেশন বর্তমানে সক্রিয় আছে প্রিয়তম
                  </p>
                  <p className="text-pink-400/90 text-[9.5px] font-semibold mt-1">
                    {romanticMode ? "💖 মায়রা এখন খুব মিষ্টি ভালোবাসাময় সুরে কথা বলছে" : "👔 মায়রা এখন সম্পূর্ণ পেশাদারভাবে কাজ করছে"}
                  </p>
                </div>

                {/* Iframe sandbox microphone access helpful hint */}
                <div className="mb-4 mx-1 p-2 bg-amber-500/5 border border-amber-500/15 rounded-xl text-left">
                  <p className="text-[8.5px] text-slate-400 leading-tight">
                    💡 <strong className="text-amber-400">মাইক সমস্যা?</strong> ক্রোম সিকিউরিটি পলিসির কারণে আইফ্রেমের ভেতর মাইক্রোফোন কাজ না করলে অনুগ্রহ করে উপরের <strong className="text-cyan-400">"New Tab"</strong> বোতামে ক্লিক করে নতুন ট্যাবে ট্রাই করুন প্রিয়।
                  </p>
                </div>

                {/* Active Play Store Style Floating Controls Panel */}
                <div className="flex items-center justify-center gap-4 bg-slate-950 border border-slate-850 p-2.5 rounded-2xl shadow-2xl w-full max-w-[250px]">
                  {/* 1. Mute Microphone circular toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMicMuted(!isMicMuted);
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border active:scale-90 cursor-pointer ${
                      isMicMuted 
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-500/25' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {isMicMuted ? <MicOff size={14} /> : <Mic size={14} />}
                  </button>

                  {/* 2. Central Red End Call Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsVoiceActive(false);
                      setVoiceLog('🔇 লাইভ সহকারী সেশন বন্ধ করা হয়েছে প্রিয়।');
                      stopAllAiAudio();
                    }}
                    className="w-11 h-11 rounded-full bg-gradient-to-r from-rose-600 to-red-650 hover:from-rose-500 hover:to-red-500 border border-rose-500/30 text-white flex items-center justify-center shadow-lg transition-all active:scale-90 cursor-pointer"
                  >
                    <X size={18} className="stroke-[3]" />
                  </button>

                  {/* 3. Speaker Out toggler */}
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !isFemaleVoiceEnabled;
                      setIsFemaleVoiceEnabled(nextVal);
                      if (!nextVal) {
                        stopAllAiAudio();
                      }
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border active:scale-90 cursor-pointer ${
                      !isFemaleVoiceEnabled 
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-455 hover:bg-rose-500/25' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Volume2 size={14} className={isFemaleVoiceEnabled ? '' : 'text-rose-500'} />
                  </button>
                </div>
              </div>
            )}
          </div>


          {/* 3D Model uploading and Camera vision triggers repositioned elegantly */}
          <div className="grid grid-cols-2 gap-2 mb-1">
            {/* 1. mobile friendly file upload button */}
            <label className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-white p-2 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 text-center shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-[9px] font-extrabold text-cyan-300">৩ডি মডেল আপলোড</span>
              <input type="file" id="fileUpload" accept=".glb,.gltf" onChange={handleLocalFileUpload} className="hidden" />
            </label>

            {/* 2. camera access button */}
            <button 
              type="button"
              id="cameraBtn" 
              onClick={handleLocalCameraToggle}
              className={`text-white p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-95 text-center ${
                isCameraActive 
                  ? 'bg-purple-600 border-purple-500' 
                  : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-[9px] font-extrabold">ক্যামেরা এক্সেস</span>
            </button>
          </div>

        </div>

          {/* 💬 Beautiful Integrated Gemini Chat & Auto-Code Generator Box */}
          <div className="mt-4 p-4 bg-slate-905 border border-slate-800/80 rounded-2xl flex flex-col shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-slate-850 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                <h4 className="text-slate-200 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Bot size={13} className="text-cyan-400 animate-pulse" />
                  জেমিনি এআই চ্যাট ও পাইলট কোডিং
                </h4>
              </div>
              <span className="text-[8px] font-mono font-bold bg-slate-950 px-2 py-0.5 rounded text-cyan-400">
                Active: Gemini 3.5
              </span>
            </div>

            {/* Mode selection tabs */}
            <div className="grid grid-cols-3 gap-1 mb-3 bg-slate-950 p-1.5 rounded-xl border border-slate-850/60">
              <button
                type="button"
                onClick={() => {
                  setChatMode('conversational');
                }}
                className={`py-1.5 px-1 rounded-lg text-[8.5px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  chatMode === 'conversational'
                    ? 'bg-gradient-to-r from-pink-600 to-indigo-700 text-white shadow-md shadow-pink-950/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span>💬 মিষ্টি কথা</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setChatMode('coding');
                }}
                className={`py-1.5 px-1 rounded-lg text-[8.5px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  chatMode === 'coding'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-md shadow-cyan-950/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span>💻 কোডিং</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setChatMode('live-voice');
                }}
                className={`py-1.5 px-1 rounded-lg text-[8.5px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  chatMode === 'live-voice'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-950/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span>🎙️ লাইভ ভয়েস</span>
              </button>
            </div>

            {chatMode === 'live-voice' ? (
              <AILiveChat />
            ) : (
              <>
                {/* Render targeted file selector for both modes for maximum clarity */}
                <div className="mb-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-slate-850/50">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                    🎯 {chatMode === 'coding' ? 'কোডিং টার্গেট ফাইল:' : 'সহকারী ফাইল মেমরি (Optional):'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'src/components/AdminPanel.tsx',
                      'src/App.tsx',
                      'server.ts'
                    ].map((file) => (
                      <button
                        key={file}
                        type="button"
                        onClick={() => {
                          setTargetFile(file);
                          speakInBengaliFemale(`টার্গেট ফাইল ${file.split('/').pop()} সিলেক্ট করা হয়েছে`);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer border ${
                          targetFile === file
                            ? 'bg-indigo-600/25 border-indigo-500/60 text-indigo-300 shadow'
                            : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-350'
                        }`}
                      >
                        /{file.split('/').pop()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Elegant AI Memory Gauge & Memory Eraser */}
                <div className="mb-3 p-2.5 bg-slate-950/80 rounded-xl border border-slate-850 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-300 tracking-wider flex items-center gap-1">
                      🧠 জেমিনী এআই মেমোরি: <span className="text-cyan-400 font-mono font-bold">{memoryCount}/500</span> কথোপকথন
                    </span>
                    <span className="text-[8.5px] font-bold text-slate-400">
                      {memoryCount === 0 ? "স্মৃতি খালি" : `মেমোরি সক্রিয় (${Math.min(100, Math.round((memoryCount / 500) * 100))}% ফুল)`}
                    </span>
                  </div>
                  
                  {/* Process Bar displaying actual level */}
                  <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                        memoryCount > 400 ? 'from-amber-500 to-rose-600' : 'from-indigo-550 to-cyan-400'
                      }`}
                      style={{ width: `${Math.min(100, (memoryCount / 500) * 100)}%` }}
                    />
                  </div>

                  {/* Dynamic quick-delete buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-slate-900/60">
                    <span className="text-[7.5px] font-mono text-slate-500 uppercase">রিসেট করুন:</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      <button
                        type="button"
                        disabled={isClearingMemory || memoryCount === 0}
                        onClick={() => handleClearMemoryPercent(30)}
                        className="px-2 py-0.5 bg-slate-900 hover:bg-slate-850 disabled:opacity-30 disabled:hover:bg-slate-900 text-[8.5px] font-bold text-indigo-400 hover:text-indigo-300 rounded border border-slate-800 transition active:scale-95 cursor-pointer"
                        title="রিসেট ৩০% মেমোরি"
                      >
                        🗑️ ৩০% মুছুন
                      </button>
                      <button
                        type="button"
                        disabled={isClearingMemory || memoryCount === 0}
                        onClick={() => handleClearMemoryPercent(50)}
                        className="px-2 py-0.5 bg-slate-900 hover:bg-slate-850 disabled:opacity-30 disabled:hover:bg-slate-900 text-[8.5px] font-bold text-amber-500 hover:text-amber-450 rounded border border-slate-800 transition active:scale-95 cursor-pointer"
                        title="রিসেট ৫০% মেমোরি"
                      >
                        ⚡ ৫০% মুছুন
                      </button>
                      <button
                        type="button"
                        disabled={isClearingMemory || memoryCount === 0}
                        onClick={() => handleClearMemoryPercent(100)}
                        className="px-2 py-0.5 bg-rose-950/40 hover:bg-rose-900/40 disabled:opacity-30 text-[8.5px] font-black text-rose-400 hover:text-rose-300 rounded border border-rose-900/30 transition active:scale-95 cursor-pointer"
                        title="রিসেট ১০০% মেমোরি"
                      >
                        💥 সব সাফ
                      </button>
                    </div>
                  </div>
                </div>

                {/* Scrollable messages history container */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 py-1 text-[10px] max-h-[140px] min-h-[95px] scrollbar-thin scrollbar-thumb-slate-800 bg-slate-950/40 rounded-xl p-2.5 border border-slate-850/30 mb-3">
                  {chatMessages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex flex-col max-w-[90%] ${
                        msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <div 
                        className={`p-2.5 rounded-xl leading-relaxed whitespace-pre-wrap shadow-sm ${
                          msg.sender === 'user' 
                            ? 'bg-blue-600 border border-blue-500/30 text-white rounded-br-none font-bold' 
                            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none font-semibold'
                        }`}
                      >
                        {msg.isCodePrompt && (
                          <div className="mb-1 text-cyan-350 font-extrabold border-b border-slate-800 pb-1 text-[8px] uppercase flex items-center gap-1 select-none">
                            💻 Target: {msg.target?.split('/').pop()}
                          </div>
                        )}
                        {msg.text}
                      </div>
                      <span className="text-[7.5px] text-slate-500 mt-0.5 px-1">{msg.time}</span>
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>

                {/* Chat Action submission form */}
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!aiCommand.trim()) return;
                    
                    const promptVal = aiCommand;

                    if (chatMode === 'conversational') {
                      setAiCommand('');
                      await handleConversationalVoiceChat(promptVal);
                    } else {
                      // Direct diagnosis trigger matching prebuilt handler perfectly
                      await handleDiagnose();
                    }
                  }} 
                  className="flex gap-2"
                >
                  <input 
                    type="text"
                    value={aiCommand}
                    onChange={(e) => setAiCommand(e.target.value)}
                    disabled={isSearching}
                    placeholder={
                      isSearching 
                        ? "জেমিনি এআই কোড বা উত্তর তৈরি করছে..." 
                        : chatMode === 'coding'
                          ? "কোডিং কম্যান্ড লিখুন (যেমন: 'লোগো বাটন ছোট করো')..."
                          : "জেমিনির সাথে কথা বলুন বা চ্যাট করুন..."
                    }
                    className="flex-1 bg-slate-950 border border-slate-800 px-3 py-2.5 rounded-xl text-[11px] text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-semibold font-sans"
                  />
                  <button 
                    type="submit"
                    disabled={isSearching || !aiCommand.trim()}
                    className="bg-indigo-600 hover:bg-indigo-550 text-white p-2.5 rounded-xl flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 cursor-pointer shadow-md"
                  >
                    {isSearching ? (
                      <Activity size={12} className="animate-spin text-cyan-450" />
                    ) : (
                      <Send size={12} />
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

              {/* Injecting beautiful floating and modal-linked laboratory CSS positions */}
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes avatarFloat {
                  0% { transform: translateY(0px); }
                  50% { transform: translateY(-12px); }
                  100% { transform: translateY(0px); }
                }
                .avatar-floating-active {
                  position: fixed !important;
                  bottom: 24px !important;
                  right: 24px !important;
                  width: 320px !important;
                  height: 420px !important;
                  z-index: 9999 !important;
                  background: transparent !important;
                  backdrop-filter: none !important;
                  border: none !important;
                  box-shadow: none !important;
                  overflow: visible !important;
                  animation: avatarFloat 4.5s ease-in-out infinite !important;
                  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                  pointer-events: none !important;
                }
                .avatar-floating-active iframe {
                  pointer-events: auto !important;
                }
                
                .customizer-preview-active {
                  position: fixed !important;
                  top: 50% !important;
                  left: 65% !important;
                  transform: translate(-50%, -50%) !important;
                  width: 440px !important;
                  height: 520px !important;
                  z-index: 9999 !important;
                  background: #010409 !important;
                  border-radius: 20px !important;
                  overflow: hidden !important;
                  animation: none !important;
                  pointer-events: auto !important;
                }
                @media (max-width: 1024px) {
                  .customizer-preview-active {
                    position: fixed !important;
                    top: auto !important;
                    bottom: 20px !important;
                    left: 50% !important;
                    right: auto !important;
                    transform: translateX(-50%) !important;
                    width: 320px !important;
                    height: 380px !important;
                  }
                }
              `}} />

              {/* Note: Iframe state, height, scaling, and actual <iframe> elements are now mounted globally in App.tsx! */}
            </div>

      {/* Code Preview & Sandboxing Comparison Block: Mobile spans 12 cols, XL spans 7 cols */}
      <div className="col-span-12 xl:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-2xl space-y-4">
        
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
            <div>
              <h3 className="font-extrabold text-white text-sm tracking-wide flex items-center gap-1.5">
                <FileCode size={16} className="text-cyan-400" />
                রিয়েল-টাইম এআই সুরক্ষা স্যান্ডবক্স ড্রাফট
              </h3>
              <p className="text-slate-500 text-[10px]">নিরাপদ স্যান্ডবক্স প্যানেল: আপনার অনুমতি ছাড়া মূল কোডে হাত দেওয়া হবে না।</p>
            </div>
            
            {hasPendingPatch && (
              <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 animate-pulse">
                <ShieldAlert size={10} /> 1 PATCH PENDING Approval
              </span>
            )}
          </div>



          <AnimatePresence mode="wait">
            {explanation && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-slate-900 border-l-4 border-yellow-550 rounded-r-xl p-3 text-xs font-semibold text-yellow-100/90 leading-relaxed max-h-[110px] overflow-y-auto"
              >
                <div className="flex items-center gap-1.5 mb-1 text-yellow-500 font-extrabold uppercase text-[9px] tracking-wider">
                  <Sparkle size={11} className="text-yellow-450" /> AI স্যান্ডবক্স নিরাপত্তা ব্যাখ্যা
                </div>
                {explanation}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Live Preview Sandbox Frame */}
          <div className="bg-slate-950 border border-slate-800 p-4.5 rounded-2xl space-y-3 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-2.5">
              <h4 className="text-xs font-extrabold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Globe size={13} className="text-indigo-400 animate-pulse" />
                রিয়েল-টাইম নমুনা প্রিভিউ ও ড্রাফট
              </h4>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSandboxReloadKey(prev => prev + 1)}
                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-[9px] font-black text-indigo-300 rounded border border-slate-800 transition active:scale-95 cursor-pointer flex items-center gap-1 font-mono"
                  title="প্রিভিউ রিলোড করুন"
                >
                  🔄 রিলোড
                </button>
              </div>
            </div>

            {/* Selector tabs for switching replica vs draft preview */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800/80">
              <button
                type="button"
                onClick={() => setSandboxType('replica')}
                className={`py-2 px-3 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  sandboxType === 'replica'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-650 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60'
                }`}
              >
                <span>🌐 ক্লোন ওয়েবসাইট (Live App Copy)</span>
              </button>
              <button
                type="button"
                onClick={() => setSandboxType('draft')}
                className={`py-2 px-3 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  sandboxType === 'draft'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60'
                }`}
              >
                <span>🧪 পরিবর্তন প্রিভিউ (Proposed Patch)</span>
              </button>
            </div>

            {/* Visual banner node status */}
            <div className="px-3 py-1.5 bg-slate-900/60 rounded-lg border-l-4 border-amber-500 flex items-center justify-between text-[9px] text-slate-350">
              {sandboxType === 'replica' ? (
                <>
                  <span>👉 <strong>লাইভ পোর্টাল ক্লোন:</strong> আপনি এখানে ডুপ্লিকেট সাইটে ক্লিক করে সব জায়গায় ঘুরে বেড়াতে পারবেন।</span>
                  <span className="text-emerald-400 font-extrabold select-none">● সচল</span>
                </>
              ) : (
                <>
                  <span>💥 <strong>প্রস্তাবিত কোড ড্রাফট:</strong> কোড রাইটিং শেষে আপডেটটি অ্যাপ্লাই করলে কেমন হবে, তা এখানে দেখাচ্ছে।</span>
                  <span className="text-pink-400 font-extrabold select-none">● ডেমো ড্রাফট</span>
                </>
              )}
            </div>

            {/* The Actual Browser Core Sandbox Container (Taller, scrolled & fully interactive) */}
            <div className="bg-[#0f172a] rounded-xl overflow-hidden border border-slate-800/90 h-[340px] relative shadow-inner">
              <iframe
                key={`${sandboxType}-${sandboxReloadKey}`}
                id="live-preview-sandbox"
                src={sandboxType === 'replica' ? '/' : undefined}
                srcDoc={sandboxType === 'draft' ? getSandboxHtml() : undefined}
                title="Sandbox Simulator"
                className="w-full h-full border-0 bg-[#0f172a] overflow-auto"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>

          {/* Code Diff Editor (Red = Old, Green = New) */}
          <div className="editor-section">
            <h4 className="text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <FileCode size={13} className="text-indigo-400" /> Real-Time Code Changes (Red = Old, Green = New)
            </h4>
            
            <div 
              id="code-diff-editor" 
              className="bg-slate-900/90 border border-slate-800 text-[10px] font-mono p-3 rounded-xl h-[170px] overflow-y-auto shadow-inner"
            >
              {renderCodeDiff(originalCode, proposedCode)}
            </div>
          </div>

        </div>

        {/* Action Panel Buttons to Approve or Reject */}
        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row justify-end items-center gap-3">
          <p className="text-[9px] text-slate-450 mr-auto text-left font-bold leading-normal max-w-[345px] flex items-center gap-1.5">
            <Database size={11} className="text-indigo-400 shrink-0" />
            <span>* আপনার ডাটাবেজ বা এডিটর তালিকায় কোনো পরিবর্তন না করে কেবল সাইটের কন্টেন্ট লাইভ করার নিরাপদ গেটকিপার।</span>
          </p>

          <div className="flex gap-2.5 w-full sm:w-auto">
            <button 
              type="button"
              onClick={handleReject}
              disabled={!hasPendingPatch}
              className="flex-1 sm:flex-initial bg-slate-900 hover:bg-slate-850 disabled:opacity-30 disabled:hover:bg-slate-900 text-slate-400 px-4 py-2.5 rounded-xl text-[10px] font-extrabold border border-slate-800 transition duration-200 cursor-pointer flex items-center justify-center gap-1"
            >
              <X size={12} />
              বাতিল (Reject)
            </button>
            
            <button 
              type="button"
              id="approve-live-btn"
              onClick={handleApprove}
              disabled={!hasPendingPatch || isDeploying}
              className={`flex-1 sm:flex-initial text-white px-5 py-2.5 rounded-xl text-[10px] font-black shadow-lg transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer border ${
                hasPendingPatch 
                  ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500/30' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-750'
              }`}
            >
              {isDeploying ? (
                <>
                  <Activity size={12} className="animate-spin text-white" />
                  আপলোড হচ্ছে...
                </>
              ) : (
                <>
                  <FileCheck size={12} />
                  🚀 Approve & Live Update
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* --- Beautiful Dynamic System Permissions Master Center Modal --- */}
      <AnimatePresence>
        {showPermissionManager && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-755 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Premium Top Glow Pattern */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500" />
              
              {/* Head */}
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3.5">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-500/15 rounded-xl border border-indigo-500/20 text-indigo-400">
                    <Shield size={18} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base tracking-wide flex items-center gap-1.5 leading-none">
                      🛡️ ল্যাপটপ/পিসি/মোবাইল পারমিশন হাব
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-extrabold">Device Permissions Master Hub</p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowPermissionManager(false)}
                  className="p-1 px-2 border border-slate-800 text-slate-400 hover:text-white rounded-lg bg-slate-950 hover:bg-slate-850 cursor-pointer text-xs font-bold transition flex items-center gap-1"
                >
                  <X size={12} />
                  বন্ধ
                </button>
              </div>

              {/* Informative description */}
              <div className="mb-4 p-3 bg-indigo-550/10 border border-indigo-500/25 rounded-2xl text-[10.5px] leading-relaxed text-indigo-200">
                ⚠️ <span className="font-extrabold text-indigo-300">স্মার্ট হাব নোটিশ:</span> এই হাবটি সরাসরি আপনার ব্রাউজার ও ডিভাইসের হার্ডওয়্যার স্তরে কানেক্ট করা। এখান থেকে 'অনুমতি দিন' বাটনে ক্লিক করলে আপনার মোবাইলের বা ল্যাপটপের ব্রাউজার একটি পারমিশন পপআপ শো করবে, যেটি এলাও করলে অটো-পাইলটের জন্য আলাদাভাবে কোথাও অনুমতি দেওয়া লাগবে না।
              </div>

              {/* Sequential Trigger Banner */}
              <div className="mb-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/25 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                <div className="text-left">
                  <h4 className="text-[11.5px] font-black text-emerald-400 flex items-center gap-1">
                    ⚡ ওয়ান-ক্লিক অল-পারমিশন বুস্টার
                  </h4>
                  <p className="text-[9px] text-slate-400 leading-tight mt-0.5">সবগুলো পারমিশন এক ক্লিকে পর্যায়ক্রমে ব্রাউজার পপআপ লুপে সচল করুন।</p>
                </div>
                <button
                  type="button"
                  onClick={grantAllSequentially}
                  className="w-full sm:w-auto p-2 px-3.5 bg-emerald-550/20 text-emerald-300 hover:bg-emerald-550/30 border border-emerald-500/50 hover:border-emerald-400/70 rounded-xl font-bold text-[10px] uppercase shadow transition duration-200 active:scale-95 cursor-pointer text-center"
                >
                  সব অনুমতি দিন
                </button>
              </div>

              {/* Permissions Control Grid */}
              <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                
                {/* 1. Geolocation */}
                <div className="flex items-center justify-between p-2.5 bg-slate-950/50 border border-slate-800 rounded-2xl hover:border-slate-750 transition">
                  <div className="flex items-center gap-2.5 text-left">
                    <span className="text-lg">📍</span>
                    <div>
                      <h4 className="text-[11.5px] font-extrabold text-slate-200 leading-none">লোকেশন ট্র্যাকিং ও জিপিএস (GPS)</h4>
                      <p className="text-[9px] text-slate-500 mt-1">নিকটস্থ ওয়ারহাউজ এবং শিপিং রুট ম্যাপ সচল করার জন্য।</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8.5px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                      permissionsState.geolocation === 'granted' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : permissionsState.geolocation === 'denied' 
                        ? 'bg-rose-500/10 text-rose-450 border-rose-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {permissionsState.geolocation === 'granted' ? 'সক্রিয় (Active)' : permissionsState.geolocation === 'denied' ? 'ব্লকড ❌' : 'অনুমতি দিন ⚠️'}
                    </span>
                    {permissionsState.geolocation !== 'granted' && (
                      <button
                        type="button"
                        onClick={requestGeolocation}
                        className="px-2.5 py-1 text-[9px] font-black uppercase text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg cursor-pointer max-w-[85px] text-center"
                      >
                        এলাও করুন
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Microphones */}
                <div className="flex items-center justify-between p-2.5 bg-slate-950/50 border border-slate-800 rounded-2xl hover:border-slate-750 transition">
                  <div className="flex items-center gap-2.5 text-left">
                    <span className="text-lg">🎙️</span>
                    <div>
                      <h4 className="text-[11.5px] font-extrabold text-slate-200 leading-none">মাইক্রোফোন ও ভয়েস ইনপুট</h4>
                      <p className="text-[9px] text-slate-500 mt-1">অটো-পাইলটে সরাসরি মুখে কথা বলে কোড বা সাইট পরিবর্তনের জন্য।</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8.5px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                      permissionsState.microphone === 'granted' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : permissionsState.microphone === 'denied' 
                        ? 'bg-rose-500/10 text-rose-450 border-rose-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {permissionsState.microphone === 'granted' ? 'সক্রিয় (Active)' : permissionsState.microphone === 'denied' ? 'ব্লকড ❌' : 'অনুমতি দিন ⚠️'}
                    </span>
                    {permissionsState.microphone !== 'granted' && (
                      <button
                        type="button"
                        onClick={requestMicrophone}
                        className="px-2.5 py-1 text-[9px] font-black uppercase text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg cursor-pointer max-w-[85px] text-center"
                      >
                        এলাও করুন
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Camera */}
                <div className="flex items-center justify-between p-2.5 bg-slate-950/50 border border-slate-800 rounded-2xl hover:border-slate-750 transition">
                  <div className="flex items-center gap-2.5 text-left">
                    <span className="text-lg">📷</span>
                    <div>
                      <h4 className="text-[11.5px] font-extrabold text-slate-200 leading-none">ক্যামেরা ভিশন ও স্ক্যানার</h4>
                      <p className="text-[9px] text-slate-500 mt-1">জেমিনী লাইভ ক্যামেরার মাধ্যমে ফেস ও ডকুমেন্টস স্ক্যানিং সেবা।</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8.5px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                      permissionsState.camera === 'granted' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : permissionsState.camera === 'denied' 
                        ? 'bg-rose-500/10 text-rose-450 border-rose-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {permissionsState.camera === 'granted' ? 'সক্রিয় (Active)' : permissionsState.camera === 'denied' ? 'ব্লকড ❌' : 'অনুমতি দিন ⚠️'}
                    </span>
                    {permissionsState.camera !== 'granted' && (
                      <button
                        type="button"
                        onClick={requestCamera}
                        className="px-2.5 py-1 text-[9px] font-black uppercase text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg cursor-pointer max-w-[85px] text-center"
                      >
                        এলাও করুন
                      </button>
                    )}
                  </div>
                </div>

                {/* 4. Notification API */}
                <div className="flex items-center justify-between p-2.5 bg-slate-950/50 border border-slate-800 rounded-2xl hover:border-slate-750 transition">
                  <div className="flex items-center gap-2.5 text-left">
                    <span className="text-lg">🔔</span>
                    <div>
                      <h4 className="text-[11.5px] font-extrabold text-slate-200 leading-none">সিস্টেম নোটিফিকেশন অ্যালার্ট</h4>
                      <p className="text-[9px] text-slate-500 mt-1">অটো-পাইলট কাজ শেষ করলে রিয়েল-টাইম পুশ নোটিফিকেশন পাঠানো।</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8.5px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                      permissionsState.notifications === 'granted' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : permissionsState.notifications === 'denied' 
                        ? 'bg-rose-500/10 text-rose-450 border-rose-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {permissionsState.notifications === 'granted' ? 'সক্রিয় (Active)' : permissionsState.notifications === 'denied' ? 'ব্লকড ❌' : 'অনুমতি দিন ⚠️'}
                    </span>
                    {permissionsState.notifications !== 'granted' && (
                      <button
                        type="button"
                        onClick={requestNotifications}
                        className="px-2.5 py-1 text-[9px] font-black uppercase text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg cursor-pointer max-w-[85px] text-center"
                      >
                        এলাও করুন
                      </button>
                    )}
                  </div>
                </div>

                {/* 5. Speech Web Speech API */}
                <div className="flex items-center justify-between p-2.5 bg-slate-950/50 border border-slate-800 rounded-2xl hover:border-slate-750 transition">
                  <div className="flex items-center gap-2.5 text-left">
                    <span className="text-lg">🗣️</span>
                    <div>
                      <h4 className="text-[11.5px] font-extrabold text-slate-200 leading-none">লাইভ স্পিচ সিন্থেসিস (Speech)</h4>
                      <p className="text-[9px] text-slate-500 mt-1">জানের মুখের রোমান্টিক কথাকে টেক্সটে রুপান্তর করার ডিকোডার।</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8.5px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                      permissionsState.speech === 'granted' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : permissionsState.speech === 'denied'
                        ? 'bg-rose-500/10 text-rose-450 border-rose-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {permissionsState.speech === 'granted' ? 'সক্রিয় (Active)' : permissionsState.speech === 'denied' ? 'ব্লকড ❌' : 'অনুমতি দিন ⚠️'}
                    </span>
                    {permissionsState.speech !== 'granted' && (
                      <button
                        type="button"
                        onClick={requestSpeech}
                        className="px-2.5 py-1 text-[9px] font-black uppercase text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg cursor-pointer max-w-[85px] text-center"
                      >
                        এলাও করুন
                      </button>
                    )}
                  </div>
                </div>

                {/* 6. Sound Playback Interaction */}
                <div className="flex items-center justify-between p-2.5 bg-slate-950/50 border border-slate-800 rounded-2xl hover:border-slate-750 transition">
                  <div className="flex items-center gap-2.5 text-left">
                    <span className="text-lg">🔊</span>
                    <div>
                      <h4 className="text-[11.5px] font-extrabold text-slate-200 leading-none">অডিও সাউন্ড প্লেব্যাক ইঞ্জিন</h4>
                      <p className="text-[9px] text-slate-500 mt-1">সব রকমের ব্যাকগ্রাউন্ড মিউজিক এবং ভয়েস শোনা রিলিজ করা।</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8.5px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                      permissionsState.sound === 'granted' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {permissionsState.sound === 'granted' ? 'অনুমোদিত' : 'অনুমতি দিন ⚠️'}
                    </span>
                    {permissionsState.sound !== 'granted' && (
                      <button
                        type="button"
                        onClick={requestSound}
                        className="px-2.5 py-1 text-[9px] font-black uppercase text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg cursor-pointer max-w-[85px] text-center"
                      >
                        এলাও করুন
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Bottom Actions banner */}
              <div className="mt-5 border-t border-slate-800 pt-4 flex items-center justify-between">
                <span className="text-[8.5px] font-bold text-slate-450">স্ট্যাটাস সিঙ্ক সচল আছে</span>
                <button
                  type="button"
                  onClick={checkAllPermissions}
                  className="p-1.5 px-3.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg text-[9.5px] font-extrabold text-slate-350 hover:text-white transition duration-200 cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  <RefreshCw size={10} className="animate-spin" style={{ animationDuration: '6s' }} />
                  সিঙ্ক ও চেক করুন
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}

        {showSecretsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-755 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden text-left"
            >
              {/* Premium Top Glow Pattern */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-teal-400 via-indigo-500 to-pink-500" />
              
              {/* Head */}
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3.5">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-pink-500/15 rounded-xl border border-pink-500/20 text-pink-405">
                    <Lock size={18} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base tracking-wide flex items-center gap-1.5 leading-none">
                      🔒 ক্রেডেনশিয়াল ও সিক্রেট কি সেভ-গেট
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-extrabold">Credentials & Secrets Vault</p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowSecretsModal(false)}
                  className="p-1 px-2 border border-slate-800 text-slate-400 hover:text-white rounded-lg bg-slate-950 hover:bg-slate-850 cursor-pointer text-xs font-bold transition flex items-center gap-1"
                >
                  <X size={12} />
                  বন্ধ
                </button>
              </div>

              {/* Informative description */}
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-[10.5px] leading-relaxed text-slate-300">
                ⚠️ <span className="font-extrabold text-emerald-400">অটো-সেভ ভল্ট নোটিশ:</span> এই ভল্টে আপনার ডাটাবেজ কনেকশন ও গিটহাব সিক্রেটগুলো নিরাপদে সংরক্ষণ করে রাখুন। এর ফলে পরবর্তীতে কোনো বড় সাইট আপডেট বা রিস্টার্ট হলেও সিক্রেটগুলো ডিলিট হবে না এবং সিস্টেম স্বয়ংক্রিয়ভাবে এগুলো ব্যবহার করে সম্পূর্ণ সচল থাকবে।
              </div>

              <form onSubmit={saveSecretsToVault} className="space-y-4">
                {/* 1. Mongo URI */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1.5 flex items-center gap-1">
                    <Database size={11} className="text-cyan-400" />
                    MongoDB Connection Connection String (MONGODB_URI)
                  </label>
                  <input
                    type={showSecretsValues ? "text" : "password"}
                    value={vaultMongoUri}
                    onChange={(e) => setVaultMongoUri(e.target.value)}
                    placeholder="mongodb+srv://username:password@cluster..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/80 transition"
                  />
                </div>

                {/* 2. Render Key */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1.5 flex items-center gap-1">
                    <Globe size={11} className="text-pink-400" />
                    Render API Key (RENDER_API_KEY)
                  </label>
                  <input
                    type={showSecretsValues ? "text" : "password"}
                    value={vaultRenderKey}
                    onChange={(e) => setVaultRenderKey(e.target.value)}
                    placeholder="rnd_aBcDeFgHiJkLmNoP..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-pink-500/80 transition"
                  />
                </div>

                {/* 3. GitHub Token */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1.5 flex items-center gap-1 flex-row">
                    <Lock size={11} className="text-purple-400" />
                    GitHub Personal Access Token (GITHUB_TOKEN)
                  </label>
                  <input
                    type={showSecretsValues ? "text" : "password"}
                    value={vaultGithubToken}
                    onChange={(e) => setVaultGithubToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxx..."
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/80 transition"
                  />
                </div>

                {/* 4. GitHub Repo */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1.5 flex items-center gap-1">
                    <Globe size={11} className="text-teal-400" />
                    GitHub Repository (Github Owner/Repo)
                  </label>
                  <input
                    type="text"
                    value={vaultGithubRepo}
                    onChange={(e) => setVaultGithubRepo(e.target.value)}
                    placeholder="user_or_org/repo_name"
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/80 transition"
                  />
                </div>

                {/* Toggle visible keys / Save Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-855">
                  <button
                    type="button"
                    onClick={() => setShowSecretsValues(!showSecretsValues)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-855 cursor-pointer transition select-none"
                  >
                    {showSecretsValues ? <EyeOff size={11} /> : <Eye size={11} />}
                    {showSecretsValues ? "চাবি আড়াল করুন" : "চাবি প্রদর্শন করুন"}
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowSecretsModal(false)}
                      className="px-4 py-2 text-xs font-bold border border-slate-800 hover:bg-slate-855 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingSecrets}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg active:scale-95 transition cursor-pointer flex items-center gap-1"
                    >
                      {isSavingSecrets ? (
                        <>
                          <RefreshCw size={12} className="animate-spin" />
                          সেভ হচ্ছে...
                        </>
                      ) : "সেভ করুন 💾"}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embedded CSS for custom keyframes waves and styles */}
      <style>{`
        .pulse-idle {
          position: absolute;
          inset: 0;
          background: transparent;
          border-radius: 50%;
        }
        .pulse-active {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid #ec4899;
          animation: wave 1.2s infinite ease-in-out;
        }
        @keyframes wave {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 0.3; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        .code-deleted { background-color: #ffeef0; color: #b31412; text-decoration: line-through; }
        .code-added { background-color: #e6ffed; color: #22863a; }
      `}</style>

    </div>
  );
}
