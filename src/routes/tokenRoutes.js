const express = require('express');
const {userTokenController} = require("../controller");

const router = express.Router();

router.post('/getAccessToken', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await userTokenController.refreshAccessToken(refreshToken);
        res.json(result);
  } catch (error) {
    next(new ErrorHandler(error));
  }
});

module.exports = router;
