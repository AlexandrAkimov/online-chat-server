const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  nickname: {type: DataTypes.STRING, unique: true},
  password: {type: DataTypes.STRING},
  photo: {type: DataTypes.STRING}
})

const Friends = sequelize.define('friends', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  friendid: {type: DataTypes.INTEGER},
  userid: {type: DataTypes.INTEGER},
})

User.hasMany(Friends)
Friends.belongsTo(User)

module.exports = {User, Friends}



