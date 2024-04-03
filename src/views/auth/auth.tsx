import { Container, Grid } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const Auth = () => {
  return (
    <Container maxWidth={false} className="tw-h-full tw-bg-white">
      <Grid container className="tw-h-full tw-fixed tw-bg-blue-600 tw-z-0">
        <Grid item sm={6} className="tw-bg-white"></Grid>
      </Grid>
      <Container maxWidth="xxl" className="tw-h-full tw-relative tw-z-10">
        <Grid container className="tw-h-full tw-items-center">
          <Grid item sm={6} className="tw-bg-white tw-text-center">
            <img src="./images/logo.png" alt="Wasp" />
          </Grid>
          <Grid item sm={6} className="tw-text-center">
            <Outlet />
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};
