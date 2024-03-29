const express = require("express");
const multer = require("multer");
const upload = multer();

const {
  httpGetDailyMonitorApis,
  httpGetServerResponse,
  httpGetBatchServerResponse,
  httpGetBatchApplicationResponse,
} = require("./dailymonitor.controller");

const dailyMonitorRouter = express.Router();

// GET methods
dailyMonitorRouter.get("/apis", httpGetDailyMonitorApis);

// POST methods
dailyMonitorRouter.post("/", upload.none(), httpGetServerResponse);
dailyMonitorRouter.post("/batch", upload.none(), httpGetBatchServerResponse);
dailyMonitorRouter.post(
  "/application",
  upload.none(),
  httpGetBatchApplicationResponse,
);

module.exports = dailyMonitorRouter;
