const express = require("express");
const router = express.Router();

// The frontend "Export PDF" currently expects a backend-generated JSON blob.
// Keeping this lightweight also prevents backend startup crashes if report
// generation is not implemented yet.
router.post("/report/json", (req, res) => {
  // Provide a stable filename for the download helper.
  res.setHeader("content-disposition", 'attachment; filename="thermal-report.json"');
  res.json(req.body);
});

module.exports = router;

