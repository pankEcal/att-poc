const express = require("express");

const {
	httpGetDailyMonitorApis,
	httpGetServerResponse,
	httpGetBatchServerResponse,
	httpGetServerResponseWithApplication,
} = require("./dailymonitor.controller");

const dailyMonitorRouter = express.Router();

// GET methods
dailyMonitorRouter.get("/", httpGetDailyMonitorApis);
dailyMonitorRouter.get("/batch", httpGetDailyMonitorApis);
dailyMonitorRouter.get("/batchwithapp", httpGetServerResponseWithApplication);

// POST methods
dailyMonitorRouter.post("/", httpGetServerResponse);
dailyMonitorRouter.post("/batch", httpGetBatchServerResponse);

module.exports = dailyMonitorRouter;
