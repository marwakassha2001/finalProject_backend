import mongoose from "mongoose";
import Category from "./CategoryModel.js";
import User from "./UserModel.js";

const Schema = mongoose.Schema;

const mealSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    slug:{
      type : String,
      required:true
    },
    mealDetails: [
      {
        weight: {
          type: String,
          required: true
        },
      price: {
        type: Number,
        validate: {
          validator: function (value) {
            return value > 0;
          },
          message: "Price must be a positive number",
        },
        required: true,
      },
    }
    ],
    display: {
      type: Boolean,
    },
    ingredients: [
      { type: String }
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const meal = mongoose.model("meal", mealSchema);

export default meal;