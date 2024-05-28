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
import * as yup from 'yup';

import {
  AuthService,
  makeRequest,
  Organisation,
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
    organisationId: yup.number(),
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
      organisationId: -1,
    },
    resolver: yupResolver(FormSchema),
  });

  const [loading, setLoading] = useState(false);
  const [organisationList, setOrganisationList] = useState<Organisation[]>([]);
  const [roleList, setRoleList] = useState<any[]>([]);
  const watchRole = watch('role');

  const authService = new AuthService();

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
    setOrganisationList(message.organisations);
    setRoleList(message.roles);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload: any = {
        name: data.name,
        email: data.email,
        phone: `+${data.phone}`,
      };

      if (data.role > 0) {
        payload['role'] = data.role;
      }
      if (data.organisationId > 0) {
        payload['organisationId'] = data.organisationId;
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
            render={({ field: { ref, onChange, onBlur, ...field } }) => (
              <FormControl fullWidth className="tw-mt-4">
                <FormLabel>Phone number</FormLabel>
                <OutlinedInput
                  {...field}
                  ref={ref}
                  size="small"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.name}
                  fullWidth
                  type="tel"
                  placeholder="User's phone with (country code)"
                />
              </FormControl>
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field: { ref, onChange, onBlur, ...field } }) => (
              <FormControl fullWidth className="tw-mt-4 tw-mb-2" size="small">
                <InputLabel id="organisationId">Select role</InputLabel>
                <Select
                  labelId="organisationId"
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

          {authService.getUserRole() === 1 &&
            [1, 2].includes(watchRole || -1) && (
              <Controller
                name="organisationId"
                control={control}
                render={({ field: { ref, onChange, onBlur, ...field } }) => (
                  <FormControl
                    fullWidth
                    className="tw-mt-4 tw-mb-2"
                    size="small"
                  >
                    <InputLabel id="organisationId">
                      Select organisation
                    </InputLabel>
                    <Select
                      labelId="organisationId"
                      label="Select organisation"
                      {...field}
                      ref={ref}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={!!errors.organisationId}
                      fullWidth
                      placeholder="Organisation name"
                    >
                      <MenuItem value={-1} disabled>
                        Select organisation
                      </MenuItem>
                      {organisationList.map((organisation) => (
                        <MenuItem key={organisation.id} value={organisation.id}>
                          {organisation.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            )}
        </DialogContent>
        <Divider />
        <DialogActions>
          <LoadingButton
            disabled={!isValid || !isDirty}
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
