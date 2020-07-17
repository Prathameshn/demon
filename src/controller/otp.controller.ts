import { Request, Response } from 'express';
import { validationResult, statusCode } from '../utill/utill';
import { AppResponse } from '../utill/response.utill';
import { OtpServices } from '../service/otp.class';
import { message } from '../utill/mesage.utill';

export class Otp {
  //Methfd for generating OTP
  static async generateOtp(req: Request, res: Response) {
    const errors = await validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(statusCode.Error).send(await AppResponse.validationErr(errors.array()));
    }

    let emailOrMobile = req.body.emailOrMobile;
    try {
      let getOtp = await OtpServices.generateOtp(emailOrMobile);
      return res.status(statusCode.document_created).send(await AppResponse.sendData(message.otp_validation.otp_succ, getOtp));
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error));
    }


  }

  //Method for verifing Otp
  static async verifyOtp(req: Request, res: Response) {
    const errors = await validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(statusCode.Error).send(await AppResponse.validationErr(errors.array()));
    }

    console.log(req.body);
    
    let type: string = "";
    let emailOrMobile: string = req.body.emailOrMobile;
    let otp: string = req.body.otp;

    if (emailOrMobile.includes('@')) {
      type = 'email';
    } else {
      type = 'mobile';
    }

    try {
      let verifyOtpRes = await OtpServices.verifyOtp(emailOrMobile, otp, type);
      return res.status(statusCode.document_created).send(await AppResponse.sendData("verifyOtpRes", verifyOtpRes));

    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }
}