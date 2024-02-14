const express = require('express');
const {CartData} = require ('../Controllers/UserCartController')
const router = express.Router()

router.route('/list').post(CartData)
//router.route('/:number').get(getUserProfile);
module.exports = router;