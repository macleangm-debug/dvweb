import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit2, Trash2, Save, X, Upload, Image, 
  Bold, Italic, List, Link as LinkIcon, Eye, EyeOff,
  FileText, Users, Briefcase, MessageSquare, Home,
  ChevronDown, ChevronRight, GripVertical, Search
} from 'lucide-react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL;

// Simple WYSIWYG Editor Component
const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) execCommand('createLink', url);
          }}
          className="p-2 hover:bg-gray-200 rounded"
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <select
          onChange={(e) => execCommand('formatBlock', e.target.value)}
          className="px-2 py-1 text-sm border rounded"
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
        </select>
      </div>
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] p-4 focus:outline-none prose prose-sm max-w-none"
        onInput={(e) => onChange(e.target.innerHTML)}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

// Image Upload Component
const ImageUpload = ({ value, onChange, label }) => {
  const [preview, setPreview] = useState(value);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // For now, use base64. In production, upload to cloud storage
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onChange(reader.result);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => { setPreview(''); onChange(''); }}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
            <Upload className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">Upload</span>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
        )}
        {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
      </div>
    </div>
  );
};

// Content Type Editors
const HomepageEditor = ({ content, onSave }) => {
  const [data, setData] = useState(content || {
    heroTitle: '',
    heroSubtitle: '',
    stats: [
      { label: 'Years of Excellence', value: '25+' },
      { label: 'Projects Completed', value: '183+' },
      { label: 'African Countries', value: '4+' },
      { label: 'Partner Organizations', value: '9+' }
    ]
  });

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
        <input
          type="text"
          value={data.heroTitle}
          onChange={(e) => setData({ ...data, heroTitle: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Data-Driven Insights Driving Global Impact"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
        <textarea
          value={data.heroSubtitle}
          onChange={(e) => setData({ ...data, heroSubtitle: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Leading data analytics, research, and development consultancy..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Statistics</label>
        <div className="grid grid-cols-2 gap-4">
          {data.stats.map((stat, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={stat.value}
                onChange={(e) => {
                  const newStats = [...data.stats];
                  newStats[index].value = e.target.value;
                  setData({ ...data, stats: newStats });
                }}
                className="w-24 px-3 py-2 border rounded-lg"
                placeholder="Value"
              />
              <input
                type="text"
                value={stat.label}
                onChange={(e) => {
                  const newStats = [...data.stats];
                  newStats[index].label = e.target.value;
                  setData({ ...data, stats: newStats });
                }}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="Label"
              />
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => onSave(data)}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <Save className="w-4 h-4" /> Save Changes
      </button>
    </div>
  );
};

const TeamMemberEditor = ({ member, onSave, onCancel }) => {
  const [data, setData] = useState(member || {
    name: '',
    role: '',
    bio: '',
    image: '',
    linkedin: '',
    email: '',
    order: 0,
    published: true
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <input
            type="text"
            value={data.role}
            onChange={(e) => setData({ ...data, role: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Senior Research Analyst"
          />
        </div>
      </div>
      <ImageUpload
        value={data.image}
        onChange={(url) => setData({ ...data, image: url })}
        label="Profile Photo"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <RichTextEditor
          value={data.bio}
          onChange={(html) => setData({ ...data, bio: html })}
          placeholder="Write a short bio..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
          <input
            type="url"
            value={data.linkedin}
            onChange={(e) => setData({ ...data, linkedin: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          checked={data.published}
          onChange={(e) => setData({ ...data, published: e.target.checked })}
          className="rounded"
        />
        <label htmlFor="published" className="text-sm text-gray-700">Published</label>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave(data)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const ProjectEditor = ({ project, onSave, onCancel }) => {
  const [data, setData] = useState(project || {
    title: '',
    client: '',
    sector: '',
    year: new Date().getFullYear(),
    location: '',
    description: '',
    challenge: '',
    solution: '',
    results: '',
    image: '',
    featured: false,
    published: true
  });

  const sectors = ['Agriculture', 'Education', 'Health', 'WASH', 'Governance', 'Climate', 'Economic Development'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
          <input
            type="text"
            value={data.client}
            onChange={(e) => setData({ ...data, client: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="World Bank, USAID, etc."
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
          <select
            value={data.sector}
            onChange={(e) => setData({ ...data, sector: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select sector</option>
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            type="number"
            value={data.year}
            onChange={(e) => setData({ ...data, year: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => setData({ ...data, location: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Tanzania, Kenya, etc."
          />
        </div>
      </div>
      <ImageUpload
        value={data.image}
        onChange={(url) => setData({ ...data, image: url })}
        label="Project Image"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <RichTextEditor
          value={data.description}
          onChange={(html) => setData({ ...data, description: html })}
          placeholder="Project overview..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Challenge</label>
        <RichTextEditor
          value={data.challenge}
          onChange={(html) => setData({ ...data, challenge: html })}
          placeholder="What challenge did this project address?"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Solution</label>
        <RichTextEditor
          value={data.solution}
          onChange={(html) => setData({ ...data, solution: html })}
          placeholder="How did we solve it?"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Results</label>
        <RichTextEditor
          value={data.results}
          onChange={(html) => setData({ ...data, results: html })}
          placeholder="Key outcomes and impact..."
        />
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.featured}
            onChange={(e) => setData({ ...data, featured: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Featured on homepage</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.published}
            onChange={(e) => setData({ ...data, published: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Published</span>
        </label>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave(data)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const BlogPostEditor = ({ post, onSave, onCancel }) => {
  const [data, setData] = useState(post || {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    tags: [],
    image: '',
    published: false,
    publishedAt: ''
  });

  const categories = ['Research', 'Technology', 'Industry Insights', 'Company News', 'Case Studies'];

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => setData({ 
            ...data, 
            title: e.target.value,
            slug: data.slug || generateSlug(e.target.value)
          })}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
          <input
            type="text"
            value={data.slug}
            onChange={(e) => setData({ ...data, slug: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={data.category}
            onChange={(e) => setData({ ...data, category: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <ImageUpload
        value={data.image}
        onChange={(url) => setData({ ...data, image: url })}
        label="Featured Image"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
        <textarea
          value={data.excerpt}
          onChange={(e) => setData({ ...data, excerpt: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          rows={2}
          placeholder="Brief summary for previews..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <RichTextEditor
          value={data.content}
          onChange={(html) => setData({ ...data, content: html })}
          placeholder="Write your article..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
          <input
            type="text"
            value={data.author}
            onChange={(e) => setData({ ...data, author: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
          <input
            type="text"
            value={data.tags.join(', ')}
            onChange={(e) => setData({ ...data, tags: e.target.value.split(',').map(t => t.trim()) })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.published}
            onChange={(e) => setData({ 
              ...data, 
              published: e.target.checked,
              publishedAt: e.target.checked ? new Date().toISOString() : ''
            })}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Publish immediately</span>
        </label>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave(data)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const TestimonialEditor = ({ testimonial, onSave, onCancel }) => {
  const [data, setData] = useState(testimonial || {
    quote: '',
    author: '',
    role: '',
    company: '',
    image: '',
    product: 'general',
    published: true
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
        <textarea
          value={data.quote}
          onChange={(e) => setData({ ...data, quote: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          rows={3}
          placeholder="Customer testimonial..."
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
          <input
            type="text"
            value={data.author}
            onChange={(e) => setData({ ...data, author: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <input
            type="text"
            value={data.role}
            onChange={(e) => setData({ ...data, role: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input
            type="text"
            value={data.company}
            onChange={(e) => setData({ ...data, company: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>
      <ImageUpload
        value={data.image}
        onChange={(url) => setData({ ...data, image: url })}
        label="Photo (optional)"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Show on</label>
        <select
          value={data.product}
          onChange={(e) => setData({ ...data, product: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="general">General / Homepage</option>
          <option value="fieldforce">FieldForce</option>
          <option value="survey360">Survey360</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave(data)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Main CMS Content Manager Component
const CMSContentManager = () => {
  const [activeSection, setActiveSection] = useState('homepage');
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    { id: 'homepage', label: 'Homepage', icon: Home },
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'blog', label: 'Blog / Insights', icon: FileText },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  ];

  useEffect(() => {
    loadContent();
  }, [activeSection]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('dv_token');
      const response = await axios.get(`${API}/api/cms/content/${activeSection}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error loading content:', error);
      // Use mock data for demonstration
      setItems(getMockData(activeSection));
    }
    setLoading(false);
  };

  const getMockData = (section) => {
    const mockData = {
      homepage: [{ id: 1, type: 'homepage', heroTitle: 'Data-Driven Insights', heroSubtitle: 'Leading consultancy...' }],
      team: [
        { id: 1, name: 'Dr. John Mwangi', role: 'CEO & Founder', published: true },
        { id: 2, name: 'Sarah Ochieng', role: 'Director of Research', published: true },
      ],
      projects: [
        { id: 1, title: 'Agricultural Survey Tanzania', client: 'World Bank', sector: 'Agriculture', year: 2024, published: true },
        { id: 2, title: 'Health Systems Assessment', client: 'USAID', sector: 'Health', year: 2024, published: true },
      ],
      blog: [
        { id: 1, title: 'The Future of Data Collection in Africa', category: 'Technology', published: true, publishedAt: '2024-01-15' },
        { id: 2, title: '2024 Research Trends', category: 'Research', published: false },
      ],
      testimonials: [
        { id: 1, author: 'Dr. Sarah Mwangi', company: 'World Bank', quote: 'Excellent research partner...', published: true },
      ],
    };
    return mockData[section] || [];
  };

  const handleSave = async (data) => {
    try {
      const token = localStorage.getItem('dv_token');
      if (editing?.id) {
        await axios.put(`${API}/api/cms/content/${activeSection}/${editing.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API}/api/cms/content/${activeSection}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      loadContent();
      setEditing(null);
    } catch (error) {
      console.error('Error saving:', error);
      // For demo, just update local state
      if (editing?.id) {
        setItems(items.map(i => i.id === editing.id ? { ...i, ...data } : i));
      } else {
        setItems([...items, { ...data, id: Date.now() }]);
      }
      setEditing(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const token = localStorage.getItem('dv_token');
      await axios.delete(`${API}/api/cms/content/${activeSection}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadContent();
    } catch (error) {
      // For demo
      setItems(items.filter(i => i.id !== id));
    }
  };

  const renderEditor = () => {
    if (!editing) return null;

    const editors = {
      homepage: <HomepageEditor content={editing} onSave={handleSave} />,
      team: <TeamMemberEditor member={editing.id ? editing : null} onSave={handleSave} onCancel={() => setEditing(null)} />,
      projects: <ProjectEditor project={editing.id ? editing : null} onSave={handleSave} onCancel={() => setEditing(null)} />,
      blog: <BlogPostEditor post={editing.id ? editing : null} onSave={handleSave} onCancel={() => setEditing(null)} />,
      testimonials: <TestimonialEditor testimonial={editing.id ? editing : null} onSave={handleSave} onCancel={() => setEditing(null)} />,
    };

    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">
          {editing.id ? 'Edit' : 'Add New'} {sections.find(s => s.id === activeSection)?.label.slice(0, -1) || 'Item'}
        </h3>
        {editors[activeSection]}
      </div>
    );
  };

  const filteredItems = items.filter(item => {
    const searchable = [item.name, item.title, item.author, item.company].filter(Boolean).join(' ').toLowerCase();
    return searchable.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 flex-wrap">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => { setActiveSection(section.id); setEditing(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSection === section.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {editing ? (
        renderEditor()
      ) : (
        <div className="bg-white rounded-lg border">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>
            {activeSection !== 'homepage' && (
              <button
                onClick={() => setEditing({})}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" /> Add New
              </button>
            )}
          </div>

          {/* Items List */}
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No items yet. Click "Add New" to create one.
            </div>
          ) : (
            <div className="divide-y">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    {activeSection !== 'homepage' && (
                      <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.name || item.title || item.author || 'Homepage Content'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.role || item.client || item.category || item.company || ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.published !== undefined && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.published ? 'Published' : 'Draft'}
                      </span>
                    )}
                    <button
                      onClick={() => setEditing(item)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {activeSection !== 'homepage' && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CMSContentManager;
