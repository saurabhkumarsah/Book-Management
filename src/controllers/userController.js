import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js"
import { isValidEmail, isValidMN, isValidPass, isValidTitle } from '../util/validator.js'

// CREATE USER =====================================================================================================================================================================
export const createUser = async (req, res) => {
    try {
        let { title, name, phone, email, password } = req.body

        if (!title) return res.status(400).json({ status: false, message: "Title is missing" })
        if (!isValidTitle(title)) return res.status(400).json({ status: false, message: "Title should be Mr/Mrs/Miss" })

        if (!name) return res.status(400).json({ status: false, message: "Name is missing" })

        if (!phone) return res.status(400).json({ status: false, message: "Phone Number is missing" })
        if (!isValidMN(phone)) return res.status(400).json({ status: false, message: "Phone Number is not valid" })
        const dbPhone = await userModel.findOne({ phone: phone })
        if (dbPhone) return res.status(400).json({ status: false, message: "Phone Number is already exist" })

        if (!email) return res.status(400).json({ status: false, message: "Email is missing" })
        if (!isValidEmail(email)) return res.status(400).json({ status: false, message: "Email is not valid" })
        const dbEmail = await userModel.findOne({ email: email })
        if (dbEmail) return res.status(400).json({ status: false, message: "Email is already exist" })

        if (!password) return res.status(400).json({ status: false, message: "Password is missing" })
        if (!isValidPass(password)) return res.status(400).json({ status: false, message: "Invalid Password" })

        const saveData = await userModel.create(req.body)
        return res.status(201).json({ status: true, data: saveData })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }

}


// LOGIN USER ======================================================================================================================================================================
export const userLogin = async (req, res) => {
    try {

        let { SECRET_KEY } = process.env
        let { email, password } = req.body

        if (!email) return res.status(400).json({ status: false, message: "Email is missing" })
        const userData = await userModel.findOne({ email: email })
        if (!userData) return res.status(400).json({ status: false, message: "Invalid Email" })

        if (!password) return res.status(400).json({ status: false, message: "Password is missing" })
        if (userData.password !== password) return res.status(400).json({ status: false, message: "Invalid Password" })

        const token = jwt.sign({ id: userData._id.toString() }, SECRET_KEY, { expiresIn: '24h' })
        return res.status(201).json({ status: true, data: { token: token } })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }

}