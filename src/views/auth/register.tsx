import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { makeRequest, RequestMethod } from '../../shared';

const FormSchema = yup
  .object({
    name: yup.string().min(6),
    phone: yup
      .string()
      .matches(/^[a-zA-Z0-9_]*/, 'This field contains only numbers')
      .min(10),
    email: yup.string().email(),
    password: yup.string().min(6).required(),
    cpassword: yup.string().min(6).required(),
  })
  .required();

export const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      cpassword: '',
    },
    resolver: yupResolver(FormSchema),
  });
  const watchPassword = watch('password');
  const watchCpassword = watch('cpassword');

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload: any = {
        name: data.name,
        email: data.email,
        phone: `+${data.phone}`,
        password: data.password,
      };

      if (data.role > 0) {
        payload['role'] = data.role;
      }

      const response = await makeRequest(
        '/auth/signup',
        RequestMethod.POST,
        true,
        payload
      );
      navigate('/auth/signin');
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const disableForm = (): boolean => {
    if (!isValid || !isDirty || loading) {
      return true;
    }
    if (watchPassword !== watchCpassword) {
      return true;
    }
    return false;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container maxWidth="xs">
        <Typography variant="h2" className="tw-font-black tw-text-yellow-400">
          Register
        </Typography>
        <Typography variant="h6" className="tw-text-white tw-mb-12">
          Sign up with us
        </Typography>
        <Grid container>
          <Grid item sm={12}>
            <Controller
              name="name"
              control={control}
              render={({ field: { ref, onChange, onBlur, ...field } }) => (
                <TextField
                  {...field}
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.name}
                  fullWidth
                  label="Full name"
                  variant="outlined"
                  InputLabelProps={{
                    className: 'tw-text-slate-100',
                  }}
                  className="tw-mb-4"
                />
              )}
            />
          </Grid>
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
                  className="tw-mb-4"
                />
              )}
            />
          </Grid>
          <Grid item sm={12}>
            <Controller
              name="phone"
              control={control}
              render={({ field: { ref, onChange, onBlur, ...field } }) => (
                <TextField
                  {...field}
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.phone}
                  fullWidth
                  label="Phone number (with country code)"
                  variant="outlined"
                  type="tel"
                  InputLabelProps={{
                    className: 'tw-text-slate-100',
                  }}
                  className="tw-mb-4"
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
                  {...field}
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.password}
                  fullWidth
                  label="Password"
                  variant="outlined"
                  type="password"
                  InputLabelProps={{
                    className: 'tw-text-slate-100',
                  }}
                  className="tw-mb-4"
                />
              )}
            />
          </Grid>
          <Grid item sm={12}>
            <Controller
              name="cpassword"
              control={control}
              render={({ field: { ref, onChange, onBlur, ...field } }) => (
                <TextField
                  {...field}
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.cpassword}
                  fullWidth
                  label="Confirm password"
                  variant="outlined"
                  type="password"
                  InputLabelProps={{
                    className: 'tw-text-slate-100',
                  }}
                  className="tw-mb-4"
                />
              )}
            />
          </Grid>
          <Grid item sm={12}>
            <LoadingButton
              disabled={disableForm()}
              color="success"
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
            <Link to="/auth/signin">
              <Button>Login instead</Button>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </form>
  );
};
