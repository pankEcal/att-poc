const express = require("express");

const {
	httpGetDailyMonitorApis,
	httpGetServerResponse,
	httpGetBatchServerResponse,
} = require("./dailymonitor.controller");

const dailyMonitorRouter = express.Router();

// GET methods
dailyMonitorRouter.get("/getapis", httpGetDailyMonitorApis);

// POST methods
dailyMonitorRouter.post("/", httpGetServerResponse);
dailyMonitorRouter.post("/batch", httpGetBatchServerResponse);

module.exports = dailyMonitorRouter;
