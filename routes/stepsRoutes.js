// routes/stepsRoutes.js
const express = require("express");
const stepsController = require("../controllers/stepsController");
const router = express.Router();

router.put("/update-step/:processId/:order", stepsController.updateStep);

router.post("/save-all-steps", stepsController.saveAllSteps);

module.exports = router;
