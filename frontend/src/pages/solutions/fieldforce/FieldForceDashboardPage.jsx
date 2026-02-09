import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderOpen,
  ClipboardList,
  FileText,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { FieldForceAppLayout } from './FieldForceAppLayout';

const API = `${process.env.REACT_APP_BACKEND_URL}/api/fieldforce`;

export const FieldForceDashboardPage = () => {
  const [stats, setStats] = useState({ projects: 0, forms: 0, submissions: 0, enumerators: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('fieldforce_token');
    try {
      const [statsRes, activityRes] = await Promise.all([
        axios.get(`${API}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/dashboard/recent-activity`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setStats(statsRes.data);
      setRecentActivity(activityRes.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Projects', value: stats.projects, icon: FolderOpen, color: 'bg-blue-500', link: '/solutions/fieldforce/app/projects' },
    { label: 'Forms', value: stats.forms, icon: ClipboardList, color: 'bg-teal-500', link: '/solutions/fieldforce/app/forms' },
    { label: 'Submissions', value: stats.submissions, icon: FileText, color: 'bg-purple-500', link: '/solutions/fieldforce/app/submissions' },
    { label: 'Team Members', value: stats.enumerators, icon: Users, color: 'bg-orange-500', link: '/solutions/fieldforce/app/team' }
  ];

  return (
    <FieldForceAppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white" data-testid="ff-dashboard-title">Dashboard</h1>
            <p className="text-white/60 text-sm">Welcome back to FieldForce</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/solutions/fieldforce/app/projects"
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              data-testid="ff-new-project-btn"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={stat.link}
                className="block bg-[#1e293b] rounded-xl p-6 hover:bg-[#1e293b]/80 transition-colors group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 ${stat.color}/20 rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {loading ? '...' : stat.value}
                </div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-[#1e293b] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/solutions/fieldforce/app/forms"
                className="bg-white/5 hover:bg-white/10 rounded-lg p-4 flex flex-col items-center text-center transition-colors"
              >
                <ClipboardList className="w-8 h-8 text-teal-400 mb-2" />
                <span className="text-white text-sm font-medium">Create Form</span>
              </Link>
              <Link
                to="/solutions/fieldforce/app/submissions"
                className="bg-white/5 hover:bg-white/10 rounded-lg p-4 flex flex-col items-center text-center transition-colors"
              >
                <FileText className="w-8 h-8 text-purple-400 mb-2" />
                <span className="text-white text-sm font-medium">View Data</span>
              </Link>
              <Link
                to="/solutions/fieldforce/app/map"
                className="bg-white/5 hover:bg-white/10 rounded-lg p-4 flex flex-col items-center text-center transition-colors"
              >
                <MapPin className="w-8 h-8 text-blue-400 mb-2" />
                <span className="text-white text-sm font-medium">GPS Map</span>
              </Link>
              <Link
                to="/solutions/fieldforce/app/team"
                className="bg-white/5 hover:bg-white/10 rounded-lg p-4 flex flex-col items-center text-center transition-colors"
              >
                <Users className="w-8 h-8 text-orange-400 mb-2" />
                <span className="text-white text-sm font-medium">Manage Team</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#1e293b] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Submissions</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/60 text-sm">No submissions yet</p>
                <p className="text-white/40 text-xs mt-1">Create a form and start collecting data</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={activity.id || index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">Submission #{activity.id?.slice(-6) || 'N/A'}</p>
                      <p className="text-white/50 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(activity.submitted_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Getting Started Guide (if no data) */}
        {!loading && stats.projects === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-2">Getting Started</h2>
            <p className="text-white/70 text-sm mb-4">
              Welcome to FieldForce! Follow these steps to start collecting data in the field.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-teal-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-400 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">Create a Project</h3>
                  <p className="text-white/60 text-xs">Organize your data collection by project</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-teal-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-400 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">Build a Form</h3>
                  <p className="text-white/60 text-xs">Design your survey with our form builder</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-teal-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-400 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">Collect Data</h3>
                  <p className="text-white/60 text-xs">Deploy to field teams and monitor progress</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </FieldForceAppLayout>
  );
};

export default FieldForceDashboardPage;
