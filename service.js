require("dotenv").config();
const express = require("express");
const { Process, Step } = require("./models/index.js");
const { OpenAI } = require("openai");
const db = require("./models/index.js");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

const openai = new OpenAI({
  apiKey: "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",
});

app.use(express.json());
app.listen(port, () => {
  console.log("app runnning on port 3000");
});

app.get("/healthcheck", async (req, res) => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.close();
    res.status(200).send("I'm healthy!");
  } catch (error) {
    await db.sequelize.close();
    res.status(500).send("unable to connect to sever");
  }
});

const getAIResponse = async (description) => {
  try {
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt: `Hey ChatGPT, I am providing you with a description of a process. Based on this description, please generate a detailed step-by-step guide. It is crucial that the structure of your response remains consistent throughout. Each step should be clearly numbered and include a concise title followed by a brief explanation. The format should be as follows:

      1. [Title of Step 1]: [Brief Explanation of Step 1].
      2. [Title of Step 2]: [Brief Explanation of Step 2].
      ...

      Please adhere strictly to this format for every step in the process :
      "${description}"`,
      max_tokens: 60,
    });
    return response.choices[0].text.trim();
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
};

app.post("/api/create-process", async (req, res) => {
  const description = req.body.description;
  const name = req.body.name;
  try {
    const response = await Process.create({ description, name });
    res.status(200).send(response);
  } catch (error) {
    console.error("Error creating process:", error);
    res.status(500).send(error);
  }
});

app.post("/api/save-all-steps", async (req, res) => {
  const steps = req.body.steps;

  try {
    await Promise.all(
      steps.map((step) => {
        return Step.create({
          processId: step.processId,
          title: step.title,
          description: step.description,
          order: step.order,
        });
      })
    );

    res.status(200).json({ message: "Steps saved successfully" });
  } catch (error) {
    console.error("Error saving steps:", error);
    res.status(500).json({ error: "Failed to save steps" });
  }
});

app.post("/api/process-description", async (req, res) => {
  const description = req.body.description;

  try {
    // Create the main process entry
    const newProcess = await Process.create({ description });

    // Get AI response and parse it into steps
    const aiResponse = await getAIResponse(description);
    const rawSteps = aiResponse.includes("\n\n")
      ? aiResponse.split(/\n\n/)
      : aiResponse.split(/\n/);
    // const rawSteps = aiResponse.split(/\n/);
    const stepsArray = rawSteps
      .map((step) => {
        const [orderPart, rest] = step.split(". ");
        // if (!rest) {
        //   res.status(404).send(error.message);
        // }
        console.log(rest);
        const [title, stepDescription] = rest.split(": ");
        return {
          order: parseInt(orderPart, 10),
          title: title ? title.trim() : "",
          description: stepDescription ? stepDescription.trim() : "",
          processId: newProcess.id, // Assuming a foreign key relation to the Process table
        };
      })
      .filter((step) => step != null);

    // Create each step in the database
    for (const stepData of stepsArray) {
      await Step.create(stepData);
    }

    res.json({ processId: newProcess.id, steps: stepsArray });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// app.post("/generate", async (req, res) => {
//   const description = req.body.description;

//   try {
//     const response = await openai.completions.create({
//       model: "text-davinci-003",
//       prompt: `Hey ChatGPT, I am providing you with a description of a process. Based on this description, please generate a detailed step-by-step guide. It is crucial that the structure of your response remains consistent throughout. Each step should be clearly numbered and include a concise title followed by a brief explanation. The format should be as follows:

//       1. [Title of Step 1]: [Brief Explanation of Step 1].
//       2. [Title of Step 2]: [Brief Explanation of Step 2].
//       ...

//       Please adhere strictly to this format for every step in the process :
//       "${description}"`,
//       max_tokens: 60,
//     });

//     const moderationResponse = response.choices[0].text.trim();
//     res.json({ steps: moderationResponse });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error.message);
//   }
// });

app.put("/api/update-step/:processId/:order", async (req, res) => {
  const { processId, order } = req.params;
  const { title, description } = req.body;

  try {
    const stepToUpdate = await Step.findOne({
      where: {
        processId: processId,
        order: order,
      },
    });

    if (!stepToUpdate) {
      return res.status(404).send("Step not found");
    }

    const [numberOfAffectedRows, [updatedStep]] = await Step.update(
      { title: title, description: description },
      { where: { id: stepToUpdate.id }, returning: true }
    );

    if (numberOfAffectedRows) {
      res.json(updatedStep);
    } else {
      res.status(404).send("Step not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the step");
  }
});
