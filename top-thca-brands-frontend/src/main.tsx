import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check if we were redirected from the serverless function and need to restore the route
const urlParams = new URLSearchParams(window.location.search);
const redirectRoute = sessionStorage.getItem('redirectRoute');
if (redirectRoute && !urlParams.has('_routed')) {
  sessionStorage.removeItem('redirectRoute');
  window.history.replaceState(null, '', redirectRoute);
}

createRoot(document.getElementById("root")!).render(<App />);
