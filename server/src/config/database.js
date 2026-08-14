const neo4j = require("neo4j-driver");
require("dotenv").config();

const uri = process.env.COGNODB_URI?.trim();
const username = process.env.COGNODB_USERNAME?.trim();
const password = process.env.COGNODB_PASSWORD?.trim();

if (!uri || !username || !password) {
  throw new Error(
    "Missing CognoDB environment variables."
  );
}

const driver = neo4j.driver(
  uri,
  neo4j.auth.basic(username, password),
  {
    connectionTimeout: 15000,
    connectionAcquisitionTimeout: 15000,
    maxConnectionLifetime: 300000,
    maxConnectionPoolSize: 20,
  }
);

async function verifyConnection() {
  try {
    await driver.verifyConnectivity();

    console.log(
      "CognoDB connection verified successfully"
    );

    return true;
  } catch (error) {
    console.error(
      "CognoDB connection unavailable:",
      error.message
    );

    return false;
  }
}

module.exports = {
  driver,
  verifyConnection,
};