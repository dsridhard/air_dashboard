const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const connectToOracle = require("./dbConn");

router.post("/:no", async (req, res) => {
  try {
    const num = req.params.no;
    const airlineCode = req.body.airline;
    const bookFrom = req.body.bookfrom; 
    const bookTo = req.body.bookto;
    const bookDate = req.body.bookdate

    const connection = await connectToOracle();
    const query = `
      SELECT TRANSACTION_ID, AIRLINE_PNR, AIRLINE, BOOKING_STATUS, FARE_AMOUNTS,
             SEAT_AMOUNT, MEAL_AMOUNT, BAGGAGE_AMOUNT, IRCTC_CHARGES, CREATION_DATE,
             BOOKING_DATE, PAYMENT_GATEWAY_NAME, PAYMENT_GATEWAY_ID, TICKET_NO
      FROM booking_recon_data
      WHERE ROWNUM <= :num
       OR AIRLINE = :airline
       OR CREATION_DATE BETWEEN :bookFrom AND :bookTo
       OR CREATION_DATE = :bookdate`; 

    const result = await connection.execute(query, [num, airlineCode, bookFrom, bookTo, bookDate], {
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
       
  console.log(`resultset_no:${rowsWithHeadings.length}`)
    
   rowsWithHeadings.length == 0 ? res.json({message:"Record Not Found"}): res.json(rowsWithHeadings);
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
