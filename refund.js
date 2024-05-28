const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const oracledb = require("oracledb"); // Ensure OracleDB is required
const connectToOracle = require("./dbConn"); // Assuming this is your connection module

router.get("/:no", async (req, res) => {
  try {
    const num = parseInt(req.params.no, 10); // Convert parameter to integer for security
    const connection = await connectToOracle();
    
    const query = `SELECT  OID, REFUNDSEQID, STORE_ID, CREATION_TIME, STATUS, DELETED, LAST_MOD_TIME, TRANSACTIONID, REFUND_DATE, REFUND_AMOUNT, REFUND_STATUS, NOOFPASSENGERS, SETTLEMENT_ID, PAYMENT_GATEWAY_NAME, RECEIPT_NUMBER, ACTUAL_REFUND_DATE, DEFAULT_CREATION_TIME FROM IR_REFUND WHERE ROWNUM <=: num`;

    const result = await connection.execute(query, [num], { outFormat: oracledb.OUT_FORMAT_OBJECT });
=======
const connectToOracle = require("./dbConn");
router.get("/", async (req, res) => {
  try {
    const connection = await connectToOracle();
    const result = await connection.execute(`SELECT  OID, REFUNDSEQID, STORE_ID, CREATION_TIME, STATUS, DELETED, LAST_MOD_TIME, TRANSACTIONID, REFUND_DATE, REFUND_AMOUNT, REFUND_STATUS, NOOFPASSENGERS, SETTLEMENT_ID, PAYMENT_GATEWAY_NAME, RECEIPT_NUMBER, ACTUAL_REFUND_DATE, DEFAULT_CREATION_TIME FROM IR_REFUND WHERE ROWNUM <= ${num}`);
    await connection.close();

    const columnHeadings = [
      "ID",
      "Refundseqid",
      "Store id",
      "Creation Time",
      "Status",
      "Deleted",
      "Last Mod Time",
      "TransactionId",
      "Refund Date",
      "Refund Amount",
      "Refund Status",
      "Number Of Passangers",
      "Settlement Id",
      "Payment Gateway Name",
      "Receipt Number",
      "Actual Refund Date",
      "Default Creation Time"
    ];

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
