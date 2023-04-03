const express = require("express");

const {
	httpGetDailyMonitorApis,
	httpGetServerResponse,
	httpBatchGetServerResponse,
} = require("./dailymonitor.controller");

const dailyMonitorRouter = express.Router();

dailyMonitorRouter.get("/", httpGetDailyMonitorApis);
dailyMonitorRouter.post("/", httpGetServerResponse);
dailyMonitorRouter.post("/batch", httpBatchGetServerResponse);

module.exports = dailyMonitorRouter;
