import { useState } from 'react';
import { createUser, updateUser } from '../../utils/storage';
import { validateEmail, validatePhone, validatePassword } from '../../utils/validators';
import { v4 as uuidv4 } from 'uuid';

export default function EmployeeForm({ employee, onClose }) {
  const isEdit = Boolean(employee);
  const [form, setForm] = useState({
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    department: employee?.department || '',
    position: employee?.position || '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const departments = ['Engineering', 'Marketing', 'Finance', 'Human Resources', 'Operations', 'Sales', 'Support'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    if (!validateEmail(form.email)) errs.email = 'Valid email required';
    if (form.phone && !validatePhone(form.phone)) errs.phone = 'Invalid phone';
    if (!form.department) errs.department = 'Required';
    if (!form.position.trim()) errs.position = 'Required';
    if (!isEdit && !validatePassword(form.password)) {
      errs.password = 'Min 8 chars, uppercase, lowercase, number, special char';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      if (isEdit) {
        const updates = { ...form };
        if (!updates.password) delete updates.password;
        updateUser(employee.id, updates);
      } else {
        createUser({
          id: `usr-${uuidv4().slice(0, 8)}`,
          ...form,
          role: 'employee',
          joinDate: new Date().toISOString().split('T')[0],
          status: 'active',
        });
      }
      onClose();
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <div data-testid="employee-form">
      <div className="modal-header">
        <h2>{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>
        <button className="btn-close" onClick={onClose} aria-label="Close">&times;</button>
      </div>

      {submitError && <div className="alert alert-error">{submitError}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="emp-firstName">First Name *</label>
            <input id="emp-firstName" name="firstName" value={form.firstName} onChange={handleChange} />
            {errors.firstName && <span className="field-error">{errors.firstName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="emp-lastName">Last Name *</label>
            <input id="emp-lastName" name="lastName" value={form.lastName} onChange={handleChange} />
            {errors.lastName && <span className="field-error">{errors.lastName}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="emp-email">Email *</label>
            <input id="emp-email" name="email" type="email" value={form.email} onChange={handleChange} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="emp-phone">Phone</label>
            <input id="emp-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="emp-department">Department *</label>
            <select id="emp-department" name="department" value={form.department} onChange={handleChange}>
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.department && <span className="field-error">{errors.department}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="emp-position">Position *</label>
            <input id="emp-position" name="position" value={form.position} onChange={handleChange} />
            {errors.position && <span className="field-error">{errors.position}</span>}
          </div>
        </div>

        {!isEdit && (
          <div className="form-group">
            <label htmlFor="emp-password">Password *</label>
            <input id="emp-password" name="password" type="password" value={form.password} onChange={handleChange} />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
        )}

        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" data-testid="save-employee-btn">
            {isEdit ? 'Save Changes' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}
