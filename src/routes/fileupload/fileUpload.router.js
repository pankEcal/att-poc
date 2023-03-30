const express = require("express");

const {
	httpGetRoutes,
	httpUploadFile,
} = require("../fileupload/fileUpload.controller");

const fileUploadRoute = express.Router();

fileUploadRoute.get("/", httpGetRoutes);

fileUploadRoute.post("/", httpUploadFile);

module.exports = fileUploadRoute;
