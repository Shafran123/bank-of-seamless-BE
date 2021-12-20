const router = require('express').Router();

const userController = require('../controller/userController')

router.get('/balance', userController.getBankBalance)
router.get('/bank/:iban', userController.getIBANDetails)
router.post('/transfer/:iban', userController.transfer)
module.exports = router