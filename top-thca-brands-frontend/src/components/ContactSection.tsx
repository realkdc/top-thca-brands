import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { submitContact } from '@/api/contactService';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    brandName: '',
    website: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Submit form data to the API
      const response = await submitContact(formData);
      
      toast({
        title: "Submission received",
        description: response.message || "Thank you for your interest. We'll review your brand and get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        brandName: '',
        website: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-thca-black relative">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Submit Your Brand</h2>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <p className="text-thca-white/70 mb-6">
              Think your brand stands out from the rest? We're always looking for exceptional THCA products that meet our rigorous standards.
            </p>
            
            <div className="bg-thca-grey/10 border border-thca-grey/30 p-6 rounded-lg mb-8">
              <h3 className="font-display text-xl font-bold mb-4 text-thca-white">
                What happens next?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-thca-gold text-thca-black font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                  <span className="text-thca-white/80">Our team reviews your submission within 5-7 business days</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-thca-gold text-thca-black font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                  <span className="text-thca-white/80">If your brand meets initial criteria, we request product samples</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-thca-gold text-thca-black font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                  <span className="text-thca-white/80">Products undergo our thorough evaluation process</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-thca-gold text-thca-black font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                  <span className="text-thca-white/80">Selected brands are featured in our elite lineup</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <form onSubmit={handleSubmit} className="bg-thca-grey/10 border border-thca-grey/30 p-8 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm text-thca-white/70">Your Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-thca-grey/20 border-thca-grey/30 focus:border-thca-gold text-thca-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-thca-white/70">Email Address</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-thca-grey/20 border-thca-grey/30 focus:border-thca-gold text-thca-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="brandName" className="text-sm text-thca-white/70">Brand Name</label>
                  <Input
                    id="brandName"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    className="bg-thca-grey/20 border-thca-grey/30 focus:border-thca-gold text-thca-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="website" className="text-sm text-thca-white/70">Website (Optional)</label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="bg-thca-grey/20 border-thca-grey/30 focus:border-thca-gold text-thca-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2 mb-8">
                <label htmlFor="message" className="text-sm text-thca-white/70">Tell us about your brand</label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="bg-thca-grey/20 border-thca-grey/30 focus:border-thca-gold text-thca-white min-h-[120px]"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-thca-red hover:bg-thca-red/90 text-thca-white font-medium py-5" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Your Brand'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
