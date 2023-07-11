// method to reutrn validation message based on the values passed
function validateServerRes(validationParams, serverResponses) {
  // creating validation message object and a map to store results
  const validationMessage = {};
  const resultsMap = new Map();
  resultsMap.set("passed", 0);
  resultsMap.set("failed", 0);

  // check if validation params are present or not, if not then it will be handled inside the block, and won't proceed further
  if (!validationParams || !Object.entries(validationParams).length) {
    Object.assign(validationMessage, {
      success: false,
      validated: false,
      message: "validation check skipped. No values passed.",
    });

    return validationMessage;
  }

  // iterate through each validation param and check if it is present in server response
  for (key in validationParams) {
    // if the validation param isn't present in server response then consider it failed case
    if (String(serverResponses[key]) === "undefined") {
      resultsMap.set("failed", resultsMap.get("failed") + 1);
    } else {
      // defining a validation condition. If value of the validation param and server param are strictly matching then it's validated and is passing case.
      const isMatchingValidationParam =
        String(validationParams[key]) === String(serverResponses[key]);

      // update validation result map based on condition
      isMatchingValidationParam
        ? resultsMap.set("passed", resultsMap.get("passed") + 1)
        : resultsMap.set("failed", resultsMap.get("failed") + 1);
    }
  }

  // check in validation message for the passing case and update the result map accordingly.
  // passing condition: at least 1 passing case should be there and no failed case should be present.
  if (resultsMap.get("passed") >= 1 && resultsMap.get("failed") === 0) {
    Object.assign(validationMessage, {
      success: true,
      validated: true,
      message: "User input and server response is matching",
    });
  } else {
    Object.assign(validationMessage, {
      success: false,
      validated: true,
      message: "User input and server response not matching",
    });
  }

  // return the validation based on the conditions checked
  return validationMessage;
}

module.exports = { validateServerRes };
