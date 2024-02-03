const nodemailer = require("nodemailer");

const mailSender = async(email,title,body) =>{
    try{
       let transporter = nodemailer.createTransport({
         host:process.env.MAIL_HOST,
         auth:{
         user:process.env.MAIL_USER,
         pass:process.env.MAIL_PASS,
            }
        });
        //SEND MAIL
         let info = transporter.sendMail({
          from:`Study Notion- Sumit Singh`,
          to:`${email}`,
          subject: `${title}`,
          html:`${body}`,
        })
        console.log(info);
        return info;
    }
    catch(error){
       console.log(error.message);
    }
}
module.exports = mailSender;