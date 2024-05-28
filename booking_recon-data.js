const express = require("express");
const router = express.Router();
const connectToOracle = require("./dbConn");

router.get("/:no/:airlinePnr", async (req, res) => {
  try {
    const num = req.params.no;
    const airlinePnr = req.params.airlinePnr; // Get the AIRLINE_PNR value

    const connection = await connectToOracle();

    // Modify the query to filter records within a specific time range and for a specific AIRLINE_PNR
    const result = await connection.execute(
      `SELECT ID, TRANSACTION_ID, AIRLINE_PNR, AIRLINE, BOOKING_STATUS, FARE_AMOUNTS, SEAT_AMOUNT, MEAL_AMOUNT, BAGGAGE_AMOUNT, IRCTC_CHARGES, CREATION_DATE, BOOKING_DATE, PAYMENT_GATEWAY_NAME, PAYMENT_GATEWAY_ID, TICKET_NO
       FROM booking_recon_data
       WHERE CREATION_DATE >= SYSDATE - INTERVAL '${num}' DAY
       AND AIRLINE_PNR = '${airlinePnr}'` // Add the condition for AIRLINE_PNR
    );

    await connection.close();
    const columnHeadings = [
      "ID",
      "Transaction ID",
      "Airline PNR",
      "Airline",
      "Booking Status",
      "Fare Amounts",
      "Seat Amount",
      "Meal Amount",
      "Baggage Amount",
      "IRCTC Charges",
      "Creation Date",
      "Booking Date",
      "Payment Gateway Name",
      "Payment Gateway ID",
      "Ticket Number",
    ];

    const rowsWithHeadings = result.rows.map((row) => {
      const rowData = {};
      row.forEach((value, index) => {
        rowData[columnHeadings[index]] = value;
      });
      return rowData;
    });

    res.json(rowsWithHeadings);
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
