import React from 'react';
import { FileText, Calendar, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import './RequestCard.css';

const StatusBadge = ({ status }) => {
  const icons = {
    pending: <Clock size={14} />,
    approved: <CheckCircle size={14} />,
    rejected: <XCircle size={14} />
  };
  
  return (
    <span className={`status-badge status-${status}`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const RequestCard = ({ request, onClick }) => {
  return (
    <div className="request-card" onClick={() => onClick(request)}>
      <div className="request-card-left">
        <div className="request-icon-box">
          <FileText size={24} />
        </div>
        <div className="request-info">
          <div className="request-title">{request.eventName}</div>
          <div className="request-meta">
            <span className="meta-item">
              <Calendar size={12} /> {request.date}
            </span>
            <span className="meta-separator">•</span>
            <span className="meta-item">{request.committee}</span>
          </div>
        </div>
      </div>
      <div className="request-card-right">
        <StatusBadge status={request.status} />
        <ChevronRight size={20} className="chevron-icon" />
      </div>
    </div>
  );
};

export default RequestCard;
