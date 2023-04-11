const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('teste', 'root', 'mesquita', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;