const axios = require("axios");
const {
	getDefaultResopnseValues,
	getValidApisWithApplication,
	getApisListWithApplication,
	getApisList,
	getApplicationsList,
} = require("../../models/dailymonitor.model");

// check if request body contains "url" property or not
function includesUrl(req) {
	if (!req.body) {
		return false;
	} else {
		return Boolean(req.body.url);
	}
}

// validates if user requested values and server response values are matching or not
function isExpectedErrorMessage(userRequest, serverResponse) {
	const { userStatus, userMessage } = userRequest;
	const { serverStatus, serverMessage } = serverResponse;

	// status is expected in boolean but it can respond differently with the conditional statemetns. Due to that reason, it is converted to string for comparasion only
	// check the lower cased value of the message to make validation more general
	const includesExpectedMessage =
		userStatus === serverStatus.toString() &&
		userMessage.toLowerCase() === serverMessage.toLowerCase();

	return includesExpectedMessage;
}

// if values are not present on request body then pass the default values
function getRequestValues(requestBody) {
	const { defaultStatus, defaultMessage } = getDefaultResopnseValues();
	let responseData = new Object();

	const { status, message } = requestBody;

	responseData.userStatus = Boolean(status !== undefined && status.toString())
		? status.toString().trim()
		: defaultStatus.toString().trim();
	responseData.userMessage = Boolean(message !== undefined && message)
		? message.trim()
		: defaultMessage;

	return responseData;
}

// returns collective response from batch POST requests
async function getBatchHttpResponse(responseBody) {
	const batchReqStartTime = Date.now();

	const validApis = getValidApisWithApplication();
	const serverResponses = [];
	const userReqValues = getRequestValues(responseBody);

	for (let i = 0; i < validApis.length; i++) {
		const { application, url } = validApis[i];
		const individualReqStartTime = Date.now();

		// since all the passing cases are from 404 response, it's handled in error block only
		try {
			process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // hotfix to avoid "unable to verify the first certificate" warning on https requests by not verifying that the SSL/TLS certificates
			await axios.get(url);
		} catch (error) {
			const {
				response: {
					data: { status, message },
				},
				request: {
					res: { statusCode, responseUrl },
				},
			} = error;

			const serverResMessage = { serverStatus: status, serverMessage: message };
			const individualReqTimeTaken = Date.now() - individualReqStartTime;

			let serverResponse = isExpectedErrorMessage(
				userReqValues,
				serverResMessage
			)
				? {
						serverResponse: {
							status: serverResMessage.serverStatus,
							message: serverResMessage.serverMessage,
						},
						statusCode: statusCode,
						testDuration: `${individualReqTimeTaken} ms`,
						testStatus: "passed",
						testType: "applications request",
						message: "user input and server response matched !",
						url: responseUrl,
						application: application,
				  }
				: {
						serverResponse: {
							status: serverResMessage.serverStatus,
							message: serverResMessage.serverMessage,
						},
						statusCode: statusCode,
						testDuration: `${individualReqTimeTaken} ms`,
						testStatus: "failed",
						testType: "applications request",
						message: "user input and server response not matching !!!",
						application: application,
						url: responseUrl,
				  };

			serverResponses.push(serverResponse);
		}
	}

	const batchReqTimeTaken = Date.now() - batchReqStartTime;

	return {
		totalTestDuration: `${batchReqTimeTaken} ms`,
		apisTested: serverResponses.length,
		data: serverResponses,
	};
}

function isValidUrl(request) {
	return getApisList().includes(request.body.url);
}

