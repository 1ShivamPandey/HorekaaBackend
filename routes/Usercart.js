const express = require('express');
const {CartData,GetCartData} = require ('../Controllers/UserCartController')
const router = express.Router()

router.route('/cart').post(CartData)
//router.route('/:number').get(getUserProfile);
module.exports = router;