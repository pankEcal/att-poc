const express = require("express");
const multer = require("multer");

const {
	httpGetIndividualRes,
	httpGetApplicationRes,
} = require("./hardcoded.controller");
const { multerStorageConfig } = require("../../utils/multerConfig");

const hardcodedRequestsRoute = express.Router(); // create a express router

const storage = multerStorageConfig(); // get configurations related to multer file uploads
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
