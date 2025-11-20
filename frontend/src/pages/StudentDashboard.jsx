import { useState } from 'react';
import { 
  LayoutDashboard, Plus, Search, FileText, Calendar, User, 
  LogOut, CheckCircle, XCircle, Clock, ChevronRight, X, AlertCircle, Download 
} from 'lucide-react';
import './StudentDashboard.css';

// Mock Data
const INITIAL_REQUESTS = [
  {
    id: 'REQ-2025-001',
    eventName: 'Tech Fest 2025',
    committee: 'Computer Science Society',
    date: '2025-11-10',
    time: '09:00 AM - 06:00 PM',
    location: 'Main Auditorium',
    status: 'pending',
    description: 'Annual technical festival featuring hackathons.',
  },
  {
    id: 'REQ-2025-002',
    eventName: 'AI Workshop',
    committee: 'Robotics Club',
    date: '2025-10-25',
    time: '02:00 PM - 05:00 PM',
    location: 'Computer Lab 3',
    status: 'approved',
    description: 'One day workshop on GenAI tools for students.',
  },
  {
    id: 'REQ-2025-003',
    eventName: 'Freshers Party',
    committee: 'Cultural Committee',
    date: '2025-10-05',
    time: '06:00 PM - 10:00 PM',
    location: 'College Grounds',
    status: 'rejected',
    description: 'Welcome party for first year students.',
    rejectionReason: 'Date conflicts with mid-term exams.'
  }
];

// Helper Component for Status Badge
const StatusBadge = ({ status }) => {
  const icons = {
    pending: <Clock size={14} />,
    approved: <CheckCircle size={14} />,
    rejected: <XCircle size={14} />
  };
  return (
    <span className={`badge ${status}`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const filteredRequests = requests.filter(req => {
    const matchesTab = activeTab === 'all' || req.status === activeTab;
    const matchesSearch = req.eventName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="dashboard-container">
      
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-icon"><CheckCircle size={20} /></div>
          <span className="brand-text">ApproveFlow</span>
        </div>
        
        <nav className="nav-menu">
          <button className="nav-item active"><LayoutDashboard size={20} /> Dashboard</button>
          <button className="nav-item"><Calendar size={20} /> Calendar</button>
          <button className="nav-item"><User size={20} /> Profile</button>
        </nav>

        <div className="user-profile">
          <div className="avatar">JD</div>
          <div className="user-info">
            <div className="user-name">John Doe</div>
            <div className="user-role">Student Head</div>
          </div>
          <LogOut size={18} className="text-gray-400 cursor-pointer" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        
        <div className="header-section">
          <div className="page-title">
            <h1>Student Dashboard</h1>
            <p>Manage your event permissions.</p>
          </div>
          <button className="new-req-btn">
            <Plus size={20} /> New Request
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-label">Total</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card stat-pending">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{stats.pending}</div>
          </div>
          <div className="stat-card stat-approved">
            <div className="stat-label">Approved</div>
            <div className="stat-value">{stats.approved}</div>
          </div>
          <div className="stat-card stat-rejected">
            <div className="stat-label">Rejected</div>
            <div className="stat-value">{stats.rejected}</div>
          </div>
        </div>

        {/* Request List */}
        <div className="list-container">
          <div className="list-controls">
            <div className="tabs">
              {['all', 'pending', 'approved', 'rejected'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="search-box">
              <Search className="search-icon" size={16} />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search events..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="requests-list">
            {filteredRequests.length > 0 ? (
              filteredRequests.map(req => (
                <div key={req.id} className="request-item" onClick={() => setSelectedRequest(req)}>
                  <div className="req-info">
                    <div className="req-icon-box"><FileText size={24} /></div>
                    <div>
                      <div className="req-title">{req.eventName}</div>
                      <div className="req-meta">
                        <span><Calendar size={12} /> {req.date}</span>
                        <span>{req.committee}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <StatusBadge status={req.status} />
                    <ChevronRight size={20} color="#CBD5E1" />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No requests found.</div>
            )}
          </div>
        </div>
      </main>



      {/* Detail Modal */}
      {selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header" style={{backgroundColor:'white', color:'#334155', borderBottom:'1px solid #E2E8F0'}}>
              <div>
                <h2 style={{fontSize:'1.25rem', fontWeight:'bold'}}>{selectedRequest.eventName}</h2>
                <div style={{marginTop:'0.5rem'}}><StatusBadge status={selectedRequest.status} /></div>
              </div>
              <button onClick={() => setSelectedRequest(null)} style={{background:'none', border:'none', cursor:'pointer'}}><X size={24} /></button>
            </div>
            <div className="modal-body">
              <p style={{marginBottom:'1rem'}}><strong>Committee:</strong> {selectedRequest.committee}</p>
              <p style={{marginBottom:'1rem'}}><strong>Date:</strong> {selectedRequest.date}</p>
              <p style={{marginBottom:'1rem'}}><strong>Time:</strong> {selectedRequest.time}</p>
              <p style={{marginBottom:'1rem'}}><strong>Location:</strong> {selectedRequest.location}</p>
              <p style={{marginBottom:'1rem', color:'#64748B'}}>{selectedRequest.description}</p>
              {selectedRequest.status === 'rejected' && (
                <div style={{background:'#FEF2F2', padding:'1rem', borderRadius:'0.5rem', color:'#991B1B'}}>
                   <div style={{fontWeight:'bold', display:'flex', alignItems:'center', gap:'0.5rem'}}><AlertCircle size={16}/> Rejection Reason</div>
                   <div>{selectedRequest.rejectionReason}</div>
                </div>
              )}
            </div>
            <div style={{padding:'1rem', borderTop:'1px solid #E2E8F0', display:'flex', justifyContent:'flex-end', gap:'1rem'}}>
              <button className="btn-cancel" onClick={() => setSelectedRequest(null)}>Close</button>
              {selectedRequest.status === 'approved' && (
                <button className="btn-submit" style={{backgroundColor:'#16A34A', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem'}}>
                  <Download size={18} /> Download Slip
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;