async function getApplicationRespose(app) {
	const batchReqStartTime = Date.now();

	const serverResponses = [];
	const userReqValues = getRequestValues(app);
	let { application } = app;

	for (let i = 0; i < app.urls.length; i++) {
		const url = app.urls[i];
		const individualReqStartTime = Date.now();

		// since all the passing cases are from 404 response, it's handled in error block only
		try {
			process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // hotfix to avoid "unable to verify the first certificate" warning on https requests by not verifying that the SSL/TLS certificates
			await axios.get(url);
		} catch (error) {
			const {
				response: {
					data: { status, message },
				},
				request: {
					res: { statusCode, responseUrl },
				},
			} = error;

			const serverResMessage = {
				serverStatus: status,
				serverMessage: message,
			};
			const individualReqTimeTaken = Date.now() - individualReqStartTime;

			let serverResponse = isExpectedErrorMessage(
				userReqValues,
				serverResMessage
			)
				? {
						serverResponse: {
							status: serverResMessage.serverStatus,
							message: serverResMessage.serverMessage,
						},
						statusCode: statusCode,
						testDuration: `${individualReqTimeTaken} ms`,
						testStatus: "passed",
						testType: "application urls batch request",
						message: "user input and server response matched !",
						url: responseUrl,
						application: application,
				  }
				: {
						serverResponse: {
							status: serverResMessage.serverStatus,
							message: serverResMessage.serverMessage,
						},
						statusCode: statusCode,
						testDuration: `${individualReqTimeTaken} ms`,
						testStatus: "failed",
						testType: "application urls batch request",
						message: "user input and server response not matching !!!",
						application: application,
						url: responseUrl,
				  };

			serverResponses.push(serverResponse);
		}
	}
	const batchReqTimeTaken = Date.now() - batchReqStartTime;

	return {
		application: application,
		apisTested: serverResponses.length,
		totalTestDuration: `${batchReqTimeTaken} ms`,
		data: serverResponses,
	};
}

/* ---------------------------------------- */
/* -----  main controller functions  ------ */
/* ---------------------------------------- */

// main function to proccess GET request
function httpGetDailyMonitorApis(req, res) {
	const apis = getApisListWithApplication();

	res.status(200).json({
		data: apis,
	});
}

// main function to process batch POST requests
async function httpGetBatchServerResponse(req, res) {
	const respose = await getBatchHttpResponse(req.body);

	return res.status(200).json(respose);
}

// main function to proccess single POST request
async function httpGetServerResponse(req, res) {
	const startTime = Date.now();

	if (!includesUrl(req)) {
		return res.status(400).json({
			testStatus: "failed",
			message: "missing url input",
		});
	}

	if (!isValidUrl(req)) {
		return res.status(400).json({
			testStatus: "failed",
			message: "invalid url input",
		});
	}

	const userReqValues = getRequestValues(req.body);

	try {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // hotfix to avoid "unable to verify the first certificate" warning on https requests by not verifying that the SSL/TLS certificates

		let serverResponse = await axios.get(req.body.url);

		// not performing actions because:
		// response is expected as 404 and is passed to error
	} catch (error) {
		const {
			response: {
				data: { status, message },
			},
			request: {
				res: { statusCode, responseUrl },
			},
		} = error;

		const serverResMessage = { serverStatus: status, serverMessage: message };
		const timeTaken = Date.now() - startTime;

		// return responses based on user requested values and server response values comparasion validation
		return isExpectedErrorMessage(userReqValues, serverResMessage)
			? res.status(statusCode).json({
					data: {
						serverResponse: {
							status: serverResMessage.serverStatus,
							message: serverResMessage.serverMessage,
						},
						statusCode: statusCode,
						testDuration: `${timeTaken} ms`,
						testStatus: "passed",
						testType: "individual request",
						message: "user input and server response matched !",
						url: responseUrl,
					},
			  })
			: res.status(statusCode).json({
					data: {
						serverResponse: {
							status: serverResMessage.serverStatus,
							message: serverResMessage.serverMessage,
						},
						statusCode: statusCode,
						testDuration: `${timeTaken} ms`,
						testStatus: "failed",
						testType: "individual request",
						message: "user input and server response not matching !!!",
						url: responseUrl,
					},
			  });
	}
}

// main function to proccess single application POST request
async function httpGetBatchApplicationResponse(req, res) {
	const requestedApplication = req.body.application.trim();
	const appsList = getApplicationsList();
	const apis = getApisListWithApplication();

	if (appsList.includes(requestedApplication)) {
		const applicationIndex = appsList.indexOf(requestedApplication);
		const application = apis[applicationIndex];

		let response = await getApplicationRespose(application);

		return res.status(200).json(response);
	} else {
		return res.status(400).json({
			status: "NOT OK",
		});
	}
}

module.exports = {
	httpGetDailyMonitorApis,
	httpGetServerResponse,
	httpGetBatchServerResponse,
	httpGetBatchApplicationResponse,
};
