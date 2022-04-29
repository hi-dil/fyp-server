const express = require('express')
const router = express.Router()

const {getAllStorageData, updatePinNumbers, putPIN} = require('../controller/storage')

router.route('/').get(getAllStorageData)
router.route('/setpin').get(putPIN)
router.route('/:id').get(updatePinNumbers)

module.exports = router