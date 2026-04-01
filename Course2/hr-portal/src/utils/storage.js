// JSON-based data storage utility using localStorage

const KEYS = {
  USERS: 'hr_portal_users',
  LEAVES: 'hr_portal_leaves',
  SESSION: 'hr_portal_session',
};

function getCollection(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setCollection(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// --- User operations ---

export function getUsers() {
  return getCollection(KEYS.USERS);
}

export function getUserById(id) {
  return getUsers().find((u) => u.id === id) || null;
}

export function getUserByEmail(email) {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function createUser(user) {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
    throw new Error('A user with this email already exists');
  }
  users.push(user);
  setCollection(KEYS.USERS, users);
  return user;
}

export function updateUser(id, updates) {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) throw new Error('User not found');
  users[index] = { ...users[index], ...updates };
  setCollection(KEYS.USERS, users);
  return users[index];
}

export function deleteUser(id) {
  const users = getUsers().filter((u) => u.id !== id);
  setCollection(KEYS.USERS, users);
}

// --- Leave operations ---

export function getLeaveRequests() {
  return getCollection(KEYS.LEAVES);
}

export function getLeavesByEmployee(employeeId) {
  return getLeaveRequests().filter((l) => l.employeeId === employeeId);
}

export function createLeaveRequest(leave) {
  const leaves = getLeaveRequests();
  leaves.push(leave);
  setCollection(KEYS.LEAVES, leaves);
  return leave;
}

export function updateLeaveRequest(id, updates) {
  const leaves = getLeaveRequests();
  const index = leaves.findIndex((l) => l.id === id);
  if (index === -1) throw new Error('Leave request not found');
  leaves[index] = { ...leaves[index], ...updates };
  setCollection(KEYS.LEAVES, leaves);
  return leaves[index];
}

// --- Session operations ---

export function getSession() {
  const data = localStorage.getItem(KEYS.SESSION);
  return data ? JSON.parse(data) : null;
}

export function setSession(user) {
  localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(KEYS.SESSION);
}
