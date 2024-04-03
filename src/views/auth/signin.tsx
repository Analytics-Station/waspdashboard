import {
  faCheckDouble,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  AlertColor,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import { makeRequest, RequestMethod } from '../../shared';

interface FormSchemaType {
  email: string;
  password: string;
}

const FormSchema = yup
  .object({
    email: yup.string().email('Enter a valid email address'),
    password: yup.string(),
  })
  .required();

export const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [alertType, setAlertType] = useState<AlertColor>('info');
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
    setDisableSubmit(true);
    setLoading(true);
    setLoading(true);
    try {
      const response = await makeRequest<FormSchemaType, string>(
        '/auth/signin',
        RequestMethod.POST,
        {
          email: data.email,
          password: data.password,
        }
      );
      // setAlertMessage(response.message);
      setAlertType('info');
    } catch (e) {
      setAlertType('error');
      // setAlertMessage(`${e}`);
    }
    setLoading(false);
    setValue('email', '');
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
              color={alertType}
              icon={
                <FontAwesomeIcon
                  icon={
                    alertType === 'info' ? faCheckDouble : faTriangleExclamation
                  }
                  className={
                    alertType === 'info'
                      ? 'tw-text-cyan-200'
                      : 'tw-text-red-600'
                  }
                />
              }
              className={`tw-my-4 tw-font-semibold tw-transition-transform tw-duration-500 tw-ease-in-out tw-z-0 ${
                alertType === 'info'
                  ? 'tw-border-cyan-200 tw-text-cyan-200'
                  : 'tw-border-red-600 tw-text-red-600'
              } ${
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
              disabled={!isValid || !isDirty || disableSubmit}
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
