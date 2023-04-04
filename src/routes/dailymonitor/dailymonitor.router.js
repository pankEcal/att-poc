const express = require("express");

const {
	httpGetDailyMonitorApis,
	httpGetServerResponse,
	httpGetBatchServerResponse,
	httpsGetDailyMonitorApis,
} = require("./dailymonitor.controller");

const dailyMonitorRouter = express.Router();

dailyMonitorRouter.get("/", httpGetDailyMonitorApis);
dailyMonitorRouter.get("/batch", httpGetDailyMonitorApis);
dailyMonitorRouter.get("/https", httpsGetDailyMonitorApis); // TODO: remove the get method after resolving the actual issue and move to POST method

dailyMonitorRouter.post("/", httpGetServerResponse);
dailyMonitorRouter.post("/batch", httpGetBatchServerResponse);

module.exports = dailyMonitorRouter;
