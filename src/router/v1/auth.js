const express = require("express");
const router = express.Router();

const { AuthController } = require("../../controller/index");
const image = require("../../utils/multer");
// const {Authenticate} = require("../../validators/index")

router.get("/userPanel", AuthController.homePage);
router.get("/signUp", AuthController.signUp);
router.post(
  "/signUpData",
  image.array("profile", 1),
  AuthController.signUpData
);
router.get("/login", AuthController.login);
router.post("/loginData", AuthController.loginData);
router.get("/updateData", AuthController.updateData);
router.post(
  "/updatedData",
  image.array("profile", 1),
  AuthController.updatedData
);
router.get("/updatePass", AuthController.updatePass);
router.post("/updatedPass/:email", AuthController.updatedPass);
module.exports = router;
