const axios = require("axios");
const {
	getDefaultResopnseValues,
	getValidApisWithApplication,
	getApisListWithApplication,
} = require("../../models/dailymonitor.model");

// check if request body contains "url" property or not
function includesUrl(req) {
	return Boolean(req.body.url);
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
	const validApis = getValidApisWithApplication();
	const serverResponses = [];
	const userReqValues = getRequestValues(responseBody);

	for (let i = 0; i < validApis.length; i++) {
		const { application, url } = validApis[i];

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

			let serverResponse = isExpectedErrorMessage(
				userReqValues,
				serverResMessage
			)
				? {
						testStatus: "passed",
						type: "batch request",
						success: true,
						statusCode: statusCode,
						message: "user input and server response matched !",
						application: application,
						url: responseUrl,
				  }
				: {
						testStatus: "failed",
						type: "batch request",
						success: false,
						statusCode: statusCode,
						message: "user input and server response not matching !!!",
						application: application,
						url: responseUrl,
				  };

			serverResponses.push(serverResponse);
		}
	}

	return {
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
	if (!includesUrl(req)) {
		return res.status(400).json({
			status: "invalid url input",
		});
	}

	const userReqValues = getRequestValues(req.body);

	try {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // hotfix to avoid "unable to verify the first certificate" warning on https requests by not verifying that the SSL/TLS certificates

		let serverResponse = await axios.get(req.body.url);

		// not performing actions because:
		// response is expected as 404 and is passed to error
		console.log(serverResponse.data);
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

		// return responses based on user requested values and server response values comparasion validation
		return isExpectedErrorMessage(userReqValues, serverResMessage)
			? res.status(statusCode).json({
					data: {
						testStatus: "passed",
						type: "individual request",
						success: true,
						statusCode: statusCode,
						message: "user input and server response matched !",
						url: responseUrl,
					},
			  })
			: res.status(statusCode).json({
					data: {
						testStatus: "failed",
						type: "individual request",
						success: false,
						statusCode: statusCode,
						message: "user input and server response not matching !!!",
						url: responseUrl,
					},
			  });
	}
}

module.exports = {
	httpGetDailyMonitorApis,
	httpGetServerResponse,
	httpGetBatchServerResponse,
};
