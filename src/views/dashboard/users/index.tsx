import { Container, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const Users = () => {
  return (
    <Container maxWidth="xxl" className="tw-pt-12">
      <Typography variant="h4" className="tw-font-black">
        Users
      </Typography>
      <Typography variant="subtitle1" className="tw-mt-4">
        List of all the users in the system. You can filter by roles and search
        keywords
      </Typography>
      <Outlet />
    </Container>
  );
};

export * from './userList';
