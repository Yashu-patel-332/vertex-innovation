require('dotenv').config();

console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("CONTACT_TO_EMAIL:", process.env.CONTACT_TO_EMAIL);


const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const dns = require("dns")

dns.setServers(["1.1.1.1", "8.8.8.8"])


connectDB();
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: process.env.SESSION_SECRET || 'change-me-in-production', resave: false, saveUninitialized: false, store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vertex-web' }), cookie: { maxAge: 1000 * 60 * 60 * 8, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' } }));
app.use((req, res, next) => { res.locals.currentPath = req.path; res.locals.admin = req.session.admin || null; res.locals.year = new Date().getFullYear(); res.locals.mapEmbedUrl = process.env.MAP_EMBED_URL || 'https://www.google.com/maps?q=Vertex+Web&output=embed'; next(); });
app.use('/contact', rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false }));
app.use('/', require('./routes/siteRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use(notFound);
app.use(errorHandler);
const port = process.env.PORT || 5000;
app.listen(port, () =>
    console.log(`Vertex Web running on port http://localhost:${port}`

    ));
