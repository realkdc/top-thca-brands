// Netlify serverless function to serve pre-rendered HTML with meta tags for social media crawlers
exports.handler = async (event, context) => {
  const userAgent = event.headers['user-agent'] || event.headers['User-Agent'] || '';
  
  // List of known crawler user agents (Instagram uses facebookexternalhit)
  const crawlers = [
    'facebookexternalhit',
    'Facebot',
    'Twitterbot',
    'LinkedInBot',
    'WhatsApp',
    'Slackbot',
    'Instagram',
    'Pinterest'
  ];
  
  // Check if the request is from a crawler
  const isCrawler = crawlers.some(crawler => 
    userAgent.toLowerCase().includes(crawler.toLowerCase())
  );
  
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
  
  // For browsers (not crawlers), return 404 so Netlify falls through to catch-all redirect
  // With force=false in netlify.toml, a 404 from the function should cause
  // Netlify to skip this redirect rule and use the catch-all (/* -> /index.html)
  return {
    statusCode: 404,
    headers: {
      'Content-Type': 'text/plain'
    },
    body: 'Not found'
  };
};
