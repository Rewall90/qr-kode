import React from 'react';

export function FAQ() {
  const faqs = [
    {
      question: 'What is a QR code?',
      answer: 'A QR code (Quick Response code) is a two-dimensional barcode that can store data such as website URLs, plain text, and other information. When scanned with a smartphone camera or QR code reader, it quickly provides access to the encoded information.'
    },
    {
      question: 'How can I use QR codes?',
      answer: 'QR codes can be used in many ways: sharing website links, business cards, product information, restaurant menus, event tickets, and more. Simply generate a QR code with your desired content and share it digitally or print it for physical use.'
    },
    {
      question: 'How do I scan a QR code?',
      answer: 'Most modern smartphones can scan QR codes directly through their camera app. Simply open your camera, point it at the QR code, and tap the notification that appears. Some devices might require a dedicated QR code scanner app.'
    }
  ];

  return (
    <section className="w-full max-w-2xl mx-auto p-6" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-2xl font-bold text-gray-900 mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {faq.question}
            </h3>
            <p className="text-gray-600">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}