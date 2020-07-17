import { check } from '../../utill/utill';
import { message } from '../../utill/mesage.utill';

export const GenerateOtpValidation = [
  check('emailOrMobile').notEmpty().withMessage(message.otp_validation.id_not_exist),
  check('emailOrMobile')
    .isString()
    .withMessage(message.otp_validation.string_type),
  check('emailOrMobile')
    .isLength({ min: 10, max: 25 })
    .withMessage(message.otp_validation.length),
];

export const VerifyOtpValidation = [
  check('otp').notEmpty().withMessage(message.otp_validation.otp_exist),
  check('otp')
    .isString()
    .withMessage(message.otp_validation.otp_type),
  check('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage(message.otp_validation.otp_length),
];