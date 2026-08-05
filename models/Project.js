const mongoose = require("mongoose");
module.exports = mongoose.model(
  "Project",
  new mongoose.Schema(
    {
      title: { type: String, required: true, trim: true },
      description: { type: String, required: true },
      technologies: [{ type: String, trim: true }],
      image: String,
      demoUrl: String,
      githubUrl: String,
      category: { type: String, default: "Demo Project" },
      featured: { type: Boolean, default: false },
    },
    { timestamps: true },
  ),
);
