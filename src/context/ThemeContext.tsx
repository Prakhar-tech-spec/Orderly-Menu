import React, { createContext, useContext, ReactNode } from 'react';

interface ThemeContextType {
  colors: {
    background: string;
    accent: string;
    text: string;
    white: string;
    highlight: string;
  };
}

const theme: ThemeContextType = {
  colors: {
    background: '#F7F7F7',
    accent: '#E04D09',
    text: '#050504',
    white: '#FFFFFF',
    highlight: '#F5C000',
  },
};

const ThemeContext = createContext<ThemeContextType>(theme);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}; 