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
		let formDataInfo = new FormData();
		for (const key in rest) {
			formDataInfo.append(key, rest[key]);
		}
		if (Boolean(file)) {
			formDataInfo.append("csvfile", fs.createReadStream(file.path));
			const serverResponse = await axios.post(baseUrl + apiLink, formDataInfo, {
				headers: { "Content-Type": "multipart/form-data" },
				transformRequest: (formDataInfo) => formDataInfo,
			});
			const { data, status } = serverResponse;

			return { data, status };
		} else {
			const serverResponse = await axios.post(baseUrl + apiLink, formDataInfo, {
				headers: { "Content-Type": "multipart/form-data" },
				transformRequest: (formDataInfo) => formDataInfo,
			});

			const { data, status } = serverResponse;

			if (file) {
				clearFiles();
			}
			return { data, status };
		}
	} catch (error) {
		const data = { status: false, message: error.message };
		return { data, status: 400 };
	}
}

async function httpGeStaticRequest(req, res) {
	const { data, status } = await makeHttpReq(req);

	return res.status(status).json({
		...data,
	});
}

module.exports = { httpGeStaticRequest };
