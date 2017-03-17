require('dotenv').config();
require('babel-polyfill');
const Sequelize = require('sequelize');
export const database = new Sequelize(process.env.CONNECTION_STRING);
