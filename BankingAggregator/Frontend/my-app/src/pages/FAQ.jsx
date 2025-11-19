import React, { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How secure is BankAggregator?",
      answer: "We use bank-level encryption and security protocols. All data is encrypted in transit and at rest. We never store your banking passwords."
    },
    {
      question: "Which banks are supported?",
      answer: "We support most major banks and financial institutions. You can connect accounts from over 10,000 banks worldwide."
    },
    {
      question: "Is there a mobile app?",
      answer: "Yes! Our mobile app is available for both iOS and Android devices with all the features of our web platform."
    },
    {
      question: "How much does it cost?",
      answer: "We offer a free basic plan with premium features starting at $9.99/month. See our Plans page for full details."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Frequently Asked Questions</h1>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="accordion" id="faqAccordion">
            {faqs.map((faq, index) => (
              <div key={index} className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${activeIndex === index ? '' : 'collapsed'}`}
                    type="button"
                    onClick={() => toggleFAQ(index)}
                  >
                    {faq.question}
                  </button>
                </h2>
                <div className={`accordion-collapse collapse ${activeIndex === index ? 'show' : ''}`}>
                  <div className="accordion-body">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card mt-4">
            <div className="card-body text-center">
              <h5>Still have questions?</h5>
              <p>Contact our support team for assistance.</p>
              <a href="/contact" className="btn btn-primary">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;