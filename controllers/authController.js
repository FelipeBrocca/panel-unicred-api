import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from '../database/models/User.js'


export const login = async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ email }).exec()

    if (!foundUser) {
        return res.status(401).json({ message: 'No MAIL' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) {
        return res.status(401).json({ message: 'No Password' })
    }

    const accessToken = jwt.sign(
        {
            "id": foundUser._id,
            "user": foundUser.username,
            "email": foundUser.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    const cookiesToSet = {
        token: accessToken,
        username: foundUser.username,
        email: foundUser.email,
    };

    for (const [cookieName, cookieValue] of Object.entries(cookiesToSet)) {
        res.cookie(cookieName, cookieValue, cookieOptions);
    }

    res.status(200).json({ message: 'Logged in succesfully' })
}

export const loggedIn = (req, res) => {
    try {
        const token = req.cookies.token

        if (!token) return res.json(false)

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        res.send(true)
    } catch (error) {
        res.json(false)
    }
}

export const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.token) return res.sendStatus(204)
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    })
    res.clearCookie('username', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    })
    res.clearCookie('email', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    })
    res.json({ message: 'Cookie cleared' })
}



