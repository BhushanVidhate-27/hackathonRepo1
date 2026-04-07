import { motion } from "motion/react";

export function TeamSection() {
  return (
    <section id="team" className="py-24 bg-[#F8F9FB]">
      <div className="max-w-[1440px] mx-auto px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3A86FF]/10 text-[#3A86FF] rounded-full text-sm mb-4">
            Our Team
          </div>

          <h2 className="text-4xl text-[#0A2540] mb-4">
            Meet our Team
          </h2>

          {/* 🔥 Gradient TEXT (main part) */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="
              text-5xl md:text-6xl font-extrabold tracking-wider
              bg-gradient-to-r from-gray-500 via-gray-800 to-black
              bg-clip-text text-transparent
            "
          >
            DEXTRO
          </motion.h1>

          {/* Description */}
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
            We are a diverse group of professionals dedicated to advancing the
            field of technology.
          </p>
        </motion.div>

      </div>
    </section>
  );
}