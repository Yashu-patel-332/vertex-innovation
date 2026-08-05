const mongoose = require('mongoose');

module.exports = mongoose.model('Blog', new mongoose.Schema(
    {
        title:
        {
            type: String,
            required: true,
            trim: true
        },
        excerpt:
        {
            type: String,
            required: true
        },
        content:
        {
            type: String,
            required: true
        },
        image: String,
        published:
        {
            type: Boolean,
            default: false
        },
        slug:
        {
            type: String,
            unique: true,
            sparse: true
        }
    }, { timestamps: true }));
