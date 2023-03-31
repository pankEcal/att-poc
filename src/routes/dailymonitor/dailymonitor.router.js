const express = require("express");

const {
	httpGetDailyMonitorApis,
	httpGetServerResponse,
} = require("./dailymonitor.controller");

const dailyMonitorRouter = express.Router();

dailyMonitorRouter.get("/", httpGetDailyMonitorApis);
dailyMonitorRouter.post("/", httpGetServerResponse);

module.exports = dailyMonitorRouter;
