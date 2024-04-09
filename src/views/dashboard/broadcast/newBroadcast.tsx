import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

interface Props {
  open: boolean;
  onCloseClicked: () => void;
}

const FormSchema = yup
  .object({
    broadcastName: yup.string(),
    templateId: yup.string(),
  })
  .required();

export const NewBroadcast = ({ open, onCloseClicked }: Props) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      broadcastName: '',
      templateId: '',
    },
    resolver: yupResolver(FormSchema),
  });

  const onSubmitClicked = () => {
    console.log('first');
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>New Broadcast</DialogTitle>
      <Divider />
      <DialogContent>
        <Typography variant="body1" className="tw-font-bold">
          What message do you want to send?
        </Typography>
        <Typography variant="subtitle2" className="tw-text-slate-400">
          Add broadcast name and template below
        </Typography>

        <Box className="tw-my-4 tw-p-4 tw-bg-slate-100 tw-rounded-lg">
          <Controller
            name="broadcastName"
            control={control}
            render={({ field: { ref, onChange, onBlur, ...field } }) => (
              <FormControl fullWidth>
                <FormLabel>Broadcast name</FormLabel>
                <OutlinedInput
                  {...field}
                  ref={ref}
                  size="small"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.broadcastName}
                  fullWidth
                  placeholder="Broadcast name"
                />
              </FormControl>
            )}
          />

          <Controller
            name="templateId"
            control={control}
            render={({ field: { ref, onChange, onBlur, ...field } }) => (
              <FormControl fullWidth className="tw-mt-4 tw-mb-2">
                <FormLabel>Select template name</FormLabel>
                <OutlinedInput
                  {...field}
                  ref={ref}
                  size="small"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.broadcastName}
                  fullWidth
                  placeholder="Template name"
                />
              </FormControl>
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onSubmitClicked()}
          variant="contained"
          disableElevation
        >
          Submit
        </Button>
        <Button
          onClick={() => onCloseClicked()}
          variant="outlined"
          disableElevation
          color="error"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
