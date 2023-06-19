import express from 'express'
import { createUser, userLogin } from '../controllers/userController.js'
import { createBook, deleteBook, getBook, getBooks, updateBook } from '../controllers/bookController.js'
import { addReview, deleteReview, updateReview } from '../controllers/reviewController.js'
export const router = express.Router()

router.get('/test', (req, res) => {
    res.send({ status: true, message: "Fine" })
})


// User Router
router.post('/register', createUser)
router.post('/login', userLogin)

// Book Router
router.post('/books', createBook)
router.get('/books', getBooks)
router.get('/books/:bookId', getBook)
router.put('/books/:bookId', updateBook)
router.delete('/books/:bookId', deleteBook)

// Review
router.post('/books/:bookId/review', addReview)
router.put('/books/:bookId/review/:reviewId', updateReview )
router.delete('/books/:bookId/review/:reviewId', deleteReview )