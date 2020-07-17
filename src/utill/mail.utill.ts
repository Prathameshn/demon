import { message } from "./mesage.utill";
import { Utill } from "./utill";



const nodemailer = require('nodemailer');
// const fs = require('fs');
// const handle = require('handlebar');
//const path = require('path');

export class Mail {
  static transport = nodemailer.createTransport({
    service : "gmail",
    auth: {
      user: 'sekharsahu143@gmail.com',
      pass: 'glemquoludpixvup'
    }
  });

  //Method for sending OTP to verify email
  static async verifyMail(receiver: string) {
    let otp = await Utill.getOtp();
    console.log(otp);
    
    // let replacements = {
    //   otp : otp
    // }
    // let htmlPath : string =  path.join(__dirname + '../');
    // let html = await fs.readFile(htmlPath + '/email_account.hbs', {encoding:'utf-8'});

    // let template = await handle.compile(html);
    // let htmlToSend = await template(replacements);

    const mailOptions = {
      from: 'sekharsahu143@gmail.com',
      to: receiver,
      subject: message.generic.welcome_mail_sub,
      text : 'Your OTP is '+ otp + ". Please verify your account by using this OTP. This will expire with in 5 minutes",
      //html: "htmlToSend"
    };

    this.transport.sendMail(mailOptions, (error: any, info: { messageId: any }) => {
      if (error) {
        return console.log(error);
      }
     // console.log('Message sent: %s', info.messageId);
    });

  }
}
