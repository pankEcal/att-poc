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
- [**Determining Test Result**](#determining-test-result)

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

## **Determining Test Result**

After running test, The test request will respond with JSON data as shown in the sample responses. The key `testStatus` indicates wheather the test was passed or not based on the test logic was implemented. Test is passed for the value `passed` and failed for the value `failed`. No other parameters are deciding part of any of the test result.
