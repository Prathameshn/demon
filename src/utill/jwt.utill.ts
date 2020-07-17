import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');
const ignoredUrl: Array<string> = ['/user/registration'];

export class jWT {
  static async getToken(userId: string, documentId: string) {
    try {
      const token = await jwt.sign(
        { documentId: documentId, user_id: userId },
        process.env.JWT_SECRET_KEY
      );
      return token;
    } catch (e) {
      console.log(e);
    }
  }

  static async verifyToken(token: string) {
    try {
      const data = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      return data;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  //Method for OTP auth token
  static async getOtpToken(emailOrmobile: string) {
    try {
      const token = await jwt.sign(
        { emailOrMobile : emailOrmobile },
        process.env.JWT_SECRET_KEY, { expiresIn: 60 * 10 }
      );
      return token;
    } catch (error) {
      return error;
    }
  }
}
