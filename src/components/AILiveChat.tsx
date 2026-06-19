import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, Activity, Bot, RotateCcw, Volume2, ShieldCheck, Zap, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AILiveChat: React.FC = () => {
  const [liveMode, setLiveMode] = useState<'premium' | 'webspeech'>('premium');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("লাইভ ভয়েস বর্তমানে বন্ধ আছে");
  const [transcript, setTranscript] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // --- REFERENCES FOR TRADITIONAL WEBSPEECH API ---
  const recognitionRef = useRef<any>(null);
  const speechSequenceIdRef = useRef<number>(0);

  // --- REFERENCES FOR PREMIUM GEMINI LIVE WEBSOCKET ---
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  // Handle traditional Web Speech API Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false; 
      recognition.interimResults = false;
      recognition.lang = 'bn-BD'; // Bengali support

      recognition.onstart = () => {
        setIsListening(true);
        setHasError(false);
        setStatusText("এআই কথা শুনছে... বলুন");
      };

      recognition.onresult = async (event: any) => {
        const resultText = event.results[0][0].transcript;
        setTranscript(resultText);
        setStatusText(`আপনি বলেছেন: "${resultText}"`);
        await sendToTraditionalAIEngine(resultText);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === 'aborted') {
          setStatusText("লাইভ ভয়েস বর্তমানে বন্ধ আছে");
          setIsListening(false);
          return;
        }
        setHasError(true);
        if (event.error === 'not-allowed') {
          setStatusText("মাইক্রোফোন ব্যবহারের অনুমতি দিন!");
        } else {
          setStatusText(`ভয়েস প্রসেসিং এরর: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      if (liveMode === 'webspeech') {
        setStatusText("আপনার ব্রাউজারে traditional ভয়েস ইনপুট সমর্থিত নয়।");
      }
    }

    return () => {
      // Cleanup WebSpeech if any active
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      // Cleanup WebSocket on unmount
      cleanupPremiumLive();
    };
  }, []);

  // Cleanup all premium Live components
  const cleanupPremiumLive = () => {
    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch (e) {}
      socketRef.current = null;
    }

    if (processorNodeRef.current) {
      try {
        processorNodeRef.current.disconnect();
      } catch (e) {}
      processorNodeRef.current = null;
    }

    if (micStreamRef.current) {
      try {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      } catch (e) {}
      micStreamRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
  };

  // --- TRADITIONAL SPEECH CONTROLS ---
  const toggleTraditionalLiveSpeech = () => {
    if (!recognitionRef.current) {
      setStatusText("স্পিচ রিকগনিশন আপনার ব্রাউজারে সমর্থিত নয়!");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setAiResponse("");
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Speech recognition start issue:", error);
      }
    }
  };

  // Speaks output out loud using browser SpeechSynthesis
  const speakOutLoud = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSequenceIdRef.current++;
      const currentId = speechSequenceIdRef.current;
      window.speechSynthesis.cancel(); 

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bn-BD'; 
      utterance.pitch = 1.0;
      utterance.rate = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const geminiLiveVoice = voices.find(voice => 
        (voice.name.includes("Google") || voice.name.includes("Natural")) && 
        voice.lang.includes("bn") && 
        voice.name.toLowerCase().includes("female")
      ) || voices.find(voice => 
        voice.lang.includes("bn") && 
        !voice.name.toLowerCase().includes("male")
      ) || voices.find(voice => 
        voice.name.toLowerCase().includes("female")
      ) || voices[0];

      if (geminiLiveVoice) {
        utterance.voice = geminiLiveVoice;
      }

      utterance.onend = () => {
        if (currentId === speechSequenceIdRef.current) {
          setStatusText("কথা বলা শেষ। নতুন কথা বলতে স্টার্ট বাটন চাপুন।");
        }
      };

      utterance.onerror = (err) => {
        console.error("SpeechSynthesis Error:", err);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setStatusText("আপনার ব্রাউজার ভয়েস আউটপুট সমর্থন করে না।");
    }
  };

  // REST API endpoint for traditional chat
  const sendToTraditionalAIEngine = async (text: string) => {
    setIsThinking(true);
    setStatusText("এআই চিন্তা করছে...");
    try {
      const response = await fetch('/api/autopilot/live-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) {
        throw new Error("Server responded with error status");
      }

      const data = await response.json();
      const replyText = data.reply || "দুঃখিত প্রিয়, আমি আপনার কথা বুঝতে পারিনি।";
      
      setAiResponse(replyText);
      setStatusText("এআই কথা বলছে...");
      speakOutLoud(replyText);
    } catch (error) {
      console.error("Error connecting to Live Voice API:", error);
      setStatusText("কানেকশন সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setIsListening(false);
    } finally {
      setIsThinking(false);
    }
  };

  // --- PREMIUM BIDIRECTIONAL PCM LIVE WEBSOCKET AUDIO SYSTEM ---
  const startPremiumLiveSession = async () => {
    setIsThinking(false);
    setHasError(false);
    setTranscript("");
    setAiResponse("");
    setStatusText("প্রিমিয়াম লাইভ ভয়েস কানেক্ট করা হচ্ছে...");

    try {
      // 1. WebSocket server endpoint with unique sessionId query param to isolate multi-user histories
      const localSessionId = localStorage.getItem('voice_session_id') || Math.random().toString(36).substring(2, 15);
      localStorage.setItem('voice_session_id', localSessionId);

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const socketUrl = `${protocol}//${window.location.host}/api/voice-stream?sessionId=${localSessionId}`;
      const socket = new WebSocket(socketUrl);
      socketRef.current = socket;

      // 2. Setup WebAudio Context with sample rate 16000 for microphone downsampling
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;
      nextStartTimeRef.current = 0; // Reset player queue

      // 3. Microphone user permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      micStreamRef.current = stream;

      const source = audioCtx.createMediaStreamSource(stream);
      // Create safe ScriptProcessorNode to capture channel data natively
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      source.connect(processor);
      
      // Route the processor node through a completely silent GainNode (gain = 0)
      // to keep the audioprocess event loop firing across all browsers while preventing
      // microphone feedback noise (the annoying ticking/kutum sound) from leaking into speakers.
      const silentGain = audioCtx.createGain();
      silentGain.gain.setValueAtTime(0, audioCtx.currentTime);
      processor.connect(silentGain);
      silentGain.connect(audioCtx.destination);

      processorNodeRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (socket.readyState === WebSocket.OPEN) {
          const float32Array = e.inputBuffer.getChannelData(0);
          
          // Downsample and convert Float32 (-1.0 to 1.0) into Little-Endian Int16 PCM array
          const buffer = new ArrayBuffer(float32Array.length * 2);
          const view = new DataView(buffer);
          for (let i = 0; i < float32Array.length; i++) {
            let s = Math.max(-1, Math.min(1, float32Array[i]));
            const val = s < 0 ? s * 0x8000 : s * 0x7FFF;
            view.setInt16(i * 2, val, true);
          }

          // Encapsulate to Base64
          let binary = '';
          const bytes = new Uint8Array(buffer);
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64Audio = window.btoa(binary);

          socket.send(JSON.stringify({ audio: base64Audio }));
        }
      };

      socket.onopen = () => {
        setIsListening(true);
        setStatusText("প্রিমিয়াম জেমিনি সংযুক্ত! সরাসরি কথা বলুন প্রিয়...");
      };

      socket.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);
          
          // Receive real-time client transcript
          if (msg.transcript) {
            setTranscript(msg.transcript);
            setStatusText(`আপনি বলেছেন: "${msg.transcript}"`);
          }

          // Receive real-time AI response text transcript
          if (msg.reply) {
            setAiResponse(msg.reply);
          }

          // Play real-time audio chunk response
          if (msg.audio) {
            console.log(`[Client Voice] Audio Frame Received at ${new Date().toISOString()}`);
            playAudioPCMChunk(msg.audio);
          }

          // Handle live speech interruption
          if (msg.interrupted) {
            console.log("[Client] Playback interrupted; clearing current speech stream.");
            nextStartTimeRef.current = 0;
          }
        } catch (e) {
          console.error("Failed to parse websocket audio frame:", e);
        }
      };

      socket.onclose = () => {
        stopPremiumLiveSession();
      };

      socket.onerror = (err) => {
        console.error("WebSocket Client Connection Error:", err);
        setHasError(true);
        setStatusText("লাইভ সেশন সংযোগ বিচ্ছিন্ন বা ত্রুটি অবরুদ্ধ!");
        stopPremiumLiveSession();
      };

    } catch (err: any) {
      console.error("Mic startup blocker or connection failure:", err);
      setHasError(true);
      setStatusText(`মাইক্রোফোন বা কানেকশন ত্রুটি: ${err.message || err}`);
      stopPremiumLiveSession();
    }
  };

  // Audio queue scheduler for seamless audio playback of 24kHz incoming chunks
  const playAudioPCMChunk = (base64Audio: string) => {
    const audioCtx = audioContextRef.current;
    if (!audioCtx) return;

    try {
      const binary = window.atob(base64Audio);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      // Pack raw 24kHz PCM into browser-decodable WAV format wrapper on-the-fly
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
        view.setUint16(20, 1, true); // PCM Format
        view.setUint16(22, 1, true); // Mono Channel
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

      // Decode the audio data asynchronously as requested
      audioCtx.decodeAudioData(wavBuffer, (audioBuffer) => {
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;

        // Apply premium sound polishing peaking filter for high clarity
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = 3200;
        filter.Q.value = 1.0;
        filter.gain.value = 4.0;

        source.connect(filter);
        filter.connect(audioCtx.destination);

        // Schedule precise gapless timing
        const currentTime = audioCtx.currentTime;
        let playTime = nextStartTimeRef.current;
        if (playTime < currentTime) {
          playTime = currentTime + 0.04; 
        }
        source.start(playTime);
        nextStartTimeRef.current = playTime + audioBuffer.duration;
      }, (decodeErr) => {
        console.warn("[AILiveChat] decodeAudioData failed, playing direct PCM fallback", decodeErr);
        
        // Direct PCM player fallback
        const int16Array = new Int16Array(bytes.buffer);
        const float32Array = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
          float32Array[i] = int16Array[i] / 32768.0;
        }

        const fallbackBuffer = audioCtx.createBuffer(1, float32Array.length, 24000);
        fallbackBuffer.getChannelData(0).set(float32Array);

        const source = audioCtx.createBufferSource();
        source.buffer = fallbackBuffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = 3200;
        filter.Q.value = 1.0;
        filter.gain.value = 4.0;

        source.connect(filter);
        filter.connect(audioCtx.destination);

        const currentTime = audioCtx.currentTime;
        let playTime = nextStartTimeRef.current;
        if (playTime < currentTime) {
          playTime = currentTime + 0.04;
        }
        source.start(playTime);
        nextStartTimeRef.current = playTime + fallbackBuffer.duration;
      });
    } catch (err) {
      console.error("Audioprocess playback scheduling failed:", err);
    }
  };

  const stopPremiumLiveSession = () => {
    cleanupPremiumLive();
    setIsListening(false);
    setStatusText("লাইভ ভয়েস বর্তমানে বন্ধ আছে");
  };

  // Unified Toggle Handler
  const toggleSpeechState = () => {
    if (liveMode === 'premium') {
      if (isListening) {
        stopPremiumLiveSession();
      } else {
        startPremiumLiveSession();
      }
    } else {
      toggleTraditionalLiveSpeech();
    }
  };

  // Switch tabs safely with clean interruptions
  const handleModeSwitch = (mode: 'premium' | 'webspeech') => {
    if (isListening) {
      if (liveMode === 'premium') stopPremiumLiveSession();
      else if (recognitionRef.current) recognitionRef.current.stop();
    }
    setLiveMode(mode);
    setTranscript("");
    setAiResponse("");
    setHasError(false);
    setStatusText(mode === 'premium' ? "প্রিমিয়াম লাইভ ভয়েস মোড নির্বাচিত" : "স্মার্ট ভয়েস-টু-টেক্সট মোড নির্বাচিত");
  };

  return (
    <div id="ai-live-chat-panel" className="bg-slate-950/90 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center text-white shadow-xl max-w-sm mx-auto my-1 relative overflow-hidden backdrop-blur-md">
      {/* Decorative backdrop glows */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Dual Mode Switcher Tabs */}
      <div className="flex w-full bg-slate-900/60 p-1 rounded-xl border border-slate-850/50 mb-3 z-10 gap-1">
        <button
          type="button"
          onClick={() => handleModeSwitch('premium')}
          className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            liveMode === 'premium'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-950/40'
          }`}
        >
          <Zap size={11} className={liveMode === 'premium' ? 'text-amber-300 animate-pulse' : 'text-slate-500'} />
          <span>প্রিমিয়াম লাইভ</span>
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch('webspeech')}
          className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            liveMode === 'webspeech'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-950/40'
          }`}
        >
          <Globe size={11} className={liveMode === 'webspeech' ? 'text-cyan-300' : 'text-slate-500'} />
          <span>স্মার্ট স্পীচ</span>
        </button>
      </div>

      {/* Title block */}
      <div className="flex items-center gap-2 mb-3.5 z-10">
        <div className="p-1 px-2 border border-emerald-500/30 rounded-lg bg-emerald-950/20 flex items-center gap-1">
          <Bot size={13} className="text-emerald-400 animate-pulse" />
          <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">
            {liveMode === 'premium' ? "Premium Multimodal Live API" : "Standard Voice Interaction"}
          </span>
        </div>
      </div>

      {/* Dynamic Status Display */}
      <div className="w-full h-11 mb-3.5 bg-slate-900/80 border border-slate-850 px-3 py-1.5 rounded-xl flex items-center justify-center text-center text-[10px] text-slate-200 z-10 shadow-inner font-semibold transition-all">
        {isThinking ? (
          <div className="flex items-center gap-2 text-cyan-400">
            <Activity size={12} className="animate-spin" />
            <span>জেমিনি চিন্তা করছে প্রিয়া...</span>
          </div>
        ) : isListening ? (
          <div className="flex items-center gap-1.5 text-rose-400 animate-pulse">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            <span>আমি কথা শুনছি প্রিয়, বলুন...</span>
          </div>
        ) : (
          <span className={hasError ? "text-rose-500 font-bold" : "text-slate-300"}>
            {statusText}
          </span>
        )}
      </div>

      {/* Transcripts visual feed */}
      <AnimatePresence mode="popLayout">
        {(transcript || aiResponse) && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="w-full text-[9px] mb-3.5 space-y-1.5 bg-slate-900/40 p-2.5 rounded-xl border border-slate-850/60 z-10 max-h-36 overflow-y-auto"
          >
            {transcript && (
              <div className="text-slate-400 flex items-start gap-1">
                <span className="font-bold text-slate-500 text-[8px] uppercase select-none mt-0.5 shrink-0">আপনি:</span>
                <p className="line-clamp-3">{transcript}</p>
              </div>
            )}
            {aiResponse && (
              <div className="text-emerald-300 font-medium flex items-start gap-1 border-t border-slate-850/30 pt-1.5 mt-1.5">
                <span className="font-bold text-emerald-500 text-[8px] uppercase select-none mt-0.5 shrink-0">জেমিনি:</span>
                <p className="line-clamp-4 leading-relaxed">{aiResponse}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Holographic Glowing Mic Circle */}
      <div className="relative flex items-center justify-center h-20 w-20 my-2 z-10">
        <AnimatePresence>
          {isListening && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.3, opacity: [0.1, 0.4, 0.1] }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className={`absolute inset-0 rounded-full blur-md ${liveMode === 'premium' ? 'bg-emerald-500' : 'bg-cyan-500'}`}
            />
          )}
        </AnimatePresence>
        
        <button
          id="toggle-live-speech-btn"
          type="button"
          onClick={toggleSpeechState}
          className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-300 border shadow-lg cursor-pointer ${
            isListening 
              ? 'bg-gradient-to-r from-red-500 to-rose-600 border-red-400 scale-105 active:scale-95 shadow-red-950/50' 
              : liveMode === 'premium'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-400 hover:border-emerald-300 active:scale-95 shadow-emerald-950/50'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-400 hover:border-cyan-300 active:scale-95 shadow-cyan-950/50'
          }`}
        >
          {isListening ? (
            <MicOff size={20} className="text-white animate-bounce" />
          ) : (
            <Mic size={20} className="text-white" />
          )}
          <span className="text-[7.5px] font-black uppercase tracking-wider text-white mt-1">
            {isListening ? "STOP" : "TALK"}
          </span>
        </button>
      </div>
      
      {/* Footer security tag line */}
      <div className="mt-2 text-center text-[7.5px] text-slate-500 w-full flex items-center justify-center gap-1 z-10">
        <ShieldCheck size={9} className="text-emerald-600" />
        <span>প্লাবন ট্রাস্ট লাইভ ভয়েস ইঞ্জিন সম্পূন্ন সুরক্ষিত মোডে সক্রিয়।</span>
      </div>
    </div>
  );
};
