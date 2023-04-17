## Exposed URLs:

### 1. Daily Monitor APIs:

- GET `/dailymonitor/apis` to get the list of available APIs
- POST `/dailymonitor` to make individual POST request. Expected `url`, `status`, and `message` fields. `url` field is mandatory, If `status` and `message` isn't provided then default values will be used.
- POST `/dailymonitor/batch` to make batch POST request. Expected `status`, and `message` fields. If values are not provided then the default values are used.
- POST `/dailymonitor/application` to make batch POST request of particular application and targets included urls only. Expected mandatory `requestedApplication` field.

### 2. File upload API:
