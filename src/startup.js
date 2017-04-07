require('dotenv').config();
require('babel-polyfill');

// Shim to better deal with thrown exceptions :)
require('express');
require('express-async-errors');

export let database = require('./models');
