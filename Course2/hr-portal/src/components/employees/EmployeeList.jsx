import { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUser } from '../../utils/storage';
import EmployeeForm from './EmployeeForm';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadEmployees = () => {
    const users = getUsers().filter((u) => u.role === 'employee');
    setEmployees(users);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const departments = [...new Set(employees.map((e) => e.department))].sort();

  const filtered = employees.filter((emp) => {
    const matchSearch =
      `${emp.firstName} ${emp.lastName} ${emp.email}`.toLowerCase().includes(search.toLowerCase());
    const matchDept = !filterDept || emp.department === filterDept;
    return matchSearch && matchDept;
  });

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    deleteUser(id);
    setConfirmDelete(null);
    loadEmployees();
  };

  const handleToggleStatus = (emp) => {
    updateUser(emp.id, { status: emp.status === 'active' ? 'inactive' : 'active' });
    loadEmployees();
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEmployee(null);
    loadEmployees();
  };

  return (
    <div data-testid="employee-list">
      <div className="page-header">
        <div>
          <h1>Employee Management</h1>
          <p>{filtered.length} employee{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)} data-testid="add-employee-btn">
          + Add Employee
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          data-testid="employee-search"
        />
        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} data-testid="dept-filter">
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="card-body">
          {filtered.length === 0 ? (
            <p className="empty-state">No employees found matching your criteria.</p>
          ) : (
            <div className="table-responsive">
              <table className="table" data-testid="employees-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Join Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp) => (
                    <tr key={emp.id} data-testid={`employee-row-${emp.id}`}>
                      <td>
                        <div className="cell-with-avatar">
                          <div className="avatar avatar-sm">{emp.firstName[0]}{emp.lastName[0]}</div>
                          <span>{emp.firstName} {emp.lastName}</span>
                        </div>
                      </td>
                      <td>{emp.email}</td>
                      <td>{emp.department}</td>
                      <td>{emp.position}</td>
                      <td>{emp.joinDate}</td>
                      <td>
                        <span className={`status-badge status-${emp.status}`}>{emp.status}</span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleEdit(emp)}
                            data-testid={`edit-${emp.id}`}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleToggleStatus(emp)}
                          >
                            {emp.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => setConfirmDelete(emp.id)}
                            data-testid={`delete-${emp.id}`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal" data-testid="delete-confirm-modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this employee? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)} data-testid="confirm-delete-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit form modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal modal-lg">
            <EmployeeForm employee={editingEmployee} onClose={handleFormClose} />
          </div>
        </div>
      )}
    </div>
  );
}
