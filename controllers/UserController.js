import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import fs from 'fs';
import { generateToken } from "../utils/jwt.js";
import mongoose from "mongoose";

export const addUser = async (req, res) => {
  const { firstName, lastName, email, password, role, phoneNumber, experties, address,city } = req.body;

  try {
    if (!firstName || !lastName || !email || !password || !phoneNumber ||!address ||!city) {
      // const imagePath = req.file ? req.file.location:null;
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // const imagePath = req.file.location;
      return res.status(400).json({ error: "Email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (!req.file) {
      return res.status(400).json({ error: "Upload an image" });
    }

    const image = req.file.location;

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "Admin",
      image,
      phoneNumber,
      city,
      experties,
      address
    });

    // if (!newUser) {
    //   const imagePath = req.file.location:null;;
    //   fs.unlinkSync(imagePath);
    // }

    res.status(200).json(newUser);
  } catch (error) {
    const imagePath = req.file.location ;
    console.error(error);
    res.status(500).json({ err: "Internal Server Error", msg: error });
  }
};
// Controller for editing a user
export const editUser = async (req, res) => {
  const id = req.body.id;
  const {
    firstName,
    lastName,
    email,
    password,
    checkPassword,
    role,
    city,
    experties,
    phoneNumber,
  } = req.body;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const existingUser = await User.findById(id);

    // if (password) {
    //   const arePasswordSame = await bcrypt.compare(
    //     checkPassword,
    //     existingUser.password
    //   );

    //   if (!arePasswordSame) {
    //     return res.status(401).json({ message: "Invalid password" });
    //   }
    // }

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    let updatedImage = existingUser.image;
    if (req.file) {
      if (existingUser.image) {
        const imagePath = req.file.location ;
      }

      updatedImage = req.file?.location ;
    }

    let updatedUserData = {};
    if (password) {
      updatedUserData = {
        firstName: firstName || existingUser.firstName,
        lastName: lastName || existingUser.lastName,
        email: email || existingUser.email,
        password: await bcrypt.hash(password, 10),
        role: role || existingUser.role,
        image: updatedImage,
        experties: experties || existingUser.experties,
        city: city || existingUser.city,
        phoneNumber: phoneNumber || existingUser.phoneNumber,
      };
    } else {
      updatedUserData = {
        firstName: firstName || existingUser.firstName,
        lastName: lastName || existingUser.lastName,
        email: email || existingUser.email,
        role: role || existingUser.role,
        image: updatedImage,
        experties: experties || existingUser.experties,
        city: city || existingUser.city,
        phoneNumber: phoneNumber || existingUser.phoneNumber,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedUserData, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    if (req.file) {
      const imagePath = req.file.location ;
    }
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};

// Controller for deleting a user
export const deleteUser = async (req, res) => {
  const id = req.body.id;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findOne({ _id: id });

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const imagePath = req.file.location;

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};

// Controller for getting one user by ID
export const getOneUser = async (req, res) => {
  const id = req.params.id; // Changed from req.body.id to req.params.id

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};


// Controller for getting users by role=cook
export const getUsersByCookRole = async (req, res) => {
  try {
    const cookUsers = await User.find({ role: "Cook" });
    res.status(200).json(cookUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};

// Controller for getting users by role=admin
export const getUsersByAdminRole = async (req, res) => {
  try {
    const adminUsers = await User.find({ role: "Admin" });
    res.status(200).json(adminUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};

export const getUsersByCustomer = async (req, res) => {
  try {
    const customerUsers = await User.find({ role: "Customer" });
    res.status(200).json(customerUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
}; 

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addCook = async (req, res) => {
  const { firstName, lastName, email, password, role, phoneNumber, experties, address,city } = req.body;

  try {
    if (!firstName || !lastName || !email || !password || !phoneNumber || !experties || !address || !city) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (!req.file) {
      return res.status(400).json({ error: "Upload an image" });
    }

    const image = req.file.location;

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "Cook",
      image,
      phoneNumber,
      experties,
      address,
      city
    });

    // if (!newUser) {
    //   const imagePath = req.file.location;
    //  ;
    // }

    res.status(200).json(newUser);
  } catch (error) {
    const imagePath =req.file.location;
    console.error(error);
    res.status(500).json({ err: "Internal Server Error", msg: error });
  }
};



// Controller for adding a new user ( and admin is adding another admin)
export const SignUp = async (req, res) => {
  const { firstName, lastName, email, password, role, phoneNumber } = req.body;

  try {
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "Customer",
      phoneNumber,
    });
    const token = generateToken(newUser);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Internal Server Error", msg: error });
  }
};

export const logIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "all fields are required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password " });
    }

    const token = generateToken(user);

    // Set token in HTTP-only cookie
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .status(200)
      .json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loggedInUser = (req, res) => {
  return res.json({ user: req.user }).status(200);
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Display all users by city
export const getUsersByCity = async (req, res) => {
  const { city } = req.body;
  try {
    const users = await User.find({ city});

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No Cook users found in this city" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};


