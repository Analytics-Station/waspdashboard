import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Container, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';

import { fbLogin, initFacebookSdk } from '../../shared';

export const FacebookBarrier = () => {
  useEffect(() => {
    return () => {
      initFacebookSdk();
    };
  }, []);

  const loginFB = () => {
    console.log('reached log in button');
    fbLogin().then((response: any) => {
      console.log(response);
      if (response.status === 'connected') {
        console.log('Person is connected');
      } else {
        // something
      }

      if (response.authResponse) {
        const accessToken = response.authResponse;
        //Use this token to call the debug_token API and get the shared WABA's ID
        console.log('accessToken', accessToken);
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    });
  };

  return (
    <Container className="tw-h-full" maxWidth="xxl">
      <Grid
        container
        className="tw-h-full"
        alignItems="center"
        justifyContent="center"
      >
        {/* <Grid item xs={6}></Grid> */}
        <Grid item xs={6} className="tw-text-center">
          <Typography
            variant="h4"
            className="tw-font-bold tw-w-2/3 tw-mx-auto tw-mb-4"
          >
            Please log in your facebook account to continue
          </Typography>
          <Button
            variant="contained"
            disableElevation
            color="info"
            startIcon={<FontAwesomeIcon icon={faFacebook} color="#FAFAFA" />}
            onClick={loginFB}
          >
            Continue with Facebook
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
