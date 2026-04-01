// Seed data for the HR Portal application
// This data is loaded into localStorage on first run

export const seedUsers = [
  {
    id: 'usr-001',
    email: 'admin@hrportal.com',
    password: 'Admin@123',
    role: 'hr',
    firstName: 'Sarah',
    lastName: 'Johnson',
    department: 'Human Resources',
    position: 'HR Manager',
    phone: '+1-555-0100',
    joinDate: '2020-01-15',
    status: 'active',
  },
  {
    id: 'usr-002',
    email: 'john.doe@hrportal.com',
    password: 'Employee@123',
    role: 'employee',
    firstName: 'John',
    lastName: 'Doe',
    department: 'Engineering',
    position: 'Senior Developer',
    phone: '+1-555-0101',
    joinDate: '2021-03-20',
    status: 'active',
  },
  {
    id: 'usr-003',
    email: 'jane.smith@hrportal.com',
    password: 'Employee@123',
    role: 'employee',
    firstName: 'Jane',
    lastName: 'Smith',
    department: 'Marketing',
    position: 'Marketing Specialist',
    phone: '+1-555-0102',
    joinDate: '2022-06-10',
    status: 'active',
  },
  {
    id: 'usr-004',
    email: 'mike.wilson@hrportal.com',
    password: 'Employee@123',
    role: 'employee',
    firstName: 'Mike',
    lastName: 'Wilson',
    department: 'Finance',
    position: 'Financial Analyst',
    phone: '+1-555-0103',
    joinDate: '2023-01-05',
    status: 'active',
  },
];

export const seedLeaveRequests = [
  {
    id: 'lv-001',
    employeeId: 'usr-002',
    employeeName: 'John Doe',
    type: 'annual',
    startDate: '2026-04-10',
    endDate: '2026-04-14',
    reason: 'Family vacation',
    status: 'pending',
    appliedOn: '2026-03-25',
  },
  {
    id: 'lv-002',
    employeeId: 'usr-003',
    employeeName: 'Jane Smith',
    type: 'sick',
    startDate: '2026-03-28',
    endDate: '2026-03-29',
    reason: 'Medical appointment',
    status: 'approved',
    appliedOn: '2026-03-26',
    reviewedBy: 'Sarah Johnson',
    reviewedOn: '2026-03-27',
  },
];

export function initializeData() {
  if (!localStorage.getItem('hr_portal_initialized')) {
    localStorage.setItem('hr_portal_users', JSON.stringify(seedUsers));
    localStorage.setItem('hr_portal_leaves', JSON.stringify(seedLeaveRequests));
    localStorage.setItem('hr_portal_initialized', 'true');
  }
}
