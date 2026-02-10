// components/FAQSection.tsx
import { useState } from 'react';
import { Plus, Minus, HelpCircle, Mail } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      question: "How do I submit a support ticket?",
      answer: "Navigate to the Support section in your dashboard and click 'Create New Ticket'. Fill in the required information including your issue category, priority level, and detailed description. You can also attach relevant files or screenshots to help us understand your issue better."
    },
    {
      question: "What's your response time?",
      answer: "We respond to urgent tickets within 1 hour and standard tickets within 24 hours during business hours. Critical issues receive immediate attention from our priority response team. Enterprise customers enjoy even faster response times with dedicated support channels."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time from the billing section in your account settings. No long-term contracts required, and you'll retain access until the end of your current billing period. We also offer a full refund within the first 30 days if you're not satisfied."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 14-day free trial with full access to all features. No credit card required to start. You can explore all premium features, create unlimited tickets, and experience our support quality firsthand before making any commitment."
    },
    {
      question: "How secure is my data?",
      answer: "We use bank-level 256-bit AES encryption, regular third-party security audits, and comply with SOC 2, GDPR, and industry security standards to protect your data. All data is backed up in multiple secure locations with 99.99% uptime guarantee."
    },
    {
      question: "Do you offer phone support?",
      answer: "Yes, phone support is available for enterprise plans with priority queue access. All plans include 24/7 email and live chat support. We also offer scheduled call-backs and video support sessions for complex technical issues."
    }
  ];

  const categories = [
    { name: "Billing", count: 12 },
    { name: "Technical", count: 18 },
    { name: "Account", count: 9 }
  ];

  return (
    <section id='faq' className="py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 mb-6">
            <HelpCircle className="text-emerald-600" size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find quick answers to common questions. Can't find what you're looking for? Our support team is here to help.
          </p>
        </div>

        {/* FAQ Categories (Optional) */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
            >
              {category.name}
              <span className="ml-2 text-xs text-gray-400">({category.count})</span>
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl border-2 transition-all duration-300 ${
                openIndex === index 
                  ? 'border-emerald-500 shadow-lg shadow-emerald-100' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
              >
                <span className={`text-base md:text-lg font-semibold transition-colors pr-4 ${
                  openIndex === index ? 'text-emerald-600' : 'text-gray-900 group-hover:text-emerald-600'
                }`}>
                  {item.question}
                </span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  openIndex === index 
                    ? 'bg-emerald-500 rotate-180' 
                    : 'bg-gray-100 group-hover:bg-emerald-100'
                }`}>
                  {openIndex === index ? (
                    <Minus className="text-white" size={18} />
                  ) : (
                    <Plus className="text-gray-600 group-hover:text-emerald-600" size={18} />
                  )}
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-6 pb-6 pt-0">
                  <div className="h-px bg-gradient-to-r from-emerald-500/20 via-emerald-500/40 to-emerald-500/20 mb-4"></div>
                  <p className="text-gray-700 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div> 
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 md:p-10 border border-emerald-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Can't find the answer you're looking for? Our friendly support team is ready to help you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 flex items-center gap-2">
                <Mail size={20} />
                Contact Support
              </button>
              <button className="px-6 py-3 border-2 border-emerald-500 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors flex items-center gap-2">
                Browse All FAQs
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;