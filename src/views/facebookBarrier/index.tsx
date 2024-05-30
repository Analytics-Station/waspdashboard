import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Container, Grid, Typography } from '@mui/material';

import { MainAppBar } from '../../components';
import { fbLogin, makeRequest, RequestMethod } from '../../shared';

export const FacebookBarrier = () => {
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
        const accessToken = response.authResponse.code;
        //Use this token to call the debug_token API and get the shared WABA's ID
        console.log('accessToken', accessToken);
        verifyToken(accessToken);
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    });
  };

  const verifyToken = async (token: string) => {
    try {
      const response = await makeRequest<any, any>(
        '/facebook/verify-debug-token',
        RequestMethod.POST,
        true,
        {
          token,
        }
      );
      return Promise.resolve(response);
    } catch (e) {
      console.error(e);
      Promise.reject(e);
    }
  };

  return (
    <Box className="tw-h-full tw-overflow-y-hidden tw-flex tw-flex-col">
      <MainAppBar />
      <Box className="tw-flex-1 tw-overflow-y-auto">
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
                Please log in with your facebook account to continue
              </Typography>
              <Button
                variant="contained"
                disableElevation
                color="info"
                startIcon={
                  <FontAwesomeIcon icon={faFacebook} color="#FAFAFA" />
                }
                onClick={loginFB}
              >
                Continue with Facebook
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};
