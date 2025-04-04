import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const Redirect = () => {
  const { target } = useParams<{ target: string }>();
  const location = useLocation();
  
  useEffect(() => {
    // Get the target URL based on the parameter
    const getRedirectUrl = () => {
      switch(target?.toLowerCase()) {
        case 'smoky':
          return 'https://www.smokymountaincbd.com/';
        // Add more destinations as needed
        default:
          return '/'; // Redirect to home if no valid target
      }
    };

    const redirectUrl = getRedirectUrl();
    
    // Extract any UTM parameters from the current URL
    const searchParams = new URLSearchParams(location.search);
    
    // If there are UTM parameters and the target isn't home, add them
    if (searchParams.toString() && redirectUrl !== '/') {
      window.location.href = `${redirectUrl}${redirectUrl.includes('?') ? '&' : '?'}${searchParams.toString()}`;
    } else {
      window.location.href = redirectUrl;
    }
  }, [target, location.search]);

  return (
    <div style={{ display: 'none' }}>
      {/* Hidden content */}
      <p>If you are not redirected, <a href="https://www.smokymountaincbd.com/">click here</a>.</p>
    </div>
  );
};

export default Redirect; 