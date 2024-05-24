const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const connectToOracle = require('./dbConn');

app.get('/', (req, res) => {
  res.send('Hello World!!!')
})

app.get('/ir_refund', async (req, res) => {
  try {
    const connection = await connectToOracle();
    const result = await connection.execute('SELECT * FROM IR_REFUND');
    await connection.close();

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.listen(port, () => {
  console.log(`AirDashboard_App listening on port ${port}`)
}) 