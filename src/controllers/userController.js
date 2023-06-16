import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js"


export const createUser = async (req, res) => {
    try {
        let { title, name, phone, email, password } = req.body

        if (!title) return res.status(400).json({ status: false, message: "Title is missing" })
        if (title !== "Mr" && title !== "Mrs" && title !== "Miss") return res.status(400).json({ status: false, message: "Title should be Mr/Mrs/Miss" })

        if (!name) return res.status(400).json({ status: false, message: "Name is missing" })

        if (!phone) return res.status(400).json({ status: false, message: "Phone Number is missing" })
        const dbPhone = await userModel.findOne({ phone: phone })
        if (dbPhone) return res.status(400).json({ status: false, message: "Phone Number is already exist" })

        if (!email) return res.status(400).json({ status: false, message: "Email is missing" })
        const dbEmail = await userModel.findOne({ email: email })
        if (dbEmail) return res.status(400).json({ status: false, message: "Email is already exist" })

        if (!password) return res.status(400).json({ status: false, message: "Password is missing" })
        if (password.length < 8 || password.length > 15) return res.status(400).json({ status: false, message: "Invalid Password" })

        const saveData = await userModel.create(req.body)
        // delete saveData.title
        return res.status(201).json({ status: true, data: saveData })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }

}


export const userLogin = async (req, res) => {
    try {
        let { SECRET_KEY } = process.env
        let { email, password } = req.body

        if (!email) return res.status(400).json({ status: false, message: "Email is missing" })
        const userData = await userModel.findOne({ email: email })
        if (!userData) return res.status(400).json({ status: false, message: "Invalid Email" })

        if (!password) return res.status(400).json({ status: false, message: "Password is missing" })
        if (userData.password !== password) return res.status(400).json({ status: false, message: "Invalid Password" })

        const token = jwt.sign({ id: userData._id.toString() }, SECRET_KEY, { expiresIn: '1h' })
        return res.status(201).json({ status: true, data: token })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }

}

















// POST / register
// Create a user - atleast 5 users
// Create a user document from request body.
// Return HTTP status 201 on a succesful user creation.Also return the user document.The response should be a JSON object like this
// Return HTTP status 400 if no params or invalid params received in request body.The response should be a JSON object like this

// POST / login
// Allow an user to login with their email and password.
// On a successful login attempt return a JWT token contatining the userId, exp, iat.The response should be a JSON object like this
// If the credentials are incorrect return a suitable error message with a valid HTTP status code.The response should be a JSON object like this

// {
//     status: true,
//         data: {
//         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JJZCI6IjYyZmUzYmUzMzY2ZmFkNDZjY2Q1MzI3ZiIsImlhdCI6MTY2MDgzMDA4MywiZXhwIjoxNjYwODY2MDgzfQ.mSo-TLyRlGhMNcy4ftEvvIlCHlyEqpaFZc-iBth4lfg"

//     }
// }

// {
//     status: true,
//         data: {
//         "_id": ObjectId("88abc190ef0288abc190ef55"),
//             "title": "How to win friends and influence people",
//                 "excerpt": "book body",
//                     "userId": ObjectId("88abc190ef0288abc190ef02"),
//                         "ISBN": "978-0008391331",
//                             "category": "Book",
//                                 "subcategory": "Non fiction",
//                                     "isDeleted": false,
//                                         "reviews": 0,
//                                             "releasedAt": "2021-09-17"
//         "createdAt": "2021-09-17T04:25:07.803Z",
//             "updatedAt": "2021-09-17T04:25:07.803Z",
//       }
// }