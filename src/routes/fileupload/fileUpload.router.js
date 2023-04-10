const express = require("express");
const multer = require("multer");
const path = require("path");

const {
	httpGetRoutes,
	httpUploadFile,
	handlefilupload,
} = require("../fileupload/fileUpload.controller");

// storage realted config to manage file uploads
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, path.join(__dirname, "../../../", "public/uploads"));
	},
	filename: (req, file, callback) => {
		callback(null, "csvfile.csv");
	},
});

// managing file upload
const upload = multer({ storage });

const fileUploadRouter = express.Router();

fileUploadRouter.get("/", httpGetRoutes);

fileUploadRouter.post("/", httpUploadFile);

fileUploadRouter.post("/test1", upload.single("csvfile"), handlefilupload);

module.exports = fileUploadRouter;
