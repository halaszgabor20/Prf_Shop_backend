const express = require("express");
const router = express.Router();
const StuffController = require("../controllers/stuff.controller");
const CheckAuth = require("../middleware/check-auth");

router.get("/get-products", CheckAuth, StuffController.getStuff);
router.get("/get-cart", CheckAuth, StuffController.getCart);
router.post("/create", CheckAuth, StuffController.createStuff);
router.post("/add-to-cart", CheckAuth, StuffController.addToCart);
router.delete("/remove-from-cart/:productId?", CheckAuth, StuffController.removeFromCart);
router.delete("/remove-all", CheckAuth, StuffController.removeAllItemsFromCart);

module.exports = router;
