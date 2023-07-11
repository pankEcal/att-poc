const express = require("express");
const multer = require("multer");

const {
  httpGetRoutes,
  handlefilupload,
} = require("../fileupload/fileUpload.controller");
const { multerStorageConfig } = require("../../utils/multerConfig");

const storage = multerStorageConfig(); // get configurations related to multer file uploads
const upload = multer({ storage });

const fileUploadRouter = express.Router();

fileUploadRouter.get("/", httpGetRoutes);

fileUploadRouter.post("/", upload.single("csvfile"), handlefilupload);

module.exports = fileUploadRouter;
