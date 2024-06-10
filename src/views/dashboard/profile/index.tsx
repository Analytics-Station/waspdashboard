import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { Avatar, Button, Container, Divider, FormControl, Grid, OutlinedInput, Typography } from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Country, isValidPhoneNumber } from 'react-phone-number-input';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

import { FlexBox, PleaseWait } from '../../../components';
import { InputPhone } from '../../../components/PhoneInput/PhoneInput';
import { RootState } from '../../../redux';

const FormSchema = yup
  .object({
    name: yup.string().min(6),
    phone: yup
      .string()
      .matches(/^[a-zA-Z0-9_]*/, 'This field contains only numbers')
      .min(10),
    email: yup.string().email(),
    role: yup.number(),
  })
  .required();

export const Profile = () => {
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      name: loggedUser ? loggedUser.name : '',
      email: loggedUser ? loggedUser.email : '',
      phone: loggedUser ? loggedUser.phone : '',
      role: loggedUser ? loggedUser.role : -1,
    },
    resolver: yupResolver(FormSchema),
  });
  const watchPhone = watch('phone');

  const [currentCountry, setCurrentCountry] = useState<Country>('IN');

  const disableForm = () => {
    if (!isValid || !isDirty) {
      return true;
    }
    if (watchPhone && !isValidPhoneNumber(watchPhone, currentCountry)) {
      return true;
    }
    return false;
  };

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  if (!loggedUser) {
    return <PleaseWait />;
  }

  return (
    <Container maxWidth="xl" className="tw-mt-12">
      <FlexBox>
        <Avatar
          alt="Profile picture"
          src="./images/avatar_default.jpg"
          sx={{ width: 56, height: 56 }}
        />
        <Typography variant="h6" className="tw-ml-4">
          {loggedUser.name}
        </Typography>
      </FlexBox>
      <Divider className="tw-my-8" />

      <Grid container spacing={4}>
        <Grid item xs={12} md={2} className="tw-text-center">
          <Typography
            variant="subtitle2"
            className="tw-text-slate-400 tw-mb-4 tw-text-left"
          >
            PROFILE IMAGE
          </Typography>
          <img
            alt={loggedUser.name}
            src="./images/avatar_default.jpg"
            className="tw-w-full tw-rounded"
          />

          <Button
            variant="text"
            size="small"
            className="tw-mt-2"
            color="info"
            startIcon={<FontAwesomeIcon icon={faImage} color="#3498db" />}
          >
            Change profile image
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography
              variant="subtitle2"
              className="tw-text-slate-400 tw-mb-2 tw-text-left"
            >
              FULL NAME
            </Typography>
            <Controller
              name="name"
              control={control}
              render={({ field: { ref, onChange, onBlur, ...field } }) => (
                <FormControl fullWidth>
                  <OutlinedInput
                    {...field}
                    ref={ref}
                    size="small"
                    onChange={onChange}
                    onBlur={onBlur}
                    error={!!errors.name}
                    fullWidth
                    placeholder="Your name"
                  />
                </FormControl>
              )}
            />

            <Typography
              variant="subtitle2"
              className="tw-text-slate-400 tw-mt-6 tw-mb-2 tw-text-left"
            >
              EMAIL ADDRESS
            </Typography>
            <Controller
              name="email"
              control={control}
              render={({ field: { ref, onChange, onBlur, ...field } }) => (
                <FormControl fullWidth>
                  <OutlinedInput
                    {...field}
                    ref={ref}
                    size="small"
                    onChange={onChange}
                    onBlur={onBlur}
                    error={!!errors.name}
                    fullWidth
                    placeholder="User's email"
                  />
                </FormControl>
              )}
            />

            <Typography
              variant="subtitle2"
              className="tw-text-slate-400 tw-mt-6 tw-mb-2 tw-text-left"
            >
              PHONE NUMBER
            </Typography>
            <Controller
              name="phone"
              control={control}
              render={({ field: { ref, onChange, ...field } }) => (
                <InputPhone
                  {...field}
                  fullWidth
                  onChange={onChange}
                  defaultCountry={currentCountry}
                  error={!!errors.phone}
                  helperText={errors.phone ? errors.phone.message : ' '}
                  onCountryChanged={setCurrentCountry}
                />
              )}
            />

            {/* <Controller
            name="role"
            control={control}
            render={({ field: { ref, onChange, onBlur, ...field } }) => (
              <FormControl fullWidth className="tw-mt-2 tw-mb-2" size="small">
                <InputLabel id="role">Select role</InputLabel>
                <Select
                  labelId="role"
                  label="Select role"
                  {...field}
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.role}
                  fullWidth
                  placeholder="Organisation name"
                >
                  <MenuItem value={-1} disabled>
                    Select role
                  </MenuItem>
                  {roleList.map((role) => (
                    <MenuItem key={role} value={role[0]}>
                      {role[1]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          /> */}

            <FlexBox className="tw-mb-8">
              <Button
                className="tw-ml-auto"
                variant="contained"
                type="submit"
                disableElevation
                disabled={disableForm()}
              >
                Save changes
              </Button>
            </FlexBox>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};
