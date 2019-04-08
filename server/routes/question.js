require("dotenv").config();
const express = require("express");
const router = express.Router();
const Controller = require("../controller/user-service.js");

router.get("/", Controller.question);
module.exports = router;
