const axios = require("axios");
const { getDefaultResopnseValues } = require("../../models/dailymonitor.model");

function httpGetDailyMonitorApis(req, res) {
	res.status(200).json({
		status: "daily monitor APIs",
	});
}

// function to check if request body contains "url" property or not
function includesUrl(req) {
	return Boolean(req.body.url);
}

// function to check if error mesage is expected or not
function isExpectedErrorMessage(userRequest, serverResponse) {
	const { uStatus, uMessage } = userRequest;
	const { sStatus, sMessage } = serverResponse;

	console.log(userRequest);
	console.log(serverResponse);

	const includesExpectedMessage = uStatus === sStatus && uMessage === sMessage;

	return includesExpectedMessage;
}

// if request body includes any value then use it if it doesn't include then use default value provided my model
function getRequestValues(requestBody) {
	const { defaultStatus, defaultMessage } = getDefaultResopnseValues();
	let responseData = new Object();

	const { status, message } = requestBody;

	responseData.uStatus = Boolean(status !== undefined && status.toString())
		? status
		: defaultStatus;
	responseData.uMessage = Boolean(message !== undefined && message)
		? message
		: defaultMessage;

	return responseData;
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

module.exports = { httpGetDailyMonitorApis, httpGetServerResponse };
