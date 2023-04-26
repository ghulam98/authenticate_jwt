const CONN = require("./DB")
const app = require("./app")
const dotenv = require("dotenv")


//config env
dotenv.config({path:"./config/config.env"})

//DB Connection
CONN();

app.listen(process.env.PORT, ()=>{
    console.log("connected on PORT:",process.env.PORT)
})


