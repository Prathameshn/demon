import { Request, Response, NextFunction } from 'express';
import { AppResponse } from '../utill/response.utill';
import { jWT } from './jwt.utill';
import { message } from '../utill/mesage.utill';

export const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ignoredUrl: Array<string> = ['/service/user/login', '/service/user/isUserExists', '/service/user/generateOtp'];
  if (req.url.toString().indexOf('Feed')>0) {
    next();
  }
  else if (ignoredUrl.includes(req.url)) {
    next();
  } else {
    try {
      const header: any = req.headers['authorization'];
      if (header) {
        const bearerToken: Array<string> = header.split(' ');
        const token: string = bearerToken[1];
        const isVarified = await jWT.verifyToken(token);
        if (isVarified.user_id) {
          req.body['user_id'] = isVarified.user_id;
          req.body.pr = "sdfd"
          next();
        } else if (isVarified.emailOrMobile) {
          req.body['emailOrMobile'] = isVarified.emailOrMobile;
          next();
        } else {
          res.status(422).send(await AppResponse.sendError(isVarified));
        }
      } else {
        res.status(422).send(await AppResponse.sendError(message.generic.auth_token_missing));
      }
    } catch (e) {
      console.log(e);
      res.status(422).send(await AppResponse.sendError(e));
    }
  }
};
