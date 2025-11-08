'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/types/useAuth'; // Thay thế đường dẫn

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/'); 
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === null) {
    return (
        <div className="flex justify-center items-center h-screen">
            Checking Authentication
        </div>
    ); 
  }

  if (isAuthenticated === true) {
    return <>{children}</>;
  }
  
  return null; 
};

export default AuthGuard;