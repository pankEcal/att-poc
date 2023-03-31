const express = require("express");

const {
	httpGetRoutes,
	httpUploadFile,
} = require("../fileupload/fileUpload.controller");

const fileUploadRouter = express.Router();

fileUploadRouter.get("/", httpGetRoutes);

fileUploadRouter.post("/", httpUploadFile);

module.exports = fileUploadRouter;
