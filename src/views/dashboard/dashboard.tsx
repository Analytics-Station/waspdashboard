import { Box } from '@mui/material';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { MainAppBar } from '../../components';
import { AuthService } from '../../shared';

export const Dashboard = () => {
  const navigate = useNavigate();
  const authService = new AuthService();

  useEffect(() => {
    if (!authService.isUserLoggedIn()) {
      navigate('/auth/signin');
    }
  }, []);

  return (
    <Box className="tw-h-full tw-overflow-y-hidden tw-flex tw-flex-col">
      <MainAppBar user={authService.loggedUser} />
      <Box className="tw-flex-1 tw-overflow-y-auto">
        <Outlet />
      </Box>
    </Box>
  );
};
