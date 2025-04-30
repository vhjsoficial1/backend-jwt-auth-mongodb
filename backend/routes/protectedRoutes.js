const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Access authorized',
    user: req.user
  });
});

module.exports = router;