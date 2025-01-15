import mongoose from "mongoose";

const productSchema = new mongoose.Schema([
  {
    title: {
      type: String,
      require: [true, "The title cannot be empty!"],
    },
    description: {
      type: String,
      require: [true, "The description cannot be empty!"],
    },
    image: String,
    rating: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      require: [true, "Category cannot be empty!"],
    },
    price: {
      type: Number,
      required: [true, "Price cannot be empty!"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
]);

const Product = mongoose.model("Product", productSchema);
export default Product;
