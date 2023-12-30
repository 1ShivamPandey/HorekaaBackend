const express = require('express');
const {registerUser,authUser,getUserProfile,removefromCart,verify} = require('../Controllers/UserProfileControllers')
const router = express.Router()

router.route('/signup').post(registerUser);
// router.route('/sendotp').post(sendOTP)
router.route('/login').post(authUser);
router.route('/:number').get(getUserProfile);
router.route('/cart/:number/:_id').delete(removefromCart);

//otp verify
router.route('/verify').post(verify)

module.exports = router;