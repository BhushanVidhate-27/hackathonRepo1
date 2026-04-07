import { Card } from "../ui/card";
import { motion } from "motion/react";
import { Linkedin, Github, Mail } from "lucide-react";

const team = [
  {
    name: "DEXTRO",
    color: "from-blue-500 to-cyan-500",
  },
];

export function TeamSection() {
  return (
    <section id="team" className="py-24 bg-[#F8F9FB]">
      <div className="max-w-[1440px] mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3A86FF]/10 text-[#3A86FF] rounded-full text-sm mb-4">
            Our Team
          </div>
          <h2 className="text-4xl text-[#0A2540] mb-4">Meet our Team</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are a diverse group of professionals dedicated to advancing the
            field of technology.
          </p>
        </motion.div>

        {/* flex + justify-center keeps a single card perfectly centred */}
        <div className="flex flex-wrap justify-center gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="flex flex-col items-center w-[260px] p-8 text-center hover:shadow-xl transition-all duration-300 border-gray-200 group hover:-translate-y-2">
                <h3 className="text-xl text-[#0A2540] mb-4">{member.name}</h3>
                <div className="flex justify-center gap-3">
                  <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#3A86FF] hover:text-white transition-colors flex items-center justify-center">
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#3A86FF] hover:text-white transition-colors flex items-center justify-center">
                    <Github className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#3A86FF] hover:text-white transition-colors flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
