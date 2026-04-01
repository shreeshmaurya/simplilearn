import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { updateUser } from '../../utils/storage';
import { validatePhone } from '../../utils/validators';

export default function EmployeeProfile() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone || '',
    department: user.department,
    position: user.position,
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (form.phone && !validatePhone(form.phone)) {
      setError('Invalid phone number');
      return;
    }
    try {
      const updated = updateUser(user.id, form);
      const sessionUser = { ...updated };
      delete sessionUser.password;
      refreshUser(sessionUser);
      setSaved(true);
      setEditing(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div data-testid="employee-profile">
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>View and update your personal information</p>
        </div>
        {!editing && (
          <button className="btn btn-primary" onClick={() => setEditing(true)} data-testid="edit-profile-btn">
            Edit Profile
          </button>
        )}
      </div>

      {saved && <div className="alert alert-success">Profile updated successfully!</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="card-body">
          <div className="profile-page">
            <div className="profile-avatar-xl">
              {user.firstName[0]}{user.lastName[0]}
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="prof-firstName">First Name</label>
                    <input id="prof-firstName" name="firstName" value={form.firstName} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="prof-lastName">Last Name</label>
                    <input id="prof-lastName" name="lastName" value={form.lastName} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="prof-phone">Phone</label>
                  <input id="prof-phone" name="phone" value={form.phone} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="prof-department">Department</label>
                    <input id="prof-department" name="department" value={form.department} disabled />
                  </div>
                  <div className="form-group">
                    <label htmlFor="prof-position">Position</label>
                    <input id="prof-position" name="position" value={form.position} disabled />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input value={user.email} disabled />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" data-testid="save-profile-btn">Save Changes</button>
                </div>
              </form>
            ) : (
              <div className="profile-details profile-details-lg">
                <div className="detail-row">
                  <span className="detail-label">Full Name</span>
                  <span>{user.firstName} {user.lastName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email</span>
                  <span>{user.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone</span>
                  <span>{user.phone || 'Not set'}</span>
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
                  <span className="detail-label">Join Date</span>
                  <span>{user.joinDate}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status</span>
                  <span className={`status-badge status-${user.status}`}>{user.status}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
