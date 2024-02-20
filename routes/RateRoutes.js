import {
    getRates,
    addRate,
    editRate,
    deleteRate,
    getMealRate    
  } from "../controllers/RateController.js";
  import express from "express";
  
  const rateRouter = express.Router();
  
  rateRouter.get("/get", getRates);
  rateRouter.post("/add", addRate);
  rateRouter.patch("/edit", editRate);
  rateRouter.post("/mealRate", getMealRate);
  rateRouter.delete('/delete',deleteRate)
  
  export default rateRouter;