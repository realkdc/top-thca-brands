import { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import NewsletterForm from './NewsletterForm';

interface NewsletterPopupProps {
  delay?: number; // Delay in milliseconds before showing the popup
  showOnce?: boolean; // Whether to show the popup only once per session
}

const NewsletterPopup = ({ 
  delay = 7000, 
  showOnce = true 
}: NewsletterPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if we should show the popup (based on localStorage)
    const hasSeenPopup = localStorage.getItem('hasSeenNewsletterPopup');
    
    if (showOnce && hasSeenPopup === 'true') {
      return;
    }
    
    // Set a timeout to show the popup after the delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      if (showOnce) {
        localStorage.setItem('hasSeenNewsletterPopup', 'true');
      }
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay, showOnce]);
  
  const closePopup = () => {
    setIsVisible(false);
  };
  
  // Don't render anything if the popup isn't visible
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="relative bg-thca-black max-w-md w-full rounded-lg border border-thca-grey/30 shadow-xl">
        <button 
          onClick={closePopup}
          className="absolute top-3 right-3 text-thca-white/70 hover:text-thca-white"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>
        
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-thca-gold/20 text-thca-gold">
              <Gift size={32} />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-thca-white text-center mb-2">
            Exclusive THCA Deals
          </h3>
          
          <p className="text-thca-white/80 text-center mb-6">
            Join our newsletter and get exclusive deals and discounts from top THCA brands delivered to your inbox.
          </p>
          
          <NewsletterForm 
            source="popup"
            buttonText="Subscribe"
            placeholderText="Your email address"
            className="mb-3"
          />
          
          <p className="text-xs text-center text-thca-white/50">
            We respect your privacy. You can unsubscribe at any time.
          </p>
          
          <div className="mt-4 pt-4 border-t border-thca-grey/20 text-center">
            <button 
              onClick={closePopup}
              className="text-sm text-thca-white/50 hover:text-thca-white"
            >
              No thanks, I'm not interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup; 