import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Alert, Button, Container, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import { loginWithEmail, RootState, useAppDispatch } from '../../redux';

const FormSchema = yup
  .object({
    email: yup.string().email('Enter a valid email address'),
    password: yup.string(),
  })
  .required();

export const SignIn = () => {
  const dispatch = useAppDispatch();
  const loading = useSelector((state: RootState) => state.app.loading);

  const [alertMessage, setAlertMessage] = useState('');

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(FormSchema),
  });

  const onSubmit = async (data: any) => {
    dispatch(loginWithEmail(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Container maxWidth="xs">
        <Typography variant="h2" className="tw-font-black tw-text-yellow-400">
          Sign In
        </Typography>
        <Typography variant="h6" className="tw-text-white tw-mb-12">
          Login to stay connected!
        </Typography>
        <Grid container>
          <Grid item sm={12}>
            <Controller
              name="email"
              control={control}
              render={({ field: { ref, onChange, onBlur, ...field } }) => (
                <TextField
                  {...field}
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.email}
                  autoComplete="off"
                  fullWidth
                  label="Email address"
                  variant="outlined"
                  type="email"
                  InputLabelProps={{
                    className: 'tw-text-slate-100',
                  }}
                />
              )}
            />
          </Grid>
          <Grid item sm={12}>
            <Controller
              name="password"
              control={control}
              render={({ field: { ref, onChange, onBlur, ...field } }) => (
                <TextField
                  className="tw-mt-8"
                  {...field}
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.email}
                  autoComplete="off"
                  fullWidth
                  label="Password"
                  variant="outlined"
                  type="password"
                  InputLabelProps={{
                    className: 'tw-text-slate-100',
                  }}
                />
              )}
            />
          </Grid>
          <Grid item sm={12}>
            <Alert
              variant="outlined"
              icon={
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="tw-text-white"
                />
              }
              className={`tw-my-4 tw-font-semibold tw-transition-transform tw-duration-500 tw-ease-in-out tw-z-0 tw-border-white tw-text-white ${
                alertMessage.length
                  ? 'tw-opacity-100 tw--translate-y-0'
                  : 'tw-opacity-0 tw--translate-y-10'
              }`}
            >
              {alertMessage}
            </Alert>
          </Grid>
          <Grid item sm={12}>
            <LoadingButton
              disabled={!isValid || !isDirty}
              size="large"
              variant="contained"
              className="tw-w-3/4 tw-font-bold tw-mb-12"
              disableElevation
              type="submit"
              loading={loading}
            >
              Continue
            </LoadingButton>
          </Grid>
          <Grid item sm={12}>
            <Link to="/auth/register">
              <Button>Register now</Button>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </form>
  );
};
