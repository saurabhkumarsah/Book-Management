import express from 'express'
import { createUser, userLogin } from '../controllers/userController.js'
import { createBook, deleteBook, getBook, getBooks, updateBook } from '../controllers/bookController.js'
import { addReview, deleteReview, updateReview } from '../controllers/reviewController.js'
import { auth, authen } from '../middlewares/authorisation.js'
export const router = express.Router()

router.get('/test', (req, res) => {
    res.send({ status: true, message: "Fine" })
})


// User Router
router.post('/register', createUser)
router.post('/login', userLogin)

// Book Router
router.post('/books', authen, createBook)
router.get('/books', authen, getBooks)
router.get('/books/:bookId', authen, getBook)
router.put('/books/:bookId', authen, updateBook)
router.delete('/books/:bookId', authen, deleteBook)

// Review
router.post('/books/:bookId/review', addReview)
router.put('/books/:bookId/review/:reviewId', updateReview)
router.delete('/books/:bookId/review/:reviewId', deleteReview)