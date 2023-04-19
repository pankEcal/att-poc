const express = require("express");
const bodyParser = require("body-parser");

const fileUploadRouter = require("./routes/fileupload/fileUpload.router");
const dailyMoniterRouter = require("./routes/dailymonitor/dailymonitor.router");

const app = express();

app.use(bodyParser.json());

/* Implementing routes */
app.use("/fileupload", fileUploadRouter);
app.use("/dailymonitor", dailyMoniterRouter);

module.exports = app;
