import User from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'

export const sendEmail=async({email,emailType,userId}:any)=>{
    try{
      
      const hashedToken=await bcryptjs.hash(userId.toString(),10)

      if(emailType==="VERIFY"){
        await User.findByIdAndUpdate(userId,
          {verifyToken:hashedToken},
          {verifyTokenExpiry:Date.now()+3600000}
        )
      }else if(emailType==="RESET"){
        await User.findByIdAndUpdate(userId,
          {forgetPasswordToken:hashedToken},
          {forgetPasswordTokenExpiry:Date.now()+3600000}
        )
      }

      const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "90e8c756c5fa7c",//Don't put here
          pass: "********b110"//Don't put here
        }
      });
          const mailOptions={
            from: 'ayush@gmail.ai',
            to: email,
            subject: emailType==='VERIFY'?"Verify your email":"Reset your password", 
            html: `<p>Click <a href ="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">Here</a>
            ${emailType==="VERIFY"?"Verify your email":"Reset your password"}
            or copy and paste the link below in your browser.<br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`,
          }

          const mailResponse=await transporter.sendMail(mailOptions);
          return mailResponse;
        }

    catch(error:any){
        console.log("Failed email")
        throw new Error(error.message)
    }
}