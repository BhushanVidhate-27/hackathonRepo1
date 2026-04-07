import { Card } from "../../components/ui/card";
import { motion } from "motion/react";
import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { apiFetch } from "../../lib/api";

export function LayerVisualization() {
  type SimulationParams = {
    layers: { thickness: number; k: number; material?: string }[];
    boundary: { T_left: number; T_inf: number; h: number };
    area?: number;
    totalThickness?: number;
  };

  type SimulationResult = {
    resistance: number;
    heat_flux: number;
    temperatures: number[]; // interfaces: T0..Tn
  };

  const params = JSON.parse(sessionStorage.getItem("simulationParams") || "null") as SimulationParams | null;
  const result = JSON.parse(sessionStorage.getItem("simulationResult") || "null") as SimulationResult | null;

  const [materials, setMaterials] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    apiFetch<Record<string, number>>("/api/materials")
      .then((m) => {
        if (!cancelled) setMaterials(m || {});
      })
      .catch(() => {
        // optional; visualization still works without material map
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const view = useMemo(() => {
    if (!params || !result) return null;
    const layers = params.layers || [];
    const temps = result.temperatures || [];
    if (!layers.length || temps.length !== layers.length + 1) return null;

    const thicknessCm =
      typeof params.totalThickness === "number"
        ? params.totalThickness * 100
        : layers.reduce((s, l) => s + (l?.thickness || 0), 0) * 100;

    const normalizedLayers = layers.map((l, i) => {
      const t0 = temps[i];
      const t1 = temps[i + 1];
      const avg = (t0 + t1) / 2;

      // Visual-only gradient (hot→cold)
      const gradient =
        i === 0
          ? "from-red-500 via-orange-400 to-yellow-300"
          : i === layers.length - 1
            ? "from-cyan-300 via-blue-400 to-blue-600"
            : "from-yellow-300 via-green-300 to-cyan-300";

      const borderColor =
        i === 0 ? "border-red-200" : i === layers.length - 1 ? "border-blue-200" : "border-green-200";

      const thickness = (l.thickness || 0) * 100; // cm
      const materialKey = l.material;
      const showMaterial = typeof materialKey === "string" && materialKey in materials;

      return {
        index: i,
        name: `Layer ${i + 1}`,
        thicknessCm: thickness,
        t0,
        t1,
        tempAvg: avg,
        k: l.k,
        materialKey: showMaterial ? materialKey : undefined,
        gradient,
        borderColor,
      };
    });

    const totalThickness = normalizedLayers.reduce((s, l) => s + l.thicknessCm, 0);

    return {
      layers: normalizedLayers,
      totalThickness,
      thicknessCm,
      heatFlux: result.heat_flux,
      resistance: result.resistance,
      hot: params.boundary.T_left,
      cold: params.boundary.T_inf,
    };
  }, [materials, params, result]);

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
          <h1 className="text-3xl text-[#0A2540] mb-2">
            Layer Visualization
          </h1>
          <p className="text-gray-600">
            Visual representation of composite wall structure with thermal gradient
          </p>
        </motion.div>

        {/* Visualization Info (top) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-8"
        >
          <Card className="p-6 border-blue-200 bg-blue-50">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-blue-900 mb-1">Visualization Info</div>
                <div className="text-xs text-blue-700">
                  Colors represent a hot-to-cold gradient. Layer sizes are proportional to thickness. Temperatures shown come from
                  the backend thermal profile.
                </div>
              </div>
              {view && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-blue-900">
                  <div>
                    <div className="text-blue-700">Heat flux</div>
                    <div className="font-semibold">{view.heatFlux.toFixed(2)} W/m²</div>
                  </div>
                  <div>
                    <div className="text-blue-700">Resistance</div>
                    <div className="font-semibold">{view.resistance.toFixed(3)} m²·K/W</div>
                  </div>
                  <div>
                    <div className="text-blue-700">Hot / Cold</div>
                    <div className="font-semibold">
                      {view.hot.toFixed(1)}°C / {view.cold.toFixed(1)}°C
                    </div>
                  </div>
                  <div>
                    <div className="text-blue-700">Total thickness</div>
                    <div className="font-semibold">{view.totalThickness.toFixed(1)} cm</div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {!view ? (
          <Card className="p-6 border-gray-200">
            <div className="text-lg text-[#0A2540] mb-2">No visualization data</div>
            <div className="text-sm text-gray-600">
              Run a simulation first so the backend can generate the thermal profile.
            </div>
          </Card>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visualization */}
          <div className="lg:col-span-2 space-y-6">
            {/* Horizontal Layer View */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-8 border-gray-200">
                <h2 className="text-xl text-[#0A2540] mb-6">Thermal Profile</h2>

                <div className="space-y-4">
                  {view.layers.map((layer, index) => {
                    const heightPercent = view.totalThickness > 0 ? (layer.thicknessCm / view.totalThickness) * 100 : 0;
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                        style={{ height: `${Math.max(heightPercent * 3, 80)}px` }}
                        className={`relative rounded-lg overflow-hidden bg-gradient-to-r ${layer.gradient} flex items-center justify-between px-6 border-2 ${layer.borderColor}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-white text-lg drop-shadow-md">
                            {layer.name}
                          </div>
                          <div className="px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full text-white text-sm">
                            {layer.thicknessCm.toFixed(1)} cm
                          </div>
                        </div>
                        
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                          <span className="text-lg">{layer.tempAvg.toFixed(1)}°C</span>
                        </div>

                        {/* Temperature gradient indicator */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-1">
                          <ArrowRight className="w-4 h-4 text-white/60" />
                          <span className="text-xs text-white/60">Heat Flow</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Heat Flow Arrow */}
                <div className="mt-6 flex items-center justify-center gap-2 text-gray-500">
                  <div className="flex-1 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 rounded-full" />
                  <span className="text-sm whitespace-nowrap">Heat Transfer Direction →</span>
                </div>
              </Card>
            </motion.div>

            {/* Cross-Section View */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-8 border-gray-200">
                <h3 className="text-lg text-[#0A2540] mb-6">Cross-Section View</h3>
                
                <div className="flex h-64 border-2 border-gray-200 rounded-lg overflow-hidden">
                  {view.layers.map((layer, index) => {
                    const widthPercent = view.totalThickness > 0 ? (layer.thicknessCm / view.totalThickness) * 100 : 0;
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                        style={{ width: `${widthPercent}%` }}
                        className={`relative bg-gradient-to-b ${layer.gradient} flex flex-col items-center justify-center border-r-2 ${layer.borderColor} last:border-r-0`}
                      >
                        <div className="text-white text-sm drop-shadow-md mb-2 transform -rotate-90 whitespace-nowrap">
                          {layer.name}
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                          {layer.tempAvg.toFixed(1)}°C
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-4 flex justify-between text-xs text-gray-600">
                  <span>Hot Side ({view.hot.toFixed(1)}°C)</span>
                  <span>Total: {view.totalThickness.toFixed(1)} cm</span>
                  <span>Cold Side ({view.cold.toFixed(1)}°C)</span>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Side Panel - Layer Details */}
          <div className="space-y-6">
            {view.layers.map((layer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <Card className="p-6 border-gray-200">
                  <div className={`w-full h-3 rounded-full bg-gradient-to-r ${layer.gradient} mb-4`} />
                  
                  <h3 className="text-lg text-[#0A2540] mb-4">
                    Layer {index + 1}
                  </h3>

                  <div className="space-y-3">
                    {layer.materialKey && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Material</span>
                        <span className="text-sm text-[#0A2540] capitalize">{layer.materialKey}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Thickness</span>
                      <span className="text-sm text-[#0A2540]">{layer.thicknessCm.toFixed(1)} cm</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Temperature</span>
                      <span className="text-sm text-[#0A2540]">
                        {layer.t0.toFixed(1)}°C → {layer.t1.toFixed(1)}°C
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">% of Total</span>
                      <span className="text-sm text-[#0A2540]">
                        {(view.totalThickness > 0 ? (layer.thicknessCm / view.totalThickness) * 100 : 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
