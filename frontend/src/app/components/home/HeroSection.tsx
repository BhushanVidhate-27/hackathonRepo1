import { Link } from "react-router";
import { Button } from "../ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#F8F9FB] pt-20 pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#3A86FF] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0A2540] opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
          

            <h1 className="text-5xl lg:text-6xl text-[#0A2540] leading-tight">
              Smart Thermal Analysis for{" "}
              <span className="bg-gradient-to-r from-[#3A86FF] to-[#0A2540] bg-clip-text text-transparent">
                Next-Gen Engineering
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              Leverage advanced CFD simulations and AI-powered insights to optimize composite wall designs. 
              Analyze temperature distribution, predict energy efficiency, and make data-driven decisions in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-[#3A86FF] hover:bg-[#2A76EF] text-white text-lg px-8 py-6">
                  Start Simulation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
            </div>

           
          </motion.div>

          {/* Right Column - Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              {/* Layer Visualization */}
              <div className="space-y-3">
                <div className="text-sm text-gray-600 mb-4">Composite Wall Thermal Profile</div>
                
                {/* Layer 1 - Hot Side */}
                <div className="relative h-24 rounded-lg overflow-hidden bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 flex items-center justify-between px-6">
                  <span className="text-white text-sm">Concrete</span>
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-red-600">
                    35°C
                  </div>
                </div>

                {/* Layer 2 - Insulation */}
                <div className="relative h-24 rounded-lg overflow-hidden bg-gradient-to-r from-yellow-300 via-green-300 to-cyan-300 flex items-center justify-between px-6">
                  <span className="text-gray-800 text-sm">Insulation</span>
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-green-600">
                    22°C
                  </div>
                </div>

                {/* Layer 3 - Cold Side */}
                <div className="relative h-24 rounded-lg overflow-hidden bg-gradient-to-r from-cyan-300 via-blue-400 to-blue-600 flex items-center justify-between px-6">
                  <span className="text-white text-sm">Brick</span>
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-blue-600">
                    12°C
                  </div>
                </div>
              </div>

              {/* Heat Flow Arrow */}
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
                <div className="w-full h-px bg-gradient-to-r from-red-500 to-blue-500" />
                <span className="whitespace-nowrap">Heat Flow →</span>
              </div>
            </div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -left-8 top-20 bg-white rounded-xl shadow-lg p-4 border border-gray-200"
            >
              <div className="text-xs text-gray-600">Heat Flux</div>
              <div className="text-2xl text-[#3A86FF]">12.5 W/m²</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -right-8 bottom-20 bg-white rounded-xl shadow-lg p-4 border border-gray-200"
            >
              <div className="text-xs text-gray-600">Efficiency</div>
              <div className="text-2xl text-green-600">94%</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
