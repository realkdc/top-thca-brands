import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Shield, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={cn(
        'fixed w-full top-0 z-50 transition-all duration-300',
        scrolled ? 'bg-thca-black/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-thca-red" />
          <span className="font-display text-xl font-bold tracking-tight text-thca-white">TOP<span className="text-thca-red">THCA</span></span>
        </a>
        
        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="#brands">Brands</NavLink>
          <NavLink href="#about">About Us</NavLink>
          <NavLink href="#criteria">Criteria</NavLink>
          <NavLink href="#contact" className="bg-thca-red hover:bg-thca-red/80 px-4 py-2 rounded transition-colors">
            Contact
          </NavLink>
        </nav>
        
        <button 
          className="md:hidden text-thca-white"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-thca-black/95 backdrop-blur-md z-40 p-6">
          <nav className="flex flex-col items-center gap-6 pt-6">
            <NavLink href="#brands" className="text-xl" onClick={() => setMobileMenuOpen(false)}>Brands</NavLink>
            <NavLink href="#about" className="text-xl" onClick={() => setMobileMenuOpen(false)}>About Us</NavLink>
            <NavLink href="#criteria" className="text-xl" onClick={() => setMobileMenuOpen(false)}>Criteria</NavLink>
            <NavLink href="#contact" className="bg-thca-red hover:bg-thca-red/80 px-6 py-3 rounded transition-colors text-xl" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

const NavLink = ({ 
  href,
  className, 
  children,
  onClick
}: { 
  href: string;
  className?: string; 
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <a 
      href={href} 
      className={cn(
        "font-medium text-thca-white hover:text-thca-gold transition-colors",
        className
      )}
      onClick={onClick}
    >
      {children}
    </a>
  );
};

export default Navbar;
