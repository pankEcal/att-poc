const data = {
  applicationName: "Bike Intell",
  baseUrl: "https://evaai.enginecal.com/",
  apis: [
    {
      applicationName: "User Login Check",
      apiLink: "core/v1/bike-intell/checklogin",
      requestMethod: "POST",
      requestParams: '{"u":"saurabh.singh@enginecal.com","p":"123456"}',
    },
    {
      applicationName: "forgot password",
      apiLink: "core/v1/bike-intell/forgetpass",
      requestMethod: "POST",
      requestParams: '{"email":"test@enginecal.com","password":"123@Ecal"}',
    },
    {
      applicationName: "New User Registration",
      apiLink: "core/v1/bike-intell/profile",
      requestMethod: "POST",
      requestParams:
        '{"user": {"deviceid": "50000411","name": "Rahul","password": "1234ec", "email": "somewhere@example.com","mobile": "+91 9876543210","emergency_no1": "+91 1234567890","emergency_no2": "+91 1234567890"}}',
    },
    {
      applicationName: "Check Activation Code Expiry (New Activation Code)",
      apiLink: "core/v1/bike-intell/valcode",
      requestMethod: "POST",
      requestParams:
        '{"acode":"Sa1234","mac":"56d788cdc641eeA","uby":"saurabh.singh@enginecal.com"}',
    },
    {
      applicationName: "Get User Statistics by Drive",
      apiLink: "core/v1/bike-intell/statistics",
      requestMethod: "POST",
      requestParams: '{"devID":"50000406","type":"drive","driveno":"6"}',
    },
    {
      applicationName: "Drive Score",
      apiLink: "core/v1/bike-intell/statistics",
      requestMethod: "POST",
      requestParams: '{"devID":"50000406","type":"drive","driveno":"6"}',
    },
    {
      applicationName: "Vehicle Model",
      apiLink: "core/v1/bike-intell/veh_model",
      requestMethod: "POST",
      requestParams: '{"mfd":"Aprilia_IND_B"}',
    },
    {
      applicationName: "Vehicle Variant and other Specs",
      apiLink: "core/v1/bike-intell/veh_spec",
      requestMethod: "POST",
      requestParams: '{"mfd":"Hyundai_IND_C","model":"Eon","fuel":"Diesel"}',
    },
    {
      applicationName: "New Vehicle Profile",
      apiLink: "core/v1/bike-intell/vehicle",
      requestMethod: "POST",
      requestParams:
        '{"veh_basic": {"deviceid": "50000410","veh_registration": "KA 01 ZZ 99979","veh_manufacturer": "Aprilia_IND_B","veh_model": "SR125","veh_varient": "BS6","fuel_type": "Petrol","mfg_year": "2015","engine_capacity": "0.125","odo":"123"}}',
    },
    {
      applicationName: "Get Calibration Value",
      apiLink: "core/v1/bike-intell/getcalvalues",
      requestMethod: "POST",
      requestParams: '{"devID":"50000410"}',
    },
    {
      applicationName: "Monitor flag",
      apiLink: "core/v1/bike-intell/monitor_flag",
      requestMethod: "POST",
      requestParams: '{"devID":"50000410"}',
    },
    {
      applicationName: "User Logout",
      apiLink: "core/v1/bike-intell/logout",
      requestMethod: "POST",
      requestParams: '{"u":"saurabh.singh@enginecal.com"}',
    },
    {
      applicationName: "File upload",
      apiLink: "event/v1/bike-intell/fileupload",
      requestMethod: "POST",
      requestParams: "csv file is passed in the form-data ",
    },
  ],
};

const getData = () => {
  console.log(JSON.stringify(data));
};

getData();
