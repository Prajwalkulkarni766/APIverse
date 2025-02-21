const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/json") {
      return cb(new Error("Only JSON files are allowed"), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
