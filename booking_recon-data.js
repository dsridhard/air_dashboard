const express = require("express");
const router = express.Router();
const connectToOracle = require("./dbConn");

router.get("/", async (req, res) => {
  try {
    const connection = await connectToOracle();
    const result = await connection.execute("SELECT TRANSACTION_ID, AIRLINE_PNR, AIRLINE, BOOKING_STATUS, FARE_AMOUNTS, SEAT_AMOUNT, MEAL_AMOUNT, BAGGAGE_AMOUNT, IRCTC_CHARGES, CREATION_DATE, BOOKING_DATE, PAYMENT_GATEWAY_NAME, PAYMENT_GATEWAY_ID, TICKET_NO FROM booking_recon_data WHERE ROWNUM <= 50");
    await connection.close();

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
