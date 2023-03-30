const axios = require("axios");

function httpGetRoutes(req, res) {
	res.status(200).json({
		status: "API is working fine",
	});
}

// method to verify if request has expected data value or not
function isValidReqData(request) {
	const {
		body: { uploadUrl },
		files,
	} = request;
	return Boolean(files) && Boolean(uploadUrl) ? true : false;
}

// make POST request with uploaded file
async function makeHttpReq(uploadUrl) {
	try {
		const response = await axios.get(uploadUrl);
		const {
			headers: { date },
			request: {
				method,
				res: { statusCode, statusMessage },
			},
			data,
		} = response;

		let responseData = {
			statusCode: statusCode,
			statusMessage: statusMessage,
			method: method,
			date: date,
			data: data,
		};

		return responseData;
	} catch (error) {
		console.error(error);
	}
}

// make http POST request with uploaded file
async function makePostReq(uploadUrl, csvfile) {
	try {
		const res = await axios({
			method: "post",
			url: uploadUrl,
			data: {
				"key 1": "val 1",
				"key 2": "val 2",
				"key 3": "val 3",
			},
		});

		const {
			status,
			statusText,
			headers: { date },
			request: { method },
			data,
		} = res;

		let responseData = {
			statusCode: status,
			statusMessage: statusText,
			method: method,
			date: date,
			data: data,
		};

		return responseData;
	} catch (error) {
		console.log("error: ");
	}
}

// main method to handle POST request
function httpUploadFile(req, res) {
	const isValid = isValidReqData(req);

	if (!isValid) {
		return res.status(400).json({
			error: "Missing valid data!",
			isValidReqData: isValid,
		});
	}

	const {
		body: { uploadUrl },
		files: { csvfile },
	} = req;

	// makeHttpReq(req.body.uploadUrl).then((response) => {
	// 	return res.status(200).json(response);
	// });

	makePostReq(uploadUrl, csvfile).then((response) => {
		return res.status(200).json(response);
	});
}

module.exports = { httpGetRoutes, httpUploadFile };
