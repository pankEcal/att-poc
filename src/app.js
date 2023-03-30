const express = require("express");
const expressFileUpload = require("express-fileupload");

const fileUploadRoute = require("./routes/fileupload/fileUpload.router");

const app = express();

/* Implementing middlewares */
app.use(expressFileUpload()); // express file uploader
app.use(express.json()); // JSON body parser

/* Implementing routes */
app.use("/fileupload", fileUploadRoute);

module.exports = app;
