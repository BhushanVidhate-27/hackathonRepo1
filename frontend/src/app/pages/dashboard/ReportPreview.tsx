import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { motion } from "motion/react";
import { Download, Share2, Printer, Calendar, Building2, User, Mail } from "lucide-react";
import React, { useMemo, useState } from "react";
import { downloadBlob } from "../../lib/download";
import { apiFetch } from "../../lib/api";

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

function formatCm(m: number) {
  if (!Number.isFinite(m)) return "—";
  return `${(m * 100).toFixed(1)}cm`;
}

export function ReportPreview() {
  const [shareStatus, setShareStatus] = useState<string>("");
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const reportId = "TSA-2026-0412";

  const snapshot = useMemo(() => {
    const simulationParams = JSON.parse(sessionStorage.getItem("simulationParams") || "null") as SimulationParams | null;
    const simulationResult = JSON.parse(sessionStorage.getItem("simulationResult") || "null") as SimulationResult | null;

    return {
      report: {
        id: reportId,
        date: currentDate,
        generatedAt: new Date().toISOString(),
      },
      simulationParams,
      simulationResult,
    };
  }, [currentDate]);

  const derived = useMemo(() => {
    const p = snapshot.simulationParams;
    const r = snapshot.simulationResult;
    const hot = p?.boundary?.T_left;
    const cold = p?.boundary?.T_inf;
    const deltaT =
      typeof hot === "number" && typeof cold === "number" ? hot - cold : null;
    const uValue = r?.resistance ? (r.resistance > 0 ? 1 / r.resistance : null) : null;
    return { deltaT, uValue };
  }, [snapshot.simulationParams, snapshot.simulationResult]);

  const handleExportPdf = async () => {
    // Backend-backed file generation (JSON for now).
    const res = await fetch(`${(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ? "http://localhost:8080" : ""}/api/report/json`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(snapshot),
    });
    if (!res.ok) throw new Error(`Export failed: ${res.status} ${res.statusText}`);
    const blob = await res.blob();

    const disposition = res.headers.get("content-disposition") || "";
    const match = disposition.match(/filename="([^"]+)"/);
    const filename = match?.[1] || `thermal-report-${new Date().toISOString().slice(0, 10)}.json`;
    downloadBlob(filename, blob);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}${window.location.hash || ""}`;
    setShareStatus("");

    try {
      if (navigator.share) {
        await navigator.share({ title: "Thermal Analysis Report", url });
        setShareStatus("Shared.");
        return;
      }
    } catch {
      // fall through to copy
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareStatus("Link copied.");
    } catch {
      setShareStatus(url);
    }
  };

  const handlePrint = () => window.print();

  const params = snapshot.simulationParams;
  const result = snapshot.simulationResult;

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-8">
      <div className="max-w-[1200px] mx-auto px-8">
        {/* Header Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl text-[#0A2540] mb-2">
              Thermal Analysis Report
            </h1>
            <p className="text-gray-600">
              Professional report ready for stakeholder presentation
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="outline" className="gap-2" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button className="bg-[#3A86FF] hover:bg-[#2A76EF] text-white gap-2" onClick={handleExportPdf}>
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </motion.div>
        {shareStatus && (
          <div className="mb-6 text-sm text-gray-600">
            {shareStatus.startsWith("http") ? (
              <span>
                Copy this link: <span className="font-mono text-gray-800">{shareStatus}</span>
              </span>
            ) : (
              <span>{shareStatus}</span>
            )}
          </div>
        )}

        {/* Report Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-12 border-gray-200 bg-white shadow-xl">
            {/* Report Header */}
            <div className="border-b-2 border-[#0A2540] pb-8 mb-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-600">ThermaSmart AI</div>
                    <div className="text-2xl text-[#0A2540]">Thermal Analysis Report</div>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Report Date: {currentDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>Project: Composite Wall Optimization</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-2">Report ID</div>
                  <div className="text-xl text-[#0A2540] font-mono">{reportId}</div>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <section className="mb-10">
              <h2 className="text-2xl text-[#0A2540] mb-4 pb-2 border-b border-gray-200">
                Executive Summary
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                This report presents a comprehensive thermal analysis of a three-layer composite wall system 
                using advanced Computational Fluid Dynamics (CFD) simulation. The analysis evaluates heat
                transfer characteristics and overall thermal performance across the composite structure.
              </p>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-gray-600 mb-1">Simulation Accuracy</div>
                  <div className="text-2xl text-blue-600">—</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm text-gray-600 mb-1">U-Value</div>
                  <div className="text-2xl text-green-600">
                    {derived.uValue === null ? "—" : derived.uValue.toFixed(3)}
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-sm text-gray-600 mb-1">Heat Flux</div>
                  <div className="text-2xl text-purple-600">
                    {typeof result?.heat_flux === "number" ? result.heat_flux.toFixed(2) : "—"}
                  </div>
                </div>
              </div>
            </section>

            {/* Configuration Details */}
            <section className="mb-10">
              <h2 className="text-2xl text-[#0A2540] mb-4 pb-2 border-b border-gray-200">
                Configuration Details
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg text-[#0A2540] mb-3">Boundary Conditions</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-gray-600">Hot Side Temperature:</span>
                        <span className="text-gray-900">
                          {typeof params?.boundary?.T_left === "number" ? `${params.boundary.T_left}°C` : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-gray-600">Cold Side Temperature:</span>
                        <span className="text-gray-900">
                          {typeof params?.boundary?.T_inf === "number" ? `${params.boundary.T_inf}°C` : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-gray-600">Temperature Difference:</span>
                        <span className="text-gray-900">
                          {derived.deltaT === null ? "—" : `${derived.deltaT.toFixed(1)}°C`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg text-[#0A2540] mb-3">Layer Composition</h3>
                    <div className="space-y-2 text-sm">
                      {(params?.layers || []).length ? (
                        (params?.layers || []).map((l, idx) => {
                          const isFirst = idx === 0;
                          const isLast = idx === (params?.layers || []).length - 1;
                          const pos = isFirst ? "Hot" : isLast ? "Cold" : "Mid";
                          const tint = isFirst
                            ? "bg-red-50 border-red-200"
                            : isLast
                              ? "bg-blue-50 border-blue-200"
                              : "bg-green-50 border-green-200";
                          return (
                            <div
                              key={idx}
                              className={`flex justify-between p-2 rounded border ${tint}`}
                            >
                              <span className="text-gray-700">Layer {idx + 1} ({pos}):</span>
                              <span className="text-gray-900">
                                {l.material ? l.material : `k=${Number(l.k).toFixed(3)}`} • {formatCm(l.thickness)}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-2 bg-gray-50 rounded border border-gray-200 text-gray-600">
                          No layer data available.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Key Findings */}
            <section className="mb-10">
              <h2 className="text-2xl text-[#0A2540] mb-4 pb-2 border-b border-gray-200">
                Key Findings
              </h2>
              
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#3A86FF] text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <div className="text-gray-900 mb-1">Heat Flux Analysis</div>
                      <div className="text-sm text-gray-600">
                        Calculated heat flux of{" "}
                        <span className="font-semibold text-gray-900">
                          {typeof result?.heat_flux === "number" ? `${result.heat_flux.toFixed(2)} W/m²` : "—"}
                        </span>{" "}
                        based on the provided boundary conditions and layer properties.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#3A86FF] text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <div className="text-gray-900 mb-1">Temperature Distribution</div>
                      <div className="text-sm text-gray-600">
                        Interface temperatures are computed at each material boundary. Total interfaces:{" "}
                        <span className="font-semibold text-gray-900">
                          {Array.isArray(result?.temperatures) ? result.temperatures.length : "—"}
                        </span>
                        .
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#3A86FF] text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <div className="text-gray-900 mb-1">Energy Performance</div>
                      <div className="text-sm text-gray-600">
                        Total thermal resistance:{" "}
                        <span className="font-semibold text-gray-900">
                          {typeof result?.resistance === "number" ? `${result.resistance.toFixed(3)} m²·K/W` : "—"}
                        </span>
                        . Further improvements can be evaluated by iterating layer thickness and material selection.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section className="mb-10">
              <h2 className="text-2xl text-[#0A2540] mb-4 pb-2 border-b border-gray-200">
                Conclusion
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The thermal analysis demonstrates that the current composite wall configuration achieves good 
                thermal performance with 94.2% efficiency. You can further improve performance by testing
                alternate materials and thicknesses and comparing temperature profiles and heat flux across
                configurations.
              </p>
            </section>

            {/* Report Footer */}
            <div className="pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-8 text-sm text-gray-600">
                <div>
                  <div className="text-gray-900 mb-2">Prepared By</div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4" />
                    <span>Dr. Sarah Chen, Chief Engineer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>sarah.chen@thermasmart.ai</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-900 mb-2">Generated By</div>
                  <div>ThermaSmart AI Platform v2.1</div>
                  <div>Powered by Advanced CFD & Machine Learning</div>
                </div>
              </div>

              <div className="mt-6 text-center text-xs text-gray-500">
                © 2026 ThermaSmart AI. This report is confidential and intended for the recipient only.
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
