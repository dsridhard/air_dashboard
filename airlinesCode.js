const express = require("express");
const router = express.Router();
const connectToOracle = require("./dbConn");

router.get("/", async (req, res) => {
  let connection;
  try {
    const connection = await connectToOracle();
    const result = await connection.execute(
      `SELECT AIRLINE_NAME , AIRLINE_CODE from AIRLINE_NAME_CODE_DETAILS`
    );

    await connection.close();
    const columnHeadings = ["AIRLINE_NAME", "AIRLINE_CODE"];

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
  } finally {
    if (connection) {
      // the connection assignment worked, must release
      try {
        await connection.release();
      } catch (e) {
        console.error(e);
      }
    }
  }
});

module.exports = router;
