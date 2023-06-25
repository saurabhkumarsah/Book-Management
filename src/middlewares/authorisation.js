import jwt from "jsonwebtoken";
import bookModel from "../models/bookModel.js";
import { isId } from "../util/validator.js";

// export const authCreate = (req, res, next) => {
//     try {
//         const { SECRET_KEY } = process.env
//         const token = req.headers['x-api-key']
//         if (!token) return res.status(401).json({ status: false, message: "Token is missing" })
//         const decoded = jwt.verify(token, SECRET_KEY)

//         if (decoded.id != req.body.userId) return res.status(401).json({ status: false, message: "User not valid" })

//         next()

//     } catch (error) {
//         if (error.message === "invalid token") return res.status(400).json({ status: false, message: "Token is not valid" })
//         return res.status(500).json({ status: false, message: error.message })
//     }
// }

export const auth = async (req, res, next) => {
    try {
        const { SECRET_KEY } = process.env
        if (!isId(req.params.bookId)) return res.status(400).json({ status: false, message: "Book ID is not valid" })
        const bookId = req.params.bookId
        const token = req.headers['x-api-key']
        if (!token) return res.status(401).json({ status: false, message: "Token is missing" })
        const decoded = jwt.verify(token, SECRET_KEY)

        const bookData = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookData) return res.status(404).json({ status: false, message: "Book is not found" })

        if (decoded.id != bookData.userId) return res.status(403).json({ status: false, message: "User not valid" })

        next()
    } catch (error) {
        if (error.message === "invalid token") return res.status(400).json({ status: false, message: "Token is not valid" })
    }
}

export const authen = async (req, res, next) => {
    try {
        const { SECRET_KEY } = process.env
        const token = req.headers['x-api-key']
        if (!token) return res.status(401).json({ status: false, message: "Token is missing" })

        try {

            const decoded = jwt.verify(token, SECRET_KEY)
            req.decoded = decoded.id

        } catch (error) {
            return res.status(403).json({ status: false, message: "Unauthorization" })
        }

        next()

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}