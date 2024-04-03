import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import { MainAppBar } from '../../components';

export const Dashboard = () => {
  return (
    <Box>
      <MainAppBar />
      <Outlet />
    </Box>
  );
};
