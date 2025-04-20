import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from '@/api/axiosConfig';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NewsletterFormProps {
  source?: string;
  className?: string;
  buttonText?: string;
  placeholderText?: string;
}

interface FormValues {
  email: string;
  name?: string;
}

const NewsletterForm = ({
  source = 'website',
  className = '',
  buttonText = 'Subscribe',
  placeholderText = 'Enter your email'
}: NewsletterFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>();
  
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      const response = await axios.post('/subscribe', {
        ...data,
        source
      });
      
      toast({
        title: "Success!",
        description: response.data.message || "You've been subscribed to our newsletter.",
        variant: "default",
      });
      
      reset();
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      
      toast({
        title: "Error",
        description: error.response?.data?.message || "There was an error subscribing you. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      <div className="flex-1">
        <Input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          placeholder={placeholderText}
          type="email"
          className={`w-full bg-opacity-20 border-thca-grey ${errors.email ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="bg-thca-gold hover:bg-thca-gold/90 text-thca-black font-semibold min-w-28"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Subscribing...' : buttonText}
      </Button>
    </form>
  );
};

export default NewsletterForm; 