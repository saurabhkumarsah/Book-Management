import mongoose from "mongoose";
const { Schema, model } = mongoose

const reviewSchema = new Schema(
    {
        bookId: {
            type: Schema.Types.ObjectId,
            ref: "Book",
            require: true
        },
        reviewedBy: {
            type: String,
            require: true,
            default: 'Guest'
        },
        reviewAt: {
            type: Date,
            require: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            require: true
        },
        review: {
            type: String
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

export default model('Review', reviewSchema)


    // bookId: { ObjectId, mandatory, refs to book model },
    // reviewedBy: {string, mandatory, default 'Guest', value: reviewer's name},
    //     reviewedAt: { Date, mandatory },
    //     rating: { number, min 1, max 5, mandatory },
    //     review: { string, optional }
    //     isDeleted: { boolean, default: false },
    // }