import mongoose from "mongoose";
import Meal from "../models/mealModel.js";
import Category from"../models/CategoryModel.js";
import slugify from "slugify";
import fs from "fs";
import User from "../models/UserModel.js";

export const addMeal = async (req, res) => {
    const {
      name,
      description,
      mealDetail,
      ingredients,
      display,
      category,
      user
    } = req.body;
  
    try {
        if (!name || !description|| !ingredients || !display ||!category || !user) {
            const imagePath = req.file ? req.file.location:null;
            return res.status(400).json({ error: "All fields are required" });
          }

            
    if (!req.file) {
        return res.status(400).json({ error: "Please upload an image" });
      }
      const image = req.file.location;
      const slug = slugify(name, { lower: true, replacement: "-" });

      // Check if the category exists by its _id
    const categoryExist = await Category.findById(category);

          if(!categoryExist){         
          return res.status(404).json({ message: "Category not found" });
        }
       const mealDetails = JSON.parse(mealDetail);

        const newMeal =  await Meal.create({
          name,
          description,
          mealDetails,
          ingredients,
          display,
          slug,
          category,
          user,
          image,
        });
        if (!newMeal){
          const imagePath =req.file ? req.file.location :null;
        }
        res.status(201).json({ message: "meal created successfully", Meal: newMeal });
      } catch (error) {
        const imagePath = req.file.location ;
        console.log(error);
        res.status(500).json("Internal server error");
      }
    }

  export const editMeal = async (req, res) => {
    const id = req.body.id;
    const {
      name,
      description,
      mealDetails,
      ingredients,
      display,
      slug,
      category,
    } = req.body;
  
    try {
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid meal ID" });
      }
  
      const existingMeal = await Meal.findById(id);
  
      if (!existingMeal) {
        return res.status(404).json({ error: "meal not found" });
      }
  
      let updatedImage = existingMeal.image;
      if (req.file) {
        if (existingMeal.image) {
          const imagePath = req.file.location;
        }
  
        updatedImage = req.file?.location;
      }
  
      let updatedMealData = {};
      updatedMealData = {
          name: name || existingMeal.name,
          description: description || existingMeal.description,
          mealDetails: mealDetails || existingMeal.mealDetails,
          ingredients: ingredients || existingMeal.ingredients,
          image: updatedImage,
          display: display || existingMeal.display,
          slug: slug || existingMeal.slug,
          category: category || existingMeal.category,
        };
  
      const updatedMeal = await Meal.findByIdAndUpdate(id, updatedMealData, {
        new: true,
      });
  
      res.status(200).json(updatedMeal);
    } catch (error) {
      console.error(error);
      if (req.file) {
        const imagePath = req.file.location;
      }
      res.status(500).json({ error: "Internal Server Error", msg: error });
    }
  };
  export const deleteMeal = async (req, res) => {
    const id = req.body.id;
  
    try {
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid meal ID" });
      }
  
      const meal = await Meal.findOne({ _id: id });
  
      const deletedMeal = await Meal.findByIdAndDelete(id);
  
      if (!deletedMeal) {
        return res.status(404).json({ error: "meal not found" });
      }
  
      const imagePath = req.file.location ;
  
      res.status(200).json({ message: "meal deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", msg: error });
    }
  }

  export const getMeal = async (req, res) => {
    const slug = req.params.slug;
  
    try {
      const meal = await Meal.findOne({ slug })
  
      if (!meal) {
        return res.status(404).json({ error: "No such a meal" });
      }
  
      res.status(200).json(meal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  export const getMealByCategory = async (req, res) => {
    const categoryId = req.params.id;
  
    try {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
  
      const meals = await Meal.find({ category: categoryId });
  
      res.status(200).json(meals);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error", msg: error });
    }
  };

  export const getAllmeals = async (req, res) => {
    try {
      const meals = await Meal.find()
        .populate('user', 'firstName image address') 
        .populate('category','name')// Populate user info with specific fields
        .sort({ createdAt: -1 });
      return res.status(200).json(meals);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }


  export const getMealsByUserId = async (req, res) => {
    const { userId } = req.body;
  
    try {
      // Assuming userId is stored as an ObjectId in the database
      const meals = await Meal.find({ user: userId }).populate('user');
      console.log(meals)
  
      if (!meals) {
        return res.status(404).json({ error: "No meals found for this user" });
      }
  
      res.status(200).json(meals);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error", msg: error });
    }
  };

export const getMealsByCity = async (req, res) => {
  const {city}= req.body;

  try {
    const usersInCity = await User.find({ city: city }).select('_id');
    console.log("hello users",usersInCity)

    if (!usersInCity) {
      return res.status(404).json({ error: "No users found in this city" });
    }

    const userIds = usersInCity.map(user => user._id);

    const meals = await Meal.find({ user: { $in: userIds } }).populate('user');
    console.log("meals",meals)

    if (!meals) {
      return res.status(404).json({ error: "No meals found for users in this city" });
    }

    res.status(200).json(meals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};