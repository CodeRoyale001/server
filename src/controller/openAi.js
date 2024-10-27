const config = require('../config/config');
const { Logger } = require('../utils');
const { getProblem } = require('./problem');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Log the API key to verify it's being read correctly
Logger.info(`Loaded API Key: ${config.OPENAI_API_KEY}`);

// In-memory store for conversation context (for production, use a database)
let conversations = {};

// Function to generate content using OpenAI API
const generateEditorial = async ({ questionTitle, userId, userPrompt }) => {
    try {
        API_KEY=config.OPENAI_API_KEY;
        const gemini = new GoogleGenerativeAI({API_KEY} );
        const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });

        Logger.info(`Fetching question from database for User: ${userId} and Question Title: ${questionTitle}`);
        const problems = await getProblem({ title: questionTitle, userId });
        const questionData = problems[0];

        Logger.info("Generating editorial using Gemini API");

        const prompt = `You are a DSA (Data Structures and Algorithms) Expert.
        Here is the question description: ${questionData.content}
        For this question, here is the provided solution: ${questionData.code}
        Using this information, please provide an answer to the following prompt: ${userPrompt}`;

        const result = await model.generateContent(prompt);

        // Log and return the response
        Logger.info("Response from OpenAI API: ", result.response.text());
        return result.response.text();
    } catch (error) {
        Logger.error('Error generating response:', error);
        throw new Error('Failed to generate response');
    }
}

module.exports = {
    generateEditorial
};