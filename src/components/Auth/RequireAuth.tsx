import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { RootState } from '../../redux';

interface Props {
  children: React.ReactNode;
}

export const RequireAuth = ({ children }: Props) => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};