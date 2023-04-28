const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const fileUploadRouter = require("./routes/fileupload/fileUpload.router");
const dailyMoniterRouter = require("./routes/dailymonitor/dailymonitor.router");
const staticRequestsRouter = require("./routes/staticrequests/staticrequests.router");

let corsOptions = {
	origin: "*",
};

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());

/* Implementing routes */
app.use("/fileupload", fileUploadRouter);
app.use("/dailymonitor", dailyMoniterRouter);
app.use("/hardcoded", staticRequestsRouter);

app.get("/", (req, res) => {
	return res.status(200).json({
		status: "running",
		message: "Hi, I'm ATT. Please follow documentation to get more info",
	});
});

module.exports = app;
