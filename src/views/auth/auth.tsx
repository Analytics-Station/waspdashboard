import { Container, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useAppDispatch, validateToken } from '../../redux';
import { LocalStorageItem } from '../../shared';

export const Auth = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLogged();
  }, []);

  const checkUserLogged = async () => {
    const token = localStorage.getItem(LocalStorageItem.TOKEN);
    if (token) {
      try {
        await dispatch(validateToken());
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
        <Grid item md={6} className="tw-bg-white"></Grid>
      </Grid>
      <Container maxWidth="xxl" className="tw-h-full tw-relative tw-z-10">
        <Grid container className="tw-h-full tw-items-center tw-justify-center">
          <Grid item sm={8} md={6} className="tw-text-center">
            <Grid container justifyContent="center">
              <Grid item xs={12} md={6}>
                <img
                  src="./images/wassp.svg"
                  alt="Wassp"
                  className="tw-w-full"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={10} md={6} className="tw-text-center">
            <Outlet />
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};
