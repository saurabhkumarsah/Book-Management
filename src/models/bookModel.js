import mongoose from "mongoose";
const { Schema, model } = mongoose

const bookSchema = new Schema(
    {
        bookCover: {
            type: String,
            require: true
        },
        title: {
            type: String,
            require: true,
            unique: true
        },
        excerpt: {
            type: String,
            require: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            require: true
        },
        ISBN: {
            type: String,
            require: true,
            unique: true
        },
        category: {
            type: String,
            require: true
        },
        subcategory: {
            type: String,
            require: true
        },
        reviews: {
            type: Number,
            default: 0
        },
        deletedAt: {
            type: Date
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        releasedAt: {
            type: Date,
            require: true
        }
    },
    {
        timestamps: true
    }
)

export default model('Book', bookSchema)