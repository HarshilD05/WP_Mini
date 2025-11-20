import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, X, AlertCircle, Download } from 'lucide-react';
import RequestCard from '../components/RequestCard';
import ApprovalProgress from '../components/ApprovalProgress';
import './StudentHome.css';

const StudentHome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch requests on mount
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API endpoint
        // const response = await fetch('/api/student/requests');
        // const data = await response.json();
        
        // Mock data for development
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData = [
          {
            id: 'REQ-2025-001',
            eventName: 'Tech Fest 2025',
            committee: 'Computer Science Society',
            date: '2025-11-10',
            time: '09:00 AM - 06:00 PM',
            location: 'Main Auditorium',
            status: 'pending',
            approvalStage: 2,
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
            approvalStage: 5,
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
            approvalStage: 3,
            rejectedAt: 3,
            description: 'Welcome party for first year students.',
            rejectionReason: 'Date conflicts with mid-term exams.'
          }
        ];
        setRequests(mockData);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

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

  const handleNewRequest = () => {
    navigate('/request-form');
  };

  return (
    <div className="student-home-page">
      <div className="page-header">
        <div>
          <h1>My Requests</h1>
          <p>Manage your event permission requests</p>
        </div>
        <button className="new-req-btn" onClick={handleNewRequest}>
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
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
          {loading ? (
            <div className="loading-state">Loading requests...</div>
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map(req => (
              <RequestCard 
                key={req.id} 
                request={req} 
                onClick={setSelectedRequest}
              />
            ))
          ) : (
            <div className="empty-state">No requests found.</div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-content">
                <h2>{selectedRequest.eventName}</h2>
                <span className={`status-badge-large status-${selectedRequest.status}`}>
                  {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                </span>
              </div>
              <button className="close-btn" onClick={() => setSelectedRequest(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <ApprovalProgress 
                currentStage={selectedRequest.approvalStage || 1} 
                rejectedAt={selectedRequest.rejectedAt || null}
              />
              
              <div className="detail-row">
                <strong>Committee:</strong>
                <span>{selectedRequest.committee}</span>
              </div>
              <div className="detail-row">
                <strong>Date:</strong>
                <span>{selectedRequest.date}</span>
              </div>
              <div className="detail-row">
                <strong>Time:</strong>
                <span>{selectedRequest.time}</span>
              </div>
              <div className="detail-row">
                <strong>Location:</strong>
                <span>{selectedRequest.location}</span>
              </div>
              <div className="detail-section">
                <strong>Description:</strong>
                <p>{selectedRequest.description}</p>
              </div>
              {selectedRequest.status === 'rejected' && selectedRequest.rejectionReason && (
                <div className="rejection-notice">
                  <div className="rejection-header">
                    <AlertCircle size={16} /> Rejection Reason
                  </div>
                  <div className="rejection-text">{selectedRequest.rejectionReason}</div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={() => setSelectedRequest(null)}>
                Close
              </button>
              {selectedRequest.status === 'approved' && (
                <button className="btn btn-download">
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

export default StudentHome;
