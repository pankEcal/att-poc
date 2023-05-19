const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
	httpGetRoutes,
	handlefilupload,
} = require("../fileupload/fileUpload.controller");

// storage realted config to manage file uploads
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		const fileUploadPath = path.join(__dirname, "../../../", "public/uploads");

		// if the directory doesn't exist then create it
		if (!fs.existsSync(fileUploadPath)) {
			fs.mkdirSync(fileUploadPath, { recursive: true }, (error) => {
				if (error) console.log(error);
			});
		}

		callback(null, fileUploadPath);
	},
	filename: (req, file, callback) => {
		const fileExtension = file.originalname.split(".")[1];
		callback(null, `uploadedFile.${fileExtension}`);
	},
});

// managing file upload
const upload = multer({ storage });

const fileUploadRouter = express.Router();

fileUploadRouter.get("/", httpGetRoutes);

fileUploadRouter.post("/", upload.single("csvfile"), handlefilupload);

module.exports = fileUploadRouter;
