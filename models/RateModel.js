import mongoose from 'mongoose';
import User from './UserModel.js';
import Meal from "./mealModel.js"


const RateSchema = new mongoose.Schema({
    rate: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    mealId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Meal',
    },
 },
 {
    timestamps: true,
  }

);


const Rate = mongoose.model('Rate',RateSchema);

export default Rate;