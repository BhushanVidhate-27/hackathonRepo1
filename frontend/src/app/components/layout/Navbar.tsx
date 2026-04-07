import { Link } from "react-router";
import { Button } from "../ui/button";
import { Activity } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl text-[#0A2540]">Thermal Analysis</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[#0A2540] hover:text-[#3A86FF] transition-colors">Features</a>
            <a href="#services" className="text-[#0A2540] hover:text-[#3A86FF] transition-colors">Services</a>
            <a href="#case-studies" className="text-[#0A2540] hover:text-[#3A86FF] transition-colors">Case Studies</a>
            <a href="#team" className="text-[#0A2540] hover:text-[#3A86FF] transition-colors">Team</a>
            <a href="#contact" className="text-[#0A2540] hover:text-[#3A86FF] transition-colors">Contact</a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
          
            <Link to="/dashboard">
              <Button className="bg-[#3A86FF] hover:bg-[#2A76EF] text-white">
                Start Simulation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
