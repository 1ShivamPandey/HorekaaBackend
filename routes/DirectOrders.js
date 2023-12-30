const express = require('express');
const {DirectOrdersData } = require ('../Controllers/DirectOrdersController')
const router = express.Router()

router.route('/apnadirectorder').post(DirectOrdersData);
//router.route('/:number').get(getUserProfile);

module.exports = router;