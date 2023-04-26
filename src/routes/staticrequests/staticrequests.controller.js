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

function validateParams(validationParams, serverResponses) {
	const validationMessage = {};
	const resultsMap = new Map();
	resultsMap.set("passed", 0);
	resultsMap.set("failed", 0);

	if (!validationParams) {
		Object.assign(validationMessage, {
			validationMessage: "validation check skipped. No values passed.",
		});

		return validationMessage;
	}

	for (key in validationParams) {
		if (String(serverResponses[key]) === "undefined") {
			resultsMap.set("failed", resultsMap.get("failed") + 1);
		} else {
			const isMatchingValidationParam =
				String(validationParams[key]) === String(serverResponses[key]);

			isMatchingValidationParam
				? resultsMap.set("passed", resultsMap.get("passed") + 1)
				: resultsMap.set("failed", resultsMap.get("failed") + 1);
		}
	}

	if (resultsMap.get("passed") >= 1 && resultsMap.get("failed") === 0) {
		Object.assign(validationMessage, {
			validationMessage:
				"validation check passed. User input and server response is matching",
		});
	} else {
		Object.assign(validationMessage, {
			validationMessage:
				"validation check failed. User input and server response not matching",
		});
	}

	return validationMessage;
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

		const {
			body: { baseUrl, apiLink, requestParams, validationParams },
		} = req;

		if (!baseUrl || !apiLink) {
			return {
				status: false,
				message: "URL input invalid or incomplete",
			};
		}

		const serverResponse = await axios.post(baseUrl + apiLink, requestParams, {
			headers: { "Content-Type": "application/json" },
		});
		const { data, status } = serverResponse;

		const validationMessage = validateParams(validationParams, data);

		return { data: { ...data, ...validationMessage }, status };
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
