import { Db } from '../config/db.config';
import { Utill } from '../utill/utill';
import { jWT } from '../utill/jwt.utill';
import { Mail } from '../utill/mail.utill';
import { message } from '../utill/mesage.utill';

export class User {
  private user_id = '';
  private user_name = '';
  private user_email = '';
  private password = '';
  private saltedString = '';
  private preferences: Array<string> = [];
  private isEmailVarified = false;
  private isMobileVarified = false;

  constructor(
    username: string,
    userEmail: string,
    password: string,
    userPreferences: Array<string>
  ) {
    this.user_id = 'BZ-' + Utill.getRandomString();
    this.user_name = username;
    this.user_email = userEmail;
    this.saltedString = Utill.getSalt();
    this.password = Utill.getPassword(password, this.saltedString);
    this.preferences = userPreferences;
  }

  static async saveUser(user: User) {
    try {
      const userColl = await Db.getUserCollObj();
      const saveUserRes = await userColl.insertOne(user);
      if (saveUserRes.ops.length) {
        return await User.__responseBuilder(saveUserRes.ops[0]);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private static async __responseBuilder(response: any) {
    //Send OTP to user for account verification
    //await Mail.verifyMail(response.user_email);
    //Generate auth token
    const token: string = await jWT.getToken(response.user_id, response._id);
    return {
      user_id: response.user_id,
      user_name: response.user_name,
      user_email: response.user_email,
      auth_token: token
    };
  }

  static async getUserDetails(userId: string) {
    const userColl = await Db.getUserCollObj();
    const saveUserRes = await userColl
      .find({ user_id: userId })
      .project({ user_name: 1, user_email: 1 })
      .toArray();
    return saveUserRes;
  }

  static async login(id: string, password: string) {
    const userColl = await Db.getUserCollObj();

    try {
      const logRes = await userColl
        .find({
          $or: [
            { user_email: id.trim() },
            { user_name: id.trim() },
            { mobile: id.trim() }
          ]
        })
        .project({})
        .toArray();
      if (logRes.length > 0) {
        const salt = logRes[0].saltedString;
        const givenPw = await Utill.getPassword(password, salt);

        if (givenPw == logRes[0].password) {
          return await User.__loginResBuilder(logRes[0]);
        } else {
          return Promise.reject({ message: message.login.login_failed });
        }
      }
      return Promise.reject({ message: message.login.id_not_found });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private static async __loginResBuilder(response: any) {
    const token: string = await jWT.getToken(response.user_id, response._id);
    return {
      user_id: response.user_id,
      user_name: response.user_name,
      user_email: response.user_email,
      mobile: '',
      dob: '',
      description: '',
      auth_token: token
    };
  }

  //Method for checking wheather the given user eamil or phone number already exist or not
  static async isDataExists(data: string, type: string) {
    try {
      const userColl = await Db.getUserCollObj();
      const isExist = await userColl
        .find({ $or: [{ user_email: data }, { mobile: data }] })
        .project({})
        .toArray();
      if (isExist.length) {
        return Promise.resolve({ status: 1, message: type + ' ' + message.isUserExists.already_exists });
      } else {
        return Promise.resolve({ status: -1, message: type + ' ' + message.isUserExists.doesnt_exists });
      }

    } catch (error) {
      return Promise.reject(error);
    }
  }

  //Method for getting list of intrests availabe in the platform
  static async getListOfInstrests() {
    try {
      const utillColl = await Db.getUtillCollObj();
      const intrestList = await utillColl.find({ name: 'preferrences' }).toArray();
      if (intrestList.length) {
        return intrestList[0];
      } else {
        return Promise.reject({ message: message.intrest_list.intrestlist_error });
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  //Method for updating Password
  static async updatePw(userId: string, currentPw: string, newPw: string) {
    try {
      //Fetch the user object based on userId.
      let userColl = await Db.getUserCollObj();
      let user = await userColl.find({ user_id: userId }).toArray();

      //Generate a password based on current pw and salt
      let givenPw = await Utill.getPassword(currentPw, user[0].saltedString);

      //Match the current pw with stored pw
      if (givenPw == user[0].password) {

        //if match encrypt it with salt and update it
        let updatedPw = await Utill.getPassword(newPw, user[0].saltedString);

        let updateRes = await userColl.update({ user_id: user[0].user_id }, { $set: { password: updatedPw } });

        if (updateRes.result.nModified) {
          return Promise.resolve({ message: message.password.pass_update_succ })
        } else {
          return Promise.reject({ message: message.password.err_pass })
        }
      } else {
        return Promise.reject({ message: message.password.incorrect_pass })
      }

    } catch (error) {
      return Promise.reject(error);
    }
  }

  //Method for Reset Password
  static async resetPassWord(emailOrMobile: string, newpw: string) {
    try {
      //Fetch the user based on emailormobile
      let userColl = await Db.getUserCollObj();
      let user = await userColl.find({ user_email: emailOrMobile }).toArray();

      if (user.length) {
        //generate the password based on given pass word by stored salt
        let newPassWord = await Utill.getPassword(newpw, user[0].saltedString);
        //update the password
        let updatePassWord = await userColl.updateOne({ user_email: emailOrMobile }, { $set: { password: newPassWord } });
        //console.log(updatePassWord);

        return message.password.pass_update_succ;
      } else {
        return Promise.reject({ message: message.generic.user_not_found });
      }

    } catch (error) {
      return Promise.reject(error);
    }
  }
}
