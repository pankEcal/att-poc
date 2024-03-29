const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const { clearFiles } = require("../utils/clearFiles");
const { validateServerRes } = require("../utils/validateServerRes");

// hanlde errors
function handleError(error) {
  // if error is occured then pass the message and status codes accordingly
  const {
    name,
    code,
    response: { status } = {}, // if response.status === undefined, in that case assign it as an empty object
    config: { url } = {}, // if response.config === undefined, in that case assign it as an empty object
    request: { method } = {}, // if response.request === undefined, in that case assign it as an empty object
    message: axiosErrorMessage,
    response: {
      datas: severResponseData = {
        message: "generic message. some error occured!!",
      },
    },
  } = error;

  const errorResponse = {
    status,
    code,
    message: axiosErrorMessage,
  };

  const errorResponseData = {
    testResult: {
      url: url,
      success: false,
      method: method,
      message:
        severResponseData?.message || severResponseData?.successMessage
          ? severResponseData.message || severResponseData.successMessage
          : axiosErrorMessage,
      status,
    },
    serverResponse:
      typeof severResponseData === "string"
        ? { message: severResponseData }
        : {
            ...severResponseData,
          },
    error: errorResponse,
  };

  return { data: errorResponseData, status: status ?? 400 }; // if status value is not coming from error, pass 400 as default
}

// handle file upload requests
async function handleFileUploadReq(request) {
  const {
    body: { baseUrl, apiLink },
    file,
  } = request;

  // validate if request body. If it's empty then throw relevant response and don't proceed for any requests
  if (!Object.keys(request.body).length) {
    const data = {
      testResult: {
        success: false,
        message: "Missing required request data",
        status: 400,
      },
    };
    return { data, status: 400 };
  }

  // validate baseUrl and apiLink. If any of is not present then throw relevant response and don't proceed for any requests
  if (!baseUrl || !apiLink) {
    const data = {
      testResult: {
        success: false,
        status: 400,
        message: "Invalid or incomplete URL input",
      },
    };

    return {
      data,
      status: 400,
    };
  }

  // validate if file is uploaded or not
  if (!file) {
    const data = {
      testResult: {
        success: false,
        message: "Missing file to upload",
        status: 400,
      },
    };
    return { data, status: 400 };
  }

  try {
    const {
      body: { baseUrl, apiLink, requestMethod, ...requestParams },
      file,
      headers,
    } = request;

    // validate request method
    if (!Boolean(requestMethod)) {
      const data = {
        testResult: {
          success: false,
          message: "Request method not provided",
          status: 400,
        },
      };
      return {
        data,
        status: 400,
      };
    } else if (String(requestMethod).toUpperCase() !== "POST") {
      const data = {
        testResult: {
          success: false,
          message: "Invalid request method. Only POST request is accepted",
          status: 400,
        },
      };
      return {
        data,
        status: 400,
      };
    }

    let serverResponse = {};
    let validationMessage = {};

    // create a new formData object instance to handle file uploading
    let formDataInput = new FormData();
    // append the uploaded file and body params into the created formData
    formDataInput.append("csvfile", fs.createReadStream(file.path));
    for (key in requestParams) {
      formDataInput.append(key, requestParams[key]);
    }

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // hotfix to avoid "unable to verify the first certificate" warning on https requests by not verifying that the SSL/TLS certificates

    // if  baseUrl and apiLink fields are non-empty then make POST request with the created formData
    serverResponse = await axios.post(baseUrl + apiLink, formDataInput, {
      headers: {
        authorization: headers.authorization ? headers.authorization : null,
      },
    });

    // get server response after making HTTP requst to the provided URL
    const { data, status } = serverResponse;
    // perform validation and get validation message if server responded with data
    if (data) {
      validationMessage = validateServerRes(requestParams, data);
    }

    // condition to validate test status
    // if validation param is passed then it will validate it and give success status based on validation which will be testResult success status.
    // if validation param isn't passed then test result will be thrown based on server response.
    const isPassingServerResponse = status === 200 && data.success === true;
    const teststatus = validationMessage.validated
      ? validationMessage.success
      : isPassingServerResponse;

    // populate final test result
    const testResult = {
      url: baseUrl + apiLink,
      success: teststatus,
      method: request.method,
      status: status ?? 400,
      message: validationMessage.validated
        ? validationMessage.message
        : data.successMessage,
    };

    // clear the file content after getting server response
    clearFiles();

    // return response back to the calling method
    return {
      data: { testResult, serverResponse: data, validationMessage },
      status,
    };
  } catch (error) {
    return handleError(error);
  }
}

