const express = require('express');
const router = express.Router();

const {getUserByUserId, addNewUserInGuildId, getUserByUserIdGuildId} = require('../controllers/user-controllers.js');

router.get('/find', getUserByUserId);

router.get('/find/guild', getUserByUserIdGuildId);

router.post('/new', addNewUserInGuildId);

module.exports = router;


