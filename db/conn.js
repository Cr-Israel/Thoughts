const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('thoughts', 'root', 'mesquita', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
