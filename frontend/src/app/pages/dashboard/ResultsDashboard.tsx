import React from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CartesianGrid, ResponsiveContainer, Tooltip, Area, AreaChart, XAxis, YAxis } from "recharts";
import { motion } from "motion/react";
import { Download, Eye, ArrowRight } from "lucide-react";
import { Link } from "react-router";

type SimulationParams = {
  layers: { thickness: number; k: number }[];
  boundary: { T_left: number; T_inf: number; h: number };
  area?: number;
  totalThickness?: number;
};

type SimulationResult = {
  resistance: number;
  heat_flux: number;
  temperatures: number[]; // interfaces: T0..Tn
};

function buildTempProfile(params: SimulationParams, result: SimulationResult) {
  const layers = params.layers || [];
  const temps = result.temperatures || [];
  const totalThicknessM =
    typeof params.totalThickness === "number"
      ? params.totalThickness
      : layers.reduce((s, l) => s + (l?.thickness || 0), 0);

  const points = 60;
  const data: { position: string; temperature: number }[] = [];
  if (!layers.length || temps.length !== layers.length + 1 || totalThicknessM <= 0) return data;

  const cumulative: number[] = [0];
  for (const l of layers) cumulative.push(cumulative[cumulative.length - 1] + l.thickness);

  for (let i = 0; i <= points; i++) {
    const xM = (i / points) * totalThicknessM;
    let layerIdx = 0;
    while (layerIdx < layers.length - 1 && xM > cumulative[layerIdx + 1]) layerIdx++;

    const x0 = cumulative[layerIdx];
    const x1 = cumulative[layerIdx + 1];
    const t0 = temps[layerIdx];
    const t1 = temps[layerIdx + 1];
    const frac = x1 > x0 ? (xM - x0) / (x1 - x0) : 0;
    const temp = t0 + (t1 - t0) * Math.min(1, Math.max(0, frac));

    data.push({
      position: ((xM * 100) as number).toFixed(1), // cm
      temperature: Number(temp.toFixed(2)),
    });
  }

  return data;
}

export function ResultsDashboard() {
  const params = JSON.parse(sessionStorage.getItem("simulationParams") || "null") as SimulationParams | null;
  const result = JSON.parse(sessionStorage.getItem("simulationResult") || "null") as SimulationResult | null;

  if (!params || !result) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] py-8">
        <div className="max-w-[1440px] mx-auto px-8">
          <Card className="p-6 border-gray-200">
            <div className="text-lg text-[#0A2540] mb-2">No results found</div>
            <div className="text-sm text-gray-600 mb-4">
              Please run a simulation to generate results.
            </div>
            <Link to="/input">
              <Button className="bg-[#3A86FF] hover:bg-[#2A76EF] text-white">Go to Inputs</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const deltaT = params.boundary.T_left - params.boundary.T_inf;
  const rTotal = result.resistance;
  const uValue = rTotal > 0 ? 1 / rTotal : null;
  const tempData = buildTempProfile(params, result);

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-8">
      <div className="max-w-[1440px] mx-auto px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-[#0A2540] mb-2">
                Simulation Results
              </h1>
              <p className="text-gray-600">
                Computation completed successfully
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/visualization">
                <Button variant="outline" className="gap-2">
                  <Eye className="w-4 h-4" />
                  View Layers
                </Button>
              </Link>
              <Button className="bg-[#3A86FF] hover:bg-[#2A76EF] text-white gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </Button>
            </div>
          </div>
        </motion.div>
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-6 border-gray-200">
              <div className="text-sm text-gray-600 mb-3">Heat Flux</div>
              <div className="text-3xl text-[#0A2540] mb-1">{result.heat_flux.toFixed(2)}</div>
              <div className="text-sm text-gray-600">W/m²</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 border-gray-200">
              <div className="text-sm text-gray-600 mb-3">Temp Drop</div>
              <div className="text-3xl text-[#0A2540] mb-1">
                {deltaT.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">°C</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-6 border-gray-200">
              <div className="text-sm text-gray-600 mb-3">Total Resistance</div>
              <div className="text-3xl text-[#0A2540] mb-1">
                {rTotal.toFixed(3)}
              </div>
              <div className="text-sm text-gray-600">m²·K/W</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6 border-gray-200">
              <div className="text-sm text-gray-600 mb-3">U-Value</div>
              <div className="text-3xl text-[#0A2540] mb-1">
                {uValue === null ? "—" : uValue.toFixed(3)}
              </div>
              <div className="text-sm text-gray-600">W/m²·K</div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Temperature Distribution Graph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 border-gray-200">
              <h2 className="text-xl text-[#0A2540] mb-6">Temperature Distribution</h2>
              
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={tempData}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="50%" stopColor="#22c55e" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="position" 
                    label={{ value: 'Position (cm)', position: 'insideBottom', offset: -5 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#3A86FF" 
                    strokeWidth={3}
                    fill="url(#tempGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="mt-4 flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500" />
                  <span className="text-gray-600">Hot Side</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500" />
                  <span className="text-gray-600">Insulation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-500" />
                  <span className="text-gray-600">Cold Side</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Interface Temperatures */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="p-6 border-gray-200">
                <h3 className="text-lg text-[#0A2540] mb-4">Interface Temperatures</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm text-gray-700">T₁ (Hot)</span>
                    <span className="text-lg text-red-600">{result.temperatures[0].toFixed(1)}°C</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm text-gray-700">T₁₋₂</span>
                    <span className="text-lg text-orange-600">{result.temperatures[1]?.toFixed(1)}°C</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-700">T₂₋₃</span>
                    <span className="text-lg text-green-600">{result.temperatures[2]?.toFixed(1)}°C</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-700">T₃ (Cold)</span>
                    <span className="text-lg text-blue-600">{result.temperatures[result.temperatures.length - 1].toFixed(1)}°C</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card className="p-6 border-gray-200">
                <h3 className="text-lg text-[#0A2540] mb-4">Next Steps</h3>
                
                <div className="space-y-3">
                  <Link to="/visualization">
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="w-4 h-4 mr-2" />
                      View Layer Visualization
                    </Button>
                  </Link>
                  
                  <Link to="/comparison">
                    <Button variant="outline" className="w-full justify-start">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Compare Configurations
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
