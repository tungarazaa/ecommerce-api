import Product from "../models/productModel.js";
import ProductFeatures from "../utils/productFeatures.js";
import catchAsync from "./catchAsync.js";

const topProducts = (req, res, next) => {
  req.query.sort = "-rating price";
  req.query.limit = 5;
  req.query.fields = "title description category price rating";
  next();
};
const getProducts = catchAsync(async (req, res) => {
  //FILTERING
  // const queryObj = { ...req.query };
  // const excludedFields = ["page", "sort", "limit", "fields"];
  // excludedFields.forEach((el) => delete queryObj[el]);

  //ADVANCED FILTERING
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  // let query = Product.find(JSON.parse(queryStr));
  // console.log(query);

  //SORTING
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(",").join(" ");
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort("-createdAt");
  // }

  //FIELDS LIMITING
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(",").join(" ");
  //   query = query.select(fields);
  // } else {
  //   query = query.select("-__v");
  // }

  //PAGINATION
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 100;
  // const skip = (page - 1) * limit;
  // query = query.skip(skip).limit(limit);
  // if (req.query.page) {
  //   const numProducts = await Product.countDocuments();
  //   if (skip >= numProducts) throw new Error("No result found!");
  // }

  const features = new ProductFeatures(Product.find(), req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const products = await features.query;
  //REPONSE
  res.status(200).json({
    status: "success",
    result: products.length,
    data: {
      products,
    },
  });
});

const getProduct = catchAsync(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

const createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newProduct,
    },
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
  });
});

export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  topProducts,
};
