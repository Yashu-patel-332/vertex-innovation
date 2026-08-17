require("dotenv").config();

const User = require("./models/User.js");
const path = require("path");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const helmet = require("helmet");
const compression = require("compression"); // CHANGE: gzip/brotli response compression for performance
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const connectDB = require("./config/db");
const SEO = require("./config/seo"); // CHANGE: central SEO / site identity config
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const dns = require("dns");
//const { verifyEmailConnection } = require("./utils/email.js");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dns.setDefaultResultOrder("ipv4first");

connectDB();

async function createDefaultAdmin() {
  try {
    const admin = await User.findOne({
      email: "admin@vertexweb.com",
    });

    if (!admin) {
      await User.create({
        name: "Admin",
        email: "admin@vertexweb.com",
        password: "Admin@123",
        role: "admin",
      });

      console.log("✅ Default Admin Created");
    } else {
      console.log("✅ Admin Already Exists");
    }
  } catch (err) {
    console.error(err);
  }
}

createDefaultAdmin();

const app = express();

// CHANGE: Trust the proxy in production (Render) so secure cookies and
// rate-limit IP detection work correctly behind their load balancer.
app.set("trust proxy", 1);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(
  helmet({
    contentSecurityPolicy: false,
    // CHANGE: allow resources from external origins (fonts, Cloudinary, GA)
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  }),
);
// CHANGE: compress HTML/JSON/CSS/JS responses (Google treats speed as a ranking factor)
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.json({ limit: "1mb" }));
app.use(mongoSanitize());

// CHANGE: cache headers for static assets (performance).
// Specific folders get long browser caching; the generic fallback is short.
app.use(
  "/css",
  express.static(path.join(__dirname, "public", "css"), { maxAge: "30d" }),
);
app.use(
  "/js",
  express.static(path.join(__dirname, "public", "js"), { maxAge: "30d" }),
);
app.use(
  "/images",
  express.static(path.join(__dirname, "public", "images"), { maxAge: "30d" }),
);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "public", "uploads"), { maxAge: "7d" }),
);
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change-me-in-production",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/vertex-web",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 8,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  }),
);


app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.admin = req.session.admin || null;
  res.locals.year = new Date().getFullYear();
  res.locals.mapEmbedUrl =
    process.env.MAP_EMBED_URL ||
    'https://www.google.com/maps?q=Vertex+Web&output=embed';

  res.locals.web3formsKey = process.env.WEB3FORMS_ACCESS_KEY;

  // CHANGE: SEO locals — computed once here and consumed by the head partial.
  // Per-route title/description come from config/seo.js (no duplicate meta).
  const meta = SEO.pages[req.path] || {};
  res.locals.site = SEO.site;
  res.locals.seo = {
    siteName: SEO.site.name,
    title: meta.title || SEO.defaults.title,
    description: meta.description || SEO.defaults.description,
    keywords: meta.keywords || SEO.defaults.keywords,
    canonicalUrl:
      SEO.site.url + (req.path === "/" ? "" : req.path),
    ogImage: SEO.site.ogImage,
    ogType: meta.type || "website",
    locale: SEO.site.locale,
    lang: SEO.site.lang,
    themeColor: SEO.site.themeColor,
    robots:
      meta.index === false
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large",
    searchConsoleVerification: process.env.SEARCH_CONSOLE_VERIFICATION || "",
  };

  next();
});

// CHANGE: SEO endpoints (sitemap.xml + robots.txt) — mounted before site routes.
app.use("/", require("./routes/seoRoutes"));

app.use(
  "/contact",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use("/api/health", (req,res)=>{
  res.json({status:'online', provider:'Groq',models: GROQ_MODELS})
})

app.use("/", require("./routes/siteRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use(notFound);
app.use(errorHandler);
const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Vertex Web running on port http://localhost:${port}`),
);
