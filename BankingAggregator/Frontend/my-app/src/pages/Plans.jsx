import React from 'react';

const Plans = () => {
  const plans = [
    {
      name: "Basic",
      price: "$0",
      period: "month",
      features: [
        "Up to 3 bank accounts",
        "Basic transaction history",
        "Email support",
        "Standard security"
      ],
      popular: false
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "month",
      features: [
        "Unlimited bank accounts",
        "Advanced analytics",
        "Priority support",
        "Enhanced security",
        "Budget planning tools",
        "Export capabilities"
      ],
      popular: true
    },
    {
      name: "Business",
      price: "$29.99",
      period: "month",
      features: [
        "All Premium features",
        "Multi-user access",
        "API access",
        "Custom reporting",
        "Dedicated account manager",
        "SLA guarantee"
      ],
      popular: false
    }
  ];

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Plans & Pricing</h1>
      </div>

      <div className="row justify-content-center">
        {plans.map((plan, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className={`card h-100 ${plan.popular ? 'border-primary' : ''}`}>
              {plan.popular && (
                <div className="card-header bg-primary text-white text-center">
                  Most Popular
                </div>
              )}
              <div className="card-body text-center">
                <h3 className="card-title">{plan.name}</h3>
                <div className="my-3">
                  <span className="h1">${plan.price}</span>
                  <span className="text-muted">/{plan.period}</span>
                </div>
                <ul className="list-unstyled mb-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="mb-2">
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
                <button className={`btn btn-${plan.popular ? 'primary' : 'outline-primary'} w-100`}>
                  Get Started
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;