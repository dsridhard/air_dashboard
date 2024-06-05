// dbConne.js

const oracledb = require("oracledb");

async function connectToOracle() {
  try {
    const connection = await oracledb.getConnection({
      user: "IR_AIR",
      password: "irctc",
      connectString: "172.28.57.14:1986/portalt",
      poolMin: 10, // Minimum number of connections in the pool
      poolMax: 50, // Maximum number of connections in the pool
      poolIncrement: 5 // Number of connections that are opened whenever a connection request exceeds the number of currently open connections
   
    });
    console.log("Successfully connected to Oracle DB");
    return connection;
  } catch (err) {
    console.error("Error connecting to Oracle DB:", err.message);
    throw err;
  }
}

module.exports = connectToOracle;
