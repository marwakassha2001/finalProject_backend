import Order from "../models/OrderModal.js";
import User from "../models/UserModel.js";
import Meal from "../models/mealModel.js";


export const addOrder = async (req, res) => {
    const { status, userId, orderDetails, address,city,deliveryFee} =
      req.body;
  
    try {
      if ((!userId, !orderDetails, !address, !country, !city)) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      const allOrders = await Order.find();
  
      const number = allOrders.length + 1;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const mealIds = orderDetails.map((item) => item.id);
      const meals = await Meal.find({ _id: { $in: mealIds } });
  
      // Calculate the total price for each meal
      const updatedMeals = meals.map((meal) => {
        const orderItem = orderDetails.find(
          (item) => item.id.toString() === meal._id.toString()
        );
  
        if (!orderItem) {
          return res.status(404).json({ error: "meal not found" });
        }
  
        return {
          ...meal.toObject(),
          quantity: orderItem.quantity,
          totalPrice: orderItem.totalPrice,
        };
      });
      const totalPrice = updatedMeals.reduce(
        (total, meal) => total + meal.totalPrice,
        0
      );
  
      const order = await Order.create({
        number: number,
        status: "Initiated" || status,
        userId: userId,
        orderDetails: updatedProducts,
        totalPrice: totalPrice + deliveryFee,
        city: city,
        address: address,
      });
  
      res.status(200).json({ message: "Order added successfully", data: order });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", msg: error.message });
    }
  };
  
  // Edit Order
  export const editOrder = async (req, res) => {
    const id = req.body.id;
    const { status, orderDetails, deliveryFee , address,city } = req.body;
  
    try {
      if (!id) {
        return res.status(400).json({ error: "No id" });
      }
  
      const existingOrder = await Order.findById(id);
      if (!existingOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      if (orderDetails) {
        const mealIds = orderDetails.map((item) => item.id);
        const meals = await Meal.find({ _id: { $in: mealIds } });
  
        // Calculate the total price for each product
        var updatedMeals = meals.map((meal) => {
          const orderItem = orderDetails.find(
            (item) => item.id.toString() === meal._id.toString()
          );
  
          if (!orderItem) {
            return res.status(404).json({ error: "meal not found" });
          }
  
          return {
            ...meal.toObject(),
            quantity: orderItem.quantity,
            totalPrice: orderItem.totalPrice,
          };
        });
  
        var totalPrice = updatedMeals.reduce(
          (total, product) => total + product.totalPrice,
          0
        );
      }
  
      existingOrder.status = status || existingOrder.status;
      existingOrder.orderDetails = updatedProducts || existingOrder.orderDetails;
      existingOrder.totalPrice = totalPrice + deliveryFee || existingOrder.totalPrice + deliveryFee;
      existingOrder.address = address || existingOrder.address;
      existingOrder.city = city || existingOrder.city;
  
      const updatedOrder = await existingOrder.save();
  
      res
        .status(200)
        .json({ message: "Order updated successfully", data: updatedOrder });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", msg: error.message });
    }
  };
  
  // Get All Orders
  export const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find().populate("userId");
      res.status(200).json(orders);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", msg: error.message });
    }
  };
  
  // Get Order By Id
  export const getOrderById = async (req, res) => {
    const id = req.body.id;
  
    try {
      const order = await Order.findById(id).populate("userId");
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json({ data: order });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", msg: error.message });
    }
  };
  
  // Delete Order
  export const deleteOrder = async (req, res) => {
    const id = req.body.id;
  
    try {
      const order = await Order.findByIdAndDelete(id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      res
        .status(200)
        .json({ message: "Order deleted successfully", data: order });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", msg: error.message });
    }
  };