// components/HeroSection.tsx
import { Search } from "lucide-react";
import image from "../assets/agent.png"; // Replace with your actual image path
import Navbar from "./Navbar";

const HeroSection = () => {
  return (
    <>
      <Navbar />
      <section id='hero' className="relative overflow-hidden bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text & Search */}
            <div className="text-center lg:text-left">
              {/* Main Heading - Fixed spacing */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                We're here to&nbsp;<span className="text-emerald-600">help</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl">
                Get instant answers from our knowledge base or connect with our
                support team for personalized assistance.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto lg:mx-0">
                <div className="relative">
                  {/* Input field */}
                  <input
                    type="text"
                    placeholder="Search for answers, guides, or topics..."
                    className="w-full pl-6 pr-20 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all shadow-sm hover:shadow-md"
                  />
                  
                  {/* Search Button with Icon */}
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-500 text-white p-3.5 rounded-xl hover:bg-emerald-600 transition-colors hover:scale-105 active:scale-95">
                    <Search size={22} />
                  </button>
                </div>

                {/* Search Suggestions */}
                <div className="mt-4 flex flex-wrap gap-2 justify-center lg:justify-start items-center">
                  <span className="text-sm text-gray-500">
                    Try searching for:
                  </span>
                  <a
                    href="#"
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Billing issues
                  </a>
                  <span className="text-gray-300">•</span>
                  <a
                    href="#"
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Account setup
                  </a>
                  <span className="text-gray-300">•</span>
                  <a
                    href="#"
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Technical support
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                <div className="text-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-2xl font-bold text-emerald-600">24/7</div>
                  <div className="text-sm text-gray-600">Support Available</div>
                </div>
                <div className="text-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-2xl font-bold text-emerald-600">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
                <div className="text-center col-span-2 md:col-span-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-2xl font-bold text-emerald-600">&lt;5 min</div>
                  <div className="text-sm text-gray-600">Average Response</div>
                </div>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="relative">
              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={image}
                  alt="Support Agent"
                  className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg border border-gray-100 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-600 font-bold">✓</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Live Agents</div>
                    <div className="text-sm text-gray-500">Ready to help</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;