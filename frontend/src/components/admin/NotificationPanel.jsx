import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, X, Check, AlertCircle, UserPlus, DollarSign, Briefcase, Package, Activity, CheckCircle } from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

// Notification type icons
const NOTIFICATION_ICONS = {
  expert_registration: UserPlus,
  user_signup: UserPlus,
  job_application: Briefcase,
  new_lead: DollarSign,
  project_update: Package,
  payment_received: DollarSign,
  expert_verified: CheckCircle,
  system_alert: AlertCircle,
  test: Activity,
  default: Bell
};

// Notification type colors
const NOTIFICATION_COLORS = {
  expert_registration: 'bg-blue-100 text-blue-600',
  user_signup: 'bg-emerald-100 text-emerald-600',
  job_application: 'bg-purple-100 text-purple-600',
  new_lead: 'bg-amber-100 text-amber-600',
  project_update: 'bg-teal-100 text-teal-600',
  payment_received: 'bg-green-100 text-green-600',
  expert_verified: 'bg-indigo-100 text-indigo-600',
  system_alert: 'bg-red-100 text-red-600',
  test: 'bg-slate-100 text-slate-600',
  default: 'bg-slate-100 text-slate-600'
};

// Priority colors for badges
const PRIORITY_COLORS = {
  low: 'bg-slate-100 text-slate-600',
  normal: 'bg-blue-100 text-blue-600',
  high: 'bg-amber-100 text-amber-700',
  urgent: 'bg-red-100 text-red-700'
};

const NotificationPanel = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const panelRef = useRef(null);

  // Format time ago
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Connect to WebSocket
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    // Construct WebSocket URL from API URL
    const wsProtocol = API?.startsWith('https') ? 'wss' : 'ws';
    const wsHost = API?.replace(/^https?:\/\//, '') || window.location.host;
    const wsUrl = `${wsProtocol}://${wsHost}/ws/notifications`;

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        
        // Authenticate with token
        if (token) {
          wsRef.current.send(JSON.stringify({ type: 'auth', token }));
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'notification') {
            // Add new notification to the list
            setNotifications(prev => [
              { ...data, id: Date.now(), read: false },
              ...prev.slice(0, 49) // Keep max 50 notifications
            ]);
            setUnreadCount(prev => prev + 1);
            
            // Play notification sound (optional)
            // new Audio('/notification.mp3').play().catch(() => {});
          } else if (data.type === 'auth') {
            console.log('WebSocket auth:', data.status);
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    } catch (e) {
      console.error('Error creating WebSocket:', e);
    }
  }, [token]);

  // Initialize WebSocket connection
  useEffect(() => {
    connectWebSocket();

    // Send periodic ping to keep connection alive
    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Get icon for notification type
  const getIcon = (type) => {
    return NOTIFICATION_ICONS[type] || NOTIFICATION_ICONS.default;
  };

  // Get color for notification type
  const getColor = (type) => {
    return NOTIFICATION_COLORS[type] || NOTIFICATION_COLORS.default;
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors"
        data-testid="notification-bell"
      >
        <Bell className={`w-5 h-5 ${isConnected ? 'text-white' : 'text-slate-400'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-xs font-bold bg-red-500 text-white rounded-full px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {/* Connection indicator */}
        <span className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}`} />
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 max-h-[70vh] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-slate-700" />
              <h3 className="font-semibold text-slate-800">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mark all read
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No notifications yet</p>
                <p className="text-slate-400 text-xs mt-1">
                  {isConnected ? 'Real-time updates enabled' : 'Connecting...'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => {
                  const Icon = getIcon(notification.notification_type);
                  const colorClass = getColor(notification.notification_type);
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-medium ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                              {notification.title}
                            </p>
                            {notification.priority && notification.priority !== 'normal' && (
                              <span className={`text-xs px-1.5 py-0.5 rounded ${PRIORITY_COLORS[notification.priority]}`}>
                                {notification.priority}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">
                            {notification.description}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}`} />
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
              <button
                onClick={() => {
                  if (wsRef.current) wsRef.current.close();
                  connectWebSocket();
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                Reconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
