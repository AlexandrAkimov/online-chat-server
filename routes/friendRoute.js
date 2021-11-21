const router = require('express').Router()
const friendController = require('../controllers/friendController')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/', authMiddleware, friendController.addFriend)
router.delete('/', authMiddleware, friendController.removeFriend)
router.get('/', authMiddleware, friendController.getFriend)

module.exports = router