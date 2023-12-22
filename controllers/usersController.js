import User from '../database/models/User.js'
import bcrypt from 'bcrypt'

export const usersController = {
    getUsers: async (req, res) => {
        try {
            const users = await User.find().select('-password');

            res.status(200).json(users)
        } catch (error) {
            res.status(404).json({
                message: error.message
            })
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);

            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({
                message: error.message
            })
        }
    },
    getUserByEmail: async (req, res) => {
        try {
            const user = await User.findOne({ email }).select('-password');
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({
                message: error.message
            })
        }
    },
    register: async (req, res) => {
        try {
            const {
                username,
                email,
                posts,
                password
            } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).send({ message: 'Email ya registrado' })
            }

            const newUser = new User({
                username,
                email,
                posts,
                password: bcrypt.hashSync(password, 10),
            })

            await newUser.save();

            res.status(201).json(newUser)
        } catch (error) {
            res.status(409).json({
                message: error.message
            })
        }
    },
    updateUser: async (req, res) => {
        try {
            const userUpd = {
                ...req.body
            }

            if (req.body.password) {
                userUpd.password = bcrypt.hashSync(req.body.password, 10)
            }

            const updateUser = await User.findByIdAndUpdate(req.params.id,
                userUpd, {
                new: true
            })
            res.status(201).json(updateUser)
        } catch (error) {
            res.status(409).json({
                message: error.message
            })
        }
    },
    deleteUser: async (req, res) => {
        try {
            const userRemove = await User.findById(req.params.id);

            await User.deleteOne({ _id: userRemove._id })

            res.status(204).send()
        } catch (error) {
            res.status(409).json({
                message: error.message
            })
        }
    }
}
