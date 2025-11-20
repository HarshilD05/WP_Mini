import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, X, AlertCircle, Download } from 'lucide-react';
import RequestCard from '../components/RequestCard';
import ApprovalProgress from '../components/ApprovalProgress';
import { getMyRequests, downloadSlip } from '../apis/requestAPI';
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
        const data = await getMyRequests();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Categorize requests based on approval stage
  // For students:
  // - Pending: Stage 1 (waiting for Faculty Coordinator)
  // - In Review: Stage > 1 (approved by Faculty, waiting for higher authority)
  // - Approved/Rejected: Final status
  const categorizeRequests = () => {
    return requests.map(req => {
      // Keep final statuses as is
      if (req.status === 'approved' || req.status === 'rejected') {
        return { ...req, viewStatus: req.status };
      }

      const currentStage = req.approvalStage;
      
      // Stage 1: Pending at Faculty Coordinator level
      if (currentStage === 1) {
        return { ...req, viewStatus: 'pending' };
      }
      
      // Stage > 1: In review with higher authorities
      if (currentStage > 1) {
        return { ...req, viewStatus: 'in-review' };
      }
      
      return { ...req, viewStatus: 'pending' };
    });
  };

  const categorizedRequests = categorizeRequests();

  const filteredRequests = categorizedRequests.filter(req => {
    const matchesTab = activeTab === 'all' || req.viewStatus === activeTab;
    const matchesSearch = req.eventName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: categorizedRequests.length,
    pending: categorizedRequests.filter(r => r.viewStatus === 'pending').length,
    inReview: categorizedRequests.filter(r => r.viewStatus === 'in-review').length,
    approved: categorizedRequests.filter(r => r.viewStatus === 'approved').length,
    rejected: categorizedRequests.filter(r => r.viewStatus === 'rejected').length,
  };

  const handleNewRequest = () => {
    navigate('/request-form');
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
            {['all', 'pending', 'in-review', 'approved', 'rejected'].map(tab => (
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
    </div>
  );
};

export default StudentHome;
