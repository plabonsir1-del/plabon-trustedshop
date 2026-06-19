import React, { useState } from 'react';
import { 
  CreditCard, 
  HelpCircle, 
  Info, 
  Lock, 
  CheckCircle,
  Coins,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MarketingTracker } from '../../marketing-hub/tracker';

interface CheckoutProps {
  onBack: () => void;
  onSubmitSuccess?: (details: any) => void;
}

export function SubscriptionCheckout({ onBack, onSubmitSuccess }: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('Bangladesh');
  const [postalCode, setPostalCode] = useState('');
  
  // Custom Digital Currency / Crypto states
  const [cryptoType, setCryptoType] = useState('USDT (TRC-20)');
  const [cryptoAddress, setCryptoAddress] = useState('TYN6b...8xK4sL72Wqp90AzM');
  const [cryptoNetwork, setCryptoNetwork] = useState('TRON (TRC20)');

  // Transaction Simulation
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Detect card type based on first digit
  const getCardType = (num: string) => {
    const clean = num.replace(/\D/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (clean.startsWith('5')) return 'MASTERCARD';
    if (clean.startsWith('3')) return 'AMEX';
    if (clean.startsWith('6')) return 'DISCOVER';
    return 'UNKNOWN';
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '').substring(0, 16);
    // Format card number with spaces every 4 digits
    let formatted = '';
    for (let i = 0; i < input.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += input[i];
    }
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (input.length > 2) {
      input = input.substring(0, 2) + '/' + input.substring(2);
    }
    setExpiry(input);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCvv(input);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (paymentMethod === 'card') {
      if (!firstName || !lastName || !cardNumber || !expiry || !cvv || !address || !postalCode) {
        setErrorMessage('অনগ্র্রহপূর্বক ক্রেডিট বা ডেবিট কার্ডের সকল তথ্য পূরণ করুন!');
        return;
      }
      if (cardNumber.replace(/\s/g, '').length < 15) {
        setErrorMessage('সঠিক ১৬ সংখ্যার কার্ড নাম্বার প্রদান করুন।');
        return;
      }
      if (expiry.length < 5) {
        setErrorMessage('সঠিক মেয়াদোত্তীর্ণের তারিখ (MM/YY) প্রদান করুন।');
        return;
      }
      if (cvv.length < 3) {
        setErrorMessage('সঠিক CVV কোড লিখুন।');
        return;
      }
    }

    setIsProcessing(true);
    
    // Simulate real gateway processing network delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Track conversion event in dormant marketing tracker
      MarketingTracker.trackEvent('purchase', {
        item: 'Royal Palace BD Store Premium Plan',
        price: 1.00,
        currency: 'USD',
        customerName: `${firstName} ${lastName}`.trim(),
        paymentMethod: paymentMethod,
        date: new Date().toISOString()
      });

      if (onSubmitSuccess) {
        onSubmitSuccess({
          paymentMethod,
          name: `${firstName} ${lastName}`,
          cardNumber: cardNumber ? `**** **** **** ${cardNumber.slice(-4)}` : 'Digital Wallet/Crypto',
          country,
          amount: '$1.00 USD',
          date: new Date().toLocaleString()
        });
      }
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="max-w-[550px] mx-auto mt-8 bg-white p-8 rounded-3xl shadow-2xl text-center border-t-8 border-emerald-500">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
            <CheckCircle size={44} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">পেমেন্ট সফল হয়েছে!</h2>
          <p className="text-emerald-600 font-bold mb-4 font-mono text-sm">TRANSACTION: #{Math.floor(100000 + Math.random() * 900000)}</p>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
            আপনার $1 USD মাসিক স্টোর ফি জমা হয়েছে। আপনার রয়্যাল প্লেস বিডি স্টোরটি সম্পূর্ণ অ্যাক্টিভ করা হয়েছে। এখন আপনার কাস্টমাররা সমস্ত কার্ড ও আন্তর্জাতিক পে ওয়ালেট দিয়ে পেমেন্ট পাঠাতে পারবে।
          </p>
          
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-left space-y-2 mb-8 text-xs font-medium text-slate-600">
            <div className="flex justify-between"><span>গ্রাহক:</span> <span className="font-bold text-slate-800">{firstName} {lastName}</span></div>
            <div className="flex justify-between"><span>কার্ড / গেটওয়ে:</span> <span className="font-bold text-slate-800">{paymentMethod === 'card' ? getCardType(cardNumber) : 'Crypto Pay'} ({cardNumber ? `*${cardNumber.slice(-4)}` : cryptoType})</span></div>
            <div className="flex justify-between"><span>ট্যাক্স সহ মোট ফি:</span> <span className="font-bold text-pink-600 font-mono">$1.00 USD</span></div>
            <div className="flex justify-between"><span>পরবর্তী চার্জের তারিখ:</span> <span className="font-bold text-slate-800 font-mono">Aug 23, 2026</span></div>
          </div>

          <button
            onClick={onBack}
            className="w-full py-3 bg-pink-600 text-white font-black rounded-2xl hover:bg-pink-700 transition uppercase tracking-widest text-xs shadow-lg shadow-pink-100"
          >
            হোম পেজে ফিরে যান
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-[550px] mx-auto mt-6 bg-slate-50 rounded-3xl overflow-hidden shadow-2xl border border-gray-100 text-slate-800">
      
      {/* Header Reopen Shopify UI */}
      <div className="bg-white p-6 pb-4 border-b border-gray-100 text-center relative">
        <button 
          onClick={onBack}
          className="absolute left-4 top-6 text-gray-400 hover:text-gray-600 p-1"
        >
          <X size={18} />
        </button>
        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
          <TrendingUp size={24} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 leading-tight">Reopen your store</h2>
        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
          We saved your progress. Pay <span className="font-bold text-gray-800 font-mono">$1/month</span> until Aug 23, 2026. Cancel anytime.
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* PayPal Gateway Warning (Shopify Connection Mock from User Screen) */}
        <div className="bg-amber-50 border border-amber-200/60 p-4 rounded-2xl flex gap-3 text-left">
          <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
          <div className="space-y-1">
            <h4 className="text-[11px] font-black uppercase text-amber-900 tracking-wider">PayPal Connection Problem</h4>
            <p className="text-xs text-amber-700 leading-relaxed font-semibold">
              Shopify couldn't connect to your PayPal account. Please try again or pay with credit cards instead.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 gap-2 bg-gray-200/60 p-1 rounded-2xl">
          <button
            onClick={() => setPaymentMethod('card')}
            className={`py-3 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider ${paymentMethod === 'card' ? 'bg-white text-pink-600 shadow-sm font-black' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <CreditCard size={14} /> Credit / Debit Card
          </button>
          <button
            onClick={() => setPaymentMethod('crypto')}
            className={`py-3 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider ${paymentMethod === 'crypto' ? 'bg-white text-pink-600 shadow-sm font-black' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Coins size={14} /> Cryptocurrency SDK
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200/60 p-3 rounded-xl text-left text-xs font-bold text-red-600">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubscribe} className="space-y-4 text-left">
          {paymentMethod === 'card' ? (
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-gray-500 tracking-wider">Credit or debit card</span>
                <div className="flex gap-1.5 grayscale opacity-65">
                  <div className="w-8 h-5 bg-gradient-to-r from-blue-700 to-indigo-700 rounded text-[9px] text-white flex items-center justify-center font-bold">VISA</div>
                  <div className="w-8 h-5 bg-gradient-to-r from-amber-600 to-red-600 rounded text-[9px] text-white flex items-center justify-center font-bold">MC</div>
                  <div className="w-8 h-5 bg-cyan-600 rounded text-[9px] text-white flex items-center justify-center font-bold">AMEX</div>
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-pink-500 transition-all font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-pink-500 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Card Number */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Card Number</label>
                  {cardNumber && (
                    <span className="text-[9px] font-extrabold text-pink-600 bg-pink-50 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                      {getCardType(cardNumber)}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-450">
                    <CreditCard size={15} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-3 py-2.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-pink-500 transition-all font-extrabold tracking-widest font-mono"
                  />
                </div>
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    required
                    placeholder="12/28"
                    value={expiry}
                    onChange={handleExpiryChange}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-pink-500 transition-all font-extrabold tracking-widest font-mono text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">CVV / CVN</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="•••"
                      value={cvv}
                      onChange={handleCvvChange}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-pink-500 transition-all font-extrabold tracking-widest font-mono text-center"
                    />
                    <HelpCircle size={12} className="absolute right-3 top-3 text-gray-400 cursor-pointer" title="The 3 or 4 digit security code on the back of card." />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Billing Address</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ধানমন্ডি ২৭, ঢাকা"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-pink-500 transition-all font-semibold"
                />
              </div>

              {/* Country & Postal Code */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Country/Region</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-pink-500 transition-all font-bold text-gray-700"
                  >
                    <option value="Bangladesh">Bangladesh 🇧🇩</option>
                    <option value="Chile">Chile 🇨🇱</option>
                    <option value="Bolivia">Bolivia 🇧🇴</option>
                    <option value="Saudi Arabia">Saudi Arabia 🇸🇦</option>
                    <option value="United Arab Emirates">UAE 🇦🇪</option>
                    <option value="United States">United States 🇺������</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Postal Code</label>
                  <input
                    type="text"
                    required
                    placeholder="1209"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-pink-500 transition-all font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-extrabold uppercase text-gray-500 tracking-wider">Digital Currency Payment Address</span>
                <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Web3 Live Gateway</span>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Select Currency</label>
                <select
                  value={cryptoType}
                  onChange={(e) => {
                    setCryptoType(e.target.value);
                    if (e.target.value.includes('USDT')) {
                      setCryptoAddress('TYN6b7k9uXmP2Qe1v4sL72Wqp90AzMdB7f');
                      setCryptoNetwork('TRON (TRC20)');
                    } else if (e.target.value.includes('BTC')) {
                      setCryptoAddress('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
                      setCryptoNetwork('Bitcoin Network');
                    } else {
                      setCryptoAddress('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
                      setCryptoNetwork('Ethereum (ERC20)');
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-pink-500 transition-all font-bold text-gray-700"
                >
                  <option value="USDT (TRC-20)">USDT (TRC-20 Token)</option>
                  <option value="Bitcoin (BTC)">Bitcoin (BTC)</option>
                  <option value="Ethereum (ETH)">Ethereum (ETH)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Network Platform</label>
                <input
                  type="text"
                  disabled
                  value={cryptoNetwork}
                  className="w-full bg-gray-100 text-gray-500 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold outline-none cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Merchant Wallet Address</label>
                <div className="relative bg-slate-50 border border-slate-200 px-3 py-3 rounded-xl text-xs font-mono font-bold select-all break-all pr-12">
                  {cryptoAddress}
                </div>
                <span className="text-[10px] text-gray-500 block leading-relaxed font-semibold">
                  এই ওয়ালেট এড্রেসে $1 USD সমপরিমাণ ডিজিটাল কারেন্সি পাঠিয়ে নিচে সাবমিট বাটন প্রেস করলেই ট্রানজেকশন অটো-ভেরিফাই হবে ও রয়্যাল প্লেস বিডি সচল হয়ে যাবে।
                </span>
              </div>
            </div>
          )}

          <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-2.5 text-xs text-gray-505 font-bold leading-relaxed">
            <Lock size={16} className="text-pink-600 flex-shrink-0" />
            <span>আপনার ডেটা এবং ট্রানজেকশন 256-bit AES ইন্ডাস্ট্রিয়াল গ্রেড ব্যাংক এনক্রিপশন দ্বারা নিরাপদ ও সুরক্ষিত।</span>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white font-extrabold rounded-2xl transition disabled:opacity-50 cursor-pointer text-xs uppercase tracking-widest shadow-xl shadow-pink-100 flex items-center justify-center gap-2 active:scale-98"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment Gateways...
              </>
            ) : (
              <>
                Subscribe for $1 USD <ArrowRight size={13} />
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}
