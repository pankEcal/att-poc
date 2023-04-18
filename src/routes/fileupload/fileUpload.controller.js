const axios = require("axios");
const path = require("path");
const fs = require("fs");
const { parse } = require("csv-parse");
const FormData = require("form-data");

function httpGetRoutes(req, res) {
	res.status(200).json({
		status: "API is working fine",
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
		let formDataInfo = new FormData();
		formDataInfo.append("devID", deviceId);
		formDataInfo.append("csvfile", fs.createReadStream(csvfile.path));

		const res = await axios.post(uploadUrl, formDataInfo);

		const {
			status,
			statusText,
			headers: { date },
			request: {
				method,
				res: { responseUrl },
			},
			data,
		} = res;

		let responseData = {
			statusCode: status,
			statusMessage: statusText,
			method: method,
			requestUrl: responseUrl,
			deviceId: deviceId,
			date: date,
			data: data,
		};

		return responseData;
	} catch (error) {
		const {
			response: {
				status,
				statusText,
				headers: { date },
			},
			request: { method },
			config: { data },
		} = error;

		const errorResData = {
			statusCode: status,
			statusMessage: statusText,
			method: method,
			date: date,
			data: data,
		};

		return errorResData;
	}
}

// method to remove the uploaded files from client side
function unlinkFiles() {
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
			error: "Missing required input data!",
			isValidReqData: isValid,
		});
	}

	const {
		body: { uploadUrl },
		file,
	} = req;

	const deviceId = await getDeviceId();

	makePostReq(uploadUrl, file, deviceId).then((response) => {
		unlinkFiles();
		return res.status(response.statusCode).json(response);
	});
}

module.exports = { httpGetRoutes, handlefilupload };
