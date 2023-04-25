const axios = require("axios");

async function makeHttpReq(req) {
	if (!Boolean(Object.keys(req.body).length)) {
		return {
			status: false,
			message: "missing required input data",
		};
	}

	const {
		body: { baseUrl, apiLink, ...rest },
		file,
	} = req;

	if (!baseUrl || !apiLink) {
		return {
			status: false,
			message: "URL input invalid or incomplete",
		};
	}

	if (req.file) {
		console.log(req.file);
	}

	try {
		const { data } = await axios.post(baseUrl + apiLink, rest);
		console.log(data);
		return data;
	} catch (error) {
		console.log(error);
		return error;
	}
}

async function httpGeStaticRequest(req, res) {
	const serverResponse = await makeHttpReq(req);

	return res.json({
		serverResponse,
	});
}

module.exports = { httpGeStaticRequest };
