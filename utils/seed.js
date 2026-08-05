require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");
const Service = require("../models/Service");
const Project = require("../models/Project");
const services = [
  "Website Development",
  "Business Websites",
  "Portfolio Websites",
  "Landing Pages",
  "MERN Stack Development",
  "Frontend Development",
  "Backend Development",
  "REST API Development",
  "Database Design",
  "Website Redesign",
  "Bug Fixing",
  "Website Maintenance",
  "Deployment",
  "Performance Optimization",
].map((title, order) => ({
  title,
  order,
  icon: [
    "layout",
    "briefcase",
    "user",
    "zap",
    "layers",
    "monitor",
    "server",
    "network",
    "database",
    "refresh",
    "tool",
    "shield",
    "cloud",
    "gauge",
  ][order],
  description: `Thoughtfully engineered ${title.toLowerCase()} that is fast, responsive, secure, and built around your goals.`,
  featured: order < 6,
}));
const projects = [
  "Restaurant Website",
  "Gym Website",
  "School Website",
  "Hospital Website",
  "Travel Website",
  "Real Estate Website",
  "E-Commerce Website",
  "Portfolio Website",
  "Company Website",
  "Admin Dashboard",
].map((title, i) => ({
  title,
  category: "Demo Project",
  description: `A polished demo concept showing how a modern ${title.toLowerCase()} can be structured for clarity, performance, and conversion.`,
  technologies: ["HTML5", "CSS3", "JavaScript"],
  featured: i < 3,
}));
(async () => {
  await connectDB();
  const email = process.env.ADMIN_EMAIL || "admin@vertexweb.dev";
  if (!(await User.findOne({ email })))
    await User.create({
      name: "Vertex Web Admin",
      email,
      password: process.env.ADMIN_PASSWORD || "ChangeThisSecurePassword123!",
    });
  if (!(await Service.countDocuments())) await Service.insertMany(services);
  if (!(await Project.countDocuments())) await Project.insertMany(projects);
  console.log("Seed complete");
  process.exit();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
