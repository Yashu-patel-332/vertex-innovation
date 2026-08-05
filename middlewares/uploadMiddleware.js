// ...existing code...
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) =>
  /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only image files are allowed."));

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image"); // change field name as needed

const uploadToCloudinary = (req, res, next) => {
  if (!req.file || !req.file.buffer) return next();

  const options = {
    folder: process.env.CLOUDINARY_UPLOAD_FOLDER || "website_uploads",
    resource_type: "image",
  };

  const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
    if (error) return next(error);
    // attach Cloudinary info to req.file for downstream use
    req.file.cloudinary = {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
    next();
  });

  streamifier.createReadStream(req.file.buffer).pipe(stream);
};

module.exports = { upload, uploadToCloudinary };
// ...existing code...