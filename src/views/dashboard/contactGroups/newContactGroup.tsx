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
  contactGroupSaved: () => void;
  onCloseClicked: () => void;
}

const FormSchema = yup
  .object({
    name: yup.string().min(6),
  })
  .required();

export const NewContactGroup = ({
  open,
  onCloseClicked,
  contactGroupSaved,
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
    },
    resolver: yupResolver(FormSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await makeRequest(
        '/contact-groups',
        RequestMethod.POST,
        true,
        {
          name: data.name,
        }
      );
      onClose();
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
    resetForm();
    contactGroupSaved();
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
        <DialogTitle>New Contact Group</DialogTitle>
        <Divider />
        <DialogContent>
          <Controller
            name="name"
            control={control}
            render={({ field: { ref, onChange, onBlur, ...field } }) => (
              <FormControl fullWidth>
                <FormLabel>Group name</FormLabel>
                <OutlinedInput
                  {...field}
                  ref={ref}
                  size="small"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.name}
                  fullWidth
                  placeholder="Group name"
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
