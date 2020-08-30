const express = require("express");
const Router = express.Router();
const Controller = require("../controllers/driver.controller");

Router.get("/", Controller.getDrivers);

module.exports = Router;
