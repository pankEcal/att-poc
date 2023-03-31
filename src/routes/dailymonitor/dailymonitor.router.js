const express = require("express");

const { httpGetDailyMonitorApis } = require("./dailymonitor.controller");

const dailyMonitorRouter = express.Router();

dailyMonitorRouter.get("/", httpGetDailyMonitorApis);

module.exports = dailyMonitorRouter;
