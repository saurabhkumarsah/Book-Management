import mongoose from "mongoose";
const { Schema, model } = mongoose

const bookSchema = new Schema(
    {
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
            type: Schema.Types.ObjectId(),
            ref: "User"
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



// {
//     title: { string, mandatory, unique },
//     excerpt: { string, mandatory },
//     userId: { ObjectId, mandatory, refs to user model },
//     ISBN: { string, mandatory, unique },
//     category: { string, mandatory },
//     subcategory: { string, mandatory },
//     reviews: { number, default: 0, comment: Holds number of reviews of this book },
//     deletedAt: { Date, when the document is deleted },
//     isDeleted: { boolean, default: false },
//     releasedAt: { Date, mandatory, format("YYYY-MM-DD") },
//     createdAt: { timestamp },
//     updatedAt: { timestamp },
// }