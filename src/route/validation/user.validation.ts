import { check } from '../../utill/utill';
import { message } from '../../utill/mesage.utill';
import { Db } from "../../config/db.config";

export const userRegValidation = [
  check('user_name').notEmpty().withMessage(message.user.user_name_missing),
  check('user_email').notEmpty().withMessage(message.user.email_missing),
  check('password').notEmpty().withMessage(message.user.password_missing),
  check('user_preferences').notEmpty().withMessage(message.user.prefereance_missing),

  check('user_name')
    .isString()
    .withMessage(message.user.user_name_type_err),
  check('user_name')
    .isLength({ min: 3, max: 25 })
    .withMessage(message.user.user_name_length_err),
  check('user_email').isEmail().withMessage(message.user.email_type_err),

  check('password').isString().withMessage(message.user.password_type_err),
  check('password')
    .isLength({ min: 3, max: 25 })
    .withMessage(message.user.password_length_err),

  check('user_email').custom(async (email: string) => {
    let conn = await Db.getUserCollObj();
    let isExist = await conn.find({ "user_email": email }).project({ _id: 0, user_id: 1 }).toArray();
    if (isExist.length) {
      return Promise.reject(message.user.email_already_exist);
    }
  }),

  check('user_name').custom(async (name: string) => {
    let conn = await Db.getUserCollObj();
    let isExist = await conn.find({ "user_name": name.trim() }).project({ _id: 0, user_id: 1 }).toArray();
    if (isExist.length) {
      return Promise.reject(message.user.user_name_already_exist);
    }
  }),
];

export const userLoginValidation = [
  check('login_id').notEmpty().withMessage(message.login.login_id_req),
  check('password').notEmpty().withMessage(message.login.password_req),

  check('login_id')
    .isString()
    .withMessage(message.login.loginid_type_err),
  check('password').isString()
    .withMessage(message.login.password_type_err),

  check('login_id').custom(async (id: string) => {
    let conn = await Db.getUserCollObj();
    let isExist = await conn.find({ $or: [{ "user_email": id.trim() }, { "user_name": id.trim() }, { "mobile": id.trim() }] }).project({ _id: 0, user_id: 1 }).toArray();
    if (isExist.length == 0) {
      return Promise.reject(message.login.id_not_found);
    }
  }),

];

export const PwValidation = [
	check('currentpw').notEmpty().withMessage(message.otp_validation.id_not_exist),
	check('newpw').notEmpty().withMessage(message.otp_validation.id_not_exist),
	check('currentpw')
		.isString()
		.withMessage(message.otp_validation.string_type),
	check('newpw')
		.isString()
		.withMessage(message.otp_validation.string_type),
	check('currentpw')
		.isLength({ min: 3, max: 25 })
		.withMessage(message.password.pw_length),
	check('newpw')
		.isLength({ min: 3, max: 25 })
		.withMessage(message.password.pw_length),
]

export const ResetPwValidation = [
	check('newpw').notEmpty().withMessage(message.otp_validation.id_not_exist),
	check('newpw')
		.isString()
		.withMessage(message.otp_validation.string_type),
	check('newpw')
		.isLength({ min: 3, max: 25 })
		.withMessage(message.password.pw_length),
]

export const isUserExists = [
  //check('emailOrMobile').notEmpty().withMessage(message.isUserExists.key_required),
];
