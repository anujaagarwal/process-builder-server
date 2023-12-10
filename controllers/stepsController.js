const stepsService = require("../services/stepsService");

exports.updateStep = async (req, res) => {
  const { processId, order } = req.params;
  const { title, description } = req.body;

  try {
    const updatedStep = await stepsService.updateStep(
      processId,
      order,
      title,
      description
    );
    if (updatedStep) {
      res.json(updatedStep);
    } else {
      res.status(404).send("Step not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the step");
  }
};

exports.saveAllSteps = async (req, res) => {
  const steps = req.body.steps;

  try {
    await stepsService.saveAllSteps(steps);
    res.status(200).json({ message: "Steps saved successfully" });
  } catch (error) {
    console.error("Error saving steps:", error);
    res.status(500).json({ error: "Failed to save steps" });
  }
};
