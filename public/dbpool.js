const oracledb = require('oracledb');

// Create a connection pool which will be used for all connections
async function initializeOracleConnectionPool() {
  try {
    await oracledb.createPool({
      user: 'IR_AIR',
      password: 'irctc',
      connectString: '172.28.57.14:1986/portalt',
      poolMin: 10, // Minimum number of connections in the pool
      poolMax: 50, // Maximum number of connections in the pool
      poolIncrement: 5 // Number of connections that are opened whenever a connection request exceeds the number of currently open connections
    });
    console.log('Connection pool started');
  } catch (err) {
    console.error('Error starting connection pool:', err.message);
    throw err;
  }
}

// Function to get a connection from the pool
async function getConnectionFromPool() {
  try {
    const connection = await oracledb.getConnection();
    return connection;
  } catch (err) {
    console.error('Error getting connection from pool:', err.message);
    throw err;
  }
}

module.exports = {
  initializeOracleConnectionPool,
  getConnectionFromPool
};
