const express = require("express");
const multer = require("multer");
const path = require("path");

const {
	httpGetRoutes,
	httpUploadFile,
	handlefilupload,
} = require("../fileupload/fileUpload.controller");

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, path.join(__dirname, "../../../", "public/uploads"));
	},
	filename: (req, file, callback) => {
		const { originalname } = file;
		callback(null, originalname);
	},
});
const upload = multer({ storage });

const fileUploadRouter = express.Router();

fileUploadRouter.get("/", httpGetRoutes);

fileUploadRouter.post("/", httpUploadFile);

fileUploadRouter.post("/test1", upload.single("csvfile"), handlefilupload);

module.exports = fileUploadRouter;
