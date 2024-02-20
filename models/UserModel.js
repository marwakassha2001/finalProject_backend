import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 20,
        },
        lastName: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 20,
        },
        role: {
            type: String,
            required: true,
            enum: ["Admin", "Cook", "Customer"],
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (value) => {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: "Invalid email format",
            },
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        address: {
            type: String,
            minlength: 3,
            maxlength: 30,
        },
        city: {
            type: String,
          },
        experties: { type: String},
        phoneNumber: { type: Number },
        image: { type: String },
    },
    {
        timestamps: true,
    }
);
const User = mongoose.model("User", userSchema);

export default User;