import mongoose from "mongoose"

export const isId = (id) => {
    if (mongoose.isValidObjectId(id)) return true
    return false
}

export const isRating = (num) => {
    if (num >= 1 && num <= 5) {
        return true
    }
    else {
        return false
    }
}