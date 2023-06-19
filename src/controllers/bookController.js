import moment from "moment"
import bookModel from "../models/bookModel.js"
import reviewModel from "../models/reviewModel.js"
import userModel from "../models/userModel.js"

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
        if (userId.length !== 24) return res.status(400).json({ status: false, message: "User ID is not valid" })
        const dbUserId = await userModel.findOne({ _id: userId })
        if (!dbUserId) return res.status(400).json({ status: false, message: "User not found" })

        if (!ISBN) return res.status(400).json({ status: false, message: "ISBN is missing" })
        const dbISBN = await bookModel.findOne({ ISBN: ISBN })
        if (dbISBN) return res.status(400).json({ status: false, message: "ISBN is already exist" })

        if (!category) return res.status(400).json({ status: false, message: "Category is missing" })

        if (!subcategory) return res.status(400).json({ status: false, message: "Sub Category is missing" })

        if (!releasedAt) return res.status(400).json({ status: false, message: "Released Date is missing" })

        const saveData = await bookModel.create(req.body)
        return res.status(201).json({ status: true, data: saveData })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

// GET BOOKS (USING FILTERS) ==================================================================================================================
export const getBooks = async (req, res) => {
    try {
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
        const bookData = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false }).lean()
        if (bookData.length === 0) return res.status(404).json({ status: false, message: "Books not found" })
        const reviewData = await reviewModel.find({ bookId: req.params.bookId })
        bookData.reviewsData = reviewData

        return res.status(200).json({ status: true, message: 'Books list', data: bookData })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}


// UPDATE BOOK (USING BOOK ID) ==============================================================================================================
export const updateBook = async (req, res) => {
    try {
        let { title, ISBN } = req.body

        const dbTitle = await bookModel.findOne({ title: title })
        if (dbTitle) return res.status(400).json({ status: false, message: "Title is already exist" })

        const dbISBN = await bookModel.findOne({ ISBN: ISBN })
        if (dbISBN) return res.status(400).json({ status: false, message: "ISBN is already exist" })

        const updateBook = await bookModel.findOneAndUpdate({ _id: req.params.bookId, isDeleted: false }, req.body, { new: true })
        if (!updateBook) return res.status(404).json({ status: false, message: "Book not found" })

        return res.status(201).json({ status: true, message: 'Book is Updated', data: updateBook })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}



// DELETE BOOK (USING BOOK ID) ==============================================================================================================
export const deleteBook = async (req, res) => {
    try {
        const date = moment().format()
        const deleteBook = await bookModel.findOneAndUpdate({ _id: req.params.bookId, isDeleted: false }, { isDeleted: true, deletedAt: date }, { new: true })
        if (!deleteBook) return res.status(404).json({ status: false, message: "Book not found" })

        return res.status(201).json({ status: true, message: 'Book is deleted' })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}


// PUT / books /: bookId
// Update a book by changing its
// title
// excerpt
// release date
// ISBN
// Make sure the unique constraints are not violated when making the update
// Check if the bookId exists(must have isDeleted false and is present in collection).If it doesn't, return an HTTP status 404 with a response body like this
// Return an HTTP status 200 if updated successfully with a body like this
// Also make sure in the response you return the updated book document.

//     DELETE / books /: bookId
// Check if the bookId exists and is not deleted.If it does, mark it deleted and return an HTTP status 200 with a response body with status and message.
// If the book document doesn't exist then return an HTTP status of 404 with a body like this

// GET / books /: bookId
// Returns a book with complete details including reviews.Reviews array would be in the form of Array.Response example here
// Return the HTTP status 200 if any documents are found.The response structure should be like this
// If the book has no reviews then the response body should include book detail as shown here and an empty array for reviewsData.
// If no documents are found then return an HTTP status 404 with a response like this




// POST / books
// Create a book document from request body.Get userId in request body only.
// Make sure the userId is a valid userId by checking the user exist in the users collection.
// Return HTTP status 201 on a succesful book creation.Also return the book document.The response should be a JSON object like this
// Create atleast 10 books for each user
// Return HTTP status 400 for an invalid request with a response body like this



// GET / books
// Returns all books in the collection that aren't deleted. Return only book _id, title, excerpt, userId, category, releasedAt, reviews field. Response example here
// Return the HTTP status 200 if any documents are found.The response structure should be like this
// If no documents are found then return an HTTP status 404 with a response like this
// Filter books list by applying filters.Query param can have any combination of below filters.
// By userId
// By category
// By subcategory example of a query url: books ? filtername = filtervalue & f2=fv2
// Return all books sorted by book name in Alphabatical order


