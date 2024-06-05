const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan"); // Include morgan
const path = require("path");
// Use morgan to log all requests in 'combined' format
app.use(morgan("combined"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use("/static", express.static(path.join(__dirname, "public")));
// Routes
const refund = require("./refund");
const booking_recon_data = require("./booking_recon-data");
const airlinecode = require("./airlinesCode");
// Router End Here

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.use("/ir_refund", refund);
app.use("/book_recon", booking_recon_data);
app.use("/airline", airlinecode);
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/error.html"));
});

app.listen(port, () => {
  console.log(`AirDashboard_App listening on port http:10.34.40.114:${port}`);
});
