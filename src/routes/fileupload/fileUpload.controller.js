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
		file,
	} = request;

	return Boolean(file) && Boolean(uploadUrl) ? true : false;
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
		// const res = await axios({
		// 	method: "post",
		// 	url: uploadUrl,
		// 	data: {
		// 		csvfile: csvfile,
		// 	},
		// });

		const res = await axios.post(uploadUrl, { csvfile });

		const {
			status,
			statusText,
			headers: { date },
			request: { method },
			data: { data },
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

function handlefilupload(req, res) {
	const isValid = isValidReqData(req);

	if (!isValid) {
		return res.status(400).json({
			error: "Missing valid data!",
			isValidReqData: isValid,
		});
	}

	const {
		body: { uploadUrl },
		file,
	} = req;

	makePostReq(uploadUrl, file).then((response) => {
		return res.status(200).json(response);
	});

	// return res.status(201).json({
	// 	status: "OK",
	// });
}

module.exports = { httpGetRoutes, httpUploadFile, handlefilupload };
