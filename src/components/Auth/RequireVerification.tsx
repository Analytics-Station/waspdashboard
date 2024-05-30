import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { RootState } from '../../redux';

interface Props {
  children: React.ReactNode;
}

export const RequireVerification = ({ children }: Props) => {
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  if (loggedUser) {
    if (!loggedUser.isOrganisationRole()) {
      return children;
    }
    if (loggedUser.organisation && loggedUser.organisation.verified) {
      return children;
    }
  }
  return <Navigate to="/facebook-login" replace />;
};
