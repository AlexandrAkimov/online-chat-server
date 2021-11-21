const router = require('express').Router()
const userRouter = require('./userRoute')
const friendRouter = require('./friendRoute')

router.use('/users', userRouter)
router.use('/friend', friendRouter)

module.exports = router