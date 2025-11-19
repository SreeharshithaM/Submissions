import React from 'react';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "John Smith",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      description: "20+ years in banking technology"
    },
    {
      name: "Sarah Johnson",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      description: "Fintech innovation expert"
    },
    {
      name: "Mike Chen",
      role: "Head of Security",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      description: "Cybersecurity specialist"
    }
  ];

  const officeImages = [
    {
      id: 1,
      title: "Office 1 - Headquarters",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=400&fit=crop",
      description: "Our main headquarters in downtown"
    },
    {
      id: 2,
      title: "Office 2 - Tech Center", 
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      description: "Technology and innovation hub"
    },
    {
      id: 3,
      title: "Office 3 - Operations",
      image: "https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=600&h=400&fit=crop",
      description: "Central operations facility"
    },
    {
      id: 4,
      title: "Office 4 - Customer Center",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
      description: "24/7 customer support center"
    },
    {
      id: 5,
      title: "Office 5 - Regional Branch",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
      description: "Regional branch office"
    },
    {
      id: 6,
      title: "Office 6 - Innovation Lab",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop",
      description: "Research and development lab"
    }
  ];

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">About Us</h1>
      </div>

      <div className="row">
        <div className="col-md-12">
          {/* Mission Section */}
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title">Our Mission</h3>
              <p className="card-text">
                BankAggregator is revolutionizing the way people manage their finances by bringing 
                all banking services to one secure platform. We believe in making banking simple, 
                transparent, and accessible to everyone.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title">Our Team</h3>
              <div className="row">
                {teamMembers.map((member, index) => (
                  <div key={index} className="col-md-4 mb-3">
                    <div className="card text-center h-100">
                      <img 
                        src={member.image} 
                        className="card-img-top rounded-circle mx-auto mt-3" 
                        alt={member.name}
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{member.name}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{member.role}</h6>
                        <p className="card-text">{member.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image Gallery Section */}
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Office Gallery</h3>
              <p className="card-text text-muted mb-4">
                Explore our modern office spaces across different locations
              </p>
              <div className="row">
                {officeImages.map((office) => (
                  <div key={office.id} className="col-md-4 mb-4">
                    <div className="card h-100">
                      <img 
                        src={office.image} 
                        className="card-img-top" 
                        alt={office.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h6 className="card-title">{office.title}</h6>
                        <p className="card-text small text-muted">{office.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;