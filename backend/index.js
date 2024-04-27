const express = require("express")
const { connection } = require("./db")


const app = express()

app.use(express.json())

app.listen(8080, async () => {
    try {
        await connection
        console.log("Connected to DB!");
    } catch (error) {
        console.log(error);
        console.log("Something went wrong while connecting to DB!!");
    }
    console.log("Server running on port 8080");
})