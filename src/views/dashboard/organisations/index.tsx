import { Container, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const Organisations = () => {
  return (
    <Container maxWidth="xxl" className="tw-pt-12">
      <Typography variant="h4" className="tw-font-black">
        Organisations
      </Typography>
      <Typography variant="subtitle1" className="tw-mt-4">
        List of all the organisations in the system.
      </Typography>
      <Outlet />
    </Container>
  );
};

export * from './organisationList';
