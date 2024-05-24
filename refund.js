const express = require("express");
const router = express.Router();
const connectToOracle = require("./dbConn");
router.get("/", async (req, res) => {
  try {
    const connection = await connectToOracle();
    const result = await connection.execute("SELECT * FROM IR_REFUND");
    await connection.close();

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
