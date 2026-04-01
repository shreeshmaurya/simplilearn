import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, getLeaveRequests } from '../../utils/storage';

export default function HRDashboard() {
  const stats = useMemo(() => {
    const users = getUsers();
    const leaves = getLeaveRequests();
    const employees = users.filter((u) => u.role === 'employee');
    const activeEmployees = employees.filter((u) => u.status === 'active');
    const pendingLeaves = leaves.filter((l) => l.status === 'pending');
    const departments = [...new Set(employees.map((e) => e.department))];

    return {
      totalEmployees: employees.length,
      activeEmployees: activeEmployees.length,
      pendingLeaves: pendingLeaves.length,
      departments: departments.length,
      recentEmployees: employees.slice(-5).reverse(),
      recentLeaves: leaves.slice(-5).reverse(),
    };
  }, []);

  return (
    <div className="dashboard" data-testid="hr-dashboard">
      <div className="page-header">
        <h1>HR Dashboard</h1>
        <p>Overview of your organization</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-value">{stats.totalEmployees}</div>
          <div className="stat-label">Total Employees</div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-value">{stats.activeEmployees}</div>
          <div className="stat-label">Active Employees</div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-value">{stats.pendingLeaves}</div>
          <div className="stat-label">Pending Leave Requests</div>
        </div>
        <div className="stat-card stat-info">
          <div className="stat-value">{stats.departments}</div>
          <div className="stat-label">Departments</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>Recent Employees</h3>
            <Link to="/hr/employees" className="btn btn-sm btn-outline">View All</Link>
          </div>
          <div className="card-body">
            {stats.recentEmployees.length === 0 ? (
              <p className="empty-state">No employees yet</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentEmployees.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.firstName} {emp.lastName}</td>
                      <td>{emp.department}</td>
                      <td>
                        <span className={`status-badge status-${emp.status}`}>{emp.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Recent Leave Requests</h3>
            <Link to="/hr/leave-management" className="btn btn-sm btn-outline">View All</Link>
          </div>
          <div className="card-body">
            {stats.recentLeaves.length === 0 ? (
              <p className="empty-state">No leave requests</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentLeaves.map((leave) => (
                    <tr key={leave.id}>
                      <td>{leave.employeeName}</td>
                      <td className="capitalize">{leave.type}</td>
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
