const axios = require("axios");

async function makeHttpReq(req) {
	const {
		body: { baseUrl, apiLink, ...rest },
		file,
	} = req;

	try {
		const { data } = await axios.post(baseUrl + apiLink, rest);

		console.log(data);

		return data;
	} catch (error) {
		console.log(error);
	}
}

async function httpGeStaticRequest(req, res) {
	const serverResponse = await makeHttpReq(req);

	return res.json({
		serverResponse,
	});
}

module.exports = { httpGeStaticRequest };
