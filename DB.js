const mongoose = require('mongoose')

const CONN = ()=>{
    mongoose.connect(process.env.DB_URI).then((data)=>{
        console.log("Connected with ", data.connection.host)
    }).catch((error)=>{
        console.log("Issue with Databse connection", error)
    })
}

module.exports = CONN