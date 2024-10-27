const express = require('express');
const router = express.Router();
const {openAiController} = require("../controller"); 
const { authUser } = require('../middleware');
const { Logger } = require('../utils');

// Route to generate editorial content
router.post('/generate-editorial', authUser,async (req, res) => {
    const { questionTitle,prompt } = req.body;
    Logger.info(`Question Title extracted from Body : ${questionTitle} for User : ${req.user.userName} and User Prompt : ${prompt}`);
    if (!questionTitle) {
        return res.status(400).json({ error: 'conversationContext is required' });
    }

    try {
        const result= await openAiController.generateEditorial({
            questionTitle,
            userId: req.user.userName,
            userPrompt: prompt
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;