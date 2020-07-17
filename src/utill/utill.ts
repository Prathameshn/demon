export const { check, validationResult } = require('express-validator');

export const statusCode = {
  "document_created" : 201,
  "data_fetched" : 200,
  "Error" : 422
}

const crypto = require('crypto');

export class Utill {
  static getSalt() {
    const salt = crypto.randomBytes(256).toString('hex');
    return salt;
  }

  static getPassword(password: string, salt: string) {
    const encrypPw = crypto.pbkdf2Sync(password, salt, 99999, 512, 'sha512');
    return encrypPw.toString('hex');
  }

  static getRandomString() {
    const character = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let ch = '';
    for (let i = 0; i < 5; i++) {
      ch += character.charAt(Math.floor(Math.random() * character.length));
    }
    return Math.floor(Math.random() * 10000) + ch;
  }

  //Method for generating OTP
  static async getOtp () {
    let otp = '';
    for(let i = 0; i < 6; i++) {
      otp = otp + Math.floor(Math.random()* 10);
    }
    return '012345';
    //return otp;
  }
}
