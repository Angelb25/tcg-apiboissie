const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tcg', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
