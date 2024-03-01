import {
    addMeal,
    editMeal,
    deleteMeal,
    getMeal,
    getMealByCategory,
    getAllmeals,
    getMealsByUserId,
    getMealsByCity
  } from "../controllers/MealController.js";
  import express from "express";
  import {upload} from "../middleware/Multer.js";
  
  const mealRouter = express.Router();

  mealRouter.get("/", getAllmeals);
  mealRouter.get("/:slug", getMeal);
  mealRouter.get("/byCategory/:id" ,getMealByCategory)
  mealRouter.post("/add", upload.single("image"), addMeal);
  mealRouter.post("/mealByUser", getMealsByUserId);
  mealRouter.post("/mealByCity", getMealsByCity);
  mealRouter.patch("/edit", upload.single("image"), editMeal);
  mealRouter.delete('/delete' , deleteMeal)
  

  export default mealRouter;