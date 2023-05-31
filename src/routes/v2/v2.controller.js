const { makeHttpReq, makeBatchHttpReq } = require("../../utils/makeHttpReq");

// method to make POST request to server and give response back
async function httpGetIndividualRes(req, res) {
	// record starting time before running test to track the total time taken
	const startingTime = Date.now();

	// collecting response coming from the requested server and sending back response
	const { data, status } = await makeHttpReq(req);

	// updating response object to add time taken to execute tests
	Object.assign(data.testResult, {
		testDuration: `${(Date.now() - startingTime) / 1000} s`,
	});

	return res.status(status).json({
		...data,
	});
}

// method to make POST request to server and give response back based on application
async function httpGetBatchRes(req, res) {
	const { data, status } = await makeBatchHttpReq(req);

	return res.status(status).json(data);
}

module.exports = { httpGetIndividualRes, httpGetBatchRes };
