const Sequelize = require('sequelize');
const config = require('../config/config');
const env = process.env.NODE_ENV || 'development';
const sequelizeConfig = config[env];
const sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, {
    host: sequelizeConfig.host,
    dialect: sequelizeConfig.dialect,
});

const User = require('./User')(sequelize, Sequelize.DataTypes);
const Post = require('./Post')(sequelize, Sequelize.DataTypes);
const Comment = require('./Comment')(sequelize, Sequelize.DataTypes);

User.hasMany(Post, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

Post.belongsTo(User, {
    foreignKey: 'userId'
});

Post.hasMany(Comment, {
    foreignKey: 'postId',
    onDelete: 'CASCADE'
});

Comment.belongsTo(User, {
    foreignKey: 'userId'
});

Comment.belongsTo(Post, {
    foreignKey: 'postId'
});

module.exports = {
    User,
    Post,
    Comment,
    sequelize,
    Sequelize
};
