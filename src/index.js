import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import multer from 'multer'
import { router } from './routes/route.js'

dotenv.config()

const { MONGO_URI, PORT } = process.env
const app = express()

app.use(express.json())
app.use(multer().any())

app.use('/', router)

app.listen(PORT, () => {
    console.log("Server run on PORT: ", PORT)
})

mongoose.connect(MONGO_URI)
    .then(() => console.log("DB connected...."))
    .catch((error) => console.log(error))