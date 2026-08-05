const Service = require("../models/Service");
const Project = require("../models/Project");
const Blog = require("../models/Blog");
const Contact = require("../models/Contact");
const { sendContactNotification } = require("../utils/email");

const render = (view, title) => (req, res, next) => {
  try {
    res.render(view, { title });
  } catch (error) {
    next(error);
  }
};

exports.home = async (req, res, next) => {
  try {
    const [services, projects] = await Promise.all([
      Service.find().sort("order").limit(6),
      Project.find({ featured: true }).limit(3),
    ]);
    res.render("home", {
      title: "Modern Digital Solutions",
      services,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

exports.about = render("about", "About Vertex Web");
exports.pricing = render("pricing", "Pricing");
exports.faq = render("faq", "Frequently Asked Questions");
exports.privacy = render("privacy", "Privacy Policy");
exports.terms = render("terms", "Terms & Conditions");

exports.services = async (req, res, next) => {
  try {
    res.render("services", {
      title: "Services",
      services: await Service.find().sort("order"),
    });
  } catch (error) {
    next(error);
  }
};

exports.portfolio = async (req, res, next) => {
  try {
    res.render("portfolio", {
      title: "Demo Projects",
      projects: await Project.find().sort("-createdAt"),
    });
  } catch (error) {
    next(error);
  }
};

exports.blog = async (req, res, next) => {
  try {
    res.render("blog", {
      title: "Insights",
      blogs: await Blog.find({ published: true }).sort("-createdAt"),
    });
  } catch (error) {
    next(error);
  }
};

exports.contact = (req, res, next) => {
  try {
    res.render("contact", {
      title: "Contact Us",
      form: {},
      error: null,
      success: null,
      mapEmbedUrl: process.env.MAP_EMBED_URL || "https://www.google.com/maps?q=Vertex+Web&output=embed",
    });
  } catch (error) {
    next(error);
  }
};

exports.submitContact = async (req, res, next) => {
  const { name, email, phone, subject, message } = req.body;
  const page = (status, error = null, success = null) =>
    res.status(status).render("contact", {
      title: "Contact Us",
      form: req.body,
      error,
      success,
      mapEmbedUrl: process.env.MAP_EMBED_URL || "https://www.google.com/maps?q=Vertex+Web&output=embed",
    });

  try {
    if (!name || !email || !subject || !message) {
      return page(422, "Please complete all required fields.");
    }
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });
    await sendContactNotification(contact);
    return page(
      200,
      null,
      "Thanks—your message has been sent. We will get back to you soon.",
    );
  } catch (error) {
    if (error.name === "ValidationError")
      return page(422, "Please provide valid contact details.");
    if (error.code === "EMAIL_DELIVERY_FAILED") {
      return page(
        503,
        `${error.message} Your message was saved in the admin inbox.`,
      );
    }
    next(error);
  }
};
