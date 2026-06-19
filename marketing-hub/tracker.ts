import { marketingProviders } from './providers';

/**
 * Marketing Integration Hub Tracker (Orchestrator Module)
 * --------------------------------------------------------
 * মূল লজিক যা আপনার অ্যাপ্লিকেশনের যেকোনো জায়গা থেকে কল করা যাবে।
 * উদাহরণ: MarketingTracker.trackEvent('purchase', { price: 599, orderId: '#ID' })
 */
export const MarketingTracker = {
    /**
     * Dispatch event to all marketing partners safely
     * @param eventName Name of the action (e.g. 'purchase', 'view_item', 'add_to_cart')
     * @param data Payload data containing parameters such as product details, price value, conversion data etc.
     */
    trackEvent: (eventName: string, data: any) => {
        try {
            // Broadcast standard parameters across active providers
            marketingProviders.trackFacebook(eventName, data);
            marketingProviders.trackTikTok(eventName, data);
            marketingProviders.trackGoogleAds(eventName, data);
        } catch (error: any) {
            console.error(`[Marketing Hub Error] Tracking failed dynamically: ${error.message}`);
        }
    }
};

export default MarketingTracker;
