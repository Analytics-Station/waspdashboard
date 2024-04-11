import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { MainAppBar } from '../../components';
import { AuthService, User } from '../../shared';

export const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authService = new AuthService();

  const [loggedUser, setLoggedUser] = useState<User>(new User({}));

  useEffect(() => {
    authenticateUser();
  }, []);

  const authenticateUser = async () => {
    try {
      if (!authService.isUserLoggedIn()) {
        const user = await authService.verifyToken(navigate, location);
        setLoggedUser(user);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!authService.isUserLoggedIn()) {
    return null;
  }

  return (
    <Box className="tw-h-full tw-overflow-y-hidden tw-flex tw-flex-col">
      <MainAppBar user={loggedUser} />
      <Box className="tw-flex-1 tw-overflow-y-auto">
        <Outlet />
      </Box>
    </Box>
  );
};
