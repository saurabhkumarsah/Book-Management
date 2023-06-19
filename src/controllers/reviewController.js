import moment from "moment"
import bookModel from "../models/bookModel.js"
import reviewModel from "../models/reviewModel.js"

export const addReview = async (req, res) => {
    try {
        const date = moment().format()
        req.body.reviewAt = date
        req.body.bookId = req.params.bookId

        let { bookId, rating } = req.body

        if (!bookId) return res.status(400).json({ status: false, message: "Book ID is missing" })

        const dbBook = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false })
        if (!dbBook) return res.status(404).json({ status: false, message: "Books not found" })

        if (!rating) return res.status(400).json({ status: false, message: "Rating is missing" })
        if (rating < 1 && rating > 5) return res.status(400).json({ status: false, message: "Invalid rating: Rating should be between 1 and 5" })

        const bookData = await bookModel.findOneAndUpdate({ _id: dbBook._id }, { reviews: dbBook.reviews + 1 }, { new: true }).lean()

        const saveData = await reviewModel.create(req.body)
        bookData.reviewsData = saveData

        return res.status(201).json({ status: true, message: "Review added successfully", data: bookData })

    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

export const updateReview = async (req, res) => {
    try {
        let { bookId, reviewId } = req.params

        if (req.body.bookId) return res.status(400).json({ status: false, message: "Not updatable" })
        if (req.body.isDeleted) return res.status(400).json({ status: false, message: "Not updatable" })

        if (!bookId) return res.status(400).json({ status: false, message: "Book ID is missing" })
        if (!reviewId) return res.status(400).json({ status: false, message: "Review ID is missing" })

        const dbBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        const dbReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!dbBook) return res.status(404).json({ status: false, message: "Book not Found" })
        if (!dbReview) return res.status(404).json({ status: false, message: "Review not Found" })

        await reviewModel.findOneAndUpdate({ _id: reviewId }, req.body)
        const allReviewData = await reviewModel.find({ bookId: bookId })

        const data = JSON.parse(JSON.stringify(dbBook))
        data.reviewsData = allReviewData

        return res.status(200).json({ status: true, message: 'Books list', data: data })

    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

export const deleteReview = async (req, res) => {
    try {
        let { bookId, reviewId } = req.params

        if (!bookId) return res.status(404).json({ status: false, message: "Book Id is missing" })
        if (!reviewId) return res.status(404).json({ status: false, message: "Review Id is missing" })
        
        const dbBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        const dbReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!dbBook) return res.status(404).json({ status: false, message: "Book not Found" })
        if (!dbReview) return res.status(404).json({ status: false, message: "Review not Found" })

        await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true })

        await bookModel.findOneAndUpdate({ _id: dbBook._id }, { reviews: dbBook.reviews - 1 })

        res.end()
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}



// DELETE / books /: bookId / review /: reviewId
// Check if the review exist with the reviewId.Check if the book exist with the bookId.Send an error response with appropirate status code like this if the book or book review does not exist
// Delete the related reivew.
// Update the books document - decrease review count by one