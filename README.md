## **How to use the app**

Before setting the application on local server, ensure that you have Node v16 or above installed on the system.

Steps to setup the app:

1. Clone the repo
2. cd into the repo
3. Install dependencies with `npm install`
4. execute command `npm run server` to start the application.

## **Exposed URLs:**

> NOTE: The app runs on [localhost:8000](http://localhost:8000/). Please follow exposed APIs section to know operating routes. The default PORT doens't provide any valid requests or response

### **1. Daily Monitor APIs:**

1. GET `/dailymonitor/apis` to get the list of available APIs.
2. POST `/dailymonitor` to make individual POST request.

   Expected fields:

   - `url`: URL to perform the test with. _(mandatory field)_
     > NOTE: while passing url value, be sure that the letter casing is exectly same as application name provided at GET `/dailymonitor/apis`
   - `status`: to verify if the user given status value is matching with the server responded status. _(If the value isn't passed then default value will be used)_
   - `message`: to verify if the user given message value is matching with the server responded message. _(If the value isn't passed then default value will be used)_

   > NOTE: Default values for `status` and `message` are `false` and `Incorrect url` respectively.

   The test response should appear like following. Based on the value of the `testStatus` in the response, the test status is determined. `passed` for passed case and `failed` for failed case.

   ```JSON
   {
      "data": {
         "serverResponse": {
               "status": false,
               "message": "Incorrect url"
         },
         "statusCode": 404,
         "testDuration": "522 ms",
         "testStatus": "passed",
         "testType": "individual request",
         "message": "user input and server response matched !",
         "url": "http://evaaidev.enginecal.com/core"
      }
   }
   ```

3. POST `/dailymonitor/batch` to make batch test request on all the listed URLs.

   Expected fields:

   - `status`: to verify if the user given status value is matching with the server responded status. _(If the value isn't passed then default value will be used)_
   - `message`: to verify if the user given message value is matching with the server responded message. _(If the value isn't passed then default value will be used)_

   > NOTE: Default values for `status` and `message` are `false` and `Incorrect url` respectively.

   The test response should appear like following. Based on the value of the `testStatus` in the response, the test status is determined for each of the URL checked. `passed` for passed case and `failed` for failed case.

   ```JSON
   {
      "totalTestDuration": "4157 ms",
      "apisTested": 2,
      "data": [
         {
               "serverResponse": {
                  "status": false,
                  "message": "Incorrect url"
               },
               "statusCode": 404,
               "testDuration": "336 ms",
               "testStatus": "passed",
               "testType": "batch test request",
               "message": "user input and server response matched !",
               "url": "http://tvseoldev.enginecal.com/event",
               "application": "EOL Application Dev"
         },
         {
               "serverResponse": {
                  "status": false,
                  "message": "Incorrect url"
               },
               "statusCode": 404,
               "testDuration": "78 ms",
               "testStatus": "passed",
               "testType": "batch test request",
               "message": "user input and server response matched !",
               "url": "http://tvseoldev.enginecal.com/core",
               "application": "EOL Application Dev"
         }
      ]
   }
   ```

4. POST `/dailymonitor/application` to make batch test request on all URLs related to a particular application only.

   Expected fields:

   - `application`: should be the name of the application whose URLs are being tested. (_mandatory field_)
     > NOTE: while passing value, be sure that the letter casing is exectly same as application name provided at GET `/dailymonitor/apis`

   The test response should appear like following. Based on the value of the `testStatus` in the response, the test status is determined for each of the URL checked. `passed` for passed case and `failed` for failed case.

   ```JSON
   {
      "application": "EOL Application Prod",
      "apisTested": 2,
      "totalTestDuration": "297 ms",
      "data": [
         {
               "serverResponse": {
                  "status": false,
                  "message": "Incorrect url"
               },
               "statusCode": 404,
               "testDuration": "156 ms",
               "testStatus": "passed",
               "testType": "application urls batch request",
               "message": "user input and server response matched !",
               "url": "https://evaeol.tvsmotor.com/event",
               "application": "EOL Application Prod"
         },
         {
               "serverResponse": {
                  "status": false,
                  "message": "Incorrect url"
               },
               "statusCode": 404,
               "testDuration": "140 ms",
               "testStatus": "passed",
               "testType": "application urls batch request",
               "message": "user input and server response matched !",
               "url": "https://evaeol.tvsmotor.com/core",
               "application": "EOL Application Prod"
         }
      ]
   }
   ```

### **2. File upload API:**

1.  GET `/fileupload` to get the basic response only. It should return following JSON response.

    ```JSON
    {
      "status": "API is working fine"
    }
    ```

2.  POST `/fileupload` to perform file upload operation.

    Expected fields: _(All mandatory)_

    - `csvfile`: Properly valid csv file which should have device Id heading and it's value at `A1` and `A2` respectively.
    - `uploadUrl`: string/text value which should be a valid URL which is capable of performing expected operation.
