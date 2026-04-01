import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getLeavesByEmployee } from '../../utils/storage';
import LeaveRequestForm from './LeaveRequestForm';

export default function EmployeeLeave() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  const loadLeaves = useCallback(() => {
    setLeaves(getLeavesByEmployee(user.id));
  }, [user.id]);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  const filtered = filterStatus ? leaves.filter((l) => l.status === filterStatus) : leaves;

  return (
    <div data-testid="employee-leave">
      <div className="page-header">
        <div>
          <h1>My Leave Requests</h1>
          <p>Manage your time off</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)} data-testid="apply-leave-btn">
          + Apply for Leave
        </button>
      </div>

      <div className="filters">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} data-testid="leave-status-filter">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="card">
        <div className="card-body">
          {filtered.length === 0 ? (
            <p className="empty-state">No leave requests found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table" data-testid="leave-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Applied On</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((leave) => (
                    <tr key={leave.id}>
                      <td className="capitalize">{leave.type}</td>
                      <td>{leave.startDate}</td>
                      <td>{leave.endDate}</td>
                      <td>{leave.reason}</td>
                      <td>{leave.appliedOn}</td>
                      <td>
                        <span className={`status-badge status-${leave.status}`}>{leave.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal modal-lg">
            <LeaveRequestForm onClose={() => setShowForm(false)} onSuccess={loadLeaves} />
          </div>
        </div>
      )}
    </div>
  );
}
