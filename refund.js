const express = require("express");
const router = express.Router();
const connectToOracle = require("./dbConn");
router.get("/:no", async (req, res) => {
  try {
    const num =  req.params.no
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
      row.forEach((value, index) => {
        rowData[columnHeadings[index]] = value;
      });
      return rowData;
    });

    res.json(rowsWithHeadings);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
