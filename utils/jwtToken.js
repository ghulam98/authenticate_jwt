exports.sendToken = (res,user, statusCode)=>{
    const token = user.getJWTtoken()
    if(!token){
        return res.status(statusCode).json({success:false, message:"Login to access this resource."})
    }
    //options
    const options = {
        httpOnly: true,
        maxAge: 30*60*1000//30mint
    }
    return res.status(statusCode).cookie('tkn1', token,options).json({
        success:true,
        token,
        user
    })
 
}