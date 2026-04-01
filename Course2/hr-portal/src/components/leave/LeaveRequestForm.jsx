import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createLeaveRequest } from '../../utils/storage';
import { v4 as uuidv4 } from 'uuid';

export default function LeaveRequestForm({ onClose, onSuccess }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [errors, setErrors] = useState({});

  const leaveTypes = [
    { value: 'annual', label: 'Annual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'personal', label: 'Personal Leave' },
    { value: 'maternity', label: 'Maternity/Paternity Leave' },
    { value: 'unpaid', label: 'Unpaid Leave' },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.type) errs.type = 'Leave type is required';
    if (!form.startDate) errs.startDate = 'Start date is required';
    if (!form.endDate) errs.endDate = 'End date is required';
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      errs.endDate = 'End date must be after start date';
    }
    if (!form.reason.trim()) errs.reason = 'Reason is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    createLeaveRequest({
      id: `lv-${uuidv4().slice(0, 8)}`,
      employeeId: user.id,
      employeeName: `${user.firstName} ${user.lastName}`,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
    });

    onSuccess?.();
    onClose();
  };

  return (
    <div data-testid="leave-request-form">
      <div className="modal-header">
        <h2>Apply for Leave</h2>
        <button className="btn-close" onClick={onClose} aria-label="Close">&times;</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="leave-type">Leave Type *</label>
          <select id="leave-type" name="type" value={form.type} onChange={handleChange}>
            <option value="">Select leave type</option>
            {leaveTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {errors.type && <span className="field-error">{errors.type}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="start-date">Start Date *</label>
            <input id="start-date" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
            {errors.startDate && <span className="field-error">{errors.startDate}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="end-date">End Date *</label>
            <input id="end-date" name="endDate" type="date" value={form.endDate} onChange={handleChange} />
            {errors.endDate && <span className="field-error">{errors.endDate}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="leave-reason">Reason *</label>
          <textarea
            id="leave-reason"
            name="reason"
            rows="3"
            placeholder="Describe your reason for leave..."
            value={form.reason}
            onChange={handleChange}
          />
          {errors.reason && <span className="field-error">{errors.reason}</span>}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" data-testid="submit-leave-btn">Submit Request</button>
        </div>
      </form>
    </div>
  );
}
