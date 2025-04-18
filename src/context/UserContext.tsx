import React, { createContext, useState, useContext, useEffect } from 'react';

interface UserContextType {
  userIP: string;
  deviceId: string;
  tableNumber: string;
  setTableNumber: (tableNumber: string) => void;
  isLoading: boolean;
  validateAndSetTableNumber: (value: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userIP, setUserIP] = useState<string>('');
  const [deviceId, setDeviceId] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Generate or retrieve device ID
  useEffect(() => {
    const storedDeviceId = localStorage.getItem('deviceId');
    if (storedDeviceId) {
      setDeviceId(storedDeviceId);
    } else {
      const newDeviceId = 'device_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('deviceId', newDeviceId);
      setDeviceId(newDeviceId);
    }

    // Retrieve stored table number
    const storedTableNumber = localStorage.getItem('tableNumber');
    if (storedTableNumber && parseInt(storedTableNumber) >= 1) {
      setTableNumber(storedTableNumber);
    }
  }, []);

  // Fetch user's IP address
  useEffect(() => {
    const getIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIP(data.ip);
      } catch (error) {
        console.error('Error fetching IP:', error);
        setUserIP('unknown');
      } finally {
        setIsLoading(false);
      }
    };
    getIP();
  }, []);

  // Validate and set table number
  const validateAndSetTableNumber = (value: string): boolean => {
    const numValue = parseInt(value);
    if (numValue >= 1) {
      setTableNumber(value);
      localStorage.setItem('tableNumber', value);
      return true;
    }
    return false;
  };

  // Store table number when it changes
  useEffect(() => {
    if (tableNumber && parseInt(tableNumber) >= 1) {
      localStorage.setItem('tableNumber', tableNumber);
    }
  }, [tableNumber]);

  const value = {
    userIP,
    deviceId,
    tableNumber,
    setTableNumber,
    isLoading,
    validateAndSetTableNumber
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext; 