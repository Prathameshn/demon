export const message = {
  generic: {
    error: 'Something went wrong.',
    user_not_found: 'user not found.',
    welcome_mail_sub : 'Welcome to bizurs. Please verify your email account',
    auth_token_missing : 'authorization token required in header'
    
  },
  feed:{
    create:`New post successfully`,
    update:`Post updated successfully`,
    delete:`Post deleted successfully`,
    get:`Post get successfully`,
    like:'Liked',
    unlike:'Unliked',
    saved:'Saved',
    remove_from_save:'Delete from save'
  },
  user: {
    user_name_missing : 'Key value user_name can not be empty.',
    email_missing : 'key value email can not be empty.',
    password_missing : 'key value password can not be empty.',
    prefereance_missing : 'Key value user_preferences can not be missing',

    user_name_type_err: 'Key user_name has to be of string type.',
    email_type_err: 'Invalid email type',
    password_type_err: 'Key password has to be of string type.',

    user_name_length_err:
      'User name legth has to be greater than 2 and less than 25 character.',
    password_length_err:
      'Password legth has to be greater than 2 and less than 25 character.',
    email_already_exist: 'Email already exists.',
    user_name_already_exist : 'User name alresy exists.'
  },
  login: {
    login_failed: 'Login failed',
    login_succ: 'Login Success',

    login_id_req: 'Key user_id required',
    password_req: 'key password required',

    loginid_type_err: 'user_id has to be of type string.',
    password_type_err: 'password has to be od type string.',

    id_not_found : "User id not found."
  },
  registartion: {
    reg_succ: 'Registration Successfull.',
    reg_fail: 'Registration Failed.'
  },
  isUserExists: {
    key_required: 'emailOrPhone key is missing.',
    key_length_error: 'emailOrPhone key length has to be in between 10 and 15',
    already_exists : "Already exists.",
    doesnt_exists : "does not exists",
    user_doesnt_exists : "User does not exists."
  },
  intrest_list : {
    intrestlist_error : 'Error occured while fetching intrest list.',
    intrestlist_succ : 'Preferrences list fetched successfully.'
  },
  otp_validation : {
    id_not_exist : 'EmailOrMoble key can not be empty.',
    string_type : 'EmailOrMoble has to be of string type.',
    otp_type : 'OTP has to be of string type.',
    otp_exist : 'OTP key can not be empty',
    otp_length : 'OTP length has to be of 6 character',
    length : 'EmailOrMoble length has to be in between 10 to 25 characters',
    err_while_generation : 'Error occured while generating OTP',
    otp_succ : 'OTP generated successfully.',
    user_id_not : 'not found' ,
    otp_expired : 'OTP expired. Please generate a new OTP',
    otp_veri_succ : "OTP verified successfully",
    otp_veri_fail : "OTP verification failed",
    otp_already_verified : "OTP already verified. Please generate again.",
    otp_auth_massge : 'Use the given auth token for OTP verifiaction. It will expire in 10 Minutes.'
  },
  password : {
    pass_update_succ : "Password updated successfully.",
    err_pass: "Error occured while updating the password.",
    pw_length : "length has to be in between 3 to 25 characters",
    incorrect_pass : "Incorrect current password"
  }
};
