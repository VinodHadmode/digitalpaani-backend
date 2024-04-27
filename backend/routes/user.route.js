const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { UserModel } = require("../models/user.model")
require('dotenv').config()


const userRouter = express.Router()

userRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body
    try {
        //checking existing user
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already resistered,Please login!!"
            })
        }

        //hashing password
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                res.status(400).send({ error: err })
            } else {
                const user = new UserModel({ name, email, password: hash })
                await user.save()
                res.status(200).send({
                    success: true,
                    message: "New user has been registered!!"
                })
            }
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Something went wrong while Registration!!",
            error
        })
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        //validation
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password"
            })
        }

        const user = await UserModel.findOne({ email })
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
                    res.status(200).send({
                        success: true,
                        message: "Login Successfully!!",
                        user: {
                            name: user.name,
                            email: user.email,
                        },
                        token: token
                    })

                } else {
                    res.status(400).send({
                        success: false,
                        message: "Password doesn't match, Wrong credentials!"
                    })
                }
            })
        } else {
            res.status(400).send({
                success: false,
                message: "User not registered!"
            })
        }

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in login",
            error
        })
    }
})

module.exports = {
    userRouter
}