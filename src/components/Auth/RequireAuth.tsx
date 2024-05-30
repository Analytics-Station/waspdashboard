import React from 'react';
import { Navigate } from 'react-router-dom';

import { AuthService } from '../../shared';

interface Props {
  children: React.ReactNode;
}

const RequireAuth = ({ children }: Props) => {
  const authService = new AuthService();

  if (authService.isUserLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAuth;
