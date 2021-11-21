const bcrypt = require('bcrypt')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid')
const { User } = require('../models/models')
const ApiError = require('../error/ApiError')


const generateToken = (options) => {
  return jwt.sign(options, process.env.SECRET_KEY, {
    expiresIn: '24h'
  })
}

class UserController {
  async registration(req, res, next) {
    const { nickname, password } = req.body

    let fileName = null
    if (req.files) {
      const { photo } = req.files
      fileName = uuid.v4() + '.jpg'

      await photo.mv(path.resolve(__dirname, '..', 'static', fileName))

      const imgs = {
        data: fs.readFileSync(path.resolve(__dirname, '..', 'static', fileName)),
        contentType: req.files.photo.mimetype
      }
    }


    if (!nickname || !password) {
      return next(ApiError.badRequest('Неккоректный никнейм или пароль'))
    }

    const candidate = await User.findOne({ where: { nickname } })

    if (candidate) {
      return next(ApiError.badRequest('Пользователь с таким никнеймом уже существует'))
    }


    const hashPassword = await bcrypt.hash(password, 4)
    const user = await User.create({ nickname, password: hashPassword, photo: fileName })
    const token = generateToken({ id: user.id, nickname, photo: fileName })
    return res.json({ token })
  }

  async update(req, res, next) {
    const { nickname } = req.body
    const {id} = req.user
    if (!nickname) {
      return next(ApiError.badRequest('Никнейм не может быть пустым'))
    }

    let fileName = null

    if (req.files) {
      const { photo } = req.files
      fileName = uuid.v4() + '.jpg'

      await photo.mv(path.resolve(__dirname, '..', 'static', fileName))

      const imgs = {
        data: fs.readFileSync(path.resolve(__dirname, '..', 'static', fileName)),
        contentType: req.files.photo.mimetype
      }
    }

    const candidate = await User.findOne({ where: { nickname } })

    if (candidate && candidate.id !== id) {
      return next(ApiError.badRequest('Пользователь с таким никнеймом уже существует'))
    }

    await User.update({nickname, photo: fileName ? fileName : req.body.photo}, {where: {id}})
    const user = await User.findOne({where: {nickname}})
    const token = generateToken({ id, nickname, photo: user.photo })
    return res.json({ token })
  }

  async login(req, res, next) {
    const { nickname, password, photo } = req.body

    const user = await User.findOne({ where: { nickname } })

    if (!user) {
      return next(ApiError.internal('Пользователя с таким никнеймом не существует'))
    }

    let comparePassword = bcrypt.compareSync(password, user.password)

    if (!comparePassword) {
      return next(ApiError.internal('Указан неверный пароль'))
    }

    const token = generateToken({ id: user.id, nickname, photo: user.photo })

    return res.json({ token })

  }

  async check(req, res, next) {
    const { id } = req.params
    if (!id) {
      next(ApiError.badRequest('Не задан ID пользователя'))
    }
  }

  async getUsersByNickname(req, res) {
    const users = await User.findAll({ where: { nickname: { [Op.like]: `%${req.params.nick}%` } } })
    res.json(users)
  }
}

module.exports = new UserController()