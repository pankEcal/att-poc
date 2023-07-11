const axios = require("axios");
const {
  getDefaultResopnseValues,
  getValidApisWithApplication,
  getApisListWithApplication,
  getApisList,
  getApplicationsList,
} = require("../../models/dailymonitor.model");

// check if request body contains "url" property or not
function includesUrl(req) {
  if (!req.body) {
    return false;
  } else {
    return Boolean(req.body.url);
  }
}

// validates if user requested values and server response values are matching or not
function isExpectedErrorMessage(userRequest, serverResponse) {
  const { userStatus, userMessage } = userRequest;
  const { serverStatus, serverMessage } = serverResponse;

  // status is expected in boolean but it can respond differently with the conditional statemetns. Due to that reason, it is converted to string for comparasion only
  // check the lower cased value of the message to make validation more general
  const includesExpectedMessage =
    userStatus === serverStatus?.toString() &&
    userMessage.toLowerCase() === serverMessage.toLowerCase();

  return includesExpectedMessage;
}

// if values are not present on request body then pass the default values
function getRequestValues(requestBody) {
  const { defaultStatus, defaultMessage } = getDefaultResopnseValues();
  let responseData = new Object();

  if (!Boolean(requestBody)) {
    responseData.userStatus = defaultStatus;
    responseData.userMessage = defaultMessage;
  } else {
    const { status, message } = requestBody;

    responseData.userStatus = Boolean(status)
      ? status.toString().trim()
      : defaultStatus;
    responseData.userMessage = Boolean(message)
      ? message.trim()
      : defaultMessage;
  }

  return responseData;
}

// returns collective response from batch POST requests
async function getBatchHttpResponse(responseBody) {
  const batchReqStartTime = Date.now();

  const validApis = getValidApisWithApplication();
  const serverResponses = [];
  const userReqValues = getRequestValues(responseBody);

  for (let i = 0; i < validApis.length; i++) {
    const { application, url } = validApis[i];
    const individualReqStartTime = Date.now();

    // since all the passing cases are from 404 response, it's handled in error block only
    try {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // hotfix to avoid "unable to verify the first certificate" warning on https requests by not verifying that the SSL/TLS certificates
      await axios.get(url);
    } catch (error) {
      const {
        response: { data } = {},
        request: {
          res: { statusCode, responseUrl, statusMessage },
          method,
        },
      } = error;

      const serverResMessage = {
        serverStatus: data.status,
        serverMessage: data.message,
      };
      const individualReqTimeTaken =
        (Date.now() - individualReqStartTime) / 1000;

      let serverResponse = isExpectedErrorMessage(
        userReqValues,
        serverResMessage,
      )
        ? {
            testStatus: "passed",
            testType: "batch url request",
            message: "user input and server response matched",
            application: application,
            testDuration: `${individualReqTimeTaken} s`,
            url: responseUrl,
            method: method,
            serverResponse: {
              statusCode,
              statusMessage,
              ...data,
            },
          }
        : {
            testStatus: "failed",
            testType: "batch test request",
            message: "user input and server response didn't matched",
            application: application,
            url: responseUrl,
            method: method,
            serverResponse: {
              statusCode,
              statusMessage,
              ...data,
            },
          };

      serverResponses.push(serverResponse);
    }
  }

  const batchReqTimeTaken = (Date.now() - batchReqStartTime) / 1000;

  return {
    totalTestDuration: `${batchReqTimeTaken} s`,
    apisTested: serverResponses.length,
    data: serverResponses,
  };
}

// returns boolean if the list of APIs in database includes passed URL or not
function isValidUrl(request) {
  return getApisList().includes(request.body.url);
}

// returns requested application name if it exists in database, else returns false
function isValidApplication(requestedApplication) {
  const userRequestedApplication = requestedApplication.trim().toLowerCase();
  const appsList = getApplicationsList().map((api) => api.toLowerCase());
  const apis = getApisListWithApplication();

  const includesApplication = appsList.includes(userRequestedApplication);

  if (!includesApplication) {
    return false;
  } else {
    const applicationIndex = appsList.indexOf(userRequestedApplication);
    const application = apis[applicationIndex];

    return application;
  }
}

