const express = require("express");

const {
	httpGetDailyMonitorApis,
	httpGetServerResponse,
	httpGetBatchServerResponse,
} = require("./dailymonitor.controller");

const dailyMonitorRouter = express.Router();

dailyMonitorRouter.get("/", httpGetDailyMonitorApis);
dailyMonitorRouter.get("/batch", httpGetDailyMonitorApis);
dailyMonitorRouter.post("/", httpGetServerResponse);
dailyMonitorRouter.post("/batch", httpGetBatchServerResponse);

module.exports = dailyMonitorRouter;
