import React, { createContext, useContext, useEffect, useState } from 'react';

// Simple password hashing (not secure for production)
const hashPassword = (password) => btoa(password);

// Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Save user to localStorage
  const saveUserToStorage = (userData) => {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setUser(userData);
  };

  // Clear user from localStorage
  const clearUserFromStorage = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  // Login function
  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.username === username && u.password === hashPassword(password));

    if (foundUser) {
      saveUserToStorage(foundUser);
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  };

  // Register function
  const register = (username, password, role = 'user') => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user already exists
    if (users.find(u => u.username === username)) {
      return { success: false, error: 'Username already exists' };
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashPassword(password),
      role,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    saveUserToStorage(newUser);

    return { success: true };
  };

  // Logout function
  const logout = () => {
    clearUserFromStorage();
  };

  // Password reset simulation
  const resetPassword = (username) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    // Generate reset token (simulation)
    const resetToken = Math.random().toString(36).substring(2, 15);
    users[userIndex].resetToken = resetToken;
    users[userIndex].resetTokenExpiry = Date.now() + 3600000; // 1 hour

    localStorage.setItem('users', JSON.stringify(users));

    // Simulate sending email
    console.log(`Password reset link: ${resetToken}`);

    return { success: true, message: 'Password reset link sent (check console)' };
  };

  // Update password with reset token
  const updatePasswordWithToken = (token, newPassword) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.resetToken === token && u.resetTokenExpiry > Date.now());

    if (userIndex === -1) {
      return { success: false, error: 'Invalid or expired reset token' };
    }

    users[userIndex].password = hashPassword(newPassword);
    delete users[userIndex].resetToken;
    delete users[userIndex].resetTokenExpiry;

    localStorage.setItem('users', JSON.stringify(users));

    return { success: true };
  };

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!user) return false;

    switch (permission) {
      case 'admin':
        return user.role === 'admin';
      case 'manageOwnTickets':
        return user.role === 'user' || user.role === 'admin';
      case 'manageAllTickets':
        return user.role === 'admin';
      default:
        return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updatePasswordWithToken,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { useAuth };