import mongoose from "mongoose";
const { Schema, model } = mongoose

const userSchema = new Schema(
    {
        title: {
            type: String,
            require: true,
            emun: ["Mr", "Mrs", "Miss"]
        },
        name: {
            type: String,
            require: true
        },
        phone: {
            type: String,
            require: true,
            unique: true
        },
        email: {
            type: String,
            require: true,
            unique: true
        },
        password: {
            type: String,
            require: true,
            minLength: 8,
            maxLength: 15
        },
        address: {
            street: {
                type: String
            },
            city: {
                type: String
            },
            pincode: {
                type: String
            }
        }

    },
    { timestamps: true }
)

export default model('User', userSchema)