import { Request, Response } from 'express';
import { User } from '../service/user.class';
import { validationResult, statusCode } from '../utill/utill';
import { AppResponse } from "../utill/response.utill";
import { message } from '../utill/mesage.utill';
import { Db } from '../config/db.config';

export class UserController {
  static async saveUser(req: Request, res: Response) {

    const errors = await validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(statusCode.Error).send(await AppResponse.validationErr(errors.array()));
    }

    const userName = req.body.user_name;
    const userMail = req.body.user_email;
    const password = req.body.password;
    const user_preferences = req.body.user_preferences;

    const user = new User(userName.trim(), userMail, password, user_preferences);
    try {
      const regUser = await User.saveUser(user);
      return res.status(statusCode.document_created).send(await AppResponse.sendData(message.registartion.reg_succ, regUser));
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }

  static async getUserDetails(req: Request, res: Response) {
    const user_id = req.body.user_id;

    try {
      const userDetails = await User.getUserDetails(user_id);
      return res.send(userDetails);
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }

  static async login(req: Request, res: Response) {
    const errors = await validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(statusCode.Error).send(await AppResponse.validationErr(errors.array()));
    }

    const loginId = req.body.login_id;
    const password = req.body.password;

    try {
      const logRes = await User.login(loginId, password);
      return res.status(statusCode.data_fetched).send(await AppResponse.sendData(message.login.login_succ, logRes));
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(message.login.login_failed));
    }
  }

  //Method for checking existing eamil and mobile
  static async isExists(req: Request, res: Response) {
    const errors = await validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(statusCode.Error).send(await AppResponse.validationErr(errors.array()));
    }
    let type: string = "";
    let emailOrMobile: string = req.body.emailOrMobile;
    if (emailOrMobile.includes('@')) {
      type = 'email';
    } else {
      type = 'mobile';
    }
    try {
      const isExistRes = await User.isDataExists(emailOrMobile, type);
      return res.status(statusCode.data_fetched).send(await AppResponse.sendData(isExistRes.message, isExistRes));
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }

  //Method for getting list of instrests available in the platform
  static async getIntrests(req: Request, res: Response) {

    try {
      const intrestList = await User.getListOfInstrests();
      return res.status(statusCode.data_fetched).send(await AppResponse.sendData(message.intrest_list.intrestlist_succ, intrestList.list_of_preferrences));
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }

  //Method for user password updation
  static async updatePw(req: Request, res: Response) {
    const errors = await validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(statusCode.Error).send(await AppResponse.validationErr(errors.array()));
    }

    let userId: string = req.body.user_id;
    let currentPw: string = req.body.currentpw;
    let newPw: string = req.body.newpw;


    try {
      let updatePwRes = await User.updatePw(userId, currentPw, newPw);

      return res.status(statusCode.data_fetched).send(await AppResponse.sendData(message.password.pass_update_succ, {}));

    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }

  //Method for Reset password
  static async resetPassWord(req: Request, res: Response) {
    const errors = await validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(statusCode.Error).send(await AppResponse.validationErr(errors.array()));
    }

    let emailOrMobile: string = req.body.emailOrMobile;
    let newpw: string = req.body.newpw;

    try {
      let resetPw = await User.resetPassWord(emailOrMobile, newpw);
      return res.status(statusCode.data_fetched).send(await AppResponse.sendData(message.password.pass_update_succ, {}));

    } catch (error) {
      console.log(error);
      
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }
}
