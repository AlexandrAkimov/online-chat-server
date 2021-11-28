const {Sequelize} = require('sequelize')

module.exports = new Sequelize(process.env.DB_URL, {
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