import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  topProducts,
} from "../controllers/productController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

//TOP 5 BEST PRODUCTS
router.route("/top-best-products").get(topProducts, getProducts);
router.route("/").get(protect, getProducts).post(createProduct);
router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

export { router };
