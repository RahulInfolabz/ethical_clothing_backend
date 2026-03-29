const multer = require("multer");
const path = require("path");

const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/categories"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

const itemStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/items"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/profiles"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (isValid) { cb(null, true); }
  else { cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)")); }
};

const categoryUpload = multer({ storage: categoryStorage, fileFilter: imageFilter });
const itemUpload = multer({ storage: itemStorage, fileFilter: imageFilter });
const profileUpload = multer({ storage: profileStorage, fileFilter: imageFilter });

module.exports = { categoryUpload, itemUpload, profileUpload };
