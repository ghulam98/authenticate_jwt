
exports.sendResp = (res, message="Ok", status,statusCode,data=null)=>{
    res.status(statusCode).json({
        success:status,
        message:message,
        data
         
    })
}