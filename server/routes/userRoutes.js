const express = require('express');
const { getUsers } = require('../controllers/userController');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.get('/', getUsers);

module.exports = router;
