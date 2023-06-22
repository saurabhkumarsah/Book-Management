import mongoose from "mongoose"
import Validator from "email-validator"

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

export const isValidTitle = (str) => {
    if (str == "Mr" || str == "Mrs" || str == "Miss") {
        return true
    } else {
        return false
    }
}

export const isValidEmail = (email) => {
    if (Validator.validate(email)) {
        return true
    } else {
        return false
    }
}

export const isValidPass = (str) => {
    let l = str.length
    if (l >= 8 && l <= 15) {
        return true
    } else {
        return false
    }
}
export const isValidMN = (str) => {
    let l = str.length
    if (l === 10) {
        return true
    } else {
        return false
    }
}