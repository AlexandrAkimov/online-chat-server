const router = require('express').Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/registration', userController.registration)
router.post('/update', authMiddleware, userController.update)
router.post('/login', userController.login)
router.get('/auth/:id', authMiddleware, userController.check)
router.get('/:nick', authMiddleware, userController.getUsersByNickname)

module.exports = router