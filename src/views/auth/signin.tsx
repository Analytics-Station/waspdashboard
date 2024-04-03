import { Button, Container, Grid, TextField, Typography } from '@mui/material';

export const SignIn = () => {
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
            <form>
              <Container maxWidth="xs">
                <Typography
                  variant="h2"
                  className="tw-font-black tw-text-yellow-400"
                >
                  Sign In
                </Typography>
                <Typography variant="h6" className="tw-text-white tw-mb-12">
                  Login to stay connected
                </Typography>
                <Grid container>
                  <Grid item sm={12}>
                    <TextField
                      fullWidth
                      label="Email address"
                      variant="outlined"
                      type="email"
                      InputLabelProps={{
                        className: 'tw-text-slate-100',
                      }}
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <TextField
                      className="tw-my-8"
                      fullWidth
                      label="Password"
                      variant="outlined"
                      type="password"
                      InputLabelProps={{
                        className: 'tw-text-slate-100',
                      }}
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <Button
                      variant="contained"
                      size="large"
                      disableElevation
                      className="tw-w-3/4 tw-font-bold tw-mb-12"
                    >
                      Continue
                    </Button>
                  </Grid>
                  <Grid item sm={12}>
                    <Button size="large" disableElevation>
                      Register now
                    </Button>
                  </Grid>
                </Grid>
              </Container>
            </form>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};
