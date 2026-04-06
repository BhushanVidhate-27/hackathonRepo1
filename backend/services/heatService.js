

const materials = require("../config/materials.config");

const computeWallService = (data) => {
  const layers = data.layers || [];
  const A = data.area || 1;
  const { T_left, T_inf, h } = data.boundary || {};

  let totalRes = 0;

  // conduction resistance
  for (let layer of layers) {
    let k = layer.k || materials[layer.material];
    if (!k) {
      throw new Error("Invalid material or k missing");
    }
    let r = layer.thickness / k;
    totalRes += r;
  }

  // convection resistance
  totalRes += 1 / (h * A);

  // heat flux
  let q = (T_left - T_inf) / totalRes;

  // temperature distribution
  let temps = [];
  let currentTemp = T_left;
  temps.push(currentTemp);

  for (let layer of layers) {
    let k = layer.k || materials[layer.material];
    let r = layer.thickness / k;
    let deltaT = q * r;
    currentTemp -= deltaT;
    temps.push(currentTemp);
  }

  return {
    resistance: totalRes,
    heat_flux: q,
    temperatures: temps,
  };
};

module.exports = { computeWallService };