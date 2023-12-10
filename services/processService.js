const { Process, Step } = require("../models");
const openaiService = require("./openaiService");

exports.createProcess = async (data) => {
  // Business logic to create a process
  const response = await Process.create(data);
  return response;
};

// services/processService.js

exports.processDescription = async (description) => {
  const newProcess = await Process.create({ description });
  const aiResponse = await openaiService.getAIResponse(description);
  const rawSteps = aiResponse.includes("\n\n")
    ? aiResponse.split(/\n\n/)
    : aiResponse.split(/\n/);

  const stepsArray = rawSteps
    .map((step) => {
      const [orderPart, rest] = step.split(". ");
      const [title, stepDescription] = rest.split(": ");
      return {
        order: parseInt(orderPart, 10),
        title: title.trim(),
        description: stepDescription.trim(),
        processId: newProcess.id,
      };
    })
    .filter((step) => step != null);

  for (const stepData of stepsArray) {
    await Step.create(stepData);
  }

  return { processId: newProcess.id, steps: stepsArray };
};
