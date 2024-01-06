const express = require('express');
const {registerUser,authUser,getUserProfile,removefromCart,verify,ResendOtp,ChangePassword,ForgotPassword} = require('../Controllers/UserProfileControllers')
const router = express.Router()

router.route('/signup').post(registerUser);
// router.route('/sendotp').post(sendOTP)
router.route('/login').post(authUser);
router.route('/:number').get(getUserProfile);
router.route('/cart/:number/:_id').delete(removefromCart);

//otp verify
router.route('/verify').post(verify)
router.route('/resendotp').post(ResendOtp)
router.route('/changepassword').post(ChangePassword);
router.route('/forgotpassword').post(ForgotPassword);

module.exports = router;