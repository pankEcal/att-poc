const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
	httpGetIndividualRes,
	httpGetApplicationRes,
} = require("./hardcoded.controller");

const hardcodedRequestsRoute = express.Router(); // create a express router

// handling file upload parameters
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		const fileUploadPath = path.join(__dirname, "../../../", "public/uploads");

		// if file upload path doesn't exist then create it
		if (!fs.existsSync(fileUploadPath)) {
			fs.mkdirSync(fileUploadPath, { recursive: true }, (error) => {
				if (error) console.log(error);
			});
		}

		callback(null, fileUploadPath);
	},

	// updating the file name to uploadedFile.<format>
	filename: (req, file, callback) => {
		const fileExtension = file.originalname.split(".")[1];
		callback(null, `uploadedFile.${fileExtension}`);
	},
});

const upload = multer({ storage });

// handle individual URL requests
hardcodedRequestsRoute.post(
	"/",
	upload.single("csvfile"), // in req.file it will have key "csvfile" which points to the uploaded file
	httpGetIndividualRes
);

// making batch request based on application requests, not handling file uploads
hardcodedRequestsRoute.post("/application", httpGetApplicationRes);

module.exports = hardcodedRequestsRoute;
