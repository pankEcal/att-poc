const axios = require("axios");
const {
	getDefaultResopnseValues,
	getApisList,
} = require("../../models/dailymonitor.model");

function httpGetDailyMonitorApis(req, res) {
	res.status(200).json({
		status: "daily monitor APIs",
	});
}

// function to check if request body contains "url" property or not
function includesUrl(req) {
	return Boolean(req.body.url);
}

// function to check if error mesage from server is matching to user request
function isExpectedErrorMessage(userRequest, serverResponse) {
	const { uStatus, uMessage } = userRequest;
	const { sStatus, sMessage } = serverResponse;

	// status is expected in boolean but it can respond differently with the conditional statemetns. Due to that reason, it is converted to string for comparasion only
	// check the lower cased value of the message to make validation more general
	const includesExpectedMessage =
		uStatus.toString() === sStatus.toString() &&
		uMessage.toLowerCase() === sMessage.toLowerCase();

	return includesExpectedMessage;
}

// if request body includes any value then use it if it doesn't include then use default value provided model data
function getRequestValues(requestBody) {
	const { defaultStatus, defaultMessage } = getDefaultResopnseValues();
	let responseData = new Object();

	const { status, message } = requestBody;

	responseData.uStatus = Boolean(status !== undefined && status.toString())
		? status
		: defaultStatus;
	responseData.uMessage = Boolean(message !== undefined && message)
		? message.trim()
		: defaultMessage;

	return responseData;
}

async function httpCallFromModel(responseBody) {
	const apis = getApisList();
	const serverResponses = [];
	const userReqValues = getRequestValues(responseBody);

	try {
		await axios.get(apis[1]);
		// since all the passing cases are from 404 response, it's handled in error block
	} catch (error) {
		const {
			response: {
				data: { status, message },
			},
			request: {
				res: { statusCode, responseUrl },
			},
		} = error;

		const serverResMessage = { sStatus: status, sMessage: message };

		let serverResponse = isExpectedErrorMessage(userReqValues, serverResMessage)
			? {
					success: true,
					statusCode: statusCode,
					message: "test passed, server response matched!!",
					url: responseUrl,
			  }
			: {
					success: false,
					statusCode: statusCode,
					message: "test failed, server response didn't matched!!",
					url: responseUrl,
			  };

		serverResponses.push(serverResponse);
	}

	return {
		status: "working",
		data: serverResponses,
	};
}

async function httpBatchGetServerResponse(req, res) {
	const respose = await httpCallFromModel(req.body);

	return res.status(200).json(respose);
}

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
				res: { statusCode },
			},
		} = error;

		const serverResMessage = { sStatus: status, sMessage: message };

		return isExpectedErrorMessage(userReqValues, serverResMessage)
			? res.status(statusCode).json({
					success: true,
					statusCode: statusCode,
					message: "test passed, server response matched!!",
			  })
			: res.status(statusCode).json({
					success: false,
					statusCode: statusCode,
					message: "test failed, server response didn't matched!!",
			  });
	}
}

module.exports = {
	httpGetDailyMonitorApis,
	httpGetServerResponse,
	httpBatchGetServerResponse,
};
