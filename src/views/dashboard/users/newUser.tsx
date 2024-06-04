import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Country, isValidPhoneNumber } from 'react-phone-number-input';
import * as yup from 'yup';

import { InputPhone } from '../../../components/PhoneInput/PhoneInput';
import {
  makeRequest,
  RequestMethod,
  UserFormDataResponse,
} from '../../../shared';

interface Props {
  open: boolean;
  userSaved: () => void;
  onCloseClicked: () => void;
}

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

export const NewUser = ({ open, onCloseClicked, userSaved }: Props) => {
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
      role: -1,
    },
    resolver: yupResolver(FormSchema),
  });

  const [loading, setLoading] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<Country>('IN');
  const [roleList, setRoleList] = useState<any[]>([]);
  const watchPhone = watch('phone');

  useEffect(() => {
    fetchUserFormData();
  }, []);

  const fetchUserFormData = async () => {
    const response = await makeRequest<null, UserFormDataResponse>(
      `/users/formdata`,
      RequestMethod.GET,
      true
    );
    const message = new UserFormDataResponse(response.message);
    setRoleList(message.roles);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload: any = {
        name: data.name,
        email: data.email,
        phone: data.phone,
      };

      if (data.role > 0) {
        payload['role'] = data.role;
      }

      const response = await makeRequest(
        '/users',
        RequestMethod.POST,
        true,
        payload
      );
      onClose();
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
    resetForm();
    userSaved();
  };

  const onClose = () => {
    resetForm();
    onCloseClicked();
  };

  const resetForm = () => {
    setValue('name', '');
  };

  const disableForm = () => {
    if (!isValid || !isDirty) {
      return true;
    }
    if (watchPhone && !isValidPhoneNumber(watchPhone, currentCountry)) {
      return true;
    }
    return false;
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>New User</DialogTitle>
        <Divider />
        <DialogContent>
          <Controller
            name="name"
            control={control}
            render={({ field: { ref, onChange, onBlur, ...field } }) => (
              <FormControl fullWidth>
                <FormLabel>User's name</FormLabel>
                <OutlinedInput
                  {...field}
                  ref={ref}
                  size="small"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.name}
                  fullWidth
                  placeholder="User's name"
                />
              </FormControl>
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field: { ref, onChange, onBlur, ...field } }) => (
              <FormControl fullWidth className="tw-mt-4">
                <FormLabel>Email address</FormLabel>
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

          <Controller
            name="phone"
            control={control}
            render={({ field: { ref, onChange, ...field } }) => (
              <InputPhone
                {...field}
                fullWidth
                className="tw-mt-6"
                onChange={onChange}
                defaultCountry={currentCountry}
                error={!!errors.phone}
                label="Phone number"
                helperText={errors.phone ? errors.phone.message : ' '}
                onCountryChanged={setCurrentCountry}
              />
            )}
          />

          <Controller
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
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <LoadingButton
            disabled={disableForm()}
            variant="contained"
            disableElevation
            type="submit"
            loading={loading}
          >
            Save changes
          </LoadingButton>
          <Button
            onClick={() => onClose()}
            variant="outlined"
            disableElevation
            color="error"
          >
            Close
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
