import { Link } from "react-router";
import { Linkedin, Twitter, Github, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0A2540] text-white">
      <div className="max-w-[1440px] mx-auto px-8 py-16">
        
        {/* Only Brand Section */}
        <div className="flex flex-col items-center text-center mb-12">
          <Link to="/" className="flex items-center mb-4">
            <span className="text-xl font-semibold">Thermal Analysis</span>
          </Link>

          <p className="text-gray-400 text-sm mb-6 max-w-md">
            Next-generation thermal analysis powered by CFD technology.
          </p>

          <div className="flex gap-3">
            <button className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center">
              <Linkedin className="w-5 h-5" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center">
              <Twitter className="w-5 h-5" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center">
              <Github className="w-5 h-5" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center">
              <Youtube className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm mb-2">
            Dextro
          </p>
          <p className="text-gray-400 text-sm">
              Designed by Team Dextro for Pentas Insulations Pvt Ltd &hearts;
          </p>
        </div>

      </div>
    </footer>
  );
}