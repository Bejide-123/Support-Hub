// components/ContactSection.tsx
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import contact from '../assets/contact.png'; // Replace with your actual image path

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      console.log('Form submitted:', formData);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSubmitStatus('idle');
      }, 3000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: <Mail className="text-emerald-600" size={20} />,
      label: 'Email',
      value: 'support@supporthub.com',
      link: 'mailto:support@supporthub.com'
    },
    {
      icon: <Phone className="text-emerald-600" size={20} />,
      label: 'Phone',
      value: '+1 (800) 123-4567',
      link: 'tel:+18001234567'
    },
    {
      icon: <MapPin className="text-emerald-600" size={20} />,
      label: 'Location',
      value: 'San Francisco, CA',
      link: null
    },
    {
      icon: <Clock className="text-emerald-600" size={20} />,
      label: 'Hours',
      value: 'Mon-Fri, 8AM-6PM',
      link: null
    }
  ];

  return (
    <section id='contact' className="relative py-20 md:py-28 overflow-hidden">
      {/* Wavy Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100">
        {/* Top Wave */}
        <div className="absolute -top-1 left-0 right-0">
          <svg className="w-full h-20 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor"></path>
          </svg>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full mb-6">
            <MessageSquare size={20} />
            <span className="ml-2 font-semibold">Get in Touch</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Contact Our Support Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to us through any of these channels.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Contact Form */}
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl border border-gray-100 sticky top-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Send us a message
            </h3>
            <p className="text-gray-600 mb-8">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
                  placeholder="How can we help?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none resize-none transition-all"
                  placeholder="Tell us about your issue or question..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                className={`w-full py-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center ${
                  submitStatus === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-200 hover:scale-[1.02]'
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircle size={20} className="mr-2" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send size={20} className="mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="text-emerald-500 mr-2 flex-shrink-0" size={18} />
                <span>We typically respond within 2 hours during business hours</span>
              </div>
            </div>
          </div>

          {/* Right Column: Image & Contact Info */}
          <div className="space-y-8">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden shadow-2xl relative">
              <img
                src={contact}
                alt="Support Team"
                className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient overlay to blend with background */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-100/50 via-transparent to-transparent pointer-events-none"></div>
            </div>
            
            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.link || undefined}
                  className={`bg-white rounded-xl p-5 border-2 border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 ${
                    method.link ? 'cursor-pointer hover:scale-105' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="p-2.5 bg-emerald-50 rounded-lg mr-3 flex-shrink-0">
                      {method.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{method.label}</h4>
                      <p className="text-sm text-gray-600">{method.value}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            
            {/* Emergency Banner */}
            <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl p-6 md:p-8 text-white shadow-2xl border-4 border-white relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
                    <AlertCircle size={16} className="mr-1" />
                    <span className="text-xs font-semibold">Emergency Line</span>
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold mb-2">24/7 Critical Support</h4>
                  <p className="text-emerald-100 text-sm mb-3">
                    For urgent issues that can't wait
                  </p>
                  <div className="font-bold text-2xl md:text-3xl tracking-wide">1-800-911-SUPPORT</div>
                </div>
                <button className="px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all hover:scale-105 shadow-lg whitespace-nowrap">
                  Call Now
                </button>
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

export default ContactSection;