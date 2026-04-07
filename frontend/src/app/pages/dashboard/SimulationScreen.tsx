import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { motion } from "motion/react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { apiFetch } from "../../lib/api";

type ComputeResponse = {
  resistance: number;
  heat_flux: number;
  temperatures: number[];
};

export function SimulationScreen() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"running" | "error">("running");
  const [error, setError] = useState<string>("");

  const steps = useMemo(
    () => [
      { label: "Validating inputs", done: true, tone: "green" as const },
      { label: "Boundary conditions applied", done: true, tone: "green" as const },
      { label: "Solving heat transfer equations...", done: status === "running", tone: "blue" as const },
      { label: "Generating visualizations", done: status !== "running", tone: "gray" as const },
    ],
    [status]
  );

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const params = JSON.parse(sessionStorage.getItem("simulationParams") || "null");
        if (!params) throw new Error("Missing simulation inputs. Please start a new simulation.");

        const result = await apiFetch<ComputeResponse>("/api/compute", {
          method: "POST",
          json: params,
        });

        if (cancelled) return;
        sessionStorage.setItem("simulationResult", JSON.stringify(result));
        navigate("/results");
      } catch (e: any) {
        if (cancelled) return;
        setStatus("error");
        setError(e?.details?.error || e?.message || "Simulation failed");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
      <div className="max-w-2xl w-full px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-12 text-center border-gray-200">
            {/* Title */}
            <h1 className="text-3xl text-[#0A2540] mb-3">
              {status === "running" ? "Running Simulation" : "Simulation Failed"}
            </h1>
            <p className="text-gray-600 mb-8">
              {status === "running"
                ? "Computing heat flux and interface temperatures using the backend solver..."
                : "We couldn't compute results with the current inputs."}
            </p>

            {/* Progress Bar */}
            <div className="mb-8">
              <Progress value={status === "running" ? 70 : 100} className="h-2" />
            </div>

            {/* Simulation Steps */}
            <div className="space-y-4 text-left max-w-md mx-auto">
              {steps.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.25 }}
                  className={[
                    "flex items-center gap-3 p-3 rounded-lg border",
                    s.tone === "green" ? "bg-green-50 border-green-200" : "",
                    s.tone === "blue" ? "bg-blue-50 border-blue-200" : "",
                    s.tone === "gray" ? "bg-gray-50 border-gray-200" : "",
                  ].join(" ")}
                >
                  {status === "error" && i === 2 ? (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  ) : s.done ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                  )}
                  <span
                    className={[
                      "text-sm",
                      s.tone === "green" ? "text-green-900" : "",
                      s.tone === "blue" ? "text-blue-900" : "",
                      s.tone === "gray" ? "text-gray-600" : "",
                      status === "error" && i === 2 ? "text-red-900" : "",
                    ].join(" ")}
                  >
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {status === "error" && (
              <div className="mt-8 pt-6 border-t border-gray-200 text-left">
                <div className="text-sm font-medium text-red-900 mb-2">Error</div>
                <div className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg p-3">
                  {error}
                </div>
                <div className="mt-4 flex gap-3">
                  <Button variant="outline" onClick={() => navigate("/input")}>
                    Back to Inputs
                  </Button>
                  <Button
                    className="bg-[#3A86FF] hover:bg-[#2A76EF] text-white"
                    onClick={() => {
                      setStatus("running");
                      setError("");
                      navigate(0);
                    }}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
