import { addUser,
    editUser,
    deleteUser,
    getAllUsers,
    addCook,
    getUsersByCustomer,
    getOneUser,
    getUsersByCookRole,
    getUsersByAdminRole,
    SignUp,
    logIn,
    loggedInUser,
    logOut,
    getUsersByCity
 } from "../controllers/UserController.js";

import {upload} from "../middleware/Multer.js";
import express from "express";
import {authenticate} from "../middleware/Auth.js"

const userRouter = express.Router();

userRouter.post("/",upload.single("image"), addUser);
userRouter.post("/cook",upload.single("image"), addCook);
userRouter.post("/userByCity", getUsersByCity);
userRouter.patch("/",upload.single("image"), editUser);
userRouter.delete("/", deleteUser);
userRouter.get("/all", getAllUsers);
userRouter.get("/cook", getUsersByCookRole);
userRouter.get("/:id", getOneUser);
userRouter.get("/admin", getUsersByAdminRole);
userRouter.get("/customer", getUsersByCustomer);
userRouter.post("/signup",SignUp);
userRouter.post("/login", logIn);
userRouter.post("/logout", logOut);
userRouter.get("/logged-in-user", authenticate, loggedInUser);

export default userRouter;