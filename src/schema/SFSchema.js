const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DATABASE
});



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
        allowNull: false
    }
}, {
    // Other model options go here
    freezeTableName: true
});

const UserToken = sequelize.define('UserToken', {

}, {
    freezeTableName: true
})

// (async () => {
//     await sequelize.sync({ force: true });
//     // Code here
// })();

// UserToken.belongsTo(User)

// `sequelize.define` also returns the model
// console.log(User === sequelize.models.User); // true


module.exports = sequelize