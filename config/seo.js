// config/seo.js
// ---------------------------------------------------------------------------
// CHANGE LOG:
//  - NEW FILE: Single source of truth for SEO, site identity and Google
//    integration configuration.
//  - Every public route is mapped to a UNIQUE title + meta description so no
//    two pages share duplicate metadata (important for Google Search).
//  - Keys are used to build canonical URLs, Open Graph, Twitter cards and
//    JSON-LD structured data in the EJS partials.
//  - Values can be overridden with environment variables at deploy time.
// ---------------------------------------------------------------------------

// Base production URL. Defaults to the Render URL already used in the
// contact form redirect. Override with SITE_URL in production.
const SITE_URL = (
  process.env.SITE_URL || "https://vertex-innovation.onrender.com"
).replace(/\/+$/, "");

const site = {
  name: "Vertex Innovations Labs",
  legalName: "Vertex Innovations Labs (Vertex Web)",
  url: SITE_URL,
  // Default SEO description used whenever a page does not override it.
  description:
    "Vertex Web crafts modern websites, web applications and digital solutions for ambitious businesses and startups.",
  // Meta keywords are optional for Google but kept for completeness.
  keywords:
    "web development, website design, web application development, MERN stack, Node.js, Express, MongoDB, digital solutions, Vertex Web",
  // Open Graph / social share image (currently the logo).
  // TIP: replace with a real 1200x630 PNG/JPG at public/images/og-cover.jpg
  ogImage: `${SITE_URL}/images/logo.jpeg`,
  locale: "en_IN",
  lang: "en",
  themeColor: "#0f172a",
  email: process.env.CONTACT_TO_EMAIL || "vertexinnovations.labs@gmail.com",
  phone: process.env.CONTACT_PHONE || "+918849763587",
  whatsapp: process.env.WHATSAPP_NUMBER || "918849763587",
  instagram: "https://www.instagram.com/vertexinnovations.labs",
};

// Defaults merged into every response's `res.locals.seo`.
const defaults = {
  title: `${site.name} | Websites, Web Applications & Digital Solutions`,
  description: site.description,
  keywords: site.keywords,
};

// Per-route metadata. Keys MUST match the exact Express route paths.
const pages = {
  "/": {
    title: "Vertex Web | Websites, Web Applications & Digital Solutions",
    description:
      "Vertex Web crafts fast, secure and memorable websites and web applications for ambitious businesses and startups.",
    type: "website",
  },
  "/about": {
    title: "About Vertex Web | Vertex Innovations Labs",
    description:
      "Learn about Vertex Innovations Labs, an independent software team building modern, fast and accessible web experiences.",
  },
  "/services": {
    title: "Web Design & Development Services | Vertex Web",
    description:
      "Explore our services: website development, MERN stack apps, landing pages, REST APIs, redesign, maintenance and deployment.",
  },
  "/portfolio": {
    title: "Portfolio & Demo Projects | Vertex Web",
    description:
      "A showcase of polished demo projects and concepts built by Vertex Web for clarity, performance and conversion.",
  },
  "/pricing": {
    title: "Pricing & Engagement Models | Vertex Web",
    description:
      "Flexible starting points for websites and web applications. Get a tailored proposal after we learn about your project.",
  },
  "/faq": {
    title: "Frequently Asked Questions | Vertex Web",
    description:
      "Answers to common questions about projects, mobile responsiveness, maintenance, hosting and how to start with Vertex Web.",
  },
  "/blog": {
    title: "Insights & Articles | Vertex Web",
    description:
      "Practical notes on website development, web applications and digital product work from the Vertex Web team.",
  },
  "/contact": {
    title: "Contact Vertex Web | Start Your Project",
    description:
      "Contact Vertex Innovations Labs to discuss your website or web application project. We reply as soon as we can.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Vertex Web",
    description:
      "Read the Privacy Policy of Vertex Innovations Labs covering the data collected through our contact form and website.",
  },
  "/terms-conditions": {
    title: "Terms & Conditions | Vertex Web",
    description:
      "The Terms & Conditions governing the use of the Vertex Innovations Labs website and project engagements.",
  },
};

module.exports = { site, defaults, pages, SITE_URL };