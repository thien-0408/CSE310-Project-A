import { useState, useEffect } from 'react';

const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken'); 
  }
  return null;
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token); 
  }, []);

  return { isAuthenticated };
};