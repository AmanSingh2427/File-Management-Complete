

const { Sequelize } = require('sequelize');

// Replace these with your actual database credentials
const sequelize = new Sequelize('php_training', 'postgres', 'mawai123', {
  host: '192.168.1.6',
  dialect: 'postgres',
});

module.exports = sequelize;
