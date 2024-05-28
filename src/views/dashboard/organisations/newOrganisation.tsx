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
  OutlinedInput,
} from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { makeRequest, RequestMethod } from '../../../shared';

interface Props {
  open: boolean;
  organisationSaved: () => void;
  onCloseClicked: () => void;
}

const FormSchema = yup
  .object({
    name: yup.string().min(6),
    phoneId: yup.string().min(6),
    waId: yup.string().min(6),
    appId: yup.string().min(6),
  })
  .required();

export const NewOrganisation = ({
  open,
  onCloseClicked,
  organisationSaved,
}: Props) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      name: '',
      phoneId: '',
      waId: '',
      appId: '',
    },
    resolver: yupResolver(FormSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await makeRequest(
        '/organisations',
        RequestMethod.POST,
        true,
        {
          name: data.name,
          phoneId: data.phoneId,
          waId: data.waId,
          appId: data.appId,
        }
      );
      onClose();
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
    resetForm();
    organisationSaved();
  };

  const onClose = () => {
    resetForm();
    onCloseClicked();
  };

  const resetForm = () => {
    setValue('name', '');
    setValue('phoneId', '');
    setValue('waId', '');
    setValue('appId', '');
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>New Organisation</DialogTitle>
        <Divider />
        <DialogContent>
          <Controller
            name="name"
            control={control}
            render={({ field: { ref, onChange, onBlur, ...field } }) => (
              <FormControl fullWidth>
                <FormLabel>Organisation name</FormLabel>
                <OutlinedInput
                  {...field}
                  ref={ref}
                  size="small"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.name}
                  fullWidth
                  placeholder="Organisation name"
                />
              </FormControl>
            )}
          />

          <Controller
            name="phoneId"
            control={control}
            render={({ field: { ref, onChange, onBlur, ...field } }) => (
              <FormControl fullWidth>
                <FormLabel>WhatsApp Phone ID</FormLabel>
                <OutlinedInput
                  {...field}
                  ref={ref}
                  size="small"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.name}
                  fullWidth
                  placeholder="WA Phone ID"
                />
              </FormControl>
            )}
          />

          <Controller
            name="waId"
            control={control}
            render={({ field: { ref, onChange, onBlur, ...field } }) => (
              <FormControl fullWidth>
                <FormLabel>WhatsApp ID</FormLabel>
                <OutlinedInput
                  {...field}
                  ref={ref}
                  size="small"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.name}
                  fullWidth
                  placeholder="WA ID"
                />
              </FormControl>
            )}
          />

          <Controller
            name="appId"
            control={control}
            render={({ field: { ref, onChange, onBlur, ...field } }) => (
              <FormControl fullWidth>
                <FormLabel>WhatsApp application ID</FormLabel>
                <OutlinedInput
                  {...field}
                  ref={ref}
                  size="small"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.name}
                  fullWidth
                  placeholder="WA application ID"
                />
              </FormControl>
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
