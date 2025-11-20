import { useState, useEffect } from 'react';
import { Plus, Search, X, MapPin, Users, FileText, Calendar } from 'lucide-react';
import RequestCard from '../components/RequestCard';
import ApprovalProgress from '../components/ApprovalProgress';
import { getAllRequests, approveRequest, rejectRequest } from '../apis/requestAPI';
import './TeacherHome.css';

const TeacherHome = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch requests on mount
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        // Fetch all requests (no status filter, backend handles faculty filtering)
        const data = await getAllRequests();
        setRequests(data);
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
    const matchesSearch = 
      req.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  const handleApprove = async (requestId) => {
    try {
      await approveRequest(requestId);
      // Refresh the requests list after approval
      const data = await getAllRequests();
      setRequests(data);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request. Please try again.');
    }
  };

  const handleReject = async (requestId, reason) => {
    try {
      await rejectRequest(requestId, reason);
      // Refresh the requests list after rejection
      const data = await getAllRequests();
      setRequests(data);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request. Please try again.');
    }
  };

  return (
    <div className="teacher-home-page">
      <div className="page-header">
        <div>
          <h1>Review Requests</h1>
          <p>Approve or reject event permission requests</p>
        </div>
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
            {['pending', 'approved', 'rejected', 'all'].map(tab => (
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
              placeholder="Search events or students..." 
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
                <strong>Submitted By:</strong>
                <span>{selectedRequest.studentName}</span>
              </div>
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
                  <div className="rejection-header">Rejection Reason</div>
                  <div className="rejection-text">{selectedRequest.rejectionReason}</div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={() => setSelectedRequest(null)}>
                Close
              </button>
              {selectedRequest.status === 'pending' && (
                <>
                  <button 
                    className="btn btn-reject" 
                    onClick={() => {
                      const reason = prompt('Enter rejection reason:');
                      if (reason) handleReject(selectedRequest.id, reason);
                    }}
                  >
                    Reject
                  </button>
                  <button className="btn btn-approve" onClick={() => handleApprove(selectedRequest.id)}>
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherHome;
