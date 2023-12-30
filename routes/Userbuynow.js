const express = require('express');
const {BuyNowData } = require ('../Controllers/UserBuyNowController')
const router = express.Router()

router.route('/buynow').post(BuyNowData);
//router.route('/:number').get(getUserProfile);

module.exports = router;