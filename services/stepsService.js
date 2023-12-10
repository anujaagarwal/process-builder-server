// services/stepsService.js
const { Step } = require("../models");

exports.updateStep = async (processId, order, title, description) => {
  const stepToUpdate = await Step.findOne({
    where: {
      processId: processId,
      order: order,
    },
  });

  if (!stepToUpdate) {
    return null;
  }

  const [numberOfAffectedRows, [updatedStep]] = await Step.update(
    { title: title, description: description },
    { where: { id: stepToUpdate.id }, returning: true }
  );

  return numberOfAffectedRows ? updatedStep : null;
};

exports.saveAllSteps = async (steps) => {
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
};
