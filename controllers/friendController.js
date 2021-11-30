const { Friends } = require('../models/models')
const {Sequelize} = require('sequelize')

const pool = new Sequelize('postgres://ivdcmtjncyrisb:40510b6cab18c66e5db73b5ef003be4fe44265d83064c6a97ef5a12b06ff8edf@ec2-54-220-223-3.eu-west-1.compute.amazonaws.com:5432/dar3h0nmqtuce4', {
  ssl: true,
  dialect: 'postgres',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // <<<<<<< YOU NEED THIS
    },
  }
})

const ApiError = require('../error/ApiError')

class FriendController {
  async addFriend(req, res, next) {
    const { id } = req.user
    const friendid = req.body.id
    const friendNick = req.body.nickname
    const friendCandidate = await Friends.findOne({ where: { userid: id, friendid } })
    if (friendCandidate) {
      return next(ApiError.badRequest('У вас есть уже этот друг'))
    }
   
    await Friends.create({ friendid, userid: id})
    return res.status(201).json({ message: `Пользователь ${friendNick} успешно добавлен в список друзей` })
  }
  async removeFriend(req, res, next) {
    const { id } = req.body
    try {
      await Friends.destroy({ where: { id } })
      return res.status(202).json({ message: 'Друг успешно удален' })
    } catch (e) {
      next(ApiError.internal('Ошибка удаления из друзей'))
    }
  }

  async getFriend(req, res, next) {
    try {
      const result = await pool.query(`
        SELECT friends.id, friendid, userid, users.nickname, users.photo 
        FROM friends 
        INNER JOIN users ON friends.friendid = users.id
        WHERE friends.userid = ${req.user.id}
      `)
      return res.status(200).json(result[0])
    } catch (error) {
      return next(ApiError.internal('Не удалось запросить ваших друзей'))
    }
    
  }


}

module.exports = new FriendController()