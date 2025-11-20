import { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  User, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronRight, 
  X, 
  MapPin,
  Users,
  FileText
} from 'lucide-react';
import './TeacherDashboard.css';

// Mock Data for Teacher
const INITIAL_TEACHER_REQUESTS = [
  {
    id: 'REQ-2025-008',
    studentName: 'Arjun Sharma',
    eventName: 'Robotics Workshop Phase 1',
    committee: 'Robotics Club',
    date: '2025-11-12',
    time: '10:00 AM - 4:00 PM',
    venue: 'Engineering Hall B',
    expectedAttendance: 150,
    status: 'pending',
    description: 'A hands-on workshop introducing first-year students to Arduino and basic sensor integration. We require projector access and power strips.',
    submittedOn: '2025-11-01',
  },
  {
    id: 'REQ-2025-009',
    studentName: 'Zara Ali',
    eventName: 'Inter-College Debate',
    committee: 'Debate Society',
    date: '2025-11-15',
    time: '2:00 PM - 6:00 PM',
    venue: 'Main Auditorium',
    expectedAttendance: 300,
    status: 'pending',
    description: 'Hosting the annual debate championship. Judges from external universities will be attending.',
    submittedOn: '2025-11-02',
  },
  {
    id: 'REQ-2025-004',
    studentName: 'Rohan Gupta',
    eventName: 'Gaming Tournament',
    committee: 'Computer Science Society',
    date: '2025-10-20',
    time: '11:00 AM',
    venue: 'Lab 3',
    expectedAttendance: 50,
    status: 'approved',
    description: 'CS:GO LAN tournament for society members.',
    submittedOn: '2025-10-10',
    approvalDate: '2025-10-11',
  },
  {
    id: 'REQ-2025-005',
    studentName: 'Priya Patel',
    eventName: 'Midnight Jam Session',
    committee: 'Music Club',
    date: '2025-10-22',
    time: '11:00 PM',
    venue: 'Open Air Theatre',
    expectedAttendance: 20,
    status: 'rejected',
    description: 'Late night acoustic session.',
    submittedOn: '2025-10-15',
    rejectionReason: 'Event timing violates campus curfew rules (Max 10 PM).',
    rejectionDate: '2025-10-16',
  }
];

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState(INITIAL_TEACHER_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Derived State for Counts
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  // Filter Logic
  const filteredRequests = requests.filter(req => {
    if (activeTab === 'all') return true;
    return req.status === activeTab;
  });

  // Handlers
  const handleApprove = () => {
    if (!selectedRequest) return;
    
    const updatedRequests = requests.map(req => 
      req.id === selectedRequest.id 
        ? { ...req, status: 'approved', approvalDate: new Date().toISOString().split('T')[0] } 
        : req
    );
    
    setRequests(updatedRequests);
    setSelectedRequest(null);
    alert(`Request ${selectedRequest.id} Approved Successfully!`);
  };

  const handleReject = () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    const updatedRequests = requests.map(req => 
      req.id === selectedRequest.id 
        ? { ...req, status: 'rejected', rejectionReason: rejectionReason, rejectionDate: new Date().toISOString().split('T')[0] } 
        : req
    );

    setRequests(updatedRequests);
    setSelectedRequest(null);
    setIsRejecting(false);
    setRejectionReason('');
    alert(`Request ${selectedRequest.id} Rejected.`);
  };

  const openModal = (req) => {
    setSelectedRequest(req);
    setIsRejecting(false);
    setRejectionReason('');
  };

  return (
    <div className="dashboard-container">
      
      {/* Sidebar (Consistent with Student View) */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-icon"><CheckCircle size={20} /></div>
          <span className="brand-text">ApproveFlow</span>
        </div>
        
        <nav className="nav-menu">
          <button className="nav-item active"><LayoutDashboard size={20} /> Overview</button>
          <button className="nav-item"><Calendar size={20} /> Schedule</button>
          <button className="nav-item"><Users size={20} /> Committees</button>
        </nav>

        <div className="user-profile">
          <div className="avatar" style={{backgroundColor: '#DBEAFE', color:'#1976D2'}}>Dr.</div>
          <div className="user-info">
            <div className="user-name">Dr. Smith</div>
            <div className="user-role">Faculty In-Charge</div>
          </div>
          <LogOut size={18} className="text-gray-400 cursor-pointer hover:text-red-500" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        
        <div className="header-section">
          <div className="page-title">
            <h1>Faculty Dashboard</h1>
            <p>Review and manage student event permissions.</p>
          </div>
        </div>

        {/* Action Banner */}
        <div className="action-banner">
          <div className="banner-info">
            <h2>Action Required</h2>
            <p>You have {pendingCount} pending requests waiting for your approval.</p>
          </div>
          <div className="banner-stat">
            <span className="stat-number">{pendingCount}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>

        {/* List Section */}
        <div className="list-container">
          {/* Tabs */}
          <div className="list-controls">
            <button 
              className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`} 
              onClick={() => setActiveTab('pending')}
            >
              Pending Review <span className="count-badge">{pendingCount}</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`} 
              onClick={() => setActiveTab('approved')}
            >
              Approved by Me <span className="count-badge">{approvedCount}</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'rejected' ? 'active' : ''}`} 
              onClick={() => setActiveTab('rejected')}
            >
              Rejected by Me <span className="count-badge">{rejectedCount}</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} 
              onClick={() => setActiveTab('all')}
            >
              All Requests
            </button>
          </div>

          {/* List Items */}
          <div className="requests-list">
            {filteredRequests.length > 0 ? (
              filteredRequests.map(req => (
                <div 
                  key={req.id} 
                  className={`request-item ${req.status === 'pending' ? 'urgent' : ''}`}
                  onClick={() => openModal(req)}
                >
                  <div className="req-main">
                    <div className="req-avatar">
                      <FileText size={24} />
                    </div>
                    <div className="req-details">
                      <h3>{req.eventName}</h3>
                      <div className="req-meta">
                        <span className="flex items-center gap-1"><User size={14}/> {req.studentName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Calendar size={14}/> {req.date}</span>
                        <span>•</span>
                        <span>{req.committee}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`status-pill ${req.status}`}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                    <ChevronRight size={20} color="#CBD5E1" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-400">
                <div className="flex justify-center mb-4"><CheckCircle size={48} className="opacity-20"/></div>
                <p>No requests found in this category.</p>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Detailed Review Modal */}
      {selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-title">
                <h2>Review Request</h2>
                <span className="text-sm text-gray-500">ID: {selectedRequest.id}</span>
              </div>
            </div>

            <div className="modal-content">
              {/* Header Info */}
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">{selectedRequest.eventName}</h1>
                  <div className="flex items-center gap-2 text-blue-600 font-medium">
                    <Users size={18} /> {selectedRequest.committee}
                  </div>
                </div>
                <div className={`status-pill ${selectedRequest.status}`}>
                  {selectedRequest.status.toUpperCase()}
                </div>
              </div>

              {/* Details Grid */}
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Date & Time</label>
                  <p className="flex items-center gap-2"><Clock size={18} className="text-gray-400"/> {selectedRequest.date} | {selectedRequest.time}</p>
                </div>
                <div className="detail-item">
                  <label>Venue</label>
                  <p className="flex items-center gap-2"><MapPin size={18} className="text-gray-400"/> {selectedRequest.venue}</p>
                </div>
                <div className="detail-item">
                  <label>Organizer</label>
                  <p>{selectedRequest.studentName}</p>
                </div>
                <div className="detail-item">
                  <label>Expected Attendance</label>
                  <p>{selectedRequest.expectedAttendance} Students</p>
                </div>
                <div className="detail-item full-width">
                  <label>Event Description</label>
                  <div className="description-box">
                    {selectedRequest.description}
                  </div>
                </div>
                
                {/* Show rejection reason if rejected */}
                {selectedRequest.status === 'rejected' && (
                  <div className="detail-item full-width">
                    <label className="text-red-600">Reason for Rejection</label>
                    <div className="bg-red-50 text-red-700 p-3 rounded border border-red-100">
                      {selectedRequest.rejectionReason}
                    </div>
                  </div>
                )}
              </div>

              {/* Rejection Input (Conditional) */}
              {isRejecting && (
                <div className="rejection-area">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Reason for Rejection *</label>
                  <textarea 
                    className="rejection-input" 
                    rows="3" 
                    placeholder="e.g., Venue unavailable, Budget exceeds limit..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    autoFocus
                  ></textarea>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="modal-footer">
              {selectedRequest.status === 'pending' ? (
                <div className="action-buttons">
                  {!isRejecting ? (
                    <>
                      <button className="btn btn-outline" onClick={() => setSelectedRequest(null)}>Close</button>
                      <button className="btn btn-reject" onClick={() => setIsRejecting(true)}>
                        <XCircle size={18} /> Reject
                      </button>
                      <button className="btn btn-approve" onClick={handleApprove}>
                        <CheckCircle size={18} /> Approve Request
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-outline" onClick={() => setIsRejecting(false)}>Cancel</button>
                      <button className="btn btn-reject" onClick={handleReject}>
                        Confirm Rejection
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="action-buttons">
                  <button className="btn btn-outline" onClick={() => setSelectedRequest(null)}>Close</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherDashboard;
