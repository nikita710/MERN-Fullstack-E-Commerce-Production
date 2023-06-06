import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  createProductController,
  getAllProductController,
  getSingleProductController,
  getPictureController,
  updateProductController,
  deleteProductController,
  filterProductController,
  countProductController,
  productListController,
  productSearchController,
  relatedProductController,
  productCategoryController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

//Routes

//Create Product || POST
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);
//Update Product || PUT
router.put(
  "/update-product/:id",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//Get All Products || GET
router.get("/all-product", getAllProductController);

//Get Single Products || GET
router.get("/single-product/:slug", getSingleProductController);

//Get Single Picture || GET
router.get("/single-picture/:pid", getPictureController);

//Delete Product || DELETE
router.delete(
  "/delete-product/:id",
  requireSignIn,
  isAdmin,
  deleteProductController
);

//Filter Product || Get
router.post("/product-filter", filterProductController);

//Count Product || Get
router.get("/product-count", countProductController);

//Count Product || Get
router.get("/product-list/:page", productListController);

//Search Product || Get
router.get("/search/:keyword", productSearchController);

//Similar Product || Get
router.get("/related-product/:pid/:cid", relatedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

export default router;
