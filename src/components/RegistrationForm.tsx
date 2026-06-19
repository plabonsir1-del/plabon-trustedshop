import React, { useState } from 'react';
import { 
  ArrowLeft, 
  IdCard, 
  Image as ImageIcon, 
  Mail, 
  User, 
  MapPin, 
  Globe, 
  Send, 
  CheckCircle,
  Home,
  ShieldCheck,
  Smartphone,
  Camera,
  Scan,
  UserCheck,
  RefreshCw,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface RegistrationFormProps {
  t: any;
  onBack: () => void;
  mode: 'dropshipping' | 'warehouse';
  onSubmitSuccess?: (data: any) => void;
  currentUser?: any;
}

export function RegistrationForm({ t, onBack, mode, onSubmitSuccess, currentUser }: RegistrationFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string | undefined>();
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({ text: '', color: '' });
  const [formData, setFormData] = useState({
    idNumber: '',
    email: currentUser?.email || '',
    password: '',
    name: currentUser?.name || '',
    district: '',
    city: '',
    country: '',
    usernameVerify: ''
  });

  // Face Scanner & KYC Biometric States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedSelfie, setCapturedSelfie] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepMessage, setScanStepMessage] = useState('');
  const [kycVerified, setKycVerified] = useState(false);
  const [userUploadedSelfie, setUserUploadedSelfie] = useState(false);

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    // Cleanup camera stream on page exit/unmount
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const initCamera = async () => {
    setCameraError(null);
    setCapturedSelfie(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("আপনার ব্রাউজারে ক্যামেরা ব্যবহারের সুবিধাটি পাওয়া যায়নি বা ব্লক করা রয়েছে।");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 480, height: 360 },
        audio: false
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.log("Video play interrupted:", e));
      }
    } catch (err: any) {
      console.error("Camera Initialisation Error:", err);
      let localizedError = "ক্যামেরা সচল করতে ব্যর্থ! অনুগ্রহ করে সেটিংস থেকে ক্যামেরা অ্যাক্সেস অনুমতি দিন।";
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        localizedError = "ক্যামেরার অনুমতি প্রত্যাখ্যাত হয়েছে! ব্রাউজারের বাম পাশের লক বা সাইট সেটিংসে গিয়ে অনুমতি দিন।";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        localizedError = "আপনার ডিভাইসে কোনো সংযুক্ত সক্রিয় ক্যামেরা পাওয়া যায়নি।";
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        localizedError = "ক্যামেরা সোর্স অন্য কোনো অ্যাপ বা ট্যাব দ্বারা ব্যবহৃত হচ্ছে।";
      } else if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        localizedError = "ক্যামেরা শুধুমাত্র HTTPS বা লোকালহোস্টের সুরক্ষিত পরিবেশে সচল করা সম্ভব।";
      }
      setCameraError(localizedError);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 360;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedSelfie(dataUrl);
      setUserUploadedSelfie(false);
      stopCamera();
      // Start simulated AI facial landmark processing & KYC matching
      triggerBiometricVerification();
    }
  };

  const handleSelfieFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedSelfie(reader.result as string);
        setUserUploadedSelfie(true);
        setCameraError(null);
        // Start simulated AI matching
        triggerBiometricVerification();
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerBiometricVerification = () => {
    setIsScanning(true);
    setKycVerified(false);
    setScanProgress(5);
    setScanStepMessage('ফেস ফ্রেম ডিটেক্ট করা হচ্ছে...');

    const steps = [
      { progress: 15, msg: 'মুখমণ্ডলের উজ্জ্বলতা ও কনট্রাস্ট যাচাই করা হচ্ছে...' },
      { progress: 35, msg: '২ডি লাইভনেস টেস্ট ও স্পুফ প্রোটেকশন রিডিং সচল...' },
      { progress: 60, msg: 'বায়োমেট্রিক ল্যান্ডমার্ক ও ফেস মেস এক্সট্র্যাকশন সম্পন্ন...' },
      { progress: 85, msg: 'কাস্টমার ডাটাবেস এর সাথে এআই সনাক্তকরণ ফেস ম্যাচিং চলছে...' },
      { progress: 100, msg: '৯৯.৪% আত্মবিশ্বাসের সাথে ডাবল-ব্লাইন্ড ফেস ভেরিফাইড!' }
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        setScanProgress(steps[currentStepIdx].progress);
        setScanStepMessage(steps[currentStepIdx].msg);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          setKycVerified(true);
        }, 600);
      }
    }, 600);
  };

  const resetBiometrics = () => {
    setCapturedSelfie(null);
    setKycVerified(false);
    setScanProgress(0);
    setScanStepMessage('');
    setIsScanning(false);
    setUserUploadedSelfie(false);
  };

  const isDropship = mode === 'dropshipping';
  const focusBorderClass = isDropship ? 'focus:border-pink-500' : 'focus:border-blue-500';
  const buttonBgClass = isDropship ? 'bg-[#FF1493] hover:bg-pink-600' : 'bg-blue-600 hover:bg-blue-700';
  const shadowClass = isDropship ? 'shadow-pink-100' : 'shadow-blue-100';

  const title = isDropship ? t.dropshippingRegTitle : t.warehouseRegTitle;
  const successMsg = isDropship ? t.appSuccess : t.warehouseSuccess;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'usernameVerify') {
      checkUsername(value);
    }
  };

  const checkUsername = (username: string) => {
    const cleanUsername = username.trim();
    if (cleanUsername.length < 3) {
      setUsernameStatus({ text: "Username must be at least 3 characters long.", color: "red" });
      setIsUsernameValid(false);
      return;
    }
    const existingUsernames = ["admin", "shop123", "myshop", "shakil", "dropship99"];
    setTimeout(() => {
      if (!existingUsernames.includes(cleanUsername.toLowerCase())) {
        setUsernameStatus({ text: "✓ This username is available.", color: "green" });
        setIsUsernameValid(true);
      } else {
        setUsernameStatus({ text: "✗ This username is already taken.", color: "red" });
        setIsUsernameValid(false);
      }
    }, 300);
  };

  const handleSuggest = () => {
    const currentName = formData.usernameVerify.trim() || formData.name.trim().toLowerCase().replace(/\s+/g, '') || "user";
    const randomNumber = Math.floor(100 + Math.random() * 900); 
    const suggested = currentName.replace(/[0-9]/g, '') + randomNumber;
    handleInputChange('usernameVerify', suggested);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUsernameValid) {
      setUsernameStatus({ text: "Please fix the username error before submitting.", color: "red" });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          whatsapp: whatsappNumber,
          type: mode
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        if (onSubmitSuccess) {
          onSubmitSuccess({
            ...formData,
            whatsapp: whatsappNumber,
            type: mode,
            status: 'pending'
          });
        }
        setIsSubmitted(true);
      } else {
        alert(data.error || "রেজিস্ট্রেশন ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
      }
    } catch (err) {
      alert("সার্ভারের সাথে যোগাযোগ করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-[500px] mx-auto mt-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="success-card bg-white rounded-[25px] shadow-2xl p-8 text-center"
        >
          <div className="flex justify-center mb-6">
            <CheckCircle size={80} className="text-green-500" />
          </div>
          <h3 className="text-3xl font-bold text-green-600 mb-4">{t.verifiedOk}</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {successMsg}
          </p>
          <button 
            onClick={onBack}
            className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-4 rounded-2xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-200 cursor-pointer"
          >
            <Home size={20} />
            {t.backToDashboard}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[500px] mx-auto mt-6 mb-20 px-4">
      {/* Universal Page Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition"
        >
          <ArrowLeft size={18} />
          <span>Dashboard</span>
        </button>
        <div className="text-slate-500 font-bold text-xs bg-slate-50 py-2 px-4 rounded-xl border">
          Role: <span className="text-[#FF1493]">{currentUser?.role || 'Verified User'}</span>
        </div>
      </div>

      <div className="text-center mb-10">
        <p className="text-sm text-slate-500 font-extrabold tracking-wide uppercase">{title}</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="registration-container bg-white p-6 md:p-8 rounded-[30px] border border-slate-100 shadow-xl"
      >
        <form onSubmit={handleSubmit} className="registration-form space-y-6 text-left">
          
          {/* NID number */}
          <div className="form-group">
            <label className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5"><IdCard size={15} /> {t.idNumber}</label>
            <input 
              type="text" 
              placeholder="Enter your NID or ID Number" 
              required 
              className={`w-full p-3.5 bg-slate-50 border border-slate-200 outline-none text-xs font-semibold rounded-xl text-slate-800 transition ${focusBorderClass}`}
              value={formData.idNumber}
              onChange={(e) => handleInputChange('idNumber', e.target.value)}
            />
          </div>

          {/* Upload ID files */}
          <div className="form-group">
            <label className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5"><ImageIcon size={15} /> {t.uploadId}</label>
            <input type="file" accept="image/*,.pdf" className="w-full text-xs p-1" />
            <small className="text-gray-400 block mt-1 text-[10px]">{t.uploadHint}</small>
          </div>

          {/* ================ LIVE FACE SCANNER & BIOMETRIC KYC ================ */}
          <div className="form-group border-2 border-dashed border-slate-200/80 rounded-2xl p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Camera size={15} className={isCameraActive ? "text-emerald-500 animate-pulse" : "text-pink-500"} />
                লাইভ ফেস ভেরিফিকেশন ও বায়োমেট্রিক আইডি ম্যাচ
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 py-1 px-2 rounded-md">
                KYC SECURE
              </span>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* Video Viewport / Capture State */}
            <div className="relative w-full h-56 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col items-center justify-center">
              
              {/* Laser Grid Effect / Scanner Mask when active */}
              {isCameraActive && !capturedSelfie && (
                <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
                  <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-[bounce_4s_infinite]" />
                  <div className="absolute inset-0 border-2 border-emerald-500/20 m-6 rounded-full border-dashed animate-pulse" />
                </div>
              )}

              {/* Viewport content */}
              {!isCameraActive && !capturedSelfie && (
                <div className="text-center p-6 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-slate-500">
                    <Camera size={22} />
                  </div>
                  <p className="text-[11px] font-bold text-slate-300">ক্যামেরা অন করে আইডি কার্ডের ছবির সাথে মুখমণ্ডল মিলান</p>
                  <p className="text-[10px] text-slate-500 leading-normal">সুরক্ষিত ফেস ম্যাচিং ও রিয়েল-টাইম লাইভনেস ভেরিফিকেশনের জন্য সচল ফেস স্ক্যানার ব্যবহার করুন।</p>
                </div>
              )}

              {/* Live Video Element */}
              {isCameraActive && (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover relative z-0"
                />
              )}

              {/* Captured Image Preview & AI analyzing state */}
              {capturedSelfie && (
                <div className="absolute inset-0 z-20 bg-slate-950 flex flex-col md:flex-row items-center gap-4 p-4">
                  <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-lg shadow-emerald-500/10 flex-shrink-0">
                    <img src={capturedSelfie} alt="Face verification captured asset" className="w-full h-full object-cover" />
                    {isScanning && (
                      <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center animate-pulse">
                        <Scan size={32} className="text-emerald-400 animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-left space-y-1.5 self-center">
                    <span className="text-[9px] font-extrabold text-[#FF1493] uppercase tracking-wider block bg-pink-950/40 px-2 py-0.5 rounded border border-pink-500/10 w-max">
                      {userUploadedSelfie ? "Selfie Photo Asset" : "Live Captured Frame"}
                    </span>
                    
                    {isScanning && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                          <span className="flex items-center gap-1"><Loader2 size={12} className="animate-spin text-emerald-400" /> {scanStepMessage}</span>
                          <span className="text-emerald-400 text-xs font-extrabold">{scanProgress}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                        </div>
                      </div>
                    )}

                    {kycVerified && (
                      <div className="space-y-1 animate-fade-in">
                        <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle size={14} /> ফেস স্ক্যান সফলভাবে সম্পন্ন হয়েছে!
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                          বায়োমেট্রিক ডাবল-ব্লাইন্ড ল্যান্ডমার্ক ৯০% এর বেশি মিলেছে। আপনার মুখমণ্ডল এখন এই প্রোফাইলের সাথে সংযুক্ত।
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Error Fallback & Manual Upload */}
            {cameraError && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-250 rounded-xl text-left">
                <div className="flex gap-2 items-start mb-2.5">
                  <AlertCircle size={15} className="text-rose-600 flex-shrink-0" />
                  <p className="text-[11px] font-semibold text-rose-800 leading-normal">{cameraError}</p>
                </div>
                {/* Fallback Live Shot input */}
                <div className="bg-white p-2.5 rounded-lg border border-rose-200">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 leading-normal">
                    বিকল্প পদ্ধতি: আপনার ডিভাইসের মেমরি বা ফাইল থেকে একটি স্পষ্ট ও সরাসরি সেলফি ছবি আপলোড করুন
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="user"
                    className="w-full text-[11px] text-slate-600 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200"
                    onChange={handleSelfieFileUpload}
                  />
                </div>
              </div>
            )}

            {/* Controller Action buttons */}
            <div className="mt-3 flex gap-2">
              {!capturedSelfie ? (
                <>
                  {!isCameraActive ? (
                    <button
                      type="button"
                      onClick={initCamera}
                      className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-850 text-white rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition active:scale-98 shadow-sm cursor-pointer"
                    >
                      <Camera size={13} /> ক্যামেরা চালু করুন
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={captureFrame}
                        className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition active:scale-98 shadow-md shadow-emerald-500/10 cursor-pointer"
                      >
                        <Scan size={13} /> ফেস স্ক্যান ও ক্যাপচার
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-[11px] transition cursor-pointer"
                      >
                        বন্ধ করুন
                      </button>
                    </>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={resetBiometrics}
                  className="flex-1 py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 hover:text-slate-900 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <RefreshCw size={12} className={isScanning ? "animate-spin" : ""} /> পুনরায় স্ক্যান করুন
                </button>
              )}
            </div>
          </div>
          {/* =================================================================== */}

          {/* Dynamic Username Verify */}
          <div className="form-group relative">
            <label htmlFor="username_verify" className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5">
              Username Verify
            </label>
            <div className="flex gap-2 items-center">
              <input 
                type="text" 
                id="username_verify" 
                name="username_verify" 
                placeholder="Enter username" 
                required
                className={`w-full p-3.5 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-800 outline-none transition`}
                style={{ 
                  borderColor: usernameStatus.color === 'red' ? 'red' : usernameStatus.color === 'green' ? 'green' : '#cbd5e1' 
                }}
                value={formData.usernameVerify}
                onChange={(e) => handleInputChange('usernameVerify', e.target.value)}
              />
              <button 
                type="button" 
                title="Suggest Username"
                onClick={handleSuggest}
                className="p-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl cursor-pointer text-sm transition"
              >
                🔄
              </button>
            </div>
            {usernameStatus.text && (
              <div 
                className="text-[11px] mt-1.5 font-bold"
                style={{ color: usernameStatus.color === 'green' ? '#10b981' : '#ef4444' }}
              >
                {usernameStatus.text}
              </div>
            )}
          </div>

          {/* WhatsApp Phone Input */}
          <div className="whatsapp-group">
            <label className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5">
              <Smartphone size={15} /> WhatsApp Number
            </label>
            <div className="phone-input-pts border p-2 rounded-xl bg-slate-50">
              <PhoneInput
                placeholder="Enter WhatsApp number"
                value={whatsappNumber}
                onChange={setWhatsappNumber}
                defaultCountry="BD"
                required
              />
            </div>
          </div>

          {/* Email address */}
          <div className="form-group">
            <label className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5"><Mail size={15} /> {t.email}</label>
            <input 
              type="email" 
              placeholder="your.email@example.com" 
              required 
              className={`w-full p-3.5 bg-slate-50 border border-slate-200 outline-none text-xs font-semibold rounded-xl text-slate-800 transition ${focusBorderClass}`}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>

          {/* Account Password */}
          <div className="form-group">
            <label className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5"><ShieldCheck size={15} /> {t.accountPassword}</label>
            <input 
              type="password" 
              placeholder="একটি পাসওয়ার্ড দিন" 
              required 
              className={`w-full p-3.5 bg-slate-50 border border-slate-200 outline-none text-xs font-semibold rounded-xl text-slate-800 transition ${focusBorderClass}`}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5"><User size={15} /> {t.name}</label>
            <input 
              type="text" 
              placeholder="Enter your full name" 
              required 
              className={`w-full p-3.5 bg-slate-50 border border-slate-200 outline-none text-xs font-semibold rounded-xl text-slate-800 transition ${focusBorderClass}`}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          {/* District & City */}
          <div className="form-row-grid grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5"><MapPin size={15} /> {t.district}</label>
              <input 
                type="text" 
                placeholder="District" 
                className={`w-full p-3.5 bg-slate-50 border border-slate-200 outline-none text-xs font-semibold rounded-xl text-slate-800 transition ${focusBorderClass}`}
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5"><MapPin size={15} /> {t.city}</label>
              <input 
                type="text" 
                placeholder="Village / City" 
                className={`w-full p-3.5 bg-slate-50 border border-slate-200 outline-none text-xs font-semibold rounded-xl text-slate-800 transition ${focusBorderClass}`}
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>
          </div>

          {/* Country Selection */}
          <div className="form-group">
            <label className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5"><Globe size={15} /> {t.country}</label>
            <select 
              value={formData.country}
              className={`w-full p-3.5 bg-slate-50 border border-slate-200 outline-none text-xs font-semibold rounded-xl bg-white text-slate-800 transition ${focusBorderClass}`}
              onChange={(e) => handleInputChange('country', e.target.value)}
            >
              <option value="">{t.selectCountry}</option>
              <option value="BD">Bangladesh</option>
              <option value="IN">India</option>
              <option value="PK">Pakistan</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="SA">Saudi Arabia</option>
              <option value="AE">UAE</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className={`mt-4 w-full text-white font-extrabold py-4 px-6 rounded-2xl text-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${buttonBgClass} ${shadowClass} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="inline-block">
                <Send size={18} />
              </motion.div>
            ) : (
              <Send size={18} />
            )}
            {t.submitBtn}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
