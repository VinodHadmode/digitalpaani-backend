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


bookRouter.post("/create",auth, async(req,res)=>{
    const {title,author,publishYear,userID}=req.body

    try {
        const newBook=new BookModel({title,author,publishYear,userID})
        await newBook.save()
        res.status(200).send({
            success: true,
            message: "New book has been created!!"
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Failed to create new book",
            error
        })
    }
})

bookRouter.patch("/update/:bookID",auth, async(req,res)=>{
    const {bookID}=req.params
    const userIDInUserDoc=req.body.userID

    try {
        const book=await BookModel.findOne({_id:bookID})
        const userIDInBookDoc=book.userID

        if(userIDInUserDoc===userIDInBookDoc){
            await BookModel.findByIdAndUpdate({_id:bookID},req.body)
            res.status(200).send({
                success: true,
                message: "Your note has been updated"
            })
        }else{
            res.status(400).send({
                success: false,
                message: "You are not Authorized!!"
            })
        }
        
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Something went wrong"
        })
    }
})

bookRouter.delete("/delete/:bookID",auth, async(req,res)=>{
    const {bookID}=req.params
    const userIDInUserDoc=req.body.userID

    try {
        const book=await BookModel.findOne({_id:bookID})
        const userIDInBookDoc=book.userID

        if(userIDInUserDoc===userIDInBookDoc){
            await BookModel.findByIdAndDelete({_id:bookID},req.body)
            res.status(200).send({
                success: true,
                message: "Your note has been deleted"
            })
        }else{
            res.status(400).send({
                success: false,
                message: "You are not Authorized!!"
            })
        }
        
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Something went wrong"
        })
    }
})

bookRouter.get("/filter", auth, async (req, res) => {
    const { author, publishYear } = req.query;

    try {
        let filter = {};

        if (author) {
            filter.author = author;
        }

        if (publishYear) {
            filter.publishYear = publishYear;
        }

        const filteredBooks = await BookModel.find(filter);

        res.status(200).send({
            success: true,
            filteredBooks,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Something went wrong",
            error,
        });
    }
});


module.exports={
    bookRouter
}