// Netlify Edge Function to serve pre-rendered HTML with meta tags for social media crawlers
// This runs BEFORE the redirects, so we can intercept crawler requests

export default async (request: Request) => {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  
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
  
  // Check if the request is from a crawler
  const isCrawler = crawlers.some(crawler => 
    userAgent.toLowerCase().includes(crawler.toLowerCase())
  );
  
  // Check if this is the retention calculator route
  const isRetentionCalculator = url.pathname === '/resources/retention-calculator';
  
  if (isCrawler && isRetentionCalculator) {
    // Return pre-rendered HTML with meta tags for retention calculator
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dispensary Retention Calculator - Top THCA Brands</title>
  <meta name="description" content="Calculate how much revenue you're leaving on the table without a customer retention app. Free 2-minute calculator to project your retention lift and extra profit.">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:title" content="Dispensary Retention Calculator - See Your Revenue Potential">
  <meta property="og:description" content="Want to see the exact $$ you're leaving without an app? Our 2-min self-serve calculator shows your revenue potential from improved customer retention.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://topthcabrands.com/resources/retention-calculator">
  <meta property="og:image" content="https://topthcabrands.com/og-image.png">
  <meta property="og:image:secure_url" content="https://topthcabrands.com/og-image.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Top THCA Brands">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Dispensary Retention Calculator">
  <meta name="twitter:description" content="Calculate your revenue potential from improved customer retention. Free 2-minute calculator.">
  <meta name="twitter:image" content="https://topthcabrands.com/og-image.png">
  
  <link rel="canonical" href="https://topthcabrands.com/resources/retention-calculator">
</head>
<body>
  <h1>Dispensary Retention Calculator</h1>
  <p>Calculate how much revenue you're leaving on the table without a customer retention app.</p>
  <p>Free 2-minute calculator to project your retention lift and extra profit.</p>
</body>
</html>`;
    
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
  
  // For regular users, continue with normal request (will serve React app)
  return new Response(null, {
    status: 200
  });
};

