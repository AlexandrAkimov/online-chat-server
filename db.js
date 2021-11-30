const {Sequelize} = require('sequelize')

module.exports = new Sequelize('postgres://ivdcmtjncyrisb:40510b6cab18c66e5db73b5ef003be4fe44265d83064c6a97ef5a12b06ff8edf@ec2-54-220-223-3.eu-west-1.compute.amazonaws.com:5432/dar3h0nmqtuce4', {
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