const express = require("express");
const router = express.Router();

const { AdminController } = require("../../controller/index");
const { ProductController } = require("../../controller/index");

router.get("/login", AdminController.homePage);
router.post("/login", AdminController.login);
router.get("/addProduct", AdminController.addProduct);

router.post("/addedProduct", ProductController.addedProduct);
router.get("/deleteProduct/:slug", ProductController.deleteProduct);
router.get("/updateProduct/:slug", ProductController.updateProduct);
router.post("/updatedProduct/:slug", ProductController.updatedProduct);

router.get("/adminDashboard", AdminController.adminDashboard);

router.get("/viewUsers/:page",AdminController.viewUsers);
router.post("/filtered",AdminController.searchUser);

router.get("/viewProducts/:page",AdminController.viewProducts);
router.post("/filteredProd",AdminController.searchProduct)

module.exports = router;
