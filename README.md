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
   - `status`: to verify if the user given status value is matching with the server responded status. _(If the value isn't passed then default value will be used)_
   - `message`: to verify if the user given message value is matching with the server responded message. _(If the value isn't passed then default value will be used)_

   > NOTE: Default values for `status` and `message` are `false` and `Incorrect url` respectively.

3. POST `/dailymonitor/batch` to make batch test request on all the listed URLs.

   Expected fields:

   - `status`: to verify if the user given status value is matching with the server responded status. _(If the value isn't passed then default value will be used)_
   - `message`: to verify if the user given message value is matching with the server responded message. _(If the value isn't passed then default value will be used)_

   > NOTE: Default values for `status` and `message` are `false` and `Incorrect url` respectively.

4. POST `/dailymonitor/application` to make batch test request on all URLs related to a particular application only.

   Expected fields:

   - `requestedApplication`: should be the name of the application whose URLs are being tested. (_mandatory field_)
     > NOTE: while passing value, be sure that the letter casing is exectly same as application name provided at GET `/dailymonitor/apis`

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
