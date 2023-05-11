const { makeHttpReq } = require("../../utils/makeHttpReq");

/* ============================================ */
/* ====== main methods to handle requests ===== */
/* ============================================ */

// method to make POST request to server and give response back
async function httpGetIndividualRes(req, res) {
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

async function httpGetApplicationRes(req, res) {
	return res.status(200).json({
		success: false,
		message: "API is working",
	});
}

module.exports = { httpGetIndividualRes, httpGetApplicationRes };
