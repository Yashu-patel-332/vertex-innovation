const mongoose = require("mongoose");
module.exports = mongoose.model(
  "Service",
  new mongoose.Schema(
    {
      title: { type: String, required: true, trim: true },
      description: { type: String, required: true, trim: true },
      icon: { type: String, default: "code" },
      featured: { type: Boolean, default: false },
      order: { type: Number, default: 0 },
    },
    { timestamps: true },
  ),
);
