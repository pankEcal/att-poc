const axios = require("axios");

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
function isExpectedErrorMessage(errorMessage) {
	const { status, message } = errorMessage;
	const includesExpectedMessage =
		status === false && message === "Incorrect url";

	return includesExpectedMessage;
}

async function httpGetServerResponse(req, res) {
	if (!includesUrl(req)) {
		return res.status(400).json({
			status: "invalid url input",
		});
	}

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

		const errorMessage = { status: status, message: message };

		return isExpectedErrorMessage(!errorMessage)
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
