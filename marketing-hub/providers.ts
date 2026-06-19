import { marketingConfig } from './config';

/**
 * Marketing Providers Integrator Helper
 * --------------------------------------------------------
 * ফেসবুক, টিকটক, এবং গুগল-এর জন্য আলাদা ফাংশন।
 * এটি বর্তমানে কোনো বাহ্যিক এপিআই কল করবে না, ফলে সাইট থাকবে সম্পূর্ণ ফাস্ট ও নিরাপদ।
 */
export const marketingProviders = {
    /**
     * Facebook Pixel and Conversion API Dispatcher Simulator
     */
    trackFacebook: (eventName: string, data: any) => {
        if (!marketingConfig.facebookPixelId) {
            if (marketingConfig.isLoggingEnabled) {
                console.log(`[Marketing Hub 💤 Facebook] "${eventName}" ইভেন্ট ট্র্যাক হয়েছে (স্লিপ মোড - আইডি বিহীন)।`, data);
            }
            return;
        }
        console.log(`[Marketing Hub 🚀 Facebook] Event "${eventName}" dispatched directly with Client Pixel ID ${marketingConfig.facebookPixelId}!`, data);
    },

    /**
     * TikTok Conversion Engine Simulator
     */
    trackTikTok: (eventName: string, data: any) => {
        if (!marketingConfig.tiktokPixelId) {
            if (marketingConfig.isLoggingEnabled) {
                console.log(`[Marketing Hub 💤 TikTok] "${eventName}" ইভেন্ট ট্র্যাক হয়েছে (স্লিপ মোড - আইডি বিহীন)।`, data);
            }
            return;
        }
        console.log(`[Marketing Hub 🚀 TikTok] Event "${eventName}" dispatched to TikTok ID ${marketingConfig.tiktokPixelId}!`, data);
    },

    /**
     * Google Ads Conversion Tracking Simulator
     */
    trackGoogleAds: (eventName: string, data: any) => {
        if (!marketingConfig.googleAdsId) {
            if (marketingConfig.isLoggingEnabled) {
                console.log(`[Marketing Hub 💤 Google Ads] "${eventName}" ইভেন্ট ট্র্যাক হয়েছে (স্লিপ মোড - আইডি বিহীন)।`, data);
            }
            return;
        }
        console.log(`[Marketing Hub 🚀 Google Ads] Event "${eventName}" dispatched to Google Ads ID ${marketingConfig.googleAdsId}!`, data);
    }
};
