require('dotenv').config();
const { parse } = require('url');

const dbConfig = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {},
};

if (process.env.JAWSDB_URL) {
  const parsedUrl = parse(process.env.JAWSDB_URL);
  dbConfig.production = {
    username: parsedUrl.auth.split(':')[0],
    password: parsedUrl.auth.split(':')[1],
    database: parsedUrl.path.substring(1),
    host: parsedUrl.hostname,
    dialect: 'mysql',
  };
}

module.exports = dbConfig;
