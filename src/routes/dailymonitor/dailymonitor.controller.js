const axios = require("axios");
const {
	getDefaultResopnseValues,
	getApisList,
} = require("../../models/dailymonitor.model");

function httpGetDailyMonitorApis(req, res) {
	const apis = getApisList();

	res.status(200).json({
		type: "daily monitor APIs",
		urls: apis,
	});
}

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
		: defaultStatus;
	responseData.userMessage = Boolean(message !== undefined && message)
		? message.trim()
		: defaultMessage;

	return responseData;
}

// returns collective response from batch POST requests
async function getBatchHttpResponse(responseBody) {
	const apis = getApisList();
	const serverResponses = [];
	const userReqValues = getRequestValues(responseBody);

	for (let i = 0; i < apis.length; i++) {
		// since all the passing cases are from 404 response, it's handled in error block only
		try {
			await axios.get(apis[i]);
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
						success: true,
						statusCode: statusCode,
						testStatus: "passed",
						message: "user input and server response matched !",
						url: responseUrl,
				  }
				: {
						success: false,
						statusCode: statusCode,
						testStatus: "failed",
						message: "user input and server response not matching !!!",
						url: responseUrl,
				  };

			serverResponses.push(serverResponse);
		}
	}

	return {
		data: serverResponses,
	};
}

// main function to process POST requests in a batch
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
					success: true,
					statusCode: statusCode,
					testStatus: "passed",
					message: "user input and server response matched !",
					url: responseUrl,
			  })
			: res.status(statusCode).json({
					success: false,
					statusCode: statusCode,
					testStatus: "failed",
					message: "user input and server response not matching !!!",
					url: responseUrl,
			  });
	}
}

// TODO: create a proper validation function after resolving core issues
async function httpsGetDailyMonitorApis(req, res) {
	const reqUrl = "https://evaeol.tvsmotor.com/event";

	res.status(200).json({
		status: "fine",
	});
}

module.exports = {
	httpGetDailyMonitorApis,
	httpGetServerResponse,
	httpGetBatchServerResponse,
	httpsGetDailyMonitorApis,
};
