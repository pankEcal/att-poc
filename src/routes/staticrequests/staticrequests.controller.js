const axios = require("axios");
const path = require("path");
const fs = require("fs");
const FormData = require("form-data");

// method to remove the uploaded files from client side
async function clearFiles() {
	const basePath = path.join(__dirname, "../../../public/uploads/");
	const uploadedFiles = [];

	fs.readdirSync(basePath).map((filename) => {
		uploadedFiles.push(basePath + filename);
	});

	fs.access(basePath, (error) => {
		if (!error) {
			uploadedFiles.map((file) => {
				fs.createWriteStream(file).write("");
			});
		}
	});

	// method to remove the file
	// blocked by Error: EPERM: operation not permitted error

	// fs.access(basePath, (error) => {
	// 	if (!error) {
	// 		uploadedFiles.map((file) => {
	// 			fs.unlink(file, (error) => {
	// 				if (error) console.log(error.message);
	// 				console.log(`${file} deleted!`);
	// 			});
	// 		});
	// 	}
	// });
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
			success: false,
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
			success: true,
			validated: true,
			message: "User input and server response is matching",
		});
	} else {
		Object.assign(validationMessage, {
			success: false,
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
			testResult: { success: false, message: "missing required input data" },
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
					success: false,
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
			const validationMessage = validate(requestParams, data);

			const testResult = {
				url: baseUrl + apiLink,
				success: validationMessage.validated ? validationMessage.success : true,
				method: req.method,
			};

			// clear the file content after getting server response
			clearFiles();

			// return testResult, server response data, validation message, and server responded statusCode
			return {
				data: { testResult, serverResponse: data, validationMessage },
				status,
			};
		}

		// get required data from request body to make request
		const {
			body: {
				baseUrl,
				apiLink,
				requestMethod = undefined,
				requestParams,
				validationParams,
			},
		} = req;

		// check if baseUrl and apiLink fields are empty, In that case, it will be handled inside this block and won't proceed further
		if (!baseUrl || !apiLink) {
			const data = {
				testResult: {
					success: false,
					message: "invalid or incomplete URL input",
				},
			};

			return {
				data,
				status: 400,
			};
		}

		if (!Boolean(requestMethod)) {
			const data = {
				testResult: {
					success: false,
					message: "request method not provided",
				},
			};

			return {
				data,
				status: 400,
			};
		} else if (
			String(requestMethod).toUpperCase() != "GET" &&
			String(requestMethod).toUpperCase() != "POST"
		) {
			const data = {
				testResult: {
					success: false,
					message: "invalid request method",
				},
			};

			return {
				data,
				status: 400,
			};
		}

		let serverResponse = {};

		// handle GET method
		if (requestMethod === "GET") {
			// if  baseUrl and apiLink fields are non-empty then make POST request with the provided request body
			process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // hotfix to avoid "unable to verify the first certificate" warning on https requests by not verifying that the SSL/TLS certificates
			const response = await axios.get(baseUrl + apiLink);
			Object.assign(serverResponse, response);
		} else if (requestMethod === "POST") {
			// handle POST method. If it's not GET then it's POST only as validation is already done
			// if  baseUrl and apiLink fields are non-empty then make POST request with the provided request body
			response = await axios.post(baseUrl + apiLink, requestParams, {
				headers: { "Content-Type": "application/json" },
			});
			Object.assign(serverResponse, response);
		}

		// get server response after making POST requst to the provided URL
		const { data, status } = serverResponse;
		// get validation message
		const validationMessage = validate(validationParams, data);
		const testResult = {
			url: baseUrl + apiLink,
			success: validationMessage.validated ? validationMessage.success : true,
			method: req.method,
		};

		// return testResult, server response data, validation message, and server responded statusCode
		return {
			data: { testResult, serverResponse: data, validationMessage },
			status,
		};
	} catch (error) {
		// if error is occured then pass the message and status codes accordingly
		const {
			response: { status } = {}, // if response.status === undefined, in that case assign it as an empty object
			config: { url } = {}, // if response.config === undefined, in that case assign it as an empty object
			request: { method } = {}, // if response.request === undefined, in that case assign it as an empty object
			message,
		} = error;

		const data = {
			testResult: {
				url: url,
				success: false,
				method: method,
				message: message,
			},
			error,
		};
		return { data, status: status ?? 400 }; // if status value is not coming from error, pass 400 as default
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
