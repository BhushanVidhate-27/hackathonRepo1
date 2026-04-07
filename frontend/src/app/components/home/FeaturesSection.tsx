import { motion } from "motion/react";
import { Activity, Cpu, TrendingUp, Factory } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "CFD Simulation Engine",
    description: "Our proprietary computational fluid dynamics engine delivers precision thermal analysis with 95%+ accuracy. Utilizing advanced finite element methods, it simulates heat transfer across complex multi-layer composite structures in real-time.",
    stats: [
      { label: "Accuracy", value: "95%" },
      { label: "Speed", value: "<30s" }
    ],
    imageGradient: "from-red-500 via-orange-500 to-yellow-500"
  },
  
  {
    icon: TrendingUp,
    title: "Real-Time Interactive Graphs",
    description: "Dynamic visualizations update instantly as you adjust parameters. Drag sliders to see temperature curves, heat flux, and energy efficiency metrics change in real-time, enabling rapid design iteration.",
    stats: [
      { label: "Response Time", value: "<100ms" },
      { label: "Data Points", value: "10k+" }
    ],
    imageGradient: "from-blue-500 via-cyan-500 to-teal-500"
  },
 
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[#F8F9FB]">
      <div className="max-w-[1440px] mx-auto px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3A86FF]/10 text-[#3A86FF] rounded-full text-sm mb-4">
            Platform Features
          </div>
          <h2 className="text-4xl text-[#0A2540] mb-4">
            Powered by Advanced Technology
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Industry-leading tools backed by cutting-edge science and engineering
          </p>
        </motion.div>

        {/* Features List */}
        <div className="space-y-32">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Image/Visualization */}
                <div className={`${!isEven ? 'lg:order-2' : ''}`}>
                  <div className="relative">
                    <div className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${feature.imageGradient} p-1`}>
                      <div className="w-full h-full bg-white rounded-xl p-8 flex items-center justify-center">
                        <Icon className="w-32 h-32 text-gray-300" />
                      </div>
                    </div>
                    
                    {/* Floating Stats */}
                    <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-gray-200">
                      <div className="flex gap-6">
                        {feature.stats.map((stat, i) => (
                          <div key={i} className="text-center">
                            <div className="text-2xl text-[#3A86FF]">{stat.value}</div>
                            <div className="text-xs text-gray-600">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className={`${!isEven ? 'lg:order-1' : ''}`}>
                  <h3 className="text-3xl text-[#0A2540] mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm text-gray-700">
                      Real-time Processing
                    </div>
                    <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm text-gray-700">
                      Cloud-powered
                    </div>
                    <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm text-gray-700">
                      Enterprise Ready
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
