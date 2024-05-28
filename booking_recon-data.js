const express = require("express");
const router = express.Router();
const oracledb = require("oracledb"); // Ensure OracleDB is required
const connectToOracle = require("./dbConn"); // Assuming this is your connection module

router.get("/:no", async (req, res) => {
  try {
    const num = parseInt(req.params.no, 10); // Convert parameter to integer for security
    const connection = await connectToOracle();
<<<<<<< HEAD
    
    const query = `SELECT TRANSACTION_ID, AIRLINE_PNR, AIRLINE, BOOKING_STATUS, FARE_AMOUNTS, 
                          SEAT_AMOUNT, MEAL_AMOUNT, BAGGAGE_AMOUNT, IRCTC_CHARGES, CREATION_DATE, 
                          BOOKING_DATE, PAYMENT_GATEWAY_NAME, PAYMENT_GATEWAY_ID, TICKET_NO 
                   FROM booking_recon_data 
                   WHERE ROWNUM <= :num`;

    const result = await connection.execute(query, [num], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    await connection.close();

    // Extract column names from metaData
    const columnHeadings = result.metaData.map(column => column.name);
=======
    const result = await connection.execute(`SELECT ID, TRANSACTION_ID, AIRLINE_PNR, AIRLINE, BOOKING_STATUS, FARE_AMOUNTS, SEAT_AMOUNT, MEAL_AMOUNT, BAGGAGE_AMOUNT, IRCTC_CHARGES, CREATION_DATE, BOOKING_DATE, PAYMENT_GATEWAY_NAME, PAYMENT_GATEWAY_ID, TICKET_NO FROM booking_recon_data WHERE ROWNUM <=${num}`);
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
      "Ticket Number"
    ];
>>>>>>> refs/remotes/origin/main

    // Map rows to column headings
    const rowsWithHeadings = result.rows.map(row => {
      const rowData = {};
      columnHeadings.forEach(heading => {
        rowData[heading] = row[heading];
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
