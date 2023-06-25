import moment from "moment"
import bookModel from "../models/bookModel.js"
import reviewModel from "../models/reviewModel.js"
import userModel from "../models/userModel.js"
import { isId } from "../util/validator.js"

const dateRegex = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/

// CREATE BOOK ================================================================================================================================
export const createBook = async (req, res) => {
    try {
        delete req.body.deletedAt
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = req.body

        if (!title) return res.status(400).json({ status: false, message: "Title is missing" })
        const dbTitle = await bookModel.findOne({ title: title })
        if (dbTitle) return res.status(400).json({ status: false, message: "Title is already exist" })

        if (!excerpt) return res.status(400).json({ status: false, message: "Excerpt is missing" })

        if (!userId) return res.status(400).json({ status: false, message: "User ID is missing" })
        if (!isId(userId)) return res.status(400).json({ status: false, message: "User ID is not valid" })

        const dbUserId = await userModel.findOne({ _id: userId })
        if (!dbUserId) return res.status(400).json({ status: false, message: "User not found" })

        if (!ISBN) return res.status(400).json({ status: false, message: "ISBN is missing" })
        const dbISBN = await bookModel.findOne({ ISBN: ISBN })
        if (dbISBN) return res.status(400).json({ status: false, message: "ISBN is already exist" })

        if (!category) return res.status(400).json({ status: false, message: "Category is missing" })

        if (!subcategory) return res.status(400).json({ status: false, message: "Sub Category is missing" })

        if (!releasedAt) return res.status(400).json({ status: false, message: "Released Date is missing" })
        if (!dateRegex.test(releasedAt)) return res.status(400).json({ status: false, message: "Date format is not valid" })

        const saveData = await bookModel.create(req.body)
        return res.status(201).json({ status: true, data: saveData })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

// GET BOOKS (USING FILTERS) ==================================================================================================================
export const getBooks = async (req, res) => {
    try {

        if (req.query.userId) {
            if (!isId(req.query.userId)) return res.status(400).json({ status: false, message: "Invalid Id" })
        }

        const data = await bookModel.find({ $and: [{ isDeleted: false }, req.query] }).select({ __v: 0, subcategory: 0, ISBN: 0, isDeleted: 0, createdAt: 0, updatedAt: 0 }).sort({ title: 1 })

        if (data.length === 0) return res.status(404).json({ status: false, message: "Books not found" })

        return res.status(200).json({ status: true, message: 'Books list', data: data })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

// GET BOOK (USING BOOK ID) =================================================================================================================
export const getBook = async (req, res) => {
    try {
        if (!isId(req.params.bookId)) return res.status(400).json({ status: false, message: "Invalid Id" })

        const bookData = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false }).select({ ISBN: 0, __v: 0 }).lean()
        if (!bookData) return res.status(404).json({ status: false, message: "Books not found" })
        const reviewData = await reviewModel.find({ bookId: req.params.bookId, isDeleted: false }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })
        bookData.reviewsData = reviewData

        return res.status(200).json({ status: true, message: 'Books list', data: bookData })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}


// UPDATE BOOK (USING BOOK ID) ==============================================================================================================
export const updateBook = async (req, res) => {
    try {
        if (!isId(req.params.bookId)) return res.status(400).json({ status: false, message: "Book not found" })

        let { title, ISBN } = req.body

        const dbTitle = await bookModel.findOne({ title: title })
        if (dbTitle) return res.status(400).json({ status: false, message: "Title is already exist" })

        const dbISBN = await bookModel.findOne({ ISBN: ISBN })
        if (dbISBN) return res.status(400).json({ status: false, message: "ISBN is already exist" })

        const dbUserId = await bookModel.findOne({ _id: req.params.bookId })
        if (!dbUserId) return res.status(404).json({ status: false, message: "Book not found" })
        if (req.decoded != dbUserId.userId) return res.status(403).json({ status: false, message: "Unauthorization" })

        const updateBook = await bookModel.findOneAndUpdate({ _id: req.params.bookId, isDeleted: false }, req.body, { new: true })

        return res.status(200).json({ status: true, message: 'Success', data: updateBook })

    } catch (error) {
        if (error.name === "CastError") return res.status(400).json({ status: false, message: "Data Type not matched" })
        return res.status(500).json({ status: false, message: error })
    }
}



// DELETE BOOK (USING BOOK ID) ==============================================================================================================
export const deleteBook = async (req, res) => {
    try {
        const date = moment().format()
        if (!isId(req.params.bookId)) return res.status(400).json({ status: false, message: "Book not found" })

        const dbUserId = await bookModel.findOne({ _id: req.params.bookId })
        if (!dbUserId) return res.status(404).json({ status: false, message: "Book not found" })
        if (req.decoded != dbUserId.userId) return res.status(403).json({ status: false, message: "Unauthorization" })

        const deleteBook = await bookModel.findOneAndUpdate({ _id: req.params.bookId, isDeleted: false }, { isDeleted: true, deletedAt: date }, { new: true })
        if (!deleteBook) return res.status(404).json({ status: false, message: "Book not found" })

        return res.status(200).json({ status: true, message: 'Book is deleted' })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}



