const {Sequelize, DataTypes} = require('sequelize');

let is_initialized = false;

const sequelize = new Sequelize("shiftfinance", "user", "pass", {
    dialect: 'sqlite',
    storage: process.env.DATABASE
});

// const sequelize = new Sequelize('sqlite::memory:');

console.log("DB:", process.env.DATABASE)

const User = sequelize.define('User', {
    // Model attributes are defined here
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING
        // allowNull defaults to true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {});

const UserToken = sequelize.define('UserToken', {
    linkToken: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accessToken: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {})

UserToken.belongsTo(User);


// `sequelize.define` also returns the model
// console.log(User === sequelize.models.User); // true

// module.exports = {sequelize, User, UserToken}
module.exports = (async () => {
    if (!is_initialized) {
        await sequelize.sync({});
        is_initialized = true;
    }
    return {sequelize, User, UserToken}
});