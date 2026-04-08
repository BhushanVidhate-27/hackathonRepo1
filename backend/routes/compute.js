const express = require("express");
const router = express.Router();
const { computeWall } = require("../controllers/heatController");
const { validateHeatInput } = require("../validators/heatValidator");

router.post("/compute", validateHeatInput, computeWall);

module.exports = router;