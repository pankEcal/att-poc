const express = require("express");
const multer = require("multer");

const {
	httpGetIndividualRes,
	httpGetBatchRes,
	httpGetFileUploadRes,
} = require("./v2.controller");
const { multerStorageConfig } = require("../../utils/multerConfig");

const v2Router = express.Router(); // create a express router

const storage = multerStorageConfig(); // get configurations related to multer file uploads
const upload = multer({ storage });

// handle individual URL requests
v2Router.post("/", httpGetIndividualRes);

// handle individual URL requests
v2Router.post(
	"/fileupload",
	upload.single("csvfile"), // in req.file it will have key "csvfile" which points to the uploaded file
	httpGetFileUploadRes
);

// making batch request based on application requests, not handling file uploads
v2Router.post("/batch", httpGetBatchRes);

module.exports = v2Router;
