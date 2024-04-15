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
  FormControlLabel,
  FormLabel,
  OutlinedInput,
  Switch,
} from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { makeRequest, RequestMethod } from '../../../shared';

interface Props {
  open: boolean;
  contactSaved: () => void;
  onCloseClicked: () => void;
}

const FormSchema = yup
  .object({
    name: yup.string().min(6),
    phone: yup.string().min(11),
    broadcast: yup.boolean(),
  })
  .required();

export const NewContact = ({ open, onCloseClicked, contactSaved }: Props) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      name: '',
      phone: '',
      broadcast: true,
    },
    resolver: yupResolver(FormSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await makeRequest(
        '/contacts',
        RequestMethod.POST,
        false,
        {
          contacts: [
            {
              name: data.name,
              phone: data.phone,
              broadcast: data.broadcast,
            },
          ],
        }
      );
      onClose();
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
    resetForm();
    contactSaved();
  };

  const onClose = () => {
    resetForm();
    onCloseClicked();
  };

  const resetForm = () => {
    setValue('name', '');
    setValue('phone', '');
    setValue('broadcast', true);
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>New Contact</DialogTitle>
        <Divider />
        <DialogContent>
          <Controller
            name="name"
            control={control}
            render={({ field: { ref, onChange, onBlur, ...field } }) => (
              <FormControl fullWidth>
                <FormLabel>Full name</FormLabel>
                <OutlinedInput
                  {...field}
                  ref={ref}
                  size="small"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.name}
                  fullWidth
                  placeholder="Full name"
                />
              </FormControl>
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field: { ref, onChange, onBlur, ...field } }) => (
              <FormControl fullWidth className="tw-my-4">
                <FormLabel>Phone number</FormLabel>
                <OutlinedInput
                  {...field}
                  ref={ref}
                  size="small"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.phone}
                  fullWidth
                  type="phone"
                  placeholder="Phone number (including country code)"
                />
              </FormControl>
            )}
          />

          <Controller
            name="broadcast"
            control={control}
            render={({ field: { ref, onChange, onBlur, value, ...field } }) => (
              <FormControlLabel
                control={
                  <Switch
                    {...field}
                    ref={ref}
                    onChange={onChange}
                    onBlur={onBlur}
                    checked={value}
                    {...field}
                  />
                }
                label="Can broadcast?"
              />
            )}
          />
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
