import User from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'

export const sendEmail=async({email,emailType,userId}:any)=>{
    try{
      
      const hashedToken=await bcryptjs.hash(userId.toString(),10)

      if(emailType==="VERIFY"){
        await User.findByIdAndUpdate(userId,{$set:{
          verifyToken:hashedToken,
          verifyTokenExpiry:Date.now()+3600000
        }}
        )
      }else if(emailType==="RESET"){
        await User.findByIdAndUpdate(userId,{$set:
          {forgetPasswordToken:hashedToken,
          forgetPasswordTokenExpiry:Date.now()+3600000}}
        )
      }

      const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.SMTP_USER, 
          pass: process.env.SMTP_PASS  
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