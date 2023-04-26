const express = require("express")
const cookieParser = require("cookie-parser")

const app = express()
//json parser
app.use(express.json())
app.use(cookieParser())

//adding routes
const user = require("./routes/userRoute")
app.use("/api/v1/",user)

module.exports = app

