const User = require("../models/User"),
  Service = require("../models/Service"),
  Project = require("../models/Project"),
  Blog = require("../models/Blog"),
  Contact = require("../models/Contact");
const safe = (s = "") =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

exports.loginPage = (req, res) =>
  res.render("admin/login", { title: "Admin Login", error: null });


exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase() });
    if (!user || !(await user.matchPassword(req.body.password)))
      return res
        .status(401)
        .render("admin/login", {
          title: "Admin Login",
          error: "Invalid email or password.",
        });
    req.session.admin = { id: user._id, name: user.name, email: user.email };
    res.redirect("/admin");
  } catch (e) {
    next(e);
  }
};

exports.logout = (req, res, next) =>
  req.session.destroy((e) => (e ? next(e) : res.redirect("/admin/login")));


exports.dashboard = async (req, res, next) => {
  try {
    const [services, projects, blogs, contacts, recent] = await Promise.all([
      Service.countDocuments(),
      Project.countDocuments(),
      Blog.countDocuments(),
      Contact.countDocuments(),
      Contact.find().sort("-createdAt").limit(5),
    ]);
    res.render("admin/dashboard", {
      title: "Dashboard",
      counts: { services, projects, blogs, contacts },
      recent,
    });
  } catch (e) {
    next(e);
  }
};
const configs = {
  services: {
    Model: Service,
    label: "Service",
    fields: ["title", "description", "icon", "order"],
    view: "admin/manage-services",
  },
  projects: {
    Model: Project,
    label: "Project",
    fields: [
      "title",
      "description",
      "technologies",
      "demoUrl",
      "githubUrl",
      "category",
    ],
    view: "admin/manage-projects",
  },
  blogs: {
    Model: Blog,
    label: "Post",
    fields: ["title", "excerpt", "content"],
    view: "admin/manage-blogs",
  },
};


exports.list = (type) => async (req, res, next) => {
  try {
    const c = configs[type];
    res.render(c.view, {
      title: `Manage ${type}`,
      items: await c.Model.find().sort("-createdAt"),
      type,
    });
  } catch (e) {
    next(e);
  }
};


exports.create = (type) => async (req, res, next) => {

    
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const c = configs[type],
      data = {};
    c.fields.forEach((f) => (data[f] = req.body[f]));
    if (type === "projects") {
      data.technologies = (req.body.technologies || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      data.featured = !!req.body.featured;
    }
    if (type === "services") {
      data.featured = !!req.body.featured;
      data.order = Number(data.order) || 0;
    }
    if (type === "blogs") {
      data.published = !!req.body.published;
      data.slug = safe(data.title);
    }
    if (req.file && req.file.cloudinary) {
       data.image = req.file.cloudinary.url;
}
    await c.Model.create(data);
    res.redirect(`/admin/${type}`);
  } catch (e) {
    next(e);
  }
};


exports.update = (type) => async (req, res, next) => {
  try {
    const c = configs[type],
      data = {};
    c.fields.forEach((f) => (data[f] = req.body[f]));
    if (type === "projects") {
      data.technologies = (req.body.technologies || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      data.featured = !!req.body.featured;
    }
    if (type === "services") {
      data.featured = !!req.body.featured;
      data.order = Number(data.order) || 0;
    }
    if (type === "blogs") {
      data.published = !!req.body.published;
      data.slug = safe(data.title);
    }
    if (req.file && req.file.cloudinary) {
  data.image = req.file.cloudinary.url;
}
    await c.Model.findByIdAndUpdate(req.params.id, data, {
      runValidators: true,
    });
    res.redirect(`/admin/${type}`);
  } catch (e) {
    next(e);
  }
};


exports.remove = (type) => async (req, res, next) => {
  try {
    await configs[type].Model.findByIdAndDelete(req.params.id);
    res.redirect(`/admin/${type}`);
  } catch (e) {
    next(e);
  }
};


exports.contacts = async (req, res, next) => {
  try {
    res.render("admin/contacts", {
      title: "Contact Messages",
      items: await Contact.find().sort("-createdAt"),
    });
  } catch (e) {
    next(e);
  }
};


exports.contactStatus = async (req, res, next) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.redirect("/admin/contacts");
  } catch (e) {
    next(e);
  }
};


exports.settings = (req, res) =>
  res.render("admin/settings", { title: "Settings" });
