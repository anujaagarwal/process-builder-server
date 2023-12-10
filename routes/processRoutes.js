const express = require("express");
const router = express.Router();
const processController = require("../controllers/processController");

router.post("/create-process", processController.createProcess);
router.post("/process-description", processController.processDescription);
// router.put("/update-step/:processId/:order", processController.updateStep);
// Add other routes...

module.exports = router;
