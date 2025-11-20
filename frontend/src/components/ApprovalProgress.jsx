import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import './ApprovalProgress.css';

const ApprovalProgress = ({ currentStage, rejectedAt = null }) => {
  const stages = [
    { id: 1, label: 'Created', key: 'created' },
    { id: 2, label: 'Faculty', key: 'faculty' },
    { id: 3, label: 'TPO', key: 'tpo' },
    { id: 4, label: 'Vice Principal', key: 'vice_principal' },
    { id: 5, label: 'Principal', key: 'principal' }
  ];

  const getStageStatus = (stageId) => {
    if (rejectedAt !== null) {
      if (stageId < rejectedAt) return 'completed';
      if (stageId === rejectedAt) return 'rejected';
      return 'pending';
    }

    if (stageId < currentStage) return 'completed';
    if (stageId === currentStage) return 'current';
    return 'pending';
  };

  const getStageIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />;
      case 'current':
        return <Clock size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="approval-progress">
      <div className="progress-header">
        <h3>Approval Progress</h3>
        {rejectedAt && (
          <span className="rejection-badge">Rejected at {stages[rejectedAt - 1].label}</span>
        )}
      </div>
      
      <div className="progress-track">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.id);
          const isLast = index === stages.length - 1;
          const nextStatus = !isLast ? getStageStatus(stages[index + 1].id) : null;
          const lineClass = status === 'completed' ? 'completed' : 
                           status === 'rejected' ? 'rejected' : 'pending';

          return (
            <React.Fragment key={stage.id}>
              <div className={`progress-stage ${status}`}>
                <div className="stage-dot">
                  {getStageIcon(status)}
                </div>
                <div className="stage-label">{stage.label}</div>
              </div>
              
              {!isLast && (
                <div className={`progress-line ${lineClass}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ApprovalProgress;
