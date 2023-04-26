const axios = require("axios");
const path = require("path");
const fs = require("fs");
const FormData = require("form-data");

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
		const data = { status: "false", message: "missing required input data" };

		return { data, status: 400 };
	}

	try {
		if (req.file) {
			const {
				body: { baseUrl, apiLink, ...requestParams },
				file,
			} = req;

			if (!baseUrl || !apiLink) {
				return {
					status: false,
					message: "URL input invalid or incomplete",
				};
			}

			let formDataInput = new FormData();
			formDataInput.append("csvfile", fs.createReadStream(file.path));

			for (key in requestParams) {
				formDataInput.append(key, requestParams[key]);
			}

			const serverResponse = await axios.post(baseUrl + apiLink, formDataInput);
			const { data, status } = serverResponse;

			return { data, status };
		}

		const serverResponse = await axios.post(baseUrl + apiLink, requestParams, {
			headers: { "Content-Type": "application/json" },
		});
		const { data, status } = serverResponse;

		return { data, status };
	} catch (error) {
		const data = { status: "false", message: error.message };
		return { ...data, status: 400 };
	}
}

async function httpGeStaticRequest(req, res) {
	const { data, status } = await makeHttpReq(req);

	return res.status(status).json({
		...data,
	});
}

module.exports = { httpGeStaticRequest };
