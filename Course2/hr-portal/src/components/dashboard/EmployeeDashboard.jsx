import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getLeavesByEmployee } from '../../utils/storage';

export default function EmployeeDashboard() {
  const { user } = useAuth();

  const stats = useMemo(() => {
    const leaves = getLeavesByEmployee(user.id);
    return {
      totalLeaves: leaves.length,
      approvedLeaves: leaves.filter((l) => l.status === 'approved').length,
      pendingLeaves: leaves.filter((l) => l.status === 'pending').length,
      rejectedLeaves: leaves.filter((l) => l.status === 'rejected').length,
      recentLeaves: leaves.slice(-5).reverse(),
    };
  }, [user.id]);

  return (
    <div className="dashboard" data-testid="employee-dashboard">
      <div className="page-header">
        <h1>Welcome, {user.firstName}!</h1>
        <p>Here's your personal overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-value">{stats.totalLeaves}</div>
          <div className="stat-label">Total Leave Requests</div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-value">{stats.approvedLeaves}</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-value">{stats.pendingLeaves}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card stat-danger">
          <div className="stat-value">{stats.rejectedLeaves}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>My Profile</h3>
            <Link to="/employee/profile" className="btn btn-sm btn-outline">Edit Profile</Link>
          </div>
          <div className="card-body">
            <div className="profile-summary">
              <div className="profile-avatar-lg">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">Name</span>
                  <span>{user.firstName} {user.lastName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email</span>
                  <span>{user.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Department</span>
                  <span>{user.department}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Position</span>
                  <span>{user.position}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Joined</span>
                  <span>{user.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Recent Leave Requests</h3>
            <Link to="/employee/leave" className="btn btn-sm btn-outline">View All</Link>
          </div>
          <div className="card-body">
            {stats.recentLeaves.length === 0 ? (
              <p className="empty-state">No leave requests yet. <Link to="/employee/leave">Apply for leave</Link></p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Dates</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentLeaves.map((leave) => (
                    <tr key={leave.id}>
                      <td className="capitalize">{leave.type}</td>
                      <td>{leave.startDate} to {leave.endDate}</td>
                      <td>
                        <span className={`status-badge status-${leave.status}`}>{leave.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
