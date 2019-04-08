require("dotenv").config();
const express = require("express");
const router = express.Router();
const Controller = require("../controller/user-service.js");

router.post("/", Controller.login);

module.exports = router;
