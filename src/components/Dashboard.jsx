import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Clock,
  Settings,
  LogOut,
  Bell,
  Search,
  Sun,
  Moon,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Activity,
  Cpu,
  UserCheck,
  Download,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  KeyRound,
  Trash2,
  Edit3
} from 'lucide-react';

export function Dashboard({ onShowToast }) {
  const { currentUser, users, logout, theme, toggleTheme, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'analytics' | 'users' | 'activity' | 'settings'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [timeframe, setTimeframe] = useState('30d'); // '7d' | '30d' | '90d'
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Settings form state
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editRole, setEditRole] = useState(currentUser?.role || '');
  const [editDepartment, setEditDepartment] = useState(currentUser?.department || '');

  // Notifications mock data
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Static Password Login', desc: 'Successful login with static key 1111', time: '2m ago', unread: true },
    { id: 2, title: 'Platform Health Optimal', desc: 'All 8 API microservices operating at 100%', time: '1h ago', unread: true },
    { id: 3, title: 'New Registration', desc: 'New user joined the workspace', time: '3h ago', unread: false }
  ]);

  // Activity events mock data
  const [activities, setActivities] = useState([
    { id: 1, event: 'Session Authenticated', desc: `${currentUser?.name} logged in using static password 1111`, time: 'Just now', type: 'auth' },
    { id: 2, event: 'System Check Completed', desc: 'Latency checks reported normal (38ms avg)', time: '14 minutes ago', type: 'system' },
    { id: 3, event: 'Database Snapshot', desc: 'In-memory client state persisted to localStorage', time: '42 minutes ago', type: 'data' },
    { id: 4, event: 'User Provisioning', desc: 'Alex Morgan verified workspace credentials', time: '2 hours ago', type: 'user' }
  ]);

  // Dynamic Chart Data based on timeframe
  const chartDatasets = {
    '7d': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [32, 45, 52, 68, 74, 86, 94],
      revenue: '$28,450',
      activeUsers: '1,890',
      trafficGrowth: '+24.5%'
    },
    '30d': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      values: [48, 62, 79, 95],
      revenue: '$84,320',
      activeUsers: '2,845',
      trafficGrowth: '+18.4%'
    },
    '90d': {
      labels: ['Month 1', 'Month 2', 'Month 3'],
      values: [120, 185, 240],
      revenue: '$236,800',
      activeUsers: '5,120',
      trafficGrowth: '+32.1%'
    }
  };

  const currentChart = chartDatasets[timeframe];

  // SVG Chart points calculation
  const svgWidth = 600;
  const svgHeight = 200;
  const maxVal = Math.max(...currentChart.values) * 1.15;
  const minVal = Math.min(...currentChart.values) * 0.7;

  const points = currentChart.values.map((val, idx) => {
    const x = (idx / (currentChart.values.length - 1)) * (svgWidth - 60) + 30;
    const y = svgHeight - 30 - ((val - minVal) / (maxVal - minVal)) * (svgHeight - 60);
    return { x, y, value: val, label: currentChart.labels[idx] };
  });

  const pathD = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - 20} L ${points[0].x} ${svgHeight - 20} Z`;

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery.trim()) return users;
    const q = userSearchQuery.toLowerCase();
    return users.filter(
      u => u.name.toLowerCase().includes(q) ||
           u.email.toLowerCase().includes(q) ||
           u.role.toLowerCase().includes(q) ||
           u.username.toLowerCase().includes(q)
    );
  }, [users, userSearchQuery]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      role: editRole,
      department: editDepartment
    });
    if (onShowToast) {
      onShowToast('Profile information successfully updated!', 'success');
    }
  };

  const handleSimulateAction = (actionTitle) => {
    const newAct = {
      id: Date.now(),
      event: actionTitle,
      desc: `Triggered by ${currentUser?.name || 'Administrator'}`,
      time: 'Just now',
      type: 'user'
    };
    setActivities(prev => [newAct, ...prev]);
    if (onShowToast) {
      onShowToast(`Triggered: ${actionTitle}`, 'info');
    }
  };

  const handleResetSessionData = () => {
    if (window.confirm('Reset local demo data to default state?')) {
      localStorage.removeItem('erp_users');
      localStorage.removeItem('erp_current_user');
      localStorage.removeItem('nexus_users');
      localStorage.removeItem('nexus_current_user');
      window.location.reload();
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="dashboard-layout">
      {/* ------------------------------------------------------------------
          SIDEBAR NAVIGATION
          ------------------------------------------------------------------ */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon-box">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="brand-name">ERP</span>
              <span className="brand-version">Portal</span>
            </div>
          </div>
          {sidebarOpen && (
            <button
              type="button"
              className="icon-button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav" aria-label="Main Navigation">
          <div className="sidebar-section-title">Menu</div>
          <button
            type="button"
            className={`nav-item-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
            id="nav-overview"
          >
            <LayoutDashboard className="nav-item-icon" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={`nav-item-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => { setActiveTab('analytics'); setSidebarOpen(false); }}
            id="nav-analytics"
          >
            <TrendingUp className="nav-item-icon" />
            <span>Analytics</span>
            <span className="nav-badge-pill">Live</span>
          </button>

          <button
            type="button"
            className={`nav-item-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => { setActiveTab('users'); setSidebarOpen(false); }}
            id="nav-users"
          >
            <Users className="nav-item-icon" />
            <span>Team & Users</span>
            <span className="nav-badge-pill">{users.length}</span>
          </button>

          <button
            type="button"
            className={`nav-item-btn ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => { setActiveTab('activity'); setSidebarOpen(false); }}
            id="nav-activity"
          >
            <Clock className="nav-item-icon" />
            <span>Activity Log</span>
          </button>

          <div className="sidebar-section-title" style={{ marginTop: '12px' }}>System</div>
          <button
            type="button"
            className={`nav-item-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
            id="nav-settings"
          >
            <Settings className="nav-item-icon" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div 
              className="user-avatar-circle" 
              style={{ backgroundColor: currentUser?.avatarColor || 'var(--primary)' }}
            >
              {currentUser?.avatarInitials || 'US'}
            </div>
            <div className="user-meta-info">
              <div className="user-display-name">{currentUser?.name || 'User'}</div>
              <div className="user-display-role">{currentUser?.role || 'Member'}</div>
            </div>
            <button
              type="button"
              className="btn-sidebar-logout"
              onClick={logout}
              title="Log out"
              id="btn-sidebar-logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------------
          MAIN WORKSPACE
          ------------------------------------------------------------------ */}
      <main className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(prev => !prev)}
              aria-label="Open sidebar menu"
              id="btn-mobile-menu-toggle"
            >
              <Menu size={22} />
            </button>

            <div className="header-search-bar">
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                className="header-search-input"
                placeholder="Search metrics, logs, users..."
                value={userSearchQuery}
                onChange={(e) => {
                  setUserSearchQuery(e.target.value);
                  if (activeTab !== 'users' && e.target.value) {
                    setActiveTab('users');
                  }
                }}
                id="global-search-input"
              />
            </div>
          </div>

          <div className="header-right">
            <div className="status-pill">
              <span className="status-dot-pulse" />
              <span>Static Auth: 1111 Active</span>
            </div>

            <button
              type="button"
              className="icon-button"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              id="btn-dashboard-theme-toggle"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="icon-button"
                onClick={() => setShowNotifications(prev => !prev)}
                title="Notifications"
                id="btn-notifications-toggle"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="notification-count-badge">{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="dropdown-header">
                    <span>Notifications</span>
                    <button
                      type="button"
                      style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer' }}
                      onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                    >
                      Mark all read
                    </button>
                  </div>
                  {notifications.map(item => (
                    <div
                      key={item.id}
                      className={`notification-item ${item.unread ? 'notif-unread' : ''}`}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {item.title}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {item.desc}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {item.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="btn-secondary-action"
              onClick={logout}
              id="btn-header-logout"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </header>

        {/* ----------------------------------------------------------------
            DYNAMIC CONTENT BODY
            ---------------------------------------------------------------- */}
        <div className="dashboard-content animate-fade">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* Welcome Banner */}
              <section className="welcome-banner" aria-labelledby="welcome-heading">
                <div className="welcome-info">
                  <h1 id="welcome-heading">Welcome, {currentUser?.name || 'Administrator'}!</h1>
                  <p>
                    Your security session is authenticated with static password rule <code>1111</code>.
                    Here is an overview of platform performance and team activity.
                  </p>
                </div>
                <div className="welcome-actions">
                  <button
                    type="button"
                    className="btn-secondary-action"
                    onClick={() => handleSimulateAction('Export Analytics PDF')}
                    id="btn-action-export"
                  >
                    <Download size={16} />
                    <span>Export</span>
                  </button>
                  <button
                    type="button"
                    className="btn-secondary-action"
                    style={{ background: 'var(--primary)', color: '#ffffff', borderColor: 'transparent' }}
                    onClick={() => handleSimulateAction('Trigger Quick Deployment')}
                    id="btn-action-deploy"
                  >
                    <Plus size={16} />
                    <span>Quick Action</span>
                  </button>
                </div>
              </section>

              {/* 4 Stat Metric Cards */}
              <section className="metrics-grid" aria-label="Key Performance Indicators">
                <div className="metric-card">
                  <div className="metric-top">
                    <span className="metric-title">Total Revenue</span>
                    <div className="metric-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                      <DollarSign size={20} />
                    </div>
                  </div>
                  <div className="metric-value">{currentChart.revenue}</div>
                  <div className="metric-trend">
                    <span className="trend-pill trend-up">
                      <ArrowUpRight size={14} />
                      {currentChart.trafficGrowth}
                    </span>
                    <span className="trend-caption">vs preceding cycle</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-top">
                    <span className="metric-title">Active Users</span>
                    <div className="metric-icon-wrap" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>
                      <Users size={20} />
                    </div>
                  </div>
                  <div className="metric-value">{currentChart.activeUsers}</div>
                  <div className="metric-trend">
                    <span className="trend-pill trend-up">
                      <ArrowUpRight size={14} />
                      +12.8%
                    </span>
                    <span className="trend-caption">daily active</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-top">
                    <span className="metric-title">Average Latency</span>
                    <div className="metric-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                      <Activity size={20} />
                    </div>
                  </div>
                  <div className="metric-value">38 ms</div>
                  <div className="metric-trend">
                    <span className="trend-pill trend-up">
                      <ArrowDownRight size={14} />
                      -8.4%
                    </span>
                    <span className="trend-caption">faster response</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-top">
                    <span className="metric-title">Registered Accounts</span>
                    <div className="metric-icon-wrap" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                      <UserCheck size={20} />
                    </div>
                  </div>
                  <div className="metric-value">{users.length} Users</div>
                  <div className="metric-trend">
                    <span className="trend-pill trend-up">
                      <ArrowUpRight size={14} />
                      All 1111-ready
                    </span>
                    <span className="trend-caption">in localStorage</span>
                  </div>
                </div>
              </section>

              {/* Chart Grid */}
              <div className="dashboard-grid-2">
                {/* Main Interactive SVG Area Chart */}
                <div className="chart-card">
                  <div className="card-header-row">
                    <div>
                      <h2 className="card-heading-title">Throughput & User Engagement</h2>
                      <p className="card-heading-sub">Dynamic real-time trend analytics</p>
                    </div>
                    <div className="timeframe-pill-group">
                      {['7d', '30d', '90d'].map(tf => (
                        <button
                          key={tf}
                          type="button"
                          className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
                          onClick={() => setTimeframe(tf)}
                        >
                          {tf.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="chart-svg-container">
                    <svg
                      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                      className="chart-svg"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Subtle Grid Lines */}
                      <line x1="30" y1="40" x2={svgWidth - 30} y2="40" stroke="var(--border-subtle)" strokeDasharray="4 4" />
                      <line x1="30" y1="90" x2={svgWidth - 30} y2="90" stroke="var(--border-subtle)" strokeDasharray="4 4" />
                      <line x1="30" y1="140" x2={svgWidth - 30} y2="140" stroke="var(--border-subtle)" strokeDasharray="4 4" />

                      {/* Smooth Area & Line */}
                      <path d={areaD} fill="url(#areaGradient)" />
                      <path d={pathD} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />

                      {/* Interactive Hoverable Points */}
                      {points.map((pt, idx) => (
                        <g key={idx}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={hoveredPoint === idx ? 7 : 4.5}
                            fill="var(--bg-secondary)"
                            stroke="var(--accent-cyan)"
                            strokeWidth="2.5"
                            style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                            onMouseEnter={() => setHoveredPoint(idx)}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                          <text
                            x={pt.x}
                            y={svgHeight - 4}
                            textAnchor="middle"
                            fill="var(--text-muted)"
                            fontSize="11"
                            fontFamily="var(--font-sans)"
                          >
                            {pt.label}
                          </text>
                        </g>
                      ))}
                    </svg>

                    {hoveredPoint !== null && (
                      <div
                        className="chart-tooltip"
                        style={{
                          left: `${(points[hoveredPoint].x / svgWidth) * 100}%`,
                          top: `${(points[hoveredPoint].y / svgHeight) * 100}%`
                        }}
                      >
                        <strong>{points[hoveredPoint].label}</strong>: {points[hoveredPoint].value}k requests
                      </div>
                    )}
                  </div>
                </div>

                {/* Resource Donut Breakdown */}
                <div className="chart-card">
                  <div className="card-header-row">
                    <div>
                      <h2 className="card-heading-title">Resource Allocation</h2>
                      <p className="card-heading-sub">Workload distribution</p>
                    </div>
                  </div>

                  <div className="donut-container">
                    <svg width="140" height="140" viewBox="0 0 42 42">
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--bg-tertiary)" strokeWidth="5" />
                      {/* Segment 1: API Gateway (45%) */}
                      <circle
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="transparent"
                        stroke="var(--primary)"
                        strokeWidth="5"
                        strokeDasharray="45 55"
                        strokeDashoffset="25"
                      />
                      {/* Segment 2: Auth Layer (30%) */}
                      <circle
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="transparent"
                        stroke="var(--accent-cyan)"
                        strokeWidth="5"
                        strokeDasharray="30 70"
                        strokeDashoffset="80"
                      />
                      {/* Segment 3: Cache (25%) */}
                      <circle
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="transparent"
                        stroke="var(--accent-purple)"
                        strokeWidth="5"
                        strokeDasharray="25 75"
                        strokeDashoffset="50"
                      />
                    </svg>

                    <div className="donut-legend">
                      <div className="legend-item">
                        <div className="legend-indicator">
                          <span className="legend-dot" style={{ background: 'var(--primary)' }} />
                          <span>API Gateway</span>
                        </div>
                        <span style={{ fontWeight: 700 }}>45%</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-indicator">
                          <span className="legend-dot" style={{ background: 'var(--accent-cyan)' }} />
                          <span>Auth & Sessions</span>
                        </div>
                        <span style={{ fontWeight: 700 }}>30%</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-indicator">
                          <span className="legend-dot" style={{ background: 'var(--accent-purple)' }} />
                          <span>Edge Storage</span>
                        </div>
                        <span style={{ fontWeight: 700 }}>25%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Activities preview */}
              <div className="dashboard-grid-2">
                {/* Recent Activities */}
                <div className="chart-card">
                  <div className="card-header-row">
                    <div>
                      <h2 className="card-heading-title">Recent Activity Feed</h2>
                      <p className="card-heading-sub">Live simulated security & auth logs</p>
                    </div>
                    <button
                      type="button"
                      className="btn-secondary-action"
                      style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                      onClick={() => handleSimulateAction('Manual Sync Completed')}
                    >
                      <RefreshCw size={13} />
                      <span>Sync</span>
                    </button>
                  </div>

                  <div className="activity-feed-list">
                    {activities.slice(0, 4).map(act => (
                      <div key={act.id} className="activity-feed-item">
                        <div
                          className="activity-icon-bubble"
                          style={{
                            background: act.type === 'auth' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                            color: act.type === 'auth' ? 'var(--primary)' : 'var(--accent-emerald)'
                          }}
                        >
                          {act.type === 'auth' ? <KeyRound size={16} /> : <CheckCircle2 size={16} />}
                        </div>
                        <div className="activity-content">
                          <div className="activity-header">
                            <span>{act.event}</span>
                            <span className="activity-time">{act.time}</span>
                          </div>
                          <div className="activity-desc">{act.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Quick Snapshot */}
                <div className="chart-card">
                  <div className="card-header-row">
                    <div>
                      <h2 className="card-heading-title">Team Roster</h2>
                      <p className="card-heading-sub">Registered accounts ({users.length})</p>
                    </div>
                    <button
                      type="button"
                      className="auth-switch-link"
                      onClick={() => setActiveTab('users')}
                    >
                      View all
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {users.slice(0, 4).map(u => (
                      <div
                        key={u.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          background: 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-md)'
                        }}
                      >
                        <div className="user-cell">
                          <div className="table-avatar" style={{ backgroundColor: u.avatarColor || 'var(--primary)' }}>
                            {u.avatarInitials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.role}</div>
                          </div>
                        </div>
                        <span className="status-badge active">1111 Pass</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="chart-card animate-fade">
              <div className="card-header-row">
                <div>
                  <h1 className="card-heading-title">Advanced Performance Analytics</h1>
                  <p className="card-heading-sub">Deep dive metrics and server telemetry</p>
                </div>
                <div className="status-pill">
                  <Cpu size={14} />
                  <span>Telemetry Live</span>
                </div>
              </div>

              <div className="metrics-grid">
                <div className="metric-card">
                  <span className="metric-title">API Response Rate</span>
                  <div className="metric-value">99.98%</div>
                  <div className="metric-trend">
                    <span className="trend-pill trend-up">Zero Errors</span>
                    <span className="trend-caption">last 24 hours</span>
                  </div>
                </div>

                <div className="metric-card">
                  <span className="metric-title">Auth Token Validations</span>
                  <div className="metric-value">48,219</div>
                  <div className="metric-trend">
                    <span className="trend-pill trend-up">+14.2%</span>
                    <span className="trend-caption">via static key</span>
                  </div>
                </div>

                <div className="metric-card">
                  <span className="metric-title">Average Session Time</span>
                  <div className="metric-value">18m 42s</div>
                  <div className="metric-trend">
                    <span className="trend-pill trend-up">+3.1%</span>
                    <span className="trend-caption">high engagement</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '24px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Global Edge Distribution</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
                  Requests are distributed across 14 edge CDN points. All authentication logic runs on client runtime with static bypass credentials.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>North America</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>54.2%</div>
                    <div style={{ color: 'var(--accent-emerald)', fontSize: '0.75rem', marginTop: '2px' }}>Operational</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Europe West</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>28.5%</div>
                    <div style={{ color: 'var(--accent-emerald)', fontSize: '0.75rem', marginTop: '2px' }}>Operational</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Asia Pacific</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>17.3%</div>
                    <div style={{ color: 'var(--accent-emerald)', fontSize: '0.75rem', marginTop: '2px' }}>Operational</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEAM & USERS */}
          {activeTab === 'users' && (
            <div className="table-card animate-fade">
              <div className="card-header-row">
                <div>
                  <h1 className="card-heading-title">Team & Registered Users</h1>
                  <p className="card-heading-sub">
                    Listing all in-memory users. All can authenticate with static password <code>1111</code>.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ width: 'auto', padding: '8px 16px' }}
                  onClick={() => handleSimulateAction('New Member Invitation Sent')}
                >
                  <Plus size={16} />
                  <span>Invite Member</span>
                </button>
              </div>

              <div className="table-controls">
                <input
                  type="text"
                  className="table-search-input"
                  placeholder="Filter by name, email or role..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  id="input-user-table-search"
                />
                <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  Showing {filteredUsers.length} of {users.length} accounts
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Username</th>
                      <th>Department & Role</th>
                      <th>Registered</th>
                      <th>Status</th>
                      <th>Static Access</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div className="user-cell">
                            <div className="table-avatar" style={{ backgroundColor: u.avatarColor || 'var(--primary)' }}>
                              {u.avatarInitials}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <code>@{u.username}</code>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{u.role}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.department}</div>
                        </td>
                        <td>{u.joinedDate}</td>
                        <td>
                          <span className="status-badge active">{u.status}</span>
                        </td>
                        <td>
                          <code style={{ color: '#a5b4fc', background: 'rgba(99, 102, 241, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                            1111
                          </code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVITY LOG */}
          {activeTab === 'activity' && (
            <div className="table-card animate-fade">
              <div className="card-header-row">
                <div>
                  <h1 className="card-heading-title">Security & Session Audit Trail</h1>
                  <p className="card-heading-sub">Chronological events recorded during this session</p>
                </div>
                <button
                  type="button"
                  className="btn-secondary-action"
                  onClick={() => handleSimulateAction('Security Audit Clean')}
                >
                  <RefreshCw size={14} />
                  <span>Run Audit</span>
                </button>
              </div>

              <div className="activity-feed-list" style={{ marginTop: '12px' }}>
                {activities.map(act => (
                  <div key={act.id} className="activity-feed-item">
                    <div
                      className="activity-icon-bubble"
                      style={{
                        background: act.type === 'auth' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: act.type === 'auth' ? 'var(--primary)' : 'var(--accent-emerald)'
                      }}
                    >
                      {act.type === 'auth' ? <KeyRound size={16} /> : <CheckCircle2 size={16} />}
                    </div>
                    <div className="activity-content">
                      <div className="activity-header">
                        <span>{act.event}</span>
                        <span className="activity-time">{act.time}</span>
                      </div>
                      <div className="activity-desc">{act.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="settings-grid animate-fade">
              {/* Profile Settings */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div>
                    <h2 className="card-heading-title">Account Profile</h2>
                    <p className="card-heading-sub">Edit your active session profile</p>
                  </div>
                  <Edit3 size={18} color="var(--primary)" />
                </div>

                <form onSubmit={handleSaveProfile} className="auth-form">
                  <div className="form-group">
                    <label className="form-label" htmlFor="settings-name">Full Name</label>
                    <input
                      id="settings-name"
                      type="text"
                      className="input-field"
                      style={{ paddingLeft: '14px' }}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="settings-role">Role Title</label>
                    <input
                      id="settings-role"
                      type="text"
                      className="input-field"
                      style={{ paddingLeft: '14px' }}
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="settings-dept">Department</label>
                    <input
                      id="settings-dept"
                      type="text"
                      className="input-field"
                      style={{ paddingLeft: '14px' }}
                      value={editDepartment}
                      onChange={(e) => setEditDepartment(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn-primary" id="btn-save-settings">
                    <span>Save Changes</span>
                  </button>
                </form>
              </div>

              {/* Static Password & Security Info */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div>
                    <h2 className="card-heading-title">Static Authentication Protocol</h2>
                    <p className="card-heading-sub">Configured demo credential parameters</p>
                  </div>
                  <ShieldCheck size={18} color="var(--accent-emerald)" />
                </div>

                <div className="static-password-highlight-box">
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Master Static Password:</span>
                  <code>1111</code>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    As configured, any user account or arbitrary identifier with password <strong>1111</strong> will authenticate successfully without needing an external database.
                  </p>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        Reset Local State
                      </div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                        Clear cached user registrations and return to default seed state
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-secondary-action"
                      style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                      onClick={handleResetSessionData}
                      id="btn-reset-data"
                    >
                      <Trash2 size={16} />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
