const express=require("express")
const { BookModel } = require("../models/book.model")
const { auth } = require("../middleware/authmiddleware")

const bookRouter=express.Router()

bookRouter.get("/", auth,async(req,res)=>{
    try {
        const allBooks=await BookModel.find()
        res.status(200).send({
            success: true,
            allBooks
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Something went wrong"
        })
    }
})