const express = require('express')
const router = express.Router()

const {getAllStorageData, updatePinNumbers, putPIN, validatePIN} = require('../controller/storage')

router.route('/').get(getAllStorageData)
router.route('/setpin').get(putPIN)
router.route('/:id').get(updatePinNumbers)
router.route('/validatepin').post(validatePIN)

module.exports = router