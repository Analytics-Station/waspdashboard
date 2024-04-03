import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

interface FormSchemaType {
  email: string;
}

const FormSchema = yup
  .object({
    email: yup
      .string()
      .email('Enter a valid email address')
      .nullable()
      .transform((curr, orig) => (orig === '' ? null : curr)),
  })
  .required();

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(FormSchema),
  });

  const onSubmit = async (data: any) => {
    setDisableSubmit(true);
    setLoading(true);
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
            <LoadingButton
              disabled={!isValid || !isDirty || disableSubmit}
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
