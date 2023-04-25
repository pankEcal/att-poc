const axios = require("axios");
const path = require("path");
const fs = require("fs");

// method to remove the uploaded files from client side
async function clearFiles() {
	const uploadFilesPath = path.join(__dirname, "../../../public/uploads");

	const uploadedFilePath = path.join(
		uploadFilesPath,
		fs.readdirSync(uploadFilesPath)[0]
	);

	fs.access(uploadFilesPath, (error) => {
		if (!error) {
			const uploadedFileStrem = fs.createWriteStream(uploadedFilePath);
			uploadedFileStrem.write("");
		}
	});
}

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

	try {
		const serverResponse = await axios.post(baseUrl + apiLink, {
			...rest,
			file,
		});
		const { data, status } = serverResponse;

		clearFiles();
		return { data, status };
	} catch (error) {
		console.log(error);
		return error;
	}
}

async function httpGeStaticRequest(req, res) {
	const { data, status } = await makeHttpReq(req);

	return res.status(status).json({
		...data,
	});
}

module.exports = { httpGeStaticRequest };
