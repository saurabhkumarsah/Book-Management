import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
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