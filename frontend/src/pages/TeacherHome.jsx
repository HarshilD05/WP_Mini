import { useState, useEffect } from 'react';
import { Plus, Search, X, MapPin, Users, FileText, Calendar, Download } from 'lucide-react';
import RequestCard from '../components/RequestCard';
import ApprovalProgress from '../components/ApprovalProgress';
import { getAllRequests, approveRequest, rejectRequest, downloadSlip } from '../apis/requestAPI';
import './TeacherHome.css';

const TeacherHome = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const userRole = sessionStorage.getItem('userRole')?.toLowerCase();

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

  // Map roles to approval stages
  const getRoleStage = (role) => {
    const roleMap = {
      'faculty coordinator': 2,
      'tpo': 3,
      'vice principal': 4,
      'principal': 5
    };
    return roleMap[role] || 0;
  };

  const myStage = getRoleStage(userRole);

  // Categorize requests based on user's role and approval stage
  const categorizeRequests = () => {
    return requests.map(req => {
      // Skip if already approved or rejected globally
      if (req.status === 'approved' || req.status === 'rejected') {
        return { ...req, viewStatus: req.status };
      }

      const currentStage = req.approvalStage;
      
      // Pending: Current stage matches my role stage (my turn to approve)
      if (currentStage === myStage) {
        return { ...req, viewStatus: 'pending' };
      }
      
      // In Review: I already approved (stage passed my level) but not final approved
      if (currentStage > myStage && req.status !== 'approved') {
        return { ...req, viewStatus: 'in-review' };
      }
      
      // Not yet reached my level - don't show
      return { ...req, viewStatus: 'hidden' };
    }).filter(req => req.viewStatus !== 'hidden');
  };

  const categorizedRequests = categorizeRequests();

  const filteredRequests = categorizedRequests.filter(req => {
    const matchesTab = activeTab === 'all' || req.viewStatus === activeTab;
    const matchesSearch = 
      req.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.studentName && req.studentName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: categorizedRequests.length,
    pending: categorizedRequests.filter(r => r.viewStatus === 'pending').length,
    inReview: categorizedRequests.filter(r => r.viewStatus === 'in-review').length,
    approved: categorizedRequests.filter(r => r.viewStatus === 'approved').length,
    rejected: categorizedRequests.filter(r => r.viewStatus === 'rejected').length,
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

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason.');
      return;
    }
    
    try {
      await rejectRequest(selectedRequest.id, rejectionReason);
      // Refresh the requests list after rejection
      const data = await getAllRequests();
      setRequests(data);
      setSelectedRequest(null);
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request. Please try again.');
    }
  };

  const openRejectModal = () => {
    setShowRejectModal(true);
    setRejectionReason('');
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectionReason('');
  };

  const handleDownloadSlip = async (requestId) => {
    try {
      const blob = await downloadSlip(requestId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `approval-slip-${requestId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading slip:', error);
      alert('Failed to download slip. Please try again.');
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
            {['pending', 'in-review', 'approved', 'rejected', 'all'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              >
                {tab === 'in-review' ? 'In Review' : tab.charAt(0).toUpperCase() + tab.slice(1)}
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
              {selectedRequest.viewStatus === 'pending' && (
                <>
                  <button 
                    className="btn btn-reject" 
                    onClick={openRejectModal}
                  >
                    Reject
                  </button>
                  <button className="btn btn-approve" onClick={() => handleApprove(selectedRequest.id)}>
                    Approve
                  </button>
                </>
              )}
              {selectedRequest.viewStatus === 'approved' && (
                <button 
                  className="btn btn-download" 
                  onClick={() => handleDownloadSlip(selectedRequest.id)}
                >
                  <Download size={18} /> Download Slip
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={closeRejectModal}>
          <div className="modal-content rejection-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reject Request</h2>
              <button className="close-btn" onClick={closeRejectModal}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <p className="rejection-modal-text">Please provide a reason for rejecting this request:</p>
              <textarea
                className="rejection-textarea"
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={5}
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={closeRejectModal}>
                Cancel
              </button>
              <button 
                className="btn btn-reject" 
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherHome;
