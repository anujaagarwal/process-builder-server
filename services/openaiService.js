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

exports.aiResponse = async function (description, processId) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Hey ChatGPT, I am providing you with a description of a process. Based on this description, please generate a detailed step-by-step guide. It is crucial that the structure of your response remains consistent throughout and it should be in proper JSON. Each step should be clearly numbered and include a concise title followed by a brief explanation. The format should be as follows:
        In the response please give two fields one is processId which is ${processId} and steps array which mandatorily include ${processId} in each step please give accurate this format json under steps - {
        {  "order": 1,
          "title": "Warm Up Exercises",
          "description": "To begin, engage in vocal warm-up exercises to prepare your voice for singing",
          "processId": ${processId}
      },
      {
          "order": 2,
          "title": "Breathing Techniques",
          "description": "Learn and practice proper breathing techniques to support your singing",
          "processId": ${processId}
      } Your response should follow the above JSON structure`,
      },
      { role: "user", content: `${description}` },
    ],
    model: "gpt-3.5-turbo-1106",
    response_format: { type: "json_object" },
  });
  const result = completion.choices[0].message.content;
  console.log({ result });
  return result;
};

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
