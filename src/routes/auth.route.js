const express = require("express");
const Router = express.Router();
const Controller = require("../controllers/auth.controller");
const Middleware = require("../middlwares/auth.middleware");

Router.post("/signin", Middleware.validate, Controller.signIn);

Router.patch("/signout", Controller.signOut);

Router.post("/signup", Middleware.validate, Middleware.checkEmailExist, Controller.signUp);

module.exports = Router;
