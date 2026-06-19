/**
 * Marketing Hub Configuration
 * --------------------------------------------------------
 * এখানে পিক্সেল বা এপিআই কি রাখার জায়গা থাকবে।
 * এআই সোর্স ইভেন্টগুলো সক্রিয় করতে এনভায়রনমেন্ট ভেরিয়েবল অথবা নিচে আইডি টোকেন বসান।
 */
export const marketingConfig = {
    // ফেসবুক পিক্সেল আইডি / কনভার্সন এপিআই টোকেন
    facebookPixelId: process.env.FACEBOOK_PIXEL_ID || null, // e.g., 'FB-1049218201'
    
    // টিকটক বিজনেস অ্যাড পিক্সেল আইডি
    tiktokPixelId: process.env.TIKTOK_PIXEL_ID || null,     // e.g., 'TT-9410A88B'
    
    // গুগল অ্যানালিটিক্স / গুগল অ্যাডস কনভার্সন ট্র্যাকিং আইডি
    googleAdsId: process.env.GOOGLE_ADS_ID || null,         // e.g., 'AW-374109281'
    
    // সোর্স ট্র্যাকার গ্লোবাল স্ট্যাটাস সাইলেন্ট ট্র্যাকার ফ্ল্যাগ
    isLoggingEnabled: true
};
