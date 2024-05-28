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
router.get("/:no", async (req, res) => {
  try {
    const num =  req.params.no
    const connection = await connectToOracle();
    const result = await connection.execute(`SELECT  OID, REFUNDSEQID, STORE_ID, CREATION_TIME, STATUS, DELETED, LAST_MOD_TIME, TRANSACTIONID, REFUND_DATE, REFUND_AMOUNT, REFUND_STATUS, NOOFPASSENGERS, SETTLEMENT_ID, PAYMENT_GATEWAY_NAME, RECEIPT_NUMBER, ACTUAL_REFUND_DATE, DEFAULT_CREATION_TIME FROM IR_REFUND WHERE ROWNUM <= ${num}`);
>>>>>>> refs/remotes/origin/main
    await connection.close();

    // Extract column names from metaData
    const columnHeadings = result.metaData.map(column => column.name);

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
