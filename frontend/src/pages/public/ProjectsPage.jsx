import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get(`${API}/projects`).then(res => setProjects(res.data)).catch(console.error);
  }, []);

  const sectors = ['all', 'agriculture', 'education', 'health', 'wash'];
  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.sector === filter);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-[#0a1628] text-white py-24 relative noise-overlay">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Our Work</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
              Projects & Case Studies
            </h1>
            <p className="text-white/80 max-w-2xl">
              Explore our portfolio of research projects delivered for leading development 
              organizations across Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Projects */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-12">
            {sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => setFilter(sector)}
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all ${
                  filter === sector 
                    ? 'bg-[#0a1628] text-white' 
                    : 'bg-[#f8fafc] text-[#64748b] hover:bg-[#e2e8f0]'
                }`}
              >
                {sector}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-[#e2e8f0] p-8 hover:border-l-4 hover:border-l-[#e63946] hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#2a9d8f] bg-[#2a9d8f]/10 px-2 py-1">
                    {project.sector}
                  </span>
                  <span className="text-xs text-[#64748b]">{project.year}</span>
                </div>
                <h3 className="text-lg font-bold text-[#0a1628] mb-3 font-serif">{project.title}</h3>
                <p className="text-[#64748b] text-sm mb-4">{project.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-[#64748b]" />
                  <span className="text-[#0a1628] font-medium">{project.client}</span>
                </div>
                <div className="flex items-center gap-2 text-sm mt-2">
                  <MapPin className="w-4 h-4 text-[#64748b]" />
                  <span className="text-[#64748b]">{project.country}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <p className="text-center text-[#64748b] py-12">No projects found in this category.</p>
          )}
        </div>
      </section>
    </div>
  );
};


export default ProjectsPage;