// handle normal requests (without file uploads)
async function handlePlainReq(request) {
  const {
    body: { baseUrl, apiLink },
  } = request;

  // validate if request body. If it's empty then throw relevant response and don't proceed for any requests
  if (!Object.keys(request.body).length) {
    const data = {
      testResult: {
        success: false,
        message: "Missing required request data",
        status: 400,
      },
    };
    return { data, status: 400 };
  }

  // validate baseUrl and apiLink. If any of is not present then throw relevant response and don't proceed for any requests
  if (!baseUrl || !apiLink) {
    const data = {
      testResult: {
        success: false,
        status: 400,
        message: "Invalid or incomplete URL input",
      },
    };

    return {
      data,
      status: 400,
    };
  }

  try {
    // get required data from request body to make request
    const {
      body: {
        baseUrl,
        apiLink,
        requestMethod = undefined,
        requestParams,
        validationParams,
        queryParams = {},
      },
      headers,
    } = request;

    // validate request method
    if (!Boolean(requestMethod)) {
      const data = {
        testResult: {
          success: false,
          message: "Request method not provided",
          status: 400,
        },
      };

      return {
        data,
        status: 400,
      };
    } else if (
      String(requestMethod).toUpperCase() !== "GET" &&
      String(requestMethod).toUpperCase() !== "POST"
    ) {
      const data = {
        testResult: {
          success: false,
          status: 400,
          message:
            "Invalid request method. Only GET and POST requests are accepted.",
        },
      };

      return {
        data,
        status: 400,
      };
    }

    let serverResponse = {};
    let validationMessage = {};

    // handle request methods and populate data to serverResponse
    if (requestMethod.toUpperCase() === "GET") {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // hotfix to avoid "unable to verify the first certificate" warning on https requests by not verifying that the SSL/TLS certificates
      const response = await axios.get(baseUrl + apiLink); // make HTTP request and get response back
      Object.assign(serverResponse, response); // update responsedata to be sent after making request
    } else if (requestMethod.toUpperCase() === "POST") {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // hotfix to avoid "unable to verify the first certificate" warning on https requests by not verifying that the SSL/TLS certificates
      // make HTTP request and get response back
      const response = await axios.post(
        `${baseUrl}${apiLink}${queryParams.length ? "?" + queryParams : ""}`,
        requestParams,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: headers.authorization ? headers.authorization : null,
          },
        }
      );
      Object.assign(serverResponse, response); // update responsedata to be sent after making request
    }

    // get server response after making HTTP requst to the provided URL
    const {
      data,
      status,
      config: { url: requestedUrl = baseUrl + apiLink },
    } = serverResponse;
    // perform validation and get validation message if server responded with data
    if (data) {
      validationMessage = validateServerRes(validationParams, data);
    }

    // condition to validate test status
    // if validation param is passed then it will validate it and give success status based on validation which will be testResult success status.
    // if validation param isn't passed then test result will be thrown based on server response.
    const isPassingServerResponse =
      (status === 200 || status === 201) &&
      (data.success === true || data.status === true);
    const teststatus = validationMessage.validated
      ? validationMessage.success
      : isPassingServerResponse;

    const testResult = {
      url: requestedUrl,
      success: teststatus,
      method: request.method,
      status: status ?? 400,
      message: validationMessage.validated
        ? validationMessage.message
        : data.message ||
          data.successMessage ||
          data.errorMessage ||
          "message field missing in server response",
    };

    // return response back to the calling method
    return {
      data: { testResult, serverResponse: { ...data }, validationMessage },
      status: status ?? 400,
    };
  } catch (error) {
    return handleError(error);
  }
}

// handle application level requests
async function handleBatchApplicationReq(request) {
  // record starting time before running test to track the total time taken
  const batchStartingTime = Date.now();

  const {
    body: { applicationName, baseUrl, apis },
    headers,
  } = request;

  // validate if request body. If it's empty then throw relevant response and don't proceed for any requests
  if (!Object.keys(request.body).length) {
    const data = {
      testResult: {
        success: false,
        message: "Missing required request data",
        status: 400,
      },
    };
    return { data, status: 400 };
  }

  if (!baseUrl) {
    const data = {
      testResult: {
        success: false,
        status: 400,
        message: "Missing baseUrl in request body",
      },
    };

    return {
      data,
      status: 400,
    };
  }

  if (!applicationName) {
    const data = {
      testResult: {
        success: false,
        status: 400,
        message: "Missing application name in request body",
      },
    };

    return {
      data,
      status: 400,
    };
  }

  if (!apis) {
    const data = {
      testResult: {
        success: false,
        status: 400,
        message: "Missing apis data in request body",
      },
    };

    return {
      data,
      status: 400,
    };
  }

  const testData = [];
  for (let i = 0; i < apis.length; i++) {
    // record starting time before running test to track the total time taken
    const individualStartingTime = Date.now();

    const {
      apiLink,
      requestMethod,
      requestParams,
      validationParams,
      apiName,
      queryParams = {},
    } = apis[i];

    const request = {
      body: {
        baseUrl,
        apiLink,
        requestMethod,
        requestParams,
        validationParams,
        queryParams,
      },
      headers,
    };

    const { data } = await handlePlainReq(request);
    Object.assign(data.testResult, { apiName: apiName ?? null });

    // updating response object to add time taken to execute tests
    Object.assign(data.testResult, {
      testDuration: `${(Date.now() - individualStartingTime) / 1000} s`,
    });

    testData.push(data);
  }

  return {
    data: {
      applicationName,
      testDuration: `${(Date.now() - batchStartingTime) / 1000} s`,
      apisTested: testData.length,
      testData,
    },
  };
}

const getApplicationData = () => {
  return (data = {
    applicationName: "Bike Intell",
    baseUrl: "https://evaai.enginecal.com/",
    apis: [
      {
        apiName: "User Login Check",
        apiLink: "core/v1/bike-intell/checklogins",
        requestMethod: "POST",
        requestParams: {
          u: "saurabh.singh@enginecal.com",
          p: "123456",
        },
        validationParams: {
          userType: "Bluetooth User",
        },
      },
      {
        apiName: "forgot password",
        apiLink: "core/v1/bike-intell/forgetpass",
        requestMethod: "POST",
        requestParams: {
          u: "saurabh.singh@enginecal.com",
          p: "123456",
        },
        validationParams: {
          userType: "Bluetooth User",
        },
      },
    ],
  });
};

/* ================================================== */
/* ========  main methods to hanlde requests ======== */
/* ================================================== */

// main function to handle a HTTP request
async function makeHttpReq(request) {
  // hanlde non file uploading request
  return await handlePlainReq(request);
}

async function makeBatchHttpReq(request) {
  // const data = getApplicationData();
  const { data } = await handleBatchApplicationReq(request);

  return {
    data,
    status: 200,
  };
}

module.exports = { makeHttpReq, makeBatchHttpReq, handleFileUploadReq };
