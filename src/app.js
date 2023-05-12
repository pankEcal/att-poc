const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const fileUploadRouter = require("./routes/fileupload/fileUpload.router");
const dailyMoniterRouter = require("./routes/dailymonitor/dailymonitor.router");
const hardcodedRequestsRoute = require("./routes/hardcoded/hardcoded.router");

// defining CORS parameters
let corsOptions = {
	origin: "*",
};

const app = express();

// implementing middlewares
app.use(cors(corsOptions));
app.use(bodyParser.json());

/* Implementing dedicated routes */
app.use("/fileupload", fileUploadRouter);
app.use("/dailymonitor", dailyMoniterRouter);
app.use("/hardcoded", hardcodedRequestsRoute);

app.get("/", (req, res) => {
	return res.status(200).json({
		status: "running",
		message: "Hi, I'm ATT. Please follow documentation to get more info",
	});
});

module.exports = app;
