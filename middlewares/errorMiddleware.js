// middlewares/errorMiddleware.js
// CHANGE LOG:
//  - 404 and 500 responses now render the existing EJS error views instead of
//    sending plain text. This keeps design + SEO tags consistent on error pages.
//  - Error pages are marked "noindex, nofollow" so Google never indexes them.
//  - Full error messages only shown in development (production hides internals).

const notFound = (req, res, next) => {
  if (res.locals.seo) {
    res.locals.seo.title = `Page Not Found | ${res.locals.seo.siteName}`;
    res.locals.seo.description = "The page you are looking for could not be found.";
    res.locals.seo.robots = "noindex, nofollow";
  }
  res
    .status(404)
    .render("errors/404", { title: "Page Not Found", path: req.path });
};

const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err);

  const status = err.statusCode || 500;
  if (res.locals.seo) {
    res.locals.seo.title = `Something Went Wrong | ${res.locals.seo.siteName}`;
    res.locals.seo.description = "An unexpected error occurred. Please try again.";
    res.locals.seo.robots = "noindex, nofollow";
  }
  res.status(status).render("errors/error", {
    title: "Something Went Wrong",
    error:
      process.env.NODE_ENV === "production"
        ? "Something went wrong. Please try again."
        : err.message || "Something went wrong",
  });
};

module.exports = {
  notFound,
  errorHandler,
};