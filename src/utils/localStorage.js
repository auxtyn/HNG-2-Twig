// Local Storage utilities for tickets and users

const STORAGE_KEYS = {
  TICKETS: 'tickets',
  USERS: 'users'
};

// Generic functions
export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return [];
  }
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

// Ticket-specific functions
export const getTickets = () => getFromStorage(STORAGE_KEYS.TICKETS);

export const saveTickets = (tickets) => saveToStorage(STORAGE_KEYS.TICKETS, tickets);

export const addTicket = (ticket) => {
  const tickets = getTickets();
  tickets.push(ticket);
  return saveTickets(tickets);
};

export const updateTicket = (id, updatedTicket) => {
  const tickets = getTickets();
  const index = tickets.findIndex(ticket => ticket.id === id);
  if (index !== -1) {
    tickets[index] = { ...updatedTicket, updatedAt: new Date().toISOString() };
    return saveTickets(tickets);
  }
  return false;
};

export const deleteTicket = (id) => {
  const tickets = getTickets();
  const filteredTickets = tickets.filter(ticket => ticket.id !== id);
  return saveTickets(filteredTickets);
};

export const getTicketById = (id) => {
  const tickets = getTickets();
  return tickets.find(ticket => ticket.id === id);
};

// User-specific functions (for future extensions)
export const getUsers = () => getFromStorage(STORAGE_KEYS.USERS);

export const saveUsers = (users) => saveToStorage(STORAGE_KEYS.USERS, users);

// Initialize with sample data if empty (for development)
export const initializeSampleData = () => {
  // Sample tickets
  if (getTickets().length === 0) {
    const sampleTickets = [
      {
        id: '1',
        title: 'Bug: Login button not working',
        description: 'Users cannot log in using the login button on the homepage.',
        status: 'open',
        priority: 'high',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z'
      },
      {
        id: '2',
        title: 'Feature: Add dark mode',
        description: 'Implement dark mode toggle for better user experience.',
        status: 'pending',
        priority: 'medium',
        createdAt: '2024-01-16T14:30:00.000Z',
        updatedAt: '2024-01-16T14:30:00.000Z'
      }
    ];
    saveTickets(sampleTickets);
  }

  // Sample users (admin and regular user)
  if (getUsers().length === 0) {
    const sampleUsers = [
      {
        id: '1',
        username: 'admin',
        password: btoa('admin123'), // hashed password
        role: 'admin',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: '2',
        username: 'user',
        password: btoa('user123'), // hashed password
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ];
    saveUsers(sampleUsers);
  }
};