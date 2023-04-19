const axios = require("axios");
const path = require("path");
const fs = require("fs");
const { parse } = require("csv-parse");
const FormData = require("form-data");

function httpGetRoutes(req, res) {
	res.status(200).json({
		message: "file upload API",
	});
}

// method to verify if request has expected data value or not
function isValidReqData(request) {
	if (!request.body && !request.file) {
		return false;
	} else {
		const {
			body: { uploadUrl },
			file,
		} = request;

		return Boolean(file) && Boolean(uploadUrl);
	}
}

// make http POST request with uploaded file
async function makePostReq(uploadUrl, csvfile, deviceId) {
	try {
		const fileUploadStartTime = Date.now();
		let formDataInfo = new FormData();
		formDataInfo.append("devID", deviceId);
		formDataInfo.append("csvfile", fs.createReadStream(csvfile.path));

		const fileUploadResponse = await axios.post(uploadUrl, formDataInfo);

		const {
			statusText,
			headers: { date },
			request: {
				method,
				res: { responseUrl, statusCode },
			},
			data,
		} = fileUploadResponse;

		const fileUploadTimeTaken = Date.now() - fileUploadStartTime;

		let responseData = {
			testStatus: "passed",
			testType: "file upload",
			testDuration: `${fileUploadTimeTaken} ms`,
			url: responseUrl,
			method: method,
			date: date,
			deviceId: deviceId,
			serverResponse: { statusCode, statusText, ...data },
		};

		clearFiles();
		return responseData;
	} catch (error) {
		const {
			response: {
				statusText,
				headers: { date },
			},
			request: {
				method,
				res: { responseUrl, statusCode },
			},
		} = error;

		const errorResData = {
			testStatus: "falied",
			testType: "file upload",
			url: responseUrl,
			method: method,
			date: date,
			statusCode: statusCode,
			statusMessage: statusText,
		};

		return errorResData;
	}
}

// method to remove the uploaded files from client side
function clearFiles() {
	const uploadFilesPath = path.join(__dirname, "../../../public/uploads");

	const csvfilePath = path.join(uploadFilesPath, "csvfile.csv");
	const deviceIdFilePath = path.join(uploadFilesPath, "deviceid.txt");

	fs.access(uploadFilesPath, (error) => {
		if (!error) {
			const csvWriteStream = fs.createWriteStream(csvfilePath);
			csvWriteStream.write("");

			const devIdWriteStream = fs.createWriteStream(deviceIdFilePath);
			devIdWriteStream.write("");
		}
	});
}

// read csv file and return device ID
async function getDeviceId() {
	return new Promise((resolve, reject) => {
		const csvFilePath = path.join(
			__dirname,
			"../../../public/uploads",
			"csvfile.csv"
		);
		const deviceIdFilePath = path.join(
			__dirname,
			"../../../public/uploads",
			"deviceid.txt"
		);

		const writeStream = fs.createWriteStream(deviceIdFilePath);

		fs.createReadStream(csvFilePath)
			.pipe(parse({ delimiter: ",", from_line: 2, toLine: 2 }))
			.on("data", function (row) {
				writeStream.write(row[0], "utf8");
			})
			.on("end", function () {
				writeStream.end();
				try {
					const deviceId = fs.readFileSync(deviceIdFilePath, "utf-8");
					resolve(deviceId);
				} catch (error) {
					reject(error);
				}
			})
			.on("error", function (error) {
				reject(error);
			});
	});
}

async function handlefilupload(req, res) {
	const isValid = isValidReqData(req);

	if (!isValid) {
		return res.status(400).json({
			testStatus: "falied",
			testType: "file upload",
			message: "missing required input data",
		});
	}

	const {
		body: { uploadUrl },
		file,
	} = req;

	const deviceId = await getDeviceId();

	makePostReq(uploadUrl, file, deviceId).then((response) => {
		return res.status(response.serverResponse.statusCode).json(response);
	});
}

module.exports = { httpGetRoutes, handlefilupload };
