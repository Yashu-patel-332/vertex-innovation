const router = require("express").Router(),
  c = require("../controllers/adminController"),
  { protect } = require("../middlewares/authMiddleware"),
  {
  upload,
  uploadToCloudinary,
} = require("../middlewares/uploadMiddleware");

router.get("/login", c.loginPage);
router.post("/login", c.login);
router.post("/logout", protect, c.logout);
router.get("/", protect, c.dashboard);
router.get("/settings", protect, c.settings);
["services", "projects", "blogs"].forEach((type) => {
  router.get(`/${type}`, protect, c.list(type));
  router.post(`/${type}`, protect,upload, uploadToCloudinary, c.create(type));
  router.post(`/${type}/:id`, protect,upload, uploadToCloudinary, c.update(type));
  router.post(`/${type}/:id/delete`, protect, c.remove(type));
});
router.get("/contacts", protect, c.contacts);
router.post("/contacts/:id", protect, c.contactStatus);


module.exports = router;
