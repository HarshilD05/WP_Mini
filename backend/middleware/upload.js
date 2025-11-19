const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb){
        const ext = path.extname(file.originalname);
        cb(null, Date.now()+ext);
    }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG/PNG images allowed"), false);
  }
};

module.exports = multer({
  storage: storage,
  fileFilter: fileFilter,
});