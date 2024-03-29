const axios = require("axios");
const path = require("path");
const fs = require("fs");
const { parse } = require("csv-parse");
const FormData = require("form-data");
const { clearFiles } = require("../../utils/clearFiles");

// method to verify if request has expected data value or not
function isValidReqData(request) {
  if (!request.body || !request.file) {
    return false;
  } else {
    const {
      body: { uploadUrl },
      file,
    } = request;

    return Boolean(file) && Boolean(uploadUrl);
  }
}

// read csv file and return device ID
async function getDeviceId() {
  return new Promise((resolve, reject) => {
    const uploadedFilePath = path.join(
      __dirname,
      "../../../public/uploads",
      "uploadedFile.csv",
    );
    const deviceIdFilePath = path.join(
      __dirname,
      "../../../public/uploads",
      "deviceid.txt",
    );

    const writeStream = fs.createWriteStream(deviceIdFilePath);

    fs.createReadStream(uploadedFilePath)
      .pipe(parse({ delimiter: ",", from_line: 2, toLine: 2 }))
      .on("data", function (row) {
        writeStream.write(row[0], "utf8");
      })
      .on("end", function () {
        writeStream.end();
        try {
          const deviceId = fs.readFileSync(deviceIdFilePath, "utf-8");
          resolve(deviceId);
        } catch (error) {
          reject(error);
        }
      })
      .on("error", function (error) {
        reject(error);
      });
  });
}

// make http POST request with uploaded file
async function makePostReq(uploadUrl, csvfile, deviceId) {
  try {
    const fileUploadStartTime = Date.now();
    let formDataInfo = new FormData();
    formDataInfo.append("devID", deviceId);
    formDataInfo.append("csvfile", fs.createReadStream(csvfile.path));

    const fileUploadResponse = await axios.post(uploadUrl, formDataInfo);

    const {
      statusText,
      headers: { date },
      request: {
        method,
        res: { responseUrl, statusCode },
      },
      data,
    } = fileUploadResponse;

    const fileUploadTimeTaken = (Date.now() - fileUploadStartTime) / 1000;

    let responseData = {
      testStatus: "passed",
      testType: "file upload",
      testDuration: `${fileUploadTimeTaken} s`,
      url: responseUrl,
      method: method,
      date: date,
      deviceId: deviceId,
      serverResponse: { statusCode, statusText, ...data },
    };

    clearFiles();
    return responseData;
  } catch (error) {
    const {
      message = null,
      response: { statusText, headers: { date } = { date: null }, data } = {
        statusText: null,
        data: null,
      },
      request: {
        method = null,
        res: { responseUrl, statusCode } = {
          responseUrl: uploadUrl,
          statusCode: 502,
        },
      },
    } = error;

    const errorResData = {
      testStatus: "failed",
      testType: "file upload",
      message: message,
      url: responseUrl,
      method: method,
      date: date,
      serverResponse: {
        statusCode,
        statusText,
        data,
      },
    };

    clearFiles();

    return errorResData;
  }
}

/* ---------------------------------------- */
/* -----  main controller functions  ------ */
/* ---------------------------------------- */

// main function to proccess GET request
function httpGetRoutes(req, res) {
  res.status(200).json({
    message: "file upload API",
  });
}

// main function to proccess POST file upload request
async function handlefilupload(req, res) {
  const isValid = isValidReqData(req);

  if (!isValid) {
    return res.status(400).json({
      testStatus: "failed",
      testType: "file upload",
      message: "missing required input data",
    });
  }
  const {
    body: { uploadUrl },
    file,
  } = req;

  const deviceId = await getDeviceId();

  return await makePostReq(uploadUrl, file, deviceId).then((response) => {
    return res.status(response.serverResponse.statusCode).json(response);
  });
}

module.exports = { httpGetRoutes, handlefilupload };
