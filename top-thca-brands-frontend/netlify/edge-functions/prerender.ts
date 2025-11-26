// Netlify Edge Function to serve pre-rendered HTML for crawlers
// This ensures Instagram, Facebook, and other crawlers see proper meta tags

// Only serve static HTML to actual preview crawlers, not in-app browsers
// Instagram's in-app browser includes "Instagram" but is a real browser
const PREVIEW_CRAWLER_PATTERNS = [
  'facebookexternalhit',  // Facebook/Instagram link preview crawler
  'Facebot',              // Facebook bot
  'Twitterbot',           // Twitter preview crawler
  'LinkedInBot',          // LinkedIn preview crawler
  'WhatsApp',             // WhatsApp preview crawler (not in-app browser)
  'Slackbot',             // Slack preview crawler
  'Pinterest',            // Pinterest preview crawler
];

function isCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  
  // Check for specific preview crawlers first
  const isPreviewCrawler = PREVIEW_CRAWLER_PATTERNS.some(pattern => 
    ua.includes(pattern.toLowerCase())
  );
  
  if (isPreviewCrawler) {
    return true;
  }
  
  // Instagram's in-app browser includes "Instagram" but is a real browser
  // It will have browser identifiers like Safari, WebKit, Mobile, etc.
  // Only treat as crawler if it's clearly a bot without browser identifiers
  const hasBrowserIdentifiers = ua.includes('safari') || 
                                 ua.includes('chrome') || 
                                 ua.includes('webkit') ||
                                 ua.includes('mobile') ||
                                 ua.includes('mozilla');
  
  // If it has browser identifiers, it's a real browser (even if it mentions Instagram)
  if (hasBrowserIdentifiers) {
    return false;
  }
  
  // Check for generic bot patterns only if no browser identifiers
  const genericBotPatterns = ['bot', 'crawler', 'spider', 'crawling'];
  return genericBotPatterns.some(pattern => ua.includes(pattern));
}

function getPrerenderedHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dispensary Retention Calculator - Top THCA Brands</title>
  <meta name="description" content="Calculate how much revenue you're leaving on the table without a customer retention app. Free 2-minute calculator to project your retention lift and extra profit.">
  <meta name="keywords" content="dispensary retention calculator, customer retention, repeat customers, dispensary revenue calculator, customer retention app">
  
  <!-- Open Graph / Facebook / Instagram -->
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
  
  <!-- Redirect browsers to the React app -->
  <script>
    // Only redirect if this is a real browser (not a crawler)
    var ua = navigator.userAgent;
    var isBot = /bot|crawler|spider|crawling|facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|Slackbot|Instagram|Pinterest/i.test(ua);
    if (!isBot) {
      window.location.replace('/resources/retention-calculator');
    }
  </script>
</head>
<body>
  <h1>Dispensary Retention Calculator</h1>
  <p>Calculate how much revenue you're leaving on the table without a customer retention app.</p>
  <p>Free 2-minute calculator to project your retention lift and extra profit.</p>
  <p><a href="https://topthcabrands.com/resources/retention-calculator">Use the calculator</a></p>
</body>
</html>`;
}

export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Only handle the retention calculator route
  if (path !== '/resources/retention-calculator') {
    return context.next(); // Let the request pass through
  }
  
  const userAgent = request.headers.get('user-agent') || '';
  
  // If it's a crawler, serve pre-rendered HTML
  if (isCrawler(userAgent)) {
    return new Response(getPrerenderedHTML(), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
  
  // For regular browsers, forward to the React app
  return context.next();
};

