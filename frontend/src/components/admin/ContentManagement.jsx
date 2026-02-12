import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FileText, Image, Users, MessageSquare, Award, Plus, Search, Filter,
  MoreVertical, Eye, Edit, Trash2, Calendar, Clock, Globe, Tag,
  ChevronRight, Upload, Bold, Italic, Link, List, AlignLeft
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

const ContentManagement = ({ subSection }) => {
  const [content, setContent] = useState({});
  const [news, setNews] = useState([]);
  const [team, setTeam] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [partners, setPartners] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    // Mock data
    setNews([
      {
        id: 1,
        title: 'DataVision Partners with World Bank for Agricultural Data Initiative',
        excerpt: 'Major partnership announced to transform agricultural data collection across East Africa...',
        content: 'Full article content...',
        author: 'John Kimani',
        category: 'Partnership',
        status: 'published',
        publishedDate: '2024-02-10',
        views: 1245,
        image: '/api/placeholder/800/400'
      },
      {
        id: 2,
        title: 'Survey360 Launches New AI-Powered Quality Monitoring',
        excerpt: 'Revolutionary feature uses machine learning to ensure data integrity in real-time...',
        content: 'Full article content...',
        author: 'Sarah Odhiambo',
        category: 'Product Update',
        status: 'published',
        publishedDate: '2024-02-08',
        views: 892,
        image: '/api/placeholder/800/400'
      },
      {
        id: 3,
        title: 'DataVision Expands to Rwanda and Uganda',
        excerpt: 'Company announces expansion plans with new offices in Kigali and Kampala...',
        content: 'Full article content...',
        author: 'Peter Mwangi',
        category: 'Company News',
        status: 'draft',
        publishedDate: null,
        views: 0,
        image: '/api/placeholder/800/400'
      },
    ]);

    setTeam([
      { id: 1, name: 'Dr. John Kimani', role: 'CEO & Founder', image: '/api/placeholder/200/200', bio: 'Over 20 years in data analytics...' },
      { id: 2, name: 'Sarah Odhiambo', role: 'CTO', image: '/api/placeholder/200/200', bio: 'Tech leader with expertise in...' },
      { id: 3, name: 'Peter Mwangi', role: 'Head of Research', image: '/api/placeholder/200/200', bio: 'PhD in Statistics from...' },
    ]);

    setTestimonials([
      { id: 1, name: 'Jane Smith', role: 'Program Director', company: 'World Bank', content: 'DataVision transformed our data collection...', rating: 5 },
      { id: 2, name: 'Mark Johnson', role: 'M&E Specialist', company: 'UNICEF', content: 'Survey360 has been invaluable...', rating: 5 },
    ]);

    setPartners([
      { id: 1, name: 'World Bank', logo: '/api/placeholder/200/80', type: 'Client' },
      { id: 2, name: 'UNICEF', logo: '/api/placeholder/200/80', type: 'Client' },
      { id: 3, name: 'GIZ', logo: '/api/placeholder/200/80', type: 'Partner' },
    ]);
  }, []);

  const ArticleEditor = ({ article, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">{article ? 'Edit Article' : 'Create New Article'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <Trash2 className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
            <input 
              type="text" 
              defaultValue={article?.title}
              className="w-full px-4 py-3 text-lg border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
              placeholder="Enter article title..."
            />
          </div>

          {/* Meta */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select className="w-full px-4 py-2 border border-slate-200 rounded-lg">
                <option>Company News</option>
                <option>Product Update</option>
                <option>Partnership</option>
                <option>Industry Insights</option>
                <option>Case Study</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Author</label>
              <select className="w-full px-4 py-2 border border-slate-200 rounded-lg">
                <option>John Kimani</option>
                <option>Sarah Odhiambo</option>
                <option>Peter Mwangi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select className="w-full px-4 py-2 border border-slate-200 rounded-lg">
                <option>Draft</option>
                <option>Published</option>
                <option>Scheduled</option>
              </select>
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Featured Image</label>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-slate-400 cursor-pointer">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Excerpt</label>
            <textarea 
              rows={2}
              defaultValue={article?.excerpt}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
              placeholder="Brief summary of the article..."
            />
          </div>

          {/* WYSIWYG Editor */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              {/* Toolbar */}
              <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center gap-1">
                <button className="p-2 hover:bg-slate-200 rounded"><Bold className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-slate-200 rounded"><Italic className="w-4 h-4" /></button>
                <div className="w-px h-6 bg-slate-300 mx-1"></div>
                <button className="p-2 hover:bg-slate-200 rounded"><Link className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-slate-200 rounded"><Image className="w-4 h-4" /></button>
                <div className="w-px h-6 bg-slate-300 mx-1"></div>
                <button className="p-2 hover:bg-slate-200 rounded"><List className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-slate-200 rounded"><AlignLeft className="w-4 h-4" /></button>
              </div>
              <textarea 
                rows={12}
                defaultValue={article?.content}
                className="w-full px-4 py-3 focus:outline-none resize-none"
                placeholder="Write your article content here..."
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
              placeholder="Add tags separated by commas..."
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex items-center justify-between">
          <button className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">
            Save as Draft
          </button>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">
              Cancel
            </button>
            <button className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800">
              Publish Article
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNewsArticles = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">News & Articles</h2>
        <button 
          onClick={() => { setEditingItem(null); setShowEditor(true); }}
          className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Articles</p>
          <p className="text-2xl font-bold text-slate-900">{news.length}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-sm text-emerald-600">Published</p>
          <p className="text-2xl font-bold text-emerald-700">{news.filter(n => n.status === 'published').length}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-600">Drafts</p>
          <p className="text-2xl font-bold text-amber-700">{news.filter(n => n.status === 'draft').length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-600">Total Views</p>
          <p className="text-2xl font-bold text-blue-700">{news.reduce((sum, n) => sum + n.views, 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="px-3 py-1.5 text-sm bg-slate-900 text-white rounded-lg">All</button>
            <button className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Published</button>
            <button className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Drafts</button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search articles..." className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg" />
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {news.map(article => (
            <div key={article.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start gap-4">
                <div className="w-32 h-20 bg-slate-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 hover:text-red-500 cursor-pointer">{article.title}</h3>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{article.excerpt}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      article.status === 'published' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {article.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {article.author}</span>
                    <span className="flex items-center gap-1"><Tag className="w-4 h-4" /> {article.category}</span>
                    {article.publishedDate && (
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {article.publishedDate}</span>
                    )}
                    <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {article.views} views</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setEditingItem(article); setShowEditor(true); }}
                    className="p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <Edit className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg">
                    <Trash2 className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showEditor && <ArticleEditor article={editingItem} onClose={() => setShowEditor(false)} />}
    </div>
  );

  const renderTeamMembers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Team Members</h2>
        <button className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map(member => (
          <div key={member.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xl font-bold">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{member.name}</h3>
                <p className="text-sm text-slate-500">{member.role}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-4">{member.bio}</p>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
              <button className="flex-1 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Edit</button>
              <button className="p-2 hover:bg-slate-100 rounded-lg">
                <Trash2 className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTestimonials = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Testimonials</h2>
        <button className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="space-y-4">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{testimonial.name}</h3>
                  <p className="text-sm text-slate-500">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Award key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                ))}
              </div>
            </div>
            <p className="text-slate-600 mt-4 italic">"{testimonial.content}"</p>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
              <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Edit</button>
              <button className="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPartners = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Partners & Client Logos</h2>
        <button className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Logo
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {partners.map(partner => (
          <div key={partner.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg transition-shadow group">
            <div className="h-16 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-slate-400 text-sm">{partner.name}</span>
            </div>
            <p className="text-sm font-medium text-slate-900 text-center">{partner.name}</p>
            <p className="text-xs text-slate-500 text-center">{partner.type}</p>
            <div className="flex items-center justify-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 hover:bg-slate-100 rounded"><Edit className="w-3 h-3 text-slate-400" /></button>
              <button className="p-1.5 hover:bg-slate-100 rounded"><Trash2 className="w-3 h-3 text-slate-400" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (subSection) {
      case 'news':
        return renderNewsArticles();
      case 'team':
        return renderTeamMembers();
      case 'testimonials':
        return renderTestimonials();
      case 'partners':
        return renderPartners();
      case 'pages':
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Page Content Manager</h2>
            <p className="text-slate-500">Select a specific content type from the sidebar to manage.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'News & Articles', count: news.length, icon: FileText, sub: 'news' },
                { label: 'Team Members', count: team.length, icon: Users, sub: 'team' },
                { label: 'Testimonials', count: testimonials.length, icon: MessageSquare, sub: 'testimonials' },
                { label: 'Partners & Logos', count: partners.length, icon: Award, sub: 'partners' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <item.icon className="w-8 h-8 text-slate-400" />
                    <span className="text-2xl font-bold text-slate-900">{item.count}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900">{item.label}</h3>
                  <button className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 mt-2">
                    Manage <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Content Management</h1>
        <p className="text-slate-500 mt-1">Manage your website content, news, and media</p>
      </div>
      {renderContent()}
    </div>
  );
};

export default ContentManagement;
