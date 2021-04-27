const express = require("express");
const router = express.Router();

const AdminRouter = require("./admin");
const UserRouter = require("./auth");
router.use("/admin", AdminRouter);
router.use("/auth", UserRouter);
module.exports = router;
