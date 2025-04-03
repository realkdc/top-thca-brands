import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { login } from '@/api/authService';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userData = await login(credentials);
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });
      navigate('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-thca-black p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-thca-white mb-2">Admin Login</h1>
          <p className="text-thca-white/70">Sign in to access the admin dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-thca-grey/10 border border-thca-grey/30 p-8 rounded-lg">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-thca-white/70">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={credentials.email}
                onChange={handleChange}
                className="bg-thca-grey/20 border-thca-grey/30 focus:border-thca-gold text-thca-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-thca-white/70">Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                className="bg-thca-grey/20 border-thca-grey/30 focus:border-thca-gold text-thca-white"
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6 bg-thca-red hover:bg-thca-red/90 text-thca-white"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login; 