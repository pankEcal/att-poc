const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const { trim_body } = require("request_trimmer");

// swagger related configs
const swaggerUi = require("swagger-ui-express");
const YAML = require("yaml");
const file = fs.readFileSync(
	path.join(__dirname, "./", "documentation.yaml"),
	"utf8"
);
const swaggerDocument = YAML.parse(file);
const options = {
	customCss: ".swagger-ui .topbar { display: none }",
};

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
app.use(trim_body);

/* Implementing dedicated routes */
app.use("/fileupload", fileUploadRouter);
app.use("/dailymonitor", dailyMoniterRouter);
app.use("/hardcoded", hardcodedRequestsRoute);
app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerDocument, options)
);

app.get("/", (req, res) => {
	return res.status(200).json({
		status: "running",
		message: "Hi, I'm ATT. Please follow documentation to get more info",
	});
});

module.exports = app;
