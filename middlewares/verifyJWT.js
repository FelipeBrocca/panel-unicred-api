import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
    try {
        const token = req.cookies.token

        if(!token) return res.status(401).json({message: 'Unauthorized'})

        const verify = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = verify.user

        next()

    } catch (error) {
        res.status(401).json({message: error})
    }
}

export default verifyJWT
