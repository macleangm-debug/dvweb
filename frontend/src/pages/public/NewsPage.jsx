import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ArrowRight, Calendar } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const NewsPage = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios.get(`${API}/news`).then(res => setNews(res.data)).catch(console.error);
  }, []);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-[#f8fafc] py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Latest Updates</p>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0a1628] font-serif">
              News & Insights
            </h1>
          </motion.div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-[#e2e8f0] hover:border-l-4 hover:border-l-[#e63946] hover:shadow-lg transition-all"
              >
                <div className="p-8">
                  <p className="text-xs text-[#64748b] mb-3">
                    {new Date(article.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <h3 className="text-lg font-bold text-[#0a1628] mb-3 font-serif">{article.title}</h3>
                  <p className="text-[#64748b] text-sm">{article.excerpt}</p>
                </div>
              </motion.article>
            ))}
          </div>

          {news.length === 0 && (
            <p className="text-center text-[#64748b] py-12">No news articles available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

// Contact Page

export default NewsPage;
