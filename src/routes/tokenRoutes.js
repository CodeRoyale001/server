const express = require('express');
// const jwt = require('jsonwebtoken');
// const config = require('../config/config');
// const {UserToken} = require('../models');
const {userTokenController} = require("../controller");

const router = express.Router();

router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await userTokenController.refreshAccessToken(refreshToken);
        res.json(result);
  } catch (error) {
    next(new ErrorHandler(error));
  }
});

module.exports = router;
