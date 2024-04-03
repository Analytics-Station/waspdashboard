import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import {
  AuthService,
  LocalStorageItem,
  LoginRequest,
  LoginResponse,
  makeRequest,
  RequestMethod,
} from '../../shared';

const FormSchema = yup
  .object({
    email: yup.string().email('Enter a valid email address'),
    password: yup.string(),
  })
  .required();

export const SignIn = () => {
  const navigate = useNavigate();
  const authService = new AuthService();

  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const response = await makeRequest<LoginRequest, LoginResponse>(
        '/auth/signin',
        RequestMethod.POST,
        false,
        {
          email: data.email,
          password: data.password,
        }
      );
      localStorage.setItem(LocalStorageItem.Token, response.message.token);
      authService.setUserLoggedIn(response.message.user);
      navigate('/');
    } catch (e) {
      setAlertMessage(`${e}`);
    }
    setLoading(false);
    setValue('email', '');
    setValue('password', '');
    setTimeout(() => {
      setAlertMessage('');
    }, 5000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container maxWidth="xs">
        <Typography variant="h2" className="tw-font-black tw-text-yellow-400">
          Sign In
        </Typography>
        <Typography variant="h6" className="tw-text-white tw-mb-12">
          Login to stay connected
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
