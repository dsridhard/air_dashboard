const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const connectToOracle = require("./dbConn");

router.post("/:no", async (req, res) => {
  try {
    const num = req.params.no;
    const receiptNo = req.body.receiptno;
    const Transactionid = req.body.transactionid;
    const RefundSeqId = req.body.refundseqid;
    const PaymentGatewayName = req.body.paymentgatewayname;
    console.log(RefundSeqId);
    const connection = await connectToOracle();

    const query = `SELECT  
           OID, REFUNDSEQID, STORE_ID, CREATION_TIME, 
           STATUS, DELETED, LAST_MOD_TIME, TRANSACTIONID,
           REFUND_DATE, REFUND_AMOUNT, REFUND_STATUS, NOOFPASSENGERS,
           SETTLEMENT_ID, PAYMENT_GATEWAY_NAME, RECEIPT_NUMBER,
           ACTUAL_REFUND_DATE, DEFAULT_CREATION_TIME FROM IR_REFUND
           WHERE ROWNUM <=: num 
           AND  RECEIPT_NUMBER = : receiptno 
           OR TRANSACTIONID = : transactionid 
           OR REFUNDSEQID = : refundseqid 
           OR PAYMENT_GATEWAY_NAME = : paymentgatewayname`;

    const result = await connection.execute(
      query,
      [num, receiptNo, Transactionid, RefundSeqId ,PaymentGatewayName],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    await connection.close();

    // Extract column names from metaData
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
