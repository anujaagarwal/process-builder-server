const { Process, Step } = require("../models");
const openaiService = require("./openaiService");

exports.createProcess = async (data) => {
  // Business logic to create a process
  const response = await Process.create(data);
  return response;
};

exports.processDescription = async (description) => {
  try {
    const newProcess = await Process.create({ description });

    const aiResponse = await openaiService.aiResponse(
      description,
      newProcess.id
    );
    const rawSteps = JSON.parse(aiResponse);
    console.log(rawSteps);
    const stepsArray = rawSteps.steps;
    for (const stepData of stepsArray) {
      console.log(stepData, "yolo");
      await Step.create(stepData);
    }

    return rawSteps;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
