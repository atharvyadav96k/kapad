const express = require('express');
const user = express.Router();

const userUtils = require('../utils/userUtills');
const userAuth = require('../middleware/userAuth');

user.post('/register', userUtils.register);

user.post('/login', userUtils.login);

user.post('/verify/:id', userUtils.verifyUser);

user.post('/reject/:id', userUtils.rejectUser);

user.post('/auth', userAuth, userUtils.auth);

module.exports = user;