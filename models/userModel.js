const mongoose = require("mongoose")
const jwt = require("jsonwebtoken") 
const bcrypt = require("bcrypt")


const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true

    },
    password:{
        type:String,
        select:false,//when this false then find() will not show untill specify like (+"password")

    },
    role:{
        type:String,
        default:'user'
    },
    resetToken:String,
    resetTimeExp:Date
})

userSchema.pre('save',async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)

})

userSchema.methods.getJWTtoken = function (){
    return jwt.sign({id:this._id},"GUPT")
}
userSchema.methods.isPasswordMatched = function(pass){
    return bcrypt.compare(this.password, pass)
}

module.exports = mongoose.model('User', userSchema);