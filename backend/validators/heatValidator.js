const validateHeatInput = (req, res, next) => {
  const { layers, boundary, area } = req.body;

  if (!layers || !Array.isArray(layers) || layers.length === 0) {
    return res.status(400).json({ error: "Layers must be a non-empty array" });
  }

  for (let layer of layers) {
    if (!layer.thickness) {
      return res.status(400).json({ error: "Layer thickness missing" });
    }
  }

  if (!boundary) {
    return res.status(400).json({ error: "Boundary conditions missing" });
  }

  const { T_left, T_inf, h } = boundary;

  if (T_left == null || T_inf == null || h == null) {
    return res.status(400).json({ error: "Boundary values missing" });
  }

  if (area && area <= 0) {
    return res.status(400).json({ error: "Invalid area" });
  }

  next();
};

module.exports = { validateHeatInput };
