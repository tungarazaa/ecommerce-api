import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  topProducts,
} from "../controllers/productController.js";

const router = express.Router();

//TOP 5 BEST PRODUCTS
router.route("/top-best-products").get(topProducts, getProducts);
router.route("/").get(getProducts).post(createProduct);
router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

export { router };
