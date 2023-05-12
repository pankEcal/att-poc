const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const { clearFiles } = require("../utils/clearFiles");
const { validateServerRes } = require("../utils/validateServerRes");

// handle file upload requests
async function handleFileUploadReq(request) {
	const {
		body: { baseUrl, apiLink, ...requestParams },
		file,
		headers,
	} = request;

	// validate baseUrl and apiLink. If any of is not present then throw relevant response and don't proceed for any requests
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
	const serverResponse = await axios.post(baseUrl + apiLink, formDataInput, {
		headers: {
			authorization: headers.authorization ? headers.authorization : null,
		},
	});

	// get server response after making POST requst to the provided URL
	const { data, status } = serverResponse;
	const validationMessage = validateServerRes(requestParams, data);

	// condition to validate test status
	// if validation param is passed then it will validate it and give success status based on validation which will be testResult success status.
	// if validation param isn't passed then test result will be thrown based on server response.
	const isPassingServerResponse = status === 200 && data.success === true;
	const teststatus = validationMessage.validated
		? validationMessage.success
		: isPassingServerResponse;

	// populate final test result
	const testResult = {
		url: baseUrl + apiLink,
		success: teststatus,
		method: request.method,
	};

	// clear the file content after getting server response
	clearFiles();

	// return response back to the calling method
	return {
		data: { testResult, serverResponse: data, validationMessage },
		status,
	};
}

// handle normal requests (without file uploads)
async function handlePlainReq(request) {
	// get required data from request body to make request
	const {
		body: {
			baseUrl,
			apiLink,
			requestMethod = undefined,
			requestParams,
			validationParams,
		},
	} = request;

	// validate baseUrl and apiLinks
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

	// validate request method
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
		String(requestMethod).toUpperCase() !== "GET" &&
		String(requestMethod).toUpperCase() !== "POST"
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

	// handle request methods and populate data to serverResponse
	if (requestMethod === "GET") {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // hotfix to avoid "unable to verify the first certificate" warning on https requests by not verifying that the SSL/TLS certificates
		const response = await axios.get(baseUrl + apiLink); // make HTTP request and get response back
		Object.assign(serverResponse, response); // update responsedata to be sent after making request
	} else if (requestMethod === "POST") {
		// make HTTP request and get response back
		response = await axios.post(baseUrl + apiLink, requestParams, {
			headers: { "Content-Type": "application/json" },
		});
		Object.assign(serverResponse, response); // update responsedata to be sent after making request
	}

	// get server response after making HTTP requst to the provided URL
	const { data, status } = serverResponse;
	// perform validation and get validation message
	const validationMessage = validateServerRes(validationParams, data);

	// condition to validate test status
	// if validation param is passed then it will validate it and give success status based on validation which will be testResult success status.
	// if validation param isn't passed then test result will be thrown based on server response.
	const isPassingServerResponse = status === 200 && data.success === true;
	const teststatus = validationMessage.validated
		? validationMessage.success
		: isPassingServerResponse;

	const testResult = {
		url: baseUrl + apiLink,
		success: teststatus,
		method: request.method,
	};

	// return response back to the calling method
	return {
		data: { testResult, serverResponse: data, validationMessage },
		status,
	};
}

// hanlde error block
async function handleError(error) {
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
		serverResponse: error,
	};

	return { data, status: status ?? 400 }; // if status value is not coming from error, pass 400 as default
}

// main function to handle a HTTP request
async function makeHttpReq(request) {
	// validate if request body is empty
	if (!Object.keys(request.body).length) {
		const data = {
			testResult: { success: false, message: "missing required input data" },
		};
		return { data, status: 400 };
	}

	// use try catch block to handle POST request to the provided server
	try {
		if (request.file) {
			return await handleFileUploadReq(request);
		}

		return await handlePlainReq(request);
	} catch (error) {
		return await handleError(request);
	}
}

module.exports = { makeHttpReq };
