import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const Dashboard = () => {
  return (
    <Box>
      <Outlet />
    </Box>
  );
};
