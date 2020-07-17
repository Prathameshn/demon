import { router } from '../../server';
import { userRegValidation, userLoginValidation, PwValidation, ResetPwValidation } from '../validation/user.validation';
import { GenerateOtpValidation, VerifyOtpValidation } from '../validation/otp.validation';
import { UserController } from '../../controller/user.controller';
import { Otp } from '../../controller/otp.controller';


router.post(
  '/user/registration',
  userRegValidation,
  UserController.saveUser
);
router.get('/user/details', UserController.getUserDetails);
router.post('/user/isUserExists', UserController.isExists);

//API for getting list of available instrests
router.get('/user/intrests', UserController.getIntrests);

//Api for OTP services
router.post('/user/generateOtp', GenerateOtpValidation , Otp.generateOtp);
router.post('/user/verifyOtp', VerifyOtpValidation,  Otp.verifyOtp);

//route for update password
router.post('/user/updatePassword', PwValidation , UserController.updatePw);
router.post('/user/resetPassword', ResetPwValidation , UserController.resetPassWord);



router.post('/user/login', userLoginValidation ,UserController.login);

module.exports = router;
