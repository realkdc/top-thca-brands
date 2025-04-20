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

async function generateSitemap() {
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

  // Write unformatted sitemap first (in case prettier fails)
  fs.writeFileSync(
    path.join(__dirname, '../public/sitemap.xml'),
    sitemap
  );

  try {
    // Try to format with prettier
    const prettierConfig = await prettier.resolveConfig(process.cwd());
    const formattedSitemap = await prettier.format(sitemap, {
      ...prettierConfig,
      parser: 'html',
      printWidth: 100
    });

    // Write the formatted sitemap
    fs.writeFileSync(
      path.join(__dirname, '../public/sitemap.xml'),
      formattedSitemap
    );
  } catch (error) {
    console.error('Error formatting sitemap with prettier:', error);
    // We already wrote the unformatted version as a fallback
  }

  console.log('Sitemap generated successfully!');
}

generateSitemap().catch(error => {
  console.error('Error generating sitemap:', error);
  process.exit(1);
}); 