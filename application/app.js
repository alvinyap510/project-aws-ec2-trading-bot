/*** Imports ***/
require("dotenv").config();
const axios = require("axios");
const { RestClientV5 } = require("bybit-api");

/*** ENV ***/
const API_KEY = process.env.BYBIT_API_KEY;

/*** Utilities ***/

// Function to sleep for an amount of time
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*** Sub Functions ***/

/*** Main ***/

async function main() {
  while (true) {
    // Print the time
    const now = new Date();
    const readableTime = now.toString();
    console.log(readableTime);

    // Demo code to try connect to ByBit's API
    axios
      .get("https://api.bybit.com/v5/market/time")
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.log("Error:", error.message);
      });
    await sleep(10000);
  }
}

main();
