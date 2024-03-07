import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } from "../controllers/CategoryController.js";
  import express from "express";
  import {upload} from "../middleware/Multer.js";

  
  const categoryRouter = express.Router();
  
  categoryRouter.get("/", getAllCategories);
  categoryRouter.post("/add",upload.single("image"), createCategory);
  categoryRouter.patch("/edit", updateCategory);
  categoryRouter.delete('/delete',deleteCategory)
  
  export default categoryRouter;