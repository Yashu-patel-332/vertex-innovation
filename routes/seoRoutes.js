// routes/seoRoutes.js
// ---------------------------------------------------------------------------
// CHANGE LOG:
//  - NEW FILE: Serves sitemap.xml and robots.txt dynamically so the production
//    domain (SITE_URL) is always correct without editing static files.
//  - sitemap.xml lists every public page with lastmod / changefreq / priority.
//  - robots.txt blocks /admin and /api from crawling and points to the sitemap.
//  - Both routes are mounted before the site routes in app.js.
// ---------------------------------------------------------------------------

const router = require("express").Router();
const SEO = require("../config/seo");

// Today's date, used as the sitemap lastmod for every static page.
const LAST_MOD = new Date().toISOString().slice(0, 10);

// Static public pages and their crawl hints.
const PUBLIC_PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/services", changefreq: "monthly", priority: "0.9" },
  { path: "/portfolio", changefreq: "monthly", priority: "0.7" },
  { path: "/pricing", changefreq: "monthly", priority: "0.7" },
  { path: "/faq", changefreq: "monthly", priority: "0.6" },
  { path: "/blog", changefreq: "weekly", priority: "0.7" },
  { path: "/contact", changefreq: "yearly", priority: "0.9" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms-conditions", changefreq: "yearly", priority: "0.3" },
];

// GET /sitemap.xml — XML sitemap for Google Search Console.
router.get("/sitemap.xml", (req, res) => {
  const urls = PUBLIC_PAGES.map((p) => {
    const loc = SEO.site.url + (p.path === "/" ? "" : p.path);
    return `<url><loc>${loc}</loc><lastmod>${LAST_MOD}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`;
  }).join("");

  res.type("application/xml");
  res.send(
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls +
      `\n</urlset>`,
  );
});

// GET /robots.txt — crawl rules + sitemap reference.
router.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(
    `# robots.txt for ${SEO.site.name}\n` +
      `User-agent: *\n` +
      `Allow: /\n` +
      `Disallow: /admin\n` +
      `Disallow: /api\n\n` +
      `Sitemap: ${SEO.site.url}/sitemap.xml\n`,
  );
});

module.exports = router;