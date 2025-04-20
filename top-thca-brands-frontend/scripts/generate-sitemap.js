const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

// Define your site URLs here
const SITE_URLS = [
  {
    url: 'https://topthcabrands.com/',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 1.0
  },
  // Add more URLs as your site grows
];

// Add any dynamic routes here (if you add a blog later, etc.)
function addDynamicRoutes() {
  // This function can be expanded later to read blog posts or other dynamic content
  // For now, we're just using the static URLs
  return SITE_URLS;
}

function generateSitemap() {
  const allUrls = addDynamicRoutes();

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(({ url, lastmod, changefreq, priority }) => {
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  // Format XML with prettier
  const formattedSitemap = prettier.format(sitemap, {
    parser: 'html',
    printWidth: 100
  });

  // Write sitemap to public directory
  fs.writeFileSync(
    path.join(__dirname, '../public/sitemap.xml'),
    formattedSitemap
  );

  console.log('Sitemap generated successfully!');
}

generateSitemap(); 