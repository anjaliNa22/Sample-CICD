import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USERS = [
  {
    id: 'usr-1',
    name: 'Alex Morgan',
    email: 'alex@erp.com',
    username: 'alex',
    password: '2222',
    role: 'Administrator',
    department: 'Platform Architecture',
    avatarInitials: 'AM',
    avatarColor: '#6366f1',
    joinedDate: 'Oct 2024',
    status: 'Active',
    lastActive: 'Just now'
  },
  {
    id: 'usr-2',
    name: 'Sarah Chen',
    email: 'sarah@erp.com',
    username: 'sarah',
    password: '2222',
    role: 'Lead DevOps Engineer',
    department: 'Cloud Infrastructure',
    avatarInitials: 'SC',
    avatarColor: '#06b6d4',
    joinedDate: 'Nov 2024',
    status: 'Active',
    lastActive: '12m ago'
  },
  {
    id: 'usr-3',
    name: 'Marcus Vance',
    email: 'marcus@erp.com',
    username: 'marcus',
    password: '2222',
    role: 'Principal Designer',
    department: 'User Experience',
    avatarInitials: 'MV',
    avatarColor: '#a855f7',
    joinedDate: 'Dec 2024',
    status: 'Active',
    lastActive: '1h ago'
  }
];

export function AuthProvider({ children }) {
  // Registered users stored in localStorage
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_users') || localStorage.getItem('nexus_users');
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  // Current logged in user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_current_user') || localStorage.getItem('nexus_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Theme state ('dark' | 'light')
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('erp_theme') || localStorage.getItem('nexus_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('erp_users', JSON.stringify(users));
    } catch (e) {
      console.error('Failed to sync users to localStorage', e);
    }
  }, [users]);

  // Sync current user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('erp_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('erp_current_user');
      }
    } catch (e) {
      console.error('Failed to sync current user', e);
    }
  }, [currentUser]);

  // Sync theme to HTML attribute and storage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('erp_theme', theme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  /**
   * Login function
   * - Static password requirement: '2222'
   * - Validates static password '2222' OR the user's customized password
   */
  const login = (identifier, password) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Verification check for password
    const isStaticPasswordValid = cleanPass === '2222';

    // Find user by email or username
    const foundUser = users.find(
      u => u.email.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId
    );

    if (foundUser) {
      if (isStaticPasswordValid || foundUser.password === cleanPass) {
        const activeUser = { ...foundUser, lastActive: 'Just now' };
        setCurrentUser(activeUser);
        return { success: true, user: activeUser };
      } else {
        return {
          success: false,
          error: 'Invalid password. (Static password is 2222)'
        };
      }
    }

    // If identifier is not in the list, but static password 2222 was provided:
    // Create an ad-hoc session so any username with password 2222 can seamlessly log in!
    if (isStaticPasswordValid && cleanId.length > 0) {
      const generatedName = identifier.split('@')[0];
      const initials = generatedName.slice(0, 2).toUpperCase();
      const newUser = {
        id: `usr-${Date.now()}`,
        name: generatedName.charAt(0).toUpperCase() + generatedName.slice(1),
        email: cleanId.includes('@') ? cleanId : `${cleanId}@erp.com`,
        username: cleanId.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'user',
        password: '2222',
        role: 'Verified Member',
        department: 'Operations',
        avatarInitials: initials,
        avatarColor: '#10b981',
        joinedDate: 'Just now',
        status: 'Active',
        lastActive: 'Just now'
      };

      setUsers(prev => [newUser, ...prev]);
      setCurrentUser(newUser);
      return { success: true, user: newUser, isNew: true };
    }

    return {
      success: false,
      error: 'User not found or invalid password. Please use static password: 2222'
    };
  };

  /**
   * Registration function
   */
  const register = ({ name, email, username, password, role = 'Member', department = 'Engineering' }) => {
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim() || '2222';

    if (!cleanName || !cleanEmail || !cleanUser) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    // Check if email or username already taken
    const exists = users.some(
      u => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanUser
    );

    if (exists) {
      return { success: false, error: 'An account with this email or username already exists.' };
    }

    // Compute initials and random vibrant color
    const parts = cleanName.split(' ');
    const initials = parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : cleanName.slice(0, 2).toUpperCase();

    const colors = ['#6366f1', '#06b6d4', '#a855f7', '#10b981', '#f59e0b', '#ec4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newUser = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      username: cleanUser,
      password: cleanPass, // Can be 2222 or custom
      role: role || 'Team Member',
      department: department || 'General',
      avatarInitials: initials,
      avatarColor: randomColor,
      joinedDate: 'Just now',
      status: 'Active',
      lastActive: 'Just now'
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);

    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        theme,
        toggleTheme,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
