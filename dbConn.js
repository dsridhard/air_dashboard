// dbConne.js

const oracledb = require("oracledb");

async function connectToOracle() {
  try {
    const connection = await oracledb.getConnection({
      user: "IR_AIR",
      password: "irctc",
      connectString: "172.28.57.14:1986/portalt",
    });
    console.log("Successfully connected to Oracle DB");
    return connection;
  } catch (err) {
    console.error("Error connecting to Oracle DB:", err.message);
    throw err;
  }
}

module.exports = connectToOracle;
