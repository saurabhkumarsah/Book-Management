import mongoose from "mongoose"

export const isId = (id) => {
    if (mongoose.isValidObjectId(id)) return true
    return false
}