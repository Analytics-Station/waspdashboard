import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Container, Grid, Typography } from '@mui/material';

import { MainAppBar } from '../../components';
import { useAppDispatch, validateToken } from '../../redux';
import { fbLogin, makeRequest, RequestMethod } from '../../shared';

export const FacebookBarrier = () => {
  const dispatch = useAppDispatch();
  const loginFB = async () => {
    const response: any = await fbLogin();
    if (response.authResponse) {
      const accessToken = response.authResponse.code;
      await verifyToken(accessToken);
      dispatch(validateToken());
    } else {
      console.log('User cancelled login or did not fully authorize.');
    }
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
