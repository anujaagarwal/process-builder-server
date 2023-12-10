require("dotenv").config();

const express = require("express");
const db = require("./models/index.js");
const processRoutes = require("./routes/processRoutes");
const stepsRoutes = require("./routes/stepsRoutes");
const app = express();
const cors = require("cors");
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/api", processRoutes);
app.use("/api", stepsRoutes);

app.get("/healthcheck", async (req, res) => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.close();
    res.status(200).send("I'm healthy!");
  } catch (error) {
    await db.sequelize.close();
    res.status(500).send("Unable to connect to server");
  }
});

app.listen(port, () => console.log(`App running on port ${port}`));
