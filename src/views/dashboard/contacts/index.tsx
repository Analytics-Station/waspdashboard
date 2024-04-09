import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Container,
  FormControl,
  Grid,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

const FormSchema = yup
  .object({
    query: yup.string(),
  })
  .required();

export const Contacts = () => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      query: '',
    },
    resolver: yupResolver(FormSchema),
  });

  return (
    <Container maxWidth="xxl" className="tw-pt-12">
      <Typography variant="h4" className="tw-font-black">
        Contacts
      </Typography>
      <Typography variant="subtitle1" className="tw-mt-4 tw-w-4/12">
        Contact list stores the list of numbers that you've interacted with. You
        can even manually export or import contacts.
      </Typography>

      <Box className="tw-bg-slate-100 tw-p-6 tw-my-8 tw-rounded-lg">
        <Grid container>
          <Grid item sm={3}>
            <Controller
              name="query"
              control={control}
              render={({ field: { ref, onChange, onBlur, ...field } }) => (
                <FormControl fullWidth>
                  <OutlinedInput
                    {...field}
                    ref={ref}
                    size="small"
                    onChange={onChange}
                    onBlur={onBlur}
                    error={!!errors.query}
                    className="tw-bg-white"
                    placeholder="Search contacts..."
                  />
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
