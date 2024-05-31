const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const connectToOracle = require("./dbConn");

router.post("/:no", async (req, res) => {
  try {
    const num = req.params.no;
    const bookFrom = req.body.bookfrom;
    const bookTo = req.body.bookto;
    const airlineCode = req.body.airline;
    const bookDate = req.body.bookdate;
    const transactionID = req.body.transactionid;
    const airlinePNR = req.body.airpnr;
    const PAYMENT_GATEWAY_ID = req.body.paymentGid;
    console.log(airlinePNR);

    const connection = await connectToOracle();
    const query = `
      SELECT ID, TRANSACTION_ID, AIRLINE_PNR, AIRLINE, BOOKING_STATUS, FARE_AMOUNTS,
             SEAT_AMOUNT, MEAL_AMOUNT, BAGGAGE_AMOUNT, IRCTC_CHARGES, CREATION_DATE,
             BOOKING_DATE, PAYMENT_GATEWAY_NAME, PAYMENT_GATEWAY_ID, TICKET_NO
      FROM booking_recon_data
      WHERE ROWNUM <= :num
       AND BOOKING_DATE BETWEEN :bookfrom AND :bookto
       OR  AIRLINE = : airline
       OR  BOOKING_DATE = : bookingdate 
       OR TRANSACTION_ID = : transactionid 
       OR AIRLINE_PNR = : airpnr
       OR PAYMENT_GATEWAY_ID = : paymentGid`;

    const result = await connection.execute(
      query,
      [
        num,
        bookFrom,
        bookTo,
        airlineCode,
        bookDate,
        transactionID,
        airlinePNR,
        PAYMENT_GATEWAY_ID,
      ],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );
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

    console.log(`resultset_no:${rowsWithHeadings.length}`);

    rowsWithHeadings.length === 0
      ? res.json({ message: "Record Not Found" })
      : res.json([
          {
            message: "success",
            status: 200,
            data: rowsWithHeadings,
          },
        ]);
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
