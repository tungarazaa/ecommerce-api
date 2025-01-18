import mongoose from "mongoose";

const productSchema = new mongoose.Schema([
  {
    title: {
      type: String,
      required: [true, "The title cannot be empty!"],
      maxlength: [40, "The product title must be less than or equal to 40"],
      minlength: [10, "The product title should not be less than 10"],
    },
    description: {
      type: String,
      required: [true, "The description cannot be empty!"],
    },
    image: String,
    rating: {
      type: Number,
      default: 0,
      max: [5.0, "The rating should be less or equal to 5.0"],
      min: [1.0, "The rating should not be less than 1.0"],
    },
    category: {
      type: String,
      required: [true, "Category cannot be empty!"],
    },
    price: {
      type: Number,
      required: [true, "Price cannot be empty!"],
    },
    priceDiscount: {
      type: Number,
      default: 0,
      validate: {
        validator: function (field) {
          return this.price > field;
        },
        message: "Discount price should be below regular price",
      },
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
