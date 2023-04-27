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

// method to reutrn validation message based on the values passed
function validate(validationParams, serverResponses) {
	// creating validation message object and a map to store results
	const validationMessage = {};
	const resultsMap = new Map();
	resultsMap.set("passed", 0);
	resultsMap.set("failed", 0);

	// check if validation params are present or not, if not then it will be handled inside the block, and won't proceed further
	if (!validationParams || !Object.entries(validationParams).length) {
		Object.assign(validationMessage, {
			status: false,
			validated: false,
			message: "validation check skipped. No values passed.",
		});

		return validationMessage;
	}

	// iterate through each validation param and check if it is present in server response
	for (key in validationParams) {
		// if the validation param isn't present in server response then consider it failed case
		if (String(serverResponses[key]) === "undefined") {
			resultsMap.set("failed", resultsMap.get("failed") + 1);
		} else {
			// defining a validation condition. If value of the validation param and server param are strictly matching then it's validated and is passing case.
			const isMatchingValidationParam =
				String(validationParams[key]) === String(serverResponses[key]);

			// update validation result map based on condition
			isMatchingValidationParam
				? resultsMap.set("passed", resultsMap.get("passed") + 1)
				: resultsMap.set("failed", resultsMap.get("failed") + 1);
		}
	}

	// check in validation message for the passing case and update the result map accordingly.
	// passing condition: at least 1 passing case should be there and no failed case should be present.
	if (resultsMap.get("passed") >= 1 && resultsMap.get("failed") === 0) {
		Object.assign(validationMessage, {
			status: true,
			validated: true,
			message: "User input and server response is matching",
		});
	} else {
		Object.assign(validationMessage, {
			status: false,
			validated: true,
			message: "User input and server response not matching",
		});
	}

	// return the validation based on the conditions checked
	return validationMessage;
}

// method to make POST request to the requested server, and send back the data to main function
async function makeHttpReq(req) {
	// check if request body is empty, if it's empty then don't proceed further
	if (!Object.keys(req.body).length) {
		const data = {
			testResult: { status: false, message: "missing required input data" },
		};
		return { data, status: 400 };
	}

	// use try catch block to handle POST request to the provided server
	try {
		// if file is uploaded from client side, then it will be handled in this block
		if (req.file) {
			// get required data from request body to make request
			const {
				body: { baseUrl, apiLink, ...requestParams },
				file,
				headers,
			} = req;

			// check if baseUrl and apiLink fields are empty, In that case, it will be handled inside this block and won't proceed further
			if (!baseUrl || !apiLink) {
				return {
					status: false,
					message: "URL input invalid or incomplete",
				};
			}

			// create a new formData object instance to handle file uploading
			let formDataInput = new FormData();
			// append the uploaded file and body params into the created formData
			formDataInput.append("csvfile", fs.createReadStream(file.path));
			for (key in requestParams) {
				formDataInput.append(key, requestParams[key]);
			}

			// if  baseUrl and apiLink fields are non-empty then make POST request with the created formData
			const serverResponse = await axios.post(
				baseUrl + apiLink,
				formDataInput,
				{
					headers: {
						authorization: headers.authorization ? headers.authorization : null,
					},
				}
			);

			// get server response after making POST requst to the provided URL
			const { data, status } = serverResponse;
			// clear the file content after getting server response
			clearFiles();

			// return server response data, and server responded statusCode
			return { data, status };
		}

		// get required data from request body to make request
		const {
			body: { baseUrl, apiLink, requestParams, validationParams },
		} = req;

		// check if baseUrl and apiLink fields are empty, In that case, it will be handled inside this block and won't proceed further
		if (!baseUrl || !apiLink) {
			const data = {
				testResult: {
					status: false,
					message: "invalid or incomplete URL input",
				},
			};

			return {
				data,
				status: 400,
			};
		}

		// if  baseUrl and apiLink fields are non-empty then make POST request with the provided request body
		const serverResponse = await axios.post(baseUrl + apiLink, requestParams, {
			headers: { "Content-Type": "application/json" },
		});

		// get server response after making POST requst to the provided URL
		const { data, status } = serverResponse;
		// get validation message
		const validationMessage = validate(validationParams, data);
		const testResult = {
			url: baseUrl + apiLink,
			status: validationMessage.validated ? validationMessage.status : true,
			method: req.method,
		};

		// return testResult, server response data, validation message, and server responded statusCode
		return {
			data: { testResult, serverResponse: data, validationMessage },
			status,
		};
	} catch (error) {
		// if error is occured then pass the message and status codes accordingly
		const data = { status: false, message: error.message };
		return { ...data, status: 400 };
	}
}

/* ============================================ */
/* ====== main methods to handle requests ===== */
/* ============================================ */

// method to make POST request to server and give response back
async function httpGeStaticRequest(req, res) {
	// record starting time before running test to track the total time taken
	const startingTime = Date.now();

	// collecting response coming from the requested server side, and sending respose back to client side
	const { data, status } = await makeHttpReq(req);

	Object.assign(data.testResult, {
		testDuration: `${Date.now() - startingTime} ms`,
	});

	return res.status(status).json({
		...data,
	});
}

module.exports = { httpGeStaticRequest };
