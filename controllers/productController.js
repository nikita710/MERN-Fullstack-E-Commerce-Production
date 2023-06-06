import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";
import categoryModel from "../models/categoryModel.js";

//Create Product
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;

    const { picture } = req.files;

    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required!" });
      case !description:
        return res.status(500).send({ error: "Description is Required!" });
      case !price:
        return res.status(500).send({ error: "Price is Required!" });
      case !category:
        return res.status(500).send({ error: "Category is Required!" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required!" });
      case picture && picture.size > 1000000:
        return res.status(500).send({ error: "Picture is Required!" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (picture) {
      products.picture.data = fs.readFileSync(picture.path);
      products.picture.contentType = picture.type;
    }

    await products.save();

    res.status(201).send({
      success: true,
      message: "Product Created Successfully...",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while creating Product!",
    });
  }
};

//Get All Product
export const getAllProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-picture")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "Fetched All Products Successfully",
      products,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error while fetching Products!",
      error,
    });
  }
};

// Get Single Product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-picture")
      .populate("category");

    if (!product) {
      res
        .status(404)
        .send({ success: false, message: "Product Not Found!", product });
    } else {
      res.status(200).send({
        success: true,
        message: "Single Product Fetched",
        product,
      });
    }
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error while Fetching Single Product!",
      error,
    });
  }
};

// Get Single Picture
export const getPictureController = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.pid)
      .select("picture");

    if (product.picture.data) {
      res.set("Content-Type", product.picture.contentType);
      return res.status(200).send(product.picture.data);
    }
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error while Fetching Single Picture!",
      error,
    });
  }
};

// Update Product
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields;

    const { picture } = req.files;

    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required!" });
      case !description:
        return res.status(500).send({ error: "Description is Required!" });
      case !price:
        return res.status(500).send({ error: "Price is Required!" });
      case !category:
        return res.status(500).send({ error: "Category is Required!" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required!" });
      case picture && picture.size > 1000000:
        return res.status(500).send({ error: "Picture is Required!" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (picture) {
      products.picture.data = fs.readFileSync(picture.path);
      products.picture.contentType = picture.type;
    }

    await products.save();

    res.status(201).send({
      success: true,
      message: "Product Updated Successfully...",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while Updating Product!",
    });
  }
};

//Delete Product Controller
export const deleteProductController = async (req, res) => {
  try {
    //delete product by id
    await productModel.findByIdAndDelete(req.params.id);
    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while deleting product",
      error,
    });
  }
};

//Filter Product
export const filterProductController = async (req, res) => {
  try {
    const { checked, radio } = await req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await productModel.find(args);

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "error while filtering product",
      error,
    });
  }
};

//Count Total Products
export const countProductController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();

    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "error while product count",
      error,
    });
  }
};

//Product Pagination
export const productListController = async (req, res) => {
  try {
    const perPage = 10;
    const page = req.params.page ? req.params.page : 1;

    const products = await productModel
      .find({})
      .select("-picture")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

//Product Search
export const productSearchController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-picture");

    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

//Similar Product
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    const product = await productModel
      .find({ category: cid, _id: { $ne: pid } })
      .select("-picture")
      .limit(3)
      .populate("category");

    res.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while fetching related product",
      error,
    });
  }
};

//Get Products By category
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");

    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};
