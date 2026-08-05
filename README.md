# Vertex Web

Production-minded MVC website for Vertex Web, built with Node.js, Express, MongoDB, Mongoose and EJS.

## Run locally

1. Copy `.env.example` to `.env` and set secure values.
2. Start MongoDB locally or use an Atlas connection string in `MONGODB_URI`.
3. Install dependencies: `npm install`
4. Create the administrator plus requested services and demo projects: `npm run seed`
5. Start the app: `npm run dev`

Visit `http://localhost:3000`. The admin sign-in is at `/admin/login`, using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`.

## Structure

`controllers`, `models`, `routes`, `middlewares`, and `config` contain the server-side MVC layers. EJS templates are in `views`; styles and interactions are in `public`. Uploaded project/blog images are stored in `public/uploads`.

## Deployment notes

Use a managed MongoDB connection, a strong session secret, HTTPS, and a persistent upload volume or object storage for production uploads. Set `NODE_ENV=production` so secure session cookies are enabled.
