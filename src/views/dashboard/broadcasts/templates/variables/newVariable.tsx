import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  OutlinedInput,
} from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { makeRequest, RequestMethod } from '../../../../../shared';

const FormSchema = yup
  .object({
    name: yup
      .string()
      .min(6)
      .matches(
        /^[a-zA-Z0-9_]*/,
        'This field contains only alphabets and underscores'
      ),
    value: yup.string().min(6),
  })
  .required();

export const NewTemplateVariable = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      name: '',
      value: '',
    },
    resolver: yupResolver(FormSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await makeRequest(
        '/broadcast-templates/variables',
        RequestMethod.POST,
        false,
        {
          name: data.name,
          value: data.value,
        }
      );
      navigate('/broadcasts/templates/variables/list');
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
    resetForm();
  };

  const resetForm = () => {
    setValue('name', '');
    setValue('value', '');
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          render={({ field: { ref, onChange, onBlur, ...field } }) => (
            <FormControl fullWidth className="tw-mb-4">
              <FormLabel>Name</FormLabel>
              <OutlinedInput
                {...field}
                ref={ref}
                size="small"
                onChange={onChange}
                onBlur={onBlur}
                error={!!errors.name}
                fullWidth
                placeholder="Variable name (no spaces)"
              />
            </FormControl>
          )}
        />
        <Controller
          name="value"
          control={control}
          render={({ field: { ref, onChange, onBlur, ...field } }) => (
            <FormControl fullWidth>
              <FormLabel>Value</FormLabel>
              <OutlinedInput
                {...field}
                ref={ref}
                size="small"
                onChange={onChange}
                onBlur={onBlur}
                error={!!errors.value}
                fullWidth
                placeholder="Variable value"
              />
            </FormControl>
          )}
        />
        {JSON.stringify(errors.name)}
        <Box className="tw-mt-6 tw-text-right">
          <LoadingButton
            className="tw-ml-auto"
            disabled={!isValid || !isDirty}
            variant="contained"
            disableElevation
            type="submit"
            loading={loading}
          >
            Save changes
          </LoadingButton>
        </Box>
      </form>
    </Container>
  );
};
