const User = require('../models/User');

async function getUsers(req, res, next) {
  try {
    const users = await User.find().select('name email').sort({ name: 1 });
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

module.exports = { getUsers };
