import React, { useState } from 'react';
const UserContext = React.createContext();

// eslint-disable-next-line react/prop-types
const UserProvider = ({ children }) => {
  const user = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  const setUser = (newUser) => {
    user.current = newUser;
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
