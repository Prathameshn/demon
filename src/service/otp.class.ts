import { Db } from '../config/db.config';
import { Utill } from '../utill/utill';
import { message } from '../utill/mesage.utill';
import { jWT } from '../utill/jwt.utill';

export class OtpServices {
  //Method for generating OTP
  static async generateOtp(emailOrMobile: string) {
    const otpColl = await Db.getOtpCollObj();

    let otp = await Utill.getOtp();

    let value = {
      user_id: emailOrMobile,
      otp: otp,
      isExpired: false,
      isVerified: false,
      created_on: new Date(),
      updated_on: new Date()
    }


    try {
      const generateOtp = await otpColl.updateOne({ user_id: emailOrMobile }, { $set: value }, { upsert: true });
      //We can send to email or mobile here
      if (generateOtp.result.n) {
        //Genrate a temp auth token for OTP
        let tempAuth = await jWT.getOtpToken(emailOrMobile);
        return Promise.resolve({message : message.otp_validation.otp_auth_massge, auth_token : tempAuth});
      } else {
        return Promise.reject({message : message.otp_validation.err_while_generation});
      }

    } catch (error) {
      return Promise.reject(error);
    }
  }


  //Method for verifing OTP
  static async verifyOtp(emailOrMobile: string, otp: string, type: string) {
    const otpColl = await Db.getOtpCollObj();

    try {
      let savedOtp = await otpColl.find({ user_id: emailOrMobile }).toArray();

      //Check weather email or mobile exists or not
      if (savedOtp.length) {
        //Check weather the OTP is expired or not
        let isExpired = await this.__isExpired(savedOtp[0].user_id, savedOtp[0].created_on);
        //If not expired
        if (isExpired.expired == 0) {
          //Verify the OTP
          if (otp == savedOtp[0].otp) {
            //Check is already verified
            if (savedOtp[0].isVerified) {
              return Promise.reject({message :message.otp_validation.otp_already_verified});
            } else {
              await otpColl.updateOne({ user_id: emailOrMobile }, { $set: { isVerified: true, updated_on: new Date() } });
              return Promise.resolve({message : message.otp_validation.otp_veri_succ});
            }
          } else {
            return Promise.reject({message : message.otp_validation.otp_veri_fail});
          }

        } else {
          return Promise.reject({message : message.otp_validation.otp_expired});
        }
      } else {
        return Promise.reject(type+' '+ message.otp_validation.user_id_not);
      }

    } catch (error) {
      return Promise.reject(error);
    }
  }

  //Private method for checking weather the OTP has expired or not
  static async __isExpired(userId: string, otpTime: Date) {
    let date: any = new Date();
    let otpcreation: any = new Date(otpTime);
    let difTime: number = date - otpcreation;

    let seconds: number = difTime / 1000;
    let minutes: number = Math.floor(seconds / 60);

    if (minutes >= 6) {
      //make the user_id in otp as expired
      const otpColl = await Db.getOtpCollObj();
      await otpColl.updateOne({ user_id: userId }, { $set: { isExpired: true, updated_on: new Date() } });
      return { expired: 1 };
    } else {
      return { expired: 0 }
    }
  }
}