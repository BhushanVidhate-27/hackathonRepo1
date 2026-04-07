import { Link } from "react-router";
import { Linkedin, Twitter, Github, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0A2540] text-white">
      <div className="max-w-[1440px] mx-auto px-8 py-20">
        
        {/* Top Section */}
        <div className="flex flex-col items-center text-center mb-16">
          
          {/* Logo / Brand */}
          <Link to="/" className="mb-4">
            <span className="text-2xl font-semibold tracking-wide">
              Thermal Analysis
            </span>
          </Link>

          {/* Tagline */}
          <p className="text-gray-300 text-lg max-w-xl leading-relaxed mb-6">
            Next-generation thermal analysis powered by CFD technology, delivering precision insights for advanced engineering solutions.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4">
            {[Linkedin, Github, Twitter, Youtube].map((Icon, i) => (
              <button
                key={i}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#3A86FF] transition-all duration-300 flex items-center justify-center hover:scale-110"
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col items-center gap-3">
          
          {/* Brand Name */}
          <p className="text-lg font-semibold tracking-wide text-white">
            Dextro
          </p>

          {/* Credits */}
          <p className="text-gray-400 text-base text-center">
            Designed by <span className="text-white font-medium">Team Dextro</span> for{" "}
            <span className="text-white font-medium">
              Pentas Insulations Pvt Ltd
            </span>{" "}
            ❤️
          </p>

          {/* Copyright */}
          <p className="text-gray-500 text-sm mt-2">
            © {new Date().getFullYear()} Dextro. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}