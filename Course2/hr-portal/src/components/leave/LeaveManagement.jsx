import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getLeaveRequests, updateLeaveRequest } from '../../utils/storage';

export default function LeaveManagement() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  const loadLeaves = () => {
    setLeaves(getLeaveRequests());
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleAction = (leaveId, status) => {
    updateLeaveRequest(leaveId, {
      status,
      reviewedBy: `${user.firstName} ${user.lastName}`,
      reviewedOn: new Date().toISOString().split('T')[0],
    });
    loadLeaves();
  };

  const filtered = leaves.filter((l) => {
    if (filterStatus && l.status !== filterStatus) return false;
    if (filterType && l.type !== filterType) return false;
    return true;
  });

  const pendingCount = leaves.filter((l) => l.status === 'pending').length;

  return (
    <div data-testid="leave-management">
      <div className="page-header">
        <div>
          <h1>Leave Management</h1>
          <p>{pendingCount} pending request{pendingCount !== 1 ? 's' : ''} awaiting review</p>
        </div>
      </div>

      <div className="filters">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} data-testid="lm-status-filter">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} data-testid="lm-type-filter">
          <option value="">All Types</option>
          <option value="annual">Annual</option>
          <option value="sick">Sick</option>
          <option value="personal">Personal</option>
          <option value="maternity">Maternity/Paternity</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      <div className="card">
        <div className="card-body">
          {filtered.length === 0 ? (
            <p className="empty-state">No leave requests found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table" data-testid="leave-mgmt-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Reason</th>
                    <th>Applied</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((leave) => (
                    <tr key={leave.id} data-testid={`leave-row-${leave.id}`}>
                      <td>{leave.employeeName}</td>
                      <td className="capitalize">{leave.type}</td>
                      <td>{leave.startDate}</td>
                      <td>{leave.endDate}</td>
                      <td>{leave.reason}</td>
                      <td>{leave.appliedOn}</td>
                      <td>
                        <span className={`status-badge status-${leave.status}`}>{leave.status}</span>
                      </td>
                      <td>
                        {leave.status === 'pending' ? (
                          <div className="action-btns">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleAction(leave.id, 'approved')}
                              data-testid={`approve-${leave.id}`}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleAction(leave.id, 'rejected')}
                              data-testid={`reject-${leave.id}`}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted">
                            {leave.reviewedBy && `by ${leave.reviewedBy}`}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
