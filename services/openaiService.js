// services/openaiService.js
const { OpenAI } = require("openai");
// require("dotenv").config();
const dotenv = require("dotenv");
dotenv.config();
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Api key not found");
}

const openai = new OpenAI({
  apiKey,
});

exports.getAIResponse = async (description) => {
  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt: `Hey ChatGPT, I am providing you with a description of a process. Based on this description, please generate a detailed step-by-step guide. It is crucial that the structure of your response remains consistent throughout. Each step should be clearly numbered and include a concise title followed by a brief explanation. The format should be as follows:

    1. [Title of Step 1]: [Brief Explanation of Step 1].
    2. [Title of Step 2]: [Brief Explanation of Step 2].
    ...
    
    Please adhere strictly to this format for every step in the process :
      "${description}"`,
    max_tokens: 100,
  });
  return response.choices[0].text.trim();
};
