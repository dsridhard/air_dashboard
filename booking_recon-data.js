const express = require("express");
const router = express.Router();
const oracledb = require("oracledb"); // Ensure OracleDB is required
const connectToOracle = require("./dbConn"); // Assuming this is your connection module

router.get("/:no", async (req, res) => {
  try {
    const num = parseInt(req.params.no, 10); // Convert parameter to integer for security
    const connection = await connectToOracle();
    const query = `SELECT TRANSACTION_ID, AIRLINE_PNR, AIRLINE, BOOKING_STATUS, FARE_AMOUNTS, 
                          SEAT_AMOUNT, MEAL_AMOUNT, BAGGAGE_AMOUNT, IRCTC_CHARGES, CREATION_DATE, 
                          BOOKING_DATE, PAYMENT_GATEWAY_NAME, PAYMENT_GATEWAY_ID, TICKET_NO 
                   FROM booking_recon_data 
                   WHERE ROWNUM <= :num`;

    const result = await connection.execute(query, [num], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    await connection.close();
    const columnHeadings = result.metaData.map((column) => column.name);

    // Map rows to column headings
    const rowsWithHeadings = result.rows.map((row) => {
      const rowData = {};
      columnHeadings.forEach((heading) => {
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
