const {Sequelize} = require('sequelize')

module.exports = new Sequelize('postgres://kqpclnyikvhceo:987056e8ad626c4b0c55a991745326d7bcdac45a3fd695a156194e27c4e5c539@ec2-34-250-16-127.eu-west-1.compute.amazonaws.com:5432/d5pa1486hea44g', {
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