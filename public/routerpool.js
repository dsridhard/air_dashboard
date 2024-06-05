const db = require('./dbConne');

// Initialize the connection pool
db.initializeOracleConnectionPool();

app.get('/some-route', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnectionFromPool();
    // Use the connection for some database operations
  } finally {
    if (connection) {
      try {
        // Release the connection back to the pool
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err.message);
      }
    }
  }
});
