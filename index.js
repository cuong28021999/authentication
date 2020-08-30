const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const port = 8080;

// routes
const authRoute = require("./src/routes/auth.route");
const driverRoute = require('./src/routes/driver.route')

// middleware
const authMiddleware = require('./src/middlwares/auth.middleware')

app.use(cors());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/driver", authMiddleware.requireAuth, driverRoute);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log("Server starting on port", port);
});
