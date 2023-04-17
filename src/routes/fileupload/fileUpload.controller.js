const axios = require("axios");
const path = require("path");
const fs = require("fs");
const { parse } = require("csv-parse");

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
		const res = await axios.post(uploadUrl, {
			devID: deviceId,
			csvfile,
		});

		const {
			status,
			statusText,
			headers: { date },
			request: { method },
			data: { json, url },
		} = res;

		let responseData = {
			statusCode: status,
			statusMessage: statusText,
			method: method,
			date: date,
			requestUrl: url,
			data: json,
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
			fs.unlink(csvfilePath, (error) => {
				console.log(
					!error ? "csv file unlinked!" : "error unlinking csv file" + error
				);
			});
			fs.unlink(deviceIdFilePath, (error) => {
				console.log(
					!error
						? "device id file unlinked!"
						: "error unlinking device id file" + error
				);
			});
		}
	});
}

// get device ID from the csv file
function getDeviceId() {
	const deviceIdFilePath = path.join(
		__dirname,
		"../../../public/uploads",
		"deviceid.txt"
	);

	fs.writeFileSync(deviceIdFilePath, "", (err) => {
		console.log(err ? err : "deviceid.txt file created");
	});

	fs.createReadStream(
		path.join(__dirname, "../../../public/uploads", "csvfile.csv")
	)
		.pipe(parse({ delimiter: ",", from_line: 2, toLine: 2 }))
		.on("data", function (row) {
			fs.writeFileSync(deviceIdFilePath, row[0]);
		})
		.on("error", function (error) {
			console.log(error.message);
		});

	try {
		const deviceId = fs.readFileSync(deviceIdFilePath, "utf-8");
		return deviceId;
	} catch (error) {
		console.log("error getting deviceId", error);
	}
}

function handlefilupload(req, res) {
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

	const deviceId = getDeviceId();

	makePostReq(uploadUrl, file, deviceId).then((response) => {
		unlinkFiles();
		return res.status(200).json(response);
	});
}

module.exports = { httpGetRoutes, handlefilupload };
