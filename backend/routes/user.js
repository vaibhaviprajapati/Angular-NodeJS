const express = require('express');
const UserController = require('../controllers/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const user = require('../models/user');
const router = express.Router();
router.post('/singup', UserController.createUser);

router.post('/login', UserController.userLogin);

module.exports = router;
