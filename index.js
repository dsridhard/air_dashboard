const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Routes
const refund = require("./refund");
const booking_recon_data = require("./booking_recon-data");
// Router End Here

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.use("/ir_refund", refund);
app.use("/book_recon", booking_recon_data);
app.listen(port, () => {
  console.log(`AirDashboard_App listening on port ${port}`);
});
