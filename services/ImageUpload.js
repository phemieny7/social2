const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: "oaIOLcF3cmvBQKOVRLiC3w0BwmZBZ5pEYz3IHzRO",
  accessKeyId: "AKIAI75EXEK775XXK3FA",
  region: "us-east-2"
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("invalid file type"), false);
  }
};

const upload = multer({
  fileFilter: fileFilter,

  storage: multerS3({
    s3: s3,
    bucket: "express-react-upload",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    ContentDisposition: "inline",
    acl: "public-read",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: "TEST" });
    },
    key: function(req, file, cb) {
      cb(null, file.originalname);
    }
  })
});



module.exports = upload;
