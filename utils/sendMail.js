const nodemailer = require("nodemailer")
const crypto = require("crypto")


exports.sendMail = async (req, res,user)=>{
    //generating token
    const resetToken = crypto.randomBytes(20).toString("hex")
    //hashing and adding token to schema
    user.resetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    //set expire time
    user.resetTimeExp = Date.now()+ 5*60*1000//miliscond for 15 mint


    //now need to create url so that url send to user mail for reset password.
    // const resetPasswordUrl = `http://localhost/api/v1/password/reset/${resetToken}`
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    const message = `Your reset password token is: \n\n ${resetPasswordUrl} \n\n if you have requested it please ignore it.`

    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASS
        }
    })


    const mailOptions = {
        from:process.env.SMTP_MAIL,
        to:req.body.email,
        subject:"gullu.com reset password",
        text:message,
    }

    const send = await transporter.sendMail(mailOptions);
    console.log("mail sent success",send.response)
}
