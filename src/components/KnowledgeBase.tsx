// components/WaveSection.tsx
import { MessageSquare, Phone, CheckCircle } from 'lucide-react';

const WaveSection = () => {
//   const supportFeatures = [
//     { icon: <Clock className="text-emerald-600" size={20} />, text: "24/7 Ticket System" },
//     { icon: <Users className="text-emerald-600" size={20} />, text: "Live Agent Support" },
//     { icon: <Shield className="text-emerald-600" size={20} />, text: "Secure & Encrypted" },
//     { icon: <Zap className="text-emerald-600" size={20} />, text: "Fast Response Time" },
//   ];

//   const supportStats = [
//     { value: "24/7", label: "Support Availability" },
//     { value: "< 5 min", label: "Avg. Response Time" },
//     { value: "98%", label: "Satisfaction Rate" },
//     { value: "10k+", label: "Tickets Resolved" },
//   ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Enhanced Wavy Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-500 to-teal-600">
        {/* Multiple waves for more dramatic effect */}
        <div className="absolute -top-1 left-0 right-0">
          <svg className="w-full h-24 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor" opacity="0.15"></path>
          </svg>
        </div>
        <div className="absolute -top-1 left-0 right-0">
          <svg className="w-full h-20 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor" opacity="0.3"></path>
          </svg>
        </div>
        <div className="absolute -top-1 left-0 right-0">
          <svg className="w-full h-16 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with features */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full mb-6">
            <CheckCircle size={18} className="mr-2" />
            <span className="font-medium">Premium Support</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Expert Support When You Need It
          </h2>
          
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-10">
            Our dedicated team is ready to help you resolve issues quickly and efficiently.
          </p>

          {/* Support Features */}
          {/* <div className="flex flex-wrap justify-center gap-6 mb-12">
            {supportFeatures.map((feature, index) => (
              <div key={index} className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                {feature.icon}
                <span className="ml-2 text-emerald-50 font-medium">{feature.text}</span>
              </div>
            ))}
          </div> */}

          {/* Support Stats */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {supportStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-emerald-200">{stat.label}</div>
              </div>
            ))}
          </div> */}
        </div>

        {/* Support Options Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Ticket Card */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 hover:-translate-y-1">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-6 mx-auto">
              <MessageSquare className="text-emerald-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Submit a Ticket
            </h3>
            <p className="text-gray-600 text-center mb-6">
              For detailed issues that need thorough investigation and documentation.
            </p>
            <ul className="space-y-2 mb-8">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle size={16} className="text-emerald-500 mr-2" />
                Detailed response within 24 hours
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle size={16} className="text-emerald-500 mr-2" />
                Attachment support for files
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle size={16} className="text-emerald-500 mr-2" />
                Progress tracking
              </li>
            </ul>
            <button className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300">
              Create Ticket
            </button>
          </div>

          {/* Chat Card - Highlighted */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 hover:-translate-y-1 border-2 border-emerald-200 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 mx-auto">
              <MessageSquare className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Live Chat
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Instant connection with support agents for real-time problem solving.
            </p>
            <ul className="space-y-2 mb-8">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle size={16} className="text-emerald-500 mr-2" />
                Instant response
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle size={16} className="text-emerald-500 mr-2" />
                Screen sharing available
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle size={16} className="text-emerald-500 mr-2" />
                File transfer support
              </li>
            </ul>
            <button className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300">
              Start Chat Now
            </button>
          </div>

          {/* Call Card */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 hover:-translate-y-1">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-6 mx-auto">
              <Phone className="text-emerald-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Phone Support
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Speak directly with our experts for complex issues requiring verbal discussion.
            </p>
            <ul className="space-y-2 mb-8">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle size={16} className="text-emerald-500 mr-2" />
                Priority queue access
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle size={16} className="text-emerald-500 mr-2" />
                Multilingual support
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle size={16} className="text-emerald-500 mr-2" />
                Call recording available
              </li>
            </ul>
            <div className="space-y-3">
              <button className="w-full py-3.5 border-2 border-emerald-500 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors">
                Schedule Call
              </button>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">Direct Line</div>
                <div className="text-lg font-bold text-emerald-600">1-800-555-SUPPORT</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section with Additional Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
                Need Urgent Help?
              </h3>
              <p className="text-emerald-100 mb-4 md:mb-6 text-sm md:text-base">
                For critical issues affecting your business operations, our emergency response team is available 24/7.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold animate-pulse text-sm md:text-base">
                  EMERGENCY
                </div>
                <div className="text-white">
                  <div className="font-bold text-lg md:text-xl">1-800-911-SUPPORT</div>
                  <div className="text-xs md:text-sm text-emerald-200">24/7 Emergency Hotline</div>
                </div>
              </div>
            </div>
            <div className="md:text-right mt-6 md:mt-0">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 rounded-xl w-full md:w-auto">
                <div className="text-emerald-50 font-medium mb-2 text-sm md:text-base">Standard Hours</div>
                <div className="text-white font-bold text-base md:text-lg">Mon - Fri: 8:30AM - 5PM CST</div>
                <div className="text-emerald-200 text-xs md:text-sm">Extended support available for enterprise clients</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Waves */}
      <div className="absolute -bottom-1 left-0 right-0">
        <svg className="w-full h-24 text-white rotate-180" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor" opacity="0.15"></path>
        </svg>
        <svg className="w-full h-20 text-white rotate-180 absolute -bottom-1" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor" opacity="0.3"></path>
        </svg>
        <svg className="w-full h-16 text-white rotate-180 absolute -bottom-1" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>
  );
};

export default WaveSection;