// Netlify serverless function to serve pre-rendered HTML with meta tags for social media crawlers
exports.handler = async (event, context) => {
  // Get user agent from headers (check multiple possible header names)
  const userAgent = event.headers['user-agent'] || 
                    event.headers['User-Agent'] || 
                    event.headers['HTTP_USER_AGENT'] || 
                    (event.multiValueHeaders && event.multiValueHeaders['user-agent'] && event.multiValueHeaders['user-agent'][0]) ||
                    '';
  
  // Log for debugging
  console.log('Function called with user agent:', userAgent);
  console.log('Event headers:', JSON.stringify(event.headers));
  
  // List of known crawler user agents (Instagram uses facebookexternalhit)
  const crawlers = [
    'facebookexternalhit',
    'Facebot',
    'Twitterbot',
    'LinkedInBot',
    'WhatsApp',
    'Slackbot',
    'Instagram',
    'Pinterest',
    'SkypeUriPreview',
    'TelegramBot',
    'ViberBot',
    'Discordbot'
  ];
  
  // Check if the request is from a crawler (case-insensitive)
  const userAgentLower = userAgent.toLowerCase();
  const isCrawler = crawlers.some(crawler => 
    userAgentLower.includes(crawler.toLowerCase())
  );
  
  console.log('Is crawler:', isCrawler);
  
  if (isCrawler) {
    // Return pre-rendered HTML with meta tags for retention calculator
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dispensary Retention Calculator - Top THCA Brands</title>
  <meta name="description" content="Calculate how much revenue you're leaving on the table without a customer retention app. Free 2-minute calculator to project your retention lift and extra profit.">
  <meta property="og:title" content="Dispensary Retention Calculator - See Your Revenue Potential">
  <meta property="og:description" content="Want to see the exact $$ you're leaving without an app? Our 2-min self-serve calculator shows your revenue potential from improved customer retention.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://topthcabrands.com/resources/retention-calculator">
  <meta property="og:image" content="https://topthcabrands.com/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Top THCA Brands">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Dispensary Retention Calculator">
  <meta name="twitter:description" content="Calculate your revenue potential from improved customer retention. Free 2-minute calculator.">
  <meta name="twitter:image" content="https://topthcabrands.com/og-image.png">
  <link rel="canonical" href="https://topthcabrands.com/resources/retention-calculator">
</head>
<body>
  <h1>Dispensary Retention Calculator</h1>
  <p>Calculate how much revenue you're leaving on the table without a customer retention app.</p>
</body>
</html>`;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      },
      body: html
    };
  }
  
  // For browsers (not crawlers), we need to serve the React app
  // Since we can't easily read files in Netlify functions, we'll fetch the index.html
  // from the site's origin or construct it with the React app scripts
  
  // Option 1: Fetch index.html from the site (might cause issues)
  // Option 2: Return HTML that redirects to a path that serves the React app
  // Option 3: Construct minimal HTML that loads React app
  
  // BEST: Return a 307 redirect to a path that will serve index.html via catch-all
  // But we need to avoid the redirect matching this function again
  // Solution: Redirect to the same path but the function won't match on the redirect
  // because Netlify processes redirects differently
  
  // Actually, the cleanest: Return HTML that includes a script to load React
  // and set the correct route. But we need the built asset paths.
  
  // WORKING SOLUTION: Return a redirect with status 307 to home
  // The React app will load and React Router will see the current URL
  // and route correctly. But the URL will change to /
  
  // BETTER: Use X-Netlify-Status header or return a proxy response
  // Actually, Netlify functions can't easily proxy to other paths
  
  // For browsers, redirect to home with the route stored in sessionStorage
  // The React app will check sessionStorage and navigate to the correct route
  const browserHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script>
    sessionStorage.setItem('redirectRoute', '/resources/retention-calculator');
    window.location.replace('/');
  </script>
  <noscript>
    <meta http-equiv="refresh" content="0;url=/" />
  </noscript>
</head>
<body>
  <p>Loading...</p>
</body>
</html>`;
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    },
    body: browserHTML
  };
};
