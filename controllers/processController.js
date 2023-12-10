const processService = require("../services/processService");

exports.createProcess = async (req, res) => {
  const description = req.body.description;
  const name = req.body.name;
  try {
    const response = await processService.createProcess({ name, description });
    res.status(200).send(response);
  } catch (error) {
    console.error("Error creating process:", error);
    res.status(500).send(error);
  }
};

exports.processDescription = async (req, res) => {
  const description = req.body.description;

  try {
    const result = await processService.processDescription(description);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};
