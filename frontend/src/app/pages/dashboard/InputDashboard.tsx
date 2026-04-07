import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ArrowRight, AlertCircle, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";

interface Layer {
  id: string;
  thickness: string;
  conductivity: string;
  unit: string;
}

export function InputDashboard() {
  const navigate = useNavigate();
  
  const [hotTemp, setHotTemp] = useState("");
  const [coldTemp, setColdTemp] = useState("");
  
  const [layers, setLayers] = useState<Layer[]>([
    { id: "1", thickness: "", conductivity: "", unit: "cm" }
  ]);

  const addLayer = () => {
    const newLayer: Layer = {
      id: Date.now().toString(),
      thickness: "",
      conductivity: "",
      unit: "cm"
    };
    setLayers([...layers, newLayer]);
  };

  const removeLayer = (id: string) => {
    if (layers.length > 1) {
      setLayers(layers.filter(layer => layer.id !== id));
    }
  };

  const updateLayer = (id: string, field: keyof Layer, value: string) => {
    setLayers(layers.map(layer => 
      layer.id === id ? { ...layer, [field]: value } : layer
    ));
  };

  const handleRunSimulation = () => {
    // Input validation
    const parsedHotTemp = parseFloat(hotTemp);
    const parsedColdTemp = parseFloat(coldTemp);
    if (isNaN(parsedHotTemp) || isNaN(parsedColdTemp)) {
      alert('Please enter valid temperatures');
      return;
    }

    // Process layers
    const processedLayers = layers.map(layer => {
      const thicknessNum = parseFloat(layer.thickness);
      if (isNaN(thicknessNum) || thicknessNum <= 0) {
        alert('Invalid layer thickness');
        return null;
      }
      const thicknessM = layer.unit === 'mm' ? thicknessNum / 1000 : thicknessNum / 100;
      const k = parseFloat(layer.conductivity);
      if (isNaN(k) || k <= 0) {
        alert('Invalid thermal conductivity');
        return null;
      }
      return { thickness: thicknessM, k };
    }).filter(Boolean) as {thickness: number, k: number}[];

    if (processedLayers.length === 0) {
      alert('At least one valid layer required');
      return;
    }

    sessionStorage.setItem('simulationParams', JSON.stringify({
      layers: processedLayers,
      boundary: {
        T_left: parsedHotTemp,
        T_inf: parsedColdTemp,
        h: 10
      },
      area: 1,
      totalThickness: processedLayers.reduce((sum, l) => sum + l.thickness, 0)
    }));
    
    navigate('/simulation');
  };

  const totalThicknessCm = layers.reduce((sum, layer) => {
    const t = parseFloat(layer.thickness) || 0;
    return sum + (layer.unit === 'mm' ? t / 10 : t);
  }, 0);

  const tempDifference = (parseFloat(hotTemp) || 0) - (parseFloat(coldTemp) || 0);

  const getLayerColor = (index: number) => {
    const colors = [
      "from-red-50 to-orange-50 border-red-200 text-red-700",
      "from-green-50 to-emerald-50 border-green-200 text-green-700",
      "from-blue-50 to-cyan-50 border-blue-200 text-blue-700",
      "from-purple-50 to-pink-50 border-purple-200 text-purple-700",
      "from-yellow-50 to-amber-50 border-yellow-200 text-yellow-700"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-8">
      <div className="max-w-[1440px] mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <h1 className="text-3xl text-[#0A2540] mb-2">Thermal Simulation Input</h1>
          <p className="text-gray-600">Configure your composite wall parameters</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Temps */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Card className="p-6">
                <h2 className="text-xl text-[#0A2540] mb-6">Boundary Temperatures</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Hot Side (°C)</label>
                    <Input type="number" value={hotTemp} onChange={(e) => setHotTemp(e.target.value)} placeholder="e.g. 20–80" className="text-lg" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Cold Side (°C)</label>
                    <Input type="number" value={coldTemp} onChange={(e) => setColdTemp(e.target.value)} placeholder="e.g. -20–30" className="text-lg" />
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">ΔT: <span className="font-semibold text-[#0A2540]">{tempDifference.toFixed(1)}°C</span></div>
                </div>
              </Card>
            </motion.div>

            {/* Layers */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl text-[#0A2540]">Layer Configuration</h2>
                  <Button onClick={addLayer} variant="outline" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" /> Add Layer
                  </Button>
                </div>
                <div className="space-y-4">
                  {layers.map((layer, index) => {
                    const colorClass = getLayerColor(index);
                    const position = index === 0 ? "Hot" : index === layers.length - 1 ? "Cold" : "Middle";
                    return (
                      <div key={layer.id} className={`p-4 bg-gradient-to-r ${colorClass.split(' ')[0]} rounded-lg border ${colorClass.split(' ')[1]}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className={colorClass.split(' ')[2]}>Layer {index + 1} ({position})</div>
                          {layers.length > 1 && (
                            <Button onClick={() => removeLayer(layer.id)} variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-700 mb-2 block">Thickness</label>
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                value={layer.thickness}
                                onChange={(e) => updateLayer(layer.id, 'thickness', e.target.value)}
                                placeholder={layer.unit === "mm" ? "e.g. 5–500" : "e.g. 1–50"}
                                className="flex-1"
                              />
                              <Select value={layer.unit} onValueChange={(value) => updateLayer(layer.id, 'unit', value)}>
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cm">cm</SelectItem>
                                  <SelectItem value="mm">mm</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-700 mb-2 block">k (W/m·K)</label>
                            <Input
                              type="number"
                              value={layer.conductivity}
                              onChange={(e) => updateLayer(layer.id, 'conductivity', e.target.value)}
                              placeholder="e.g. 0.02–2.0"
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-900">
                    Layers: <span className="font-semibold">{layers.length}</span> | Total: <span className="font-semibold">{totalThicknessCm.toFixed(1)} cm</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <Card className="p-6">
                <h3 className="text-lg text-[#0A2540] mb-4">Summary</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Thickness</div>
                    <div className="text-2xl text-[#0A2540]">{totalThicknessCm.toFixed(1)} cm</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">ΔT</div>
                    <div className="text-2xl text-[#0A2540]">{tempDifference.toFixed(1)}°C</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Layers</div>
                    <div className="text-2xl text-[#0A2540]">{layers.length}</div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
              <Card className="p-6 border-yellow-200 bg-yellow-50">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-yellow-900 mb-1">Tip</div>
                    <div className="text-xs text-yellow-800">
                      Add insulation layers for better performance.
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
              <Button onClick={handleRunSimulation} className="w-full bg-[#3A86FF] hover:bg-[#2A76EF] text-white py-6 text-lg" disabled={layers.length === 0 || !hotTemp || !coldTemp}>
                Run Simulation <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