async function getApplicationRespose(app) {
  const batchReqStartTime = Date.now();

  const serverResponses = [];
  const userReqValues = getRequestValues(app);
  let { application } = app;

  for (let i = 0; i < app.urls.length; i++) {
    const url = app.urls[i];
    const individualReqStartTime = Date.now();

    // since all the passing cases are from 404 response, it's handled in error block only
    try {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // hotfix to avoid "unable to verify the first certificate" warning on https requests by not verifying that the SSL/TLS certificates
      await axios.get(url);
    } catch (error) {
      const {
        response: { data },
        request: {
          res: { statusCode, responseUrl, statusMessage },
          method,
        },
      } = error;

      const serverResMessage = {
        serverStatus: data.status,
        serverMessage: data.message,
      };

      const individualReqTimeTaken =
        (Date.now() - individualReqStartTime) / 1000;

      let serverResponse = isExpectedErrorMessage(
        userReqValues,
        serverResMessage,
      )
        ? {
            testStatus: "passed",
            testType: "application urls batch request",
            message: "user input and server response matched !",
            application: application,
            testDuration: `${individualReqTimeTaken} s`,
            url: responseUrl,
            method: method,
            serverResponse: {
              statusCode,
              statusMessage,
              ...data,
            },
          }
        : {
            testStatus: "failed",
            testType: "application urls batch request",
            message: "user input and server response not matching !!!",
            application: application,
            url: responseUrl,
            method: method,
            serverResponse: {
              statusCode,
              statusMessage,
              ...data,
            },
          };

      serverResponses.push(serverResponse);
    }
  }
  const batchReqTimeTaken = (Date.now() - batchReqStartTime) / 1000;

  return {
    application: application,
    apisTested: serverResponses.length,
    totalTestDuration: `${batchReqTimeTaken} s`,
    data: serverResponses,
  };
}

/* ---------------------------------------- */
/* -----  main controller functions  ------ */
/* ---------------------------------------- */

// main function to proccess GET request
function httpGetDailyMonitorApis(req, res) {
  const apis = getApisListWithApplication();

  res.status(200).json({
    data: apis,
  });
}

// main function to process batch POST requests
async function httpGetBatchServerResponse(req, res) {
  const respose = await getBatchHttpResponse(req.body);

  return res.status(200).json(respose);
}

// main function to proccess single POST request
async function httpGetServerResponse(req, res) {
  const startTime = Date.now();

  if (!req.body.url) {
    return res.status(400).json({
      testStatus: "failed",
      testType: "individual url request",
      message: "missing url input",
    });
  }

  if (!isValidUrl(req)) {
    return res.status(400).json({
      testStatus: "failed",
      testType: "individual url request",
      message: "invalid url input",
    });
  }

  const userReqValues = getRequestValues(req.body);

  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // hotfix to avoid "unable to verify the first certificate" warning on https requests by not verifying that the SSL/TLS certificates
    let serverResponse = await axios.get(req.body.url);

    // not performing actions because:
    // response is expected as 404 and is passed to error
  } catch (error) {
    const {
      response: { data },
      request: {
        res: { statusCode, responseUrl, statusMessage },
        method,
      },
    } = error;

    const serverResMessage = {
      serverStatus: data.status,
      serverMessage: data.message,
    };

    const timeTaken = (Date.now() - startTime) / 1000;

    // return responses based on user requested values and server response values comparasion validation
    return isExpectedErrorMessage(userReqValues, serverResMessage)
      ? res.status(200).json({
          testStatus: "passed",
          testType: "individual url request",
          message: "user input and server response matched",
          testDuration: `${timeTaken} s`,
          url: responseUrl,
          method: method,
          serverResponse: {
            statusCode,
            statusMessage,
            ...data,
          },
        })
      : res.status(400).json({
          testStatus: "failed",
          testType: "individual url request",
          message: "user input and server response didn't matched",
          url: responseUrl,
          method: method,
          serverResponse: {
            statusCode,
            statusMessage,
            ...data,
          },
        });
  }
}

// main function to proccess single application POST request
async function httpGetBatchApplicationResponse(req, res) {
  if (!req.body.application) {
    return res.status(400).json({
      testStatus: "failed",
      testType: "application urls batch request",
      message: "missing application name",
    });
  }

  if (!isValidApplication(req.body.application)) {
    return res.status(400).json({
      testStatus: "failed",
      testType: "application urls batch request",
      message: "invalid application name",
    });
  }

  const userRequestedApplication = isValidApplication(req.body.application);
  const response = await getApplicationRespose(userRequestedApplication);
  return res.json(response);
}

module.exports = {
  httpGetDailyMonitorApis,
  httpGetServerResponse,
  httpGetBatchServerResponse,
  httpGetBatchApplicationResponse,
};
