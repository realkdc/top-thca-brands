import { Mail, Tag, Bell } from 'lucide-react';
import NewsletterForm from './NewsletterForm';

const NewsletterSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-thca-black to-thca-black/95">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="section-title mb-4">Get Exclusive THCA Deals</h2>
          <p className="text-thca-white/80 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and receive exclusive deals, industry news, and early access to product reviews
            from the top THCA brands.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-thca-grey/10 p-6 rounded-lg border border-thca-grey/30">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-thca-gold/20 text-thca-gold mb-4">
                <Tag size={24} />
              </div>
              <h3 className="text-lg font-semibold text-thca-white mb-2">Exclusive Discounts</h3>
              <p className="text-sm text-thca-white/70">
                Get access to subscriber-only coupon codes and special promotions from premium brands.
              </p>
            </div>
            
            <div className="bg-thca-grey/10 p-6 rounded-lg border border-thca-grey/30">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-thca-gold/20 text-thca-gold mb-4">
                <Bell size={24} />
              </div>
              <h3 className="text-lg font-semibold text-thca-white mb-2">New Product Alerts</h3>
              <p className="text-sm text-thca-white/70">
                Be the first to know when top brands release new products or limited edition items.
              </p>
            </div>
            
            <div className="bg-thca-grey/10 p-6 rounded-lg border border-thca-grey/30">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-thca-gold/20 text-thca-gold mb-4">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-semibold text-thca-white mb-2">Expert Insights</h3>
              <p className="text-sm text-thca-white/70">
                Get curated content on the latest trends, lab results, and expert opinions on premium THCA products.
              </p>
            </div>
          </div>
          
          <div className="max-w-md mx-auto">
            <NewsletterForm
              source="newsletter_section"
              buttonText="Join Now"
              placeholderText="Your email address"
              className="mb-3"
            />
            <p className="text-xs text-thca-white/50">
              By subscribing, you agree to receive marketing emails from Top THCA Brands. 
              We respect your privacy and you can unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection; 