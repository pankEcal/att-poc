const { makeHttpReq, makeBatchAppHttpReq } = require("../../utils/makeHttpReq");

// method to make POST request to server and give response back
async function httpGetIndividualRes(req, res) {
	// record starting time before running test to track the total time taken
	const startingTime = Date.now();

	// collecting response coming from the requested server and sending back response
	const { data, status } = await makeHttpReq(req);

	// updating response object to add time taken to execute tests
	Object.assign(data.testResult, {
		testDuration: `${Date.now() - startingTime} ms`,
	});

	return res.status(status).json({
		...data,
	});
}

// method to make POST request to server and give response back based on application
async function httpGetApplicationRes(req, res) {
	const { data, status } = await makeBatchAppHttpReq(req);

	return res.status(status).json(data);
}

module.exports = { httpGetIndividualRes, httpGetApplicationRes };
