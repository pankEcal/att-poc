const express = require("express");
const expressFileUpload = require("express-fileupload");

const fileUploadRouter = require("./routes/fileupload/fileUpload.router");
const dailyMoniterRouter = require("./routes/dailymonitor/dailymonitor.router");

const app = express();

/* Implementing middlewares */
app.use(expressFileUpload()); // express file uploader
app.use(express.json()); // JSON body parser

/* Implementing routes */
app.use("/fileupload", fileUploadRouter);
app.use("/dailymonitor", dailyMoniterRouter);

module.exports = app;
