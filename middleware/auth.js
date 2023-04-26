
const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")

exports.isAuthenticated = async (req, res,next)=>{
    const {tkn1} = req.cookies
    if(!tkn1){
        return res.status(401).json({success:false, message:"Login first for accessing resource"})
    }
    try {
        const decodeData = jwt.verify(tkn1, "GUPT")
        req.user = await userModel.findById(decodeData.id)
        next()
 
        
    } catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }

}

exports.authorizedRole = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({success:true, message:"This user is not authorized to access this resource."})
        }
        next()
    }
}


