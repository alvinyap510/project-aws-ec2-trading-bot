/*** Imports ***/
require("dotenv").config();
const axios = require("axios");
const crypto = require("crypto");
const { RestClientV5 } = require("bybit-api");

/*** ENV ***/
const API_KEY = process.env.BYBIT_API_KEY;
const BYBIT_API_SECRET = process.env.BYBIT_API_SECRET;

/*** Comnfigure ***/

const INTERVAL_TIME = 10000; // 10 seconds
const TARGET_ASSET = "BTCUSD";

/*** Utilities & Herlper Functions ***/

// Function to sleep for an amount of time
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*** Sub Functions ***/
// Function to sign requests
const signRequest = (params, secret) => {
  const orderedParams = Object.keys(params)
    .sort()
    .reduce((obj, key) => {
      obj[key] = params[key];
      return obj;
    }, {});

  const query = Object.keys(orderedParams)
    .map((key) => `${key}=${orderedParams[key]}`)
    .join("&");
  return crypto.createHmac("sha256", secret).update(query).digest("hex");
};

const getAccountBalance = async () => {
  try {
    const timestamp = new Date().getTime();
    const params = {
      api_key: API_KEY,
      timestamp: timestamp,
    };

    // Generate the signature
    const signature = signRequest(params, BYBIT_API_SECRET);

    // Add the signature to the request parameters
    params.sign = signature;

    // Make the request to the Bybit API
    const response = await axios.get(
      "https://api.bybit.com/v2/private/wallet/balance",
      { params }
    );

    // Handle the response
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching account balance:", error);
    throw error;
  }
};

const getAssetPrice = async (assetSymbol) => {
  try {
    // Replace with the actual Bybit API endpoint and add your asset symbol
    const response = await axios.get(
      `https://api.bybit.com/v2/public/tickers?symbol=${assetSymbol}`
    );
    // Handle response according to Bybit's API structure
    if (response.data && response.data.result) {
      return response.data.result[0].last_price; // Adjust based on actual response structure
    }
    return null;
  } catch (error) {
    console.error("Error fetching asset price:", error);
    return null;
  }
};

/*** Main ***/

async function main() {
  while (true) {
    // Print the time
    const now = new Date();
    const readableTime = now.toString();
    console.log(readableTime);

    // Demo code to try connect to ByBit's API
    // axios
    //   .get("https://api.bybit.com/v5/market/time")
    //   .then((response) => {
    //     console.log("Response:", response.data);
    //   })
    //   .catch((error) => {
    //     console.log("Error:", error.message);
    //   });

    // Get Target Asset Price
    const currentPrice = await getAssetPrice(TARGET_ASSET);
    console.log(`Current ${TARGET_ASSET} Price:, ${currentPrice} \n`);

    // Get Wallet Balance
    const accountBalance = await getAccountBalance();
    let USDTBalance;

    if (Object.keys(accountBalance.result).length > 0) {
      console.log(accountBalance.result);
      USDTBalance = accountBalance.result.USDT;
    } else {
      console.log("Error fetching wallet balance");
    }

    // Custom Strategy
    // Execute your custom strategy here

    // Sleep
    await sleep(INTERVAL_TIME);
  }
}

main();
