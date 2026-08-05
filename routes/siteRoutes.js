const router = require("express").Router();

const c = require("../controllers/siteController");

router.get("/", c.home);
router.get("/about", c.about);
router.get("/services", c.services);
router.get("/portfolio", c.portfolio);
router.get("/pricing", c.pricing);
router.get("/faq", c.faq);
router.get("/blog", c.blog);
router.get("/contact", c.contact);
router.post("/contact", c.submitContact);
router.get("/privacy-policy", c.privacy);
router.get("/terms-conditions", c.terms);
module.exports = router;
