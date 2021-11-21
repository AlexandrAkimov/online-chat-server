const { Friends } = require('../models/models')
const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
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
    pool.query(`
        SELECT friends.id, friendid, userid, users.nickname, users.photo 
        FROM friends 
        INNER JOIN users ON friends.friendid = users.id
        WHERE friends.userid = ${req.user.id}
      `, (error, response) => {
      if (error) {
        return next(ApiError.internal('Не удалось запросить ваших друзей'))
      }
      return res.status(200).json(response)
    })
    
  }


}

module.exports = new FriendController()