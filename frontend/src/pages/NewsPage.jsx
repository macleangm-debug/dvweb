import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Newspaper, Calendar, ArrowRight, Clock, User } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/news`)
      .then(res => setNews(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-[#0a1628] text-white py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Latest Updates</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">News & Insights</h1>
            <p className="text-white/80 max-w-2xl">
              Stay updated with our latest news, insights, and thought leadership.
            </p>
          </motion.div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-12">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="aspect-video bg-gradient-to-br from-[#e63946]/10 to-[#2a9d8f]/10 flex items-center justify-center">
                    {article.image_url ? (
                      <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                    ) : (
                      <Newspaper className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.published_at || article.created_at).toLocaleDateString()}
                      </div>
                      {article.author && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {article.author}
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#e63946] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3">{article.summary || article.content?.substring(0, 150)}</p>
                    <Link 
                      to={`/insights/${article.slug || article.id}`}
                      className="inline-flex items-center gap-1 text-[#e63946] font-medium text-sm hover:underline"
                    >
                      Read More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
          
          {news.length === 0 && !loading && (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No news articles found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
