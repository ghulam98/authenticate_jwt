const userModel = require("../models/userModel")
const { sendToken } = require("../utils/jwtToken")
const { sendMail } = require("../utils/sendMail")
const { sendResp } = require("../utils/sendResp")
const crypto = require("crypto")


exports.register = async(req, res)=>{
    try {
        const user = await userModel.create({...req.body})
        sendToken(res,user,200)
    } catch (error) {
        sendResp(res,error.message,false,500)
    }
}

//Login
exports.login = async(req, res)=>{
    try {
        const user = await userModel.findOne({email:req.body.email}).select("+password")
        if(!user){
            return sendResp(res,"User credetial invalid1",false, 404)
        }
        if(!user.isPasswordMatched(req.body.password)){
            return sendResp(res,"User credetial invalid11",false, 404)
        }
        sendToken(res,user,200)
    } catch (error) {
        sendResp(res, error.message, false, 500)
        
    }
}


//logout user
exports.logout = async(req, res)=>{
    try {
        const {tkn1} = req.cookies;
        if(!tkn1){
            return res.status(401).json({
                success:false,msg:"Already have been logged out."
            })
        }
        res.cookie('tkn1',null,{maxAge:0, httpOnly:true})
        res.status(200).json({sucess:true, message:"Logged out success."})
        
    } catch (error) {
        sendResp(res, error.message, false, 500)
    }
}

//see all user details---Admin
exports.allUser = async (req, res)=>{
    try {
        const users = await userModel.find()
        return sendResp(res, "got all users", true, 500, users)
        
    } catch (error) {
        sendResp(res, error.message, false, 500)
    }
}

//forgot password
exports.forgotPass = async (req, res)=>{
    const user = await userModel.findOne({email:req.body.email})
    try {
        if(!user){
            return sendResp(res, "User with this mail is not exist.", false, 500)
        }

        sendMail(req, res,user);
        await user.save({validateBeforeSave: false})
        sendResp(res, `Reset mail sent success[${req.body.email}]`, true, 200)

    } catch (error) {
        user.resetTimeExp = undefined;
        user.resetToken = undefined
        user.save({validateBeforeSave: false})
        sendResp(res, error.message, false, 500)
    }
}

//reset password
exports.resetPass = async (req, res)=>{
    try {
        const {password, confirmPassword} = req.body
        if(password !== confirmPassword){
            return sendResp(res, "Confirm password not matched", false, 401)
        }

        //creating token and then hashing it to match with database which is encrypted
        const resetToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
        const user = await userModel.findOne({
            resetToken,
            resetTimeExp:{$gt: Date.now()}
        })

        if(!user){
            return res.status(400).json({success:false, message:"Reset password token is invalid or expired."})
        }
        user.password = req.body.password
        user.resetToken = undefined
        user.resetTimeExp = undefined
        await user.save()
        sendToken(res, user,200)
        
    } catch (error) {
        sendResp(res, error.message, false, 500)
    }
}
//update profile me
exports.updateProfile = async(req, res)=>{
    const {name, email} = req.body;
    try {
        let user = await userModel.findById(req.user._id)
        if(!user){
            return sendResp(res, "User with this mail is not exist.", false, 500)

        }
    user.name = name || user.name;// if name was not passed vai req.body then will not change same for others
    user.email = email || user.email;
    user.save()
    return sendResp(res, "Profile update success", true, 200, user)


        
    } catch (error) {
        sendResp(res, error.message, false, 500)
        
    }
}



// change user roll-- Admin
exports.updaterole = async(req, res)=>{
    try {
        const user = await userModel.findById(req.params.id)
        if(!user){
            return sendResp(res, "this user is not exist.", false, 201)
        }
        console.log(req.params.id)
        user.role = req.body.role
        user.save({validateBeforeSave:false})
        return sendResp(res, "Roll update success", true, 200, user)
    } catch (error) {
        sendResp(res, error.message, false, 500)
        
    }
}

