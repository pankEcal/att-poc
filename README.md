- [**Setting up the app in local environment**](#setting-up-the-app-in-local-environment)
- [**Exposed Routes**](#exposed-routes)
  - [**Daily monitor APIs**](#daily-monitor-apis)
    - [1. GET `/dailymonitor/apis`](#1-get-dailymonitorapis)
    - [2. POST `/dailymonitor`](#2-post-dailymonitor)
    - [3. POST `/dailymonitor/application`](#3-post-dailymonitorapplication)
    - [4. POST `/dailymonitor/batch`](#4-post-dailymonitorbatch)
  - [**File Upload APIs**](#file-upload-apis)
    - [1. GET `/fileupload`](#1-get-fileupload)
    - [2. POST `/fileupload`](#2-post-fileupload)
  - [**Hardcoded Upload APIs**](#hardcoded-upload-apis)
    - [1. POST `/hardcoded`](#1-post-hardcoded)
- [**Determining Test Result**](#determining-test-result)
  - [for File Upload APIs and Daily monitor APIs](#for-file-upload-apis-and-daily-monitor-apis)
  - [for Hardcoded Upload APIs](#for-hardcoded-upload-apis)

## **Setting up the app in local environment**

pre requisite:

1.  must have node v16 or above on local machine

setting up app:

1.  clone the repo
2.  cd into the project
3.  install dependencies with `npm install`
4.  start developement server with `npm run server`
5.  verify console message `app is running on PORT 8000` is coming up

> The PORT value is hardcoded as `8000` at `src\server.js`

## **Exposed Routes**

The application has following 2 major tests. They are:

1.  daily monitoring of the list of URLs.
2.  load testing of a URL with file uploading.

### **Daily monitor APIs**

#### 1. GET `/dailymonitor/apis`

The API will give the list of applications and their respective URLs to perform the test.

The sample response will be like:

```JSON
{
   "data": [
      {
            "application": "EOL Application Dev",
            "urls": [
               "http://tvseoldev.enginecal.com/event",
               "http://tvseoldev.enginecal.com/core"
            ]
      },
      {
            "application": "EOL Application Prod",
            "urls": [
               "https://evaeol.tvsmotor.com/event",
               "https://evaeol.tvsmotor.com/core"
            ]
      },
      {
            "application": "EngineInsight Prod",
            "urls": []
      },
   ]
}
```

#### 2. POST `/dailymonitor`

The API will perform test on an individual URL provided from client side.

Expected fields:

1.  `url`: URL to perform the test with (mandatory field)
2.  `status`: to provide expected status field value from server and validate if it matches with actual server responded status value. _(If the value isn't passed then default value will be used)_
3.  `message`: to provide expected message field value from server and validate if it matches with actual server responded message value. _(If the value isn't passed then default value will be used)_

---

The Default values for `status` and `message` are `false` and `Incorrect url` respectively. It's hardcoded at `src\models\dailymonitor.model.js` inside of `defalutValues` object.

Sample response for passing case:

```JSON
{
   "testStatus": "passed",
   "testType": "individual url request",
   "message": "user input and server response matched",
   "testDuration": "428 ms",
   "url": "http://evaaidev.enginecal.com/core",
   "method": "GET",
   "serverResponse": {
      "statusCode": 404,
      "statusMessage": "Not Found",
      "status": false,
      "message": "Incorrect url"
   }
}
```

Sample response for invalid url input value case:

```JSON
{
"testStatus": "failed",
"testType": "individual url request",
"message": "invalid url input"
}
```

Sample response for missing url input value case:

```JSON
{
"testStatus": "failed",
"testType": "individual url request",
"message": "missing url input"
}
```

#### 3. POST `/dailymonitor/application`

The API will perform test on URLs listed under particular application.

Expected fields:

1.  `application`: name of the application to test it's listed URLs (mandatory field).

Sample response for passing case:

```JSON
{
   "application": "RideOScope Dev",
   "apisTested": 2,
   "totalTestDuration": "445 ms",
   "data": [
      {
            "testStatus": "passed",
            "testType": "application urls batch request",
            "message": "user input and server response matched !",
            "application": "RideOScope Dev",
            "testDuration": "366 ms",
            "url": "http://tvsrdsdev.enginecal.com/event",
            "method": "GET",
            "serverResponse": {
               "statusCode": 404,
               "statusMessage": "Not Found",
               "status": false,
               "message": "Incorrect url"
            }
      },
      {
            "testStatus": "passed",
            "testType": "application urls batch request",
            "message": "user input and server response matched !",
            "application": "RideOScope Dev",
            "testDuration": "79 ms",
            "url": "http://tvsrdsdev.enginecal.com/core",
            "method": "GET",
            "serverResponse": {
               "statusCode": 404,
               "statusMessage": "Not Found",
               "status": false,
               "message": "Incorrect url"
            }
      }
   ]
}
```

Sample response for missing application input value case:

```JSON
{
"testStatus": "failed",
"testType": "application urls batch request",
"message": "missing application name"
}
```

Sample response for invalid application input value case:

```JSON
{
"testStatus": "failed",
"testType": "application urls batch request",
"message": "invalid application name"
}
```

#### 4. POST `/dailymonitor/batch`

The API will perform test on all the URLs listed in the database. The list of URLs are hardcoded at `src\models\dailymonitor.model.js` inside of `apisWithApplications` Array.

Expected fields:

1.  `status`: to provide expected status field value from server and validate if it matches with actual server responded status value. _(If the value isn't passed then default value will be used)_
2.  `message`: to provide expected message field value from server and validate if it matches with actual server responded message value. _(If the value isn't passed then default value will be used)_

---

The Default values for `status` and `message` are `false` and `Incorrect url` respectively. It's hardcoded at `src\models\dailymonitor.model.js` inside of `defalutValues` object.

> NOTE: The values are going to be checked with each of the URLs and the behaviour can't be changed as it's a batch request. In such case, use POST `/dailymonitor`

Sample response for passing case:

```JSON
{
    "totalTestDuration": "606 ms",
    "apisTested": 2,
    "data": [
        {
            "testStatus": "passed",
            "testType": "batch url request",
            "message": "user input and server response matched",
            "application": "EOL Application Dev",
            "testDuration": "524 ms",
            "url": "http://tvseoldev.enginecal.com/event",
            "method": "GET",
            "serverResponse": {
                "statusCode": 404,
                "statusMessage": "Not Found",
                "status": false,
                "message": "Incorrect url"
            }
        },
        {
            "testStatus": "passed",
            "testType": "batch url request",
            "message": "user input and server response matched",
            "application": "EOL Application Dev",
            "testDuration": "79 ms",
            "url": "http://tvseoldev.enginecal.com/core",
            "method": "GET",
            "serverResponse": {
                "statusCode": 404,
                "statusMessage": "Not Found",
                "status": false,
                "message": "Incorrect url"
            }
        }
    ]
}
```

Sample response for failed case:

```JSON
{
    "totalTestDuration": "709 ms",
    "apisTested": 2,
    "data": [
        {
            "testStatus": "failed",
            "testType": "batch test request",
            "message": "user input and server response didn't matched",
            "application": "EOL Application Dev",
            "url": "http://tvseoldev.enginecal.com/event",
            "method": "GET",
            "serverResponse": {
                "statusCode": 404,
                "statusMessage": "Not Found",
                "status": false,
                "message": "Incorrect url"
            }
        },
        {
            "testStatus": "failed",
            "testType": "batch test request",
            "message": "user input and server response didn't matched",
            "application": "EOL Application Dev",
            "url": "http://tvseoldev.enginecal.com/core",
            "method": "GET",
            "serverResponse": {
                "statusCode": 404,
                "statusMessage": "Not Found",
                "status": false,
                "message": "Incorrect url"
            }
        }
    ]
}
```

### **File Upload APIs**

#### 1. GET `/fileupload`

The API will give the the basic response just to verify if the API is working or not. It should return following JSON response.

```JSON
{
    "message": "file upload API"
}
```

#### 2. POST `/fileupload`

The API will perform file upload operation on the URL provided from client side.

Expected fields:

1.  `csvfile`: Properly valid csv file which has `device Id` heading and it's value at `A1` and `A2` positions respectively. The `device Id` value is required to perform the test and the is directly parsed from the csv file.

2.  `uploadUrl`: string/text value which is a valid URL and is capable of performing expected operation.

Sample response for passing case:

```JSON
{
    "testStatus": "passed",
    "testType": "file upload",
    "testDuration": "709 ms",
    "url": "http://evaaidev.enginecal.com/event/v1/cai/fileupload",
    "method": "POST",
    "date": "Thu, 20 Apr 2023 09:53:53 GMT",
    "deviceId": "EVA0000001",
    "serverResponse": {
        "statusCode": 200,
        "statusText": "OK",
        "success": true,
        "successMessage": "Data has been updated successfully"
    }
}
```

Sample response for failing case:

```JSON
{
    "testStatus": "failed",
    "testType": "file upload",
    "message": "Request failed with status code 404",
    "url": "http://evaaidev.enginecal.com/event/v1/cai/fileuploadsss",
    "method": "POST",
    "date": "Thu, 20 Apr 2023 09:58:14 GMT",
    "serverResponse": {
        "statusCode": 404,
        "statusText": "Not Found",
        "data": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot POST /v1/cai/fileuploadsss</pre>\n</body>\n</html>\n"
    }
}
```

Sample response for missing requierd input data case:

```JSON
{
    "testStatus": "failed",
    "testType": "file upload",
    "message": "missing required input data"
}
```

### **Hardcoded Upload APIs**

The API will perform tests based on the data provided from client side. The data will include the url to test with, params to provide to the url and also the validation data if validation has to be performed.

#### 1. POST `/hardcoded`

It has 2 major parts of performing tests.

1. tests related to file uploading
2. tests not related to file uploading

**Expected fields for tests related to file uploading:**

NOTE: The fields are expected to be passed as form data.

1. `baseUrl`: (mandatory) is base url of the API being tested.
2. `apiLink`: (mandatory) is the rest part of the API being tested.
3. `csvfile`: (mandatory) is the csv file being uploaded on the API.
4. `headers`: is authorization header which could be required. Should be directly passed as a request header instead of sending in request body.

NOTE: Fields other than mandatory fields are considered as validation fields. The test result will be determined based on that.

> If any header is required to be passed then it has to be passed as standard request header while sending the request.

**Expected fields for tests not related to file uploading:**

NOTE: The fields are expected to be passed in JSON format

1. `baseUrl`: (mandatory) is base url of the API being tested.
2. `apiLink`: (mandatory) is the rest part of the API being tested.
3. `requestMethod`: (mandatory) is the type of the test to be done. Anything except of "GET" or "POST" will be considerd invalid request method.
4. `requestParams`: is the field which consists all the required parameters to make valid request to the API.
5. `validationParams`: is the field which consists all the required parameters to validate the server response received from server side of the tested API. If the field is missing or empty, then validation check will be skipped.

**Understanding JSON response**

The test response will have mandatory `testResult` field which includes data related to test result.

---

Upon hitting the API successfully, it will have `serverResponse` and `validationMessage` fields respectively which holds response received from server and validation status respectively.

example: making request to valid url with valid params but passing wrong validation params.

request params:

```JSON
{
    "baseUrl": "https://evaai.enginecal.com/",
    "apiLink": "core/v1/bike-intell/checklogin",
    "requestParams": {
        "u": "saurabh.singh@enginecal.com",
        "p": "12345"
    },
    "validationParams": {
        "errorCode": "1003"
    }
}
```

test response:

```JSON
{
    "testResult": {
        "url": "https://evaai.enginecal.com/core/v1/bike-intell/checklogin",
        "success": false,
        "method": "POST",
        "testDuration": "709 ms"
    },
    "serverResponse": {
        "success": false,
        "errorCode": "1002",
        "errorMessage": "Invalid Username or Password!"
    },
    "validationMessage": {
        "success": false,
        "validated": true,
        "message": "User input and server response not matching"
    }
}
```

---

In case of error which was not able to be handled by the request, it will have `error` field which will include all the information received related to the error instance.

example: making request to invalid url with valid params which is ideally a error condition.

request params:

```JSON
{
    "baseUrl": "https://evaai.enginecal.com/",
    "apiLink": "core/v1/bike-intell/checklogsin",
    "requestParams": {
        "u": "saurabh.singh@enginecal.com",
        "p": "12345"
    },
    "validationParams": {
        "errorCode": "1003"
    }
}
```

test response:

```JSON
{
    "testResult": {
        "url": "https://evaai.enginecal.com/core/v1/bike-intell/checklogsin",
        "success": false,
        "method": "POST",
        "message": "Request failed with status code 404",
        "testDuration": "489 ms"
    },
    "error": {
        "message": "Request failed with status code 404",
        "name": "AxiosError",
        "stack": "AxiosError: Request failed with status code 404\n    at settle (C:\\Users\\Admin\\Desktop\\pankaj\\NodeJs\\att-poc\\node_modules\\axios\\dist\\node\\axios.cjs:1900:12)\n    at IncomingMessage.handleStreamEnd (C:\\Users\\Admin\\Desktop\\pankaj\\NodeJs\\att-poc\\node_modules\\axios\\dist\\node\\axios.cjs:2952:11)\n    at IncomingMessage.emit (node:events:402:35)\n    at endReadableNT (node:internal/streams/readable:1343:12)\n    at processTicksAndRejections (node:internal/process/task_queues:83:21)",
        "config": {
            "transitional": {
                "silentJSONParsing": true,
                "forcedJSONParsing": true,
                "clarifyTimeoutError": false
            },
            "adapter": [
                "xhr",
                "http"
            ],
            "transformRequest": [
                null
            ],
            "transformResponse": [
                null
            ],
            "timeout": 0,
            "xsrfCookieName": "XSRF-TOKEN",
            "xsrfHeaderName": "X-XSRF-TOKEN",
            "maxContentLength": -1,
            "maxBodyLength": -1,
            "env": {
                "Blob": null
            },
            "headers": {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "User-Agent": "axios/1.3.4",
                "Content-Length": "47",
                "Accept-Encoding": "gzip, compress, deflate, br"
            },
            "method": "post",
            "url": "https://evaai.enginecal.com/core/v1/bike-intell/checklogsin",
            "data": "{\"u\":\"saurabh.singh@enginecal.com\",\"p\":\"12345\"}"
        },
        "code": "ERR_BAD_REQUEST",
        "status": 404
    }
}
```

## **Determining Test Result**

### for File Upload APIs and Daily monitor APIs

After running test, The test request will respond with JSON data as shown in the sample responses. The key `testStatus` indicates wheather the test was passed or not based on the test logic was implemented. Test is passed for the value `passed` and failed for the value `failed`. No other parameters are deciding part of any of the test result.

### for Hardcoded Upload APIs

The field `testResult` is where the test result is holded. Inside of it, value of the boolean `success` field determines the test result.(i.e: passed for `true` and `false` for false)

---

Also, the field `validationMessage` holds result related to validation separately.

If the `validationParams` field isn't passed or is empty while making request, validation won't be performed and it will be considered as failed validation. The `validated` field value will be `false` in such case and `success` will also be `false`.

If the `validationParams` field is passed and is not empty while making request, then `validated` field will be `true` and `success` will be `true` or `false` based on the values passed to to the field. The value of `success` field in `testResult` is directly proportional to the value of `success` field in `validationParams`.
