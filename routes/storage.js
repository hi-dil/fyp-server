const express = require('express')
const router = express.Router()

const {getAllStorageData, updatePinNumbers, putPIN, validatePIN, motionDetected} = require('../controller/storage')

router.route('/').get(getAllStorageData)
router.route('/setpin').get(putPIN)
router.route('/:id').get(updatePinNumbers)
router.route('/validatepin').post(validatePIN)
router.route('/motiondetect').post(motionDetected)

module.exports = router