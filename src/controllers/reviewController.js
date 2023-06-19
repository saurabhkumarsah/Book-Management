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

        const bookData = await bookModel.findOneAndUpdate({ _id: dbBook._id }, { reviews: dbBook.reviews + 1 }, { new: true }).lean()

        const saveData = await reviewModel.create(req.body)
        bookData.reviewsData = saveData
        
        return res.status(201).json({ status: true, message: "Review added successfully", data: bookData })

    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}










// POST / books /: bookId / review
// Add a review for the book in reviews collection.
// Check if the bookId exists and is not deleted before adding the review.Send an error response with appropirate status code like this if the book does not exist
// Get review details like review, rating, reviewer's name in request body.
// Update the related book document by increasing its review count
// Return the updated book document with reviews data on successful operation.The response body should be in the form of JSON object like this
/**
{
    "status": true,
    "message": "Review added successfully",
    "data": {
        "reviews": 2,
        "isDeleted": false,
        "_id": "63ede089c7c6ef5f68ca5360",
        "title": "Wings of Fire 8347",
        "excerpt": "Free will",
        "userId": "63ede081c7c6ef5f68ca5356",
        "ISBN": "1001078",
        "category": "Science",
        "subcategory": "Life Science",
        "releasedAt": "1990-12-20T00:00:00.000Z",
        "createdAt": "2023-02-16T07:51:37.348Z",
        "updatedAt": "2023-02-16T07:51:47.075Z",
        "__v": 0,
        "reviewsData": {
            "reviewedBy": "Jack",
            "isDeleted": false,
            "_id": "63ede093c7c6ef5f68ca5367",
            "bookId": "63ede089c7c6ef5f68ca5360",
            "rating": 3,
            "review": "very good",
            "reviewedAt": "2023-02-16T07:51:47.029Z",
            "createdAt": "2023-02-16T07:51:47.031Z",
            "updatedAt": "2023-02-16T07:51:47.031Z",
            "__v": 0
        }
    }
}
*/

// PUT / books /: bookId / review /: reviewId
// Update the review - review, rating, reviewer's name.
// Check if the bookId exists and is not deleted before updating the review.Check if the review exist before updating the review.Send an error response with appropirate status code like this if the book does not exist
// Get review details like review, rating, reviewer's name in request body.
// Return the updated book document with reviews data on successful operation.The response body should be in the form of JSON object like this


// DELETE / books /: bookId / review /: reviewId
// Check if the review exist with the reviewId.Check if the book exist with the bookId.Send an error response with appropirate status code like this if the book or book review does not exist
// Delete the related reivew.
// Update the books document - decrease review count by one