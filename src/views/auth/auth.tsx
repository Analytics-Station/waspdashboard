import { Container, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { AuthService, LocalStorageItem } from '../../shared';

export const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authService = new AuthService();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLogged();
  }, []);

  const checkUserLogged = async () => {
    const token = localStorage.getItem(LocalStorageItem.Token);
    if (token) {
      try {
        await authService.verifyToken(navigate, location);
      } catch (e) {
        console.log(e);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return null;
  }

  return (
    <Container
      maxWidth={false}
      className="tw-h-full tw-bg-white"
      disableGutters
    >
      <Grid container className="tw-h-full tw-fixed tw-bg-blue-600 tw-z-0">
        <Grid item sm={6} className="tw-bg-white"></Grid>
      </Grid>
      <Container maxWidth="xxl" className="tw-h-full tw-relative tw-z-10">
        <Grid container className="tw-h-full tw-items-center">
          <Grid item xs={10} sm={6} className="tw-bg-white tw-text-center">
            <Grid container justifyContent="center">
              <Grid item lg={6}>
                <img
                  src="./images/logo.webp"
                  alt="Wasp"
                  className="tw-w-full"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={6} className="tw-text-center">
            <Outlet />
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};
