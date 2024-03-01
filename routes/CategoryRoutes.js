import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } from "../controllers/CategoryController.js";
  import express from "express";

  
  const categoryRouter = express.Router();
  
  categoryRouter.get("/", getAllCategories);
  categoryRouter.post("/add", createCategory);
  categoryRouter.patch("/edit", updateCategory);
  categoryRouter.delete('/delete',deleteCategory)
  
  export default categoryRouter;