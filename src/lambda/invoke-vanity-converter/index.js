("use strict");
const AWS = require("aws-sdk");

const lambda = new AWS.Lambda({
  region: "us-east-1",
});

exports.handler = async function (event, context, callback) {
  try {
    const { phoneNumber } = event.Details.Parameters;
    let { LAMBDA_NAME } = process.env;

    console.log("Invoking ", LAMBDA_NAME, " for phone number ", phoneNumber);

    const params = {
      FunctionName: LAMBDA_NAME || "vanity-numbers",
      InvocationType: "Event",
      LogType: "None",
      Payload: JSON.stringify({
        phoneNumber: phoneNumber,
      }),
    }; // params to declare the async lambda  that needs to be invoked -
    

    await lambda.invoke(params).promise(); 
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};