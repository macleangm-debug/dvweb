import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder - original file backed up due to babel issues
const ServicesHubPageRedesigned = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Services Hub</h1>
        <p className="text-gray-600 mb-8">Our comprehensive research and data services</p>
        <Link to="/services" className="text-blue-600 hover:underline">View Services →</Link>
      </div>
    </div>
  );
};

export default ServicesHubPageRedesigned;
