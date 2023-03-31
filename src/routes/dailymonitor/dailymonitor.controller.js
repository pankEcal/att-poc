function httpGetDailyMonitorApis(req, res) {
	res.status(200).json({
		status: "daily monitor APIs",
	});
}

module.exports = { httpGetDailyMonitorApis };
