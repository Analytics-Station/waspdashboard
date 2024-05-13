import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { languages } from '../../../../../shared';

const FormSchema = yup
  .object({
    category: yup.string().min(6).required(),
    name: yup.string().required(),
    language: yup.string().required(),
  })
  .required();

interface Props {
  formData: any;
  nextClicked: (data: any) => void;
}

export const TemplateForm1 = ({ nextClicked, formData }: Props) => {
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      name: formData['name'] ? formData['name'] : '',
      category: formData['category'] ? formData['category'] : '',
      language: formData['language'] ? formData['language'] : 'en_US',
    },
    resolver: yupResolver(FormSchema),
  });

  const onSubmit = async (data: any) => {
    nextClicked(data);
  };

  const isFormDisabled = (): boolean => {
    if (!isValid) {
      return true;
    }
    if (!formData['category'] && !isDirty) {
      return true;
    }
    return false;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box className="tw-p-4 tw-bg-slate-100 tw-mt-4 tw-rounded-lg">
        <Typography variant="subtitle1" className="tw-font-bold">
          Category
        </Typography>
        <Typography variant="body2" className="tw-text-slate-500">
          Choose a category that best describes your message template
        </Typography>
        <Controller
          name="category"
          control={control}
          render={({ field: { ref, onChange, onBlur, ...field } }) => (
            <FormControl fullWidth className="tw-mb-4">
              <RadioGroup
                {...field}
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
              >
                <FormControlLabel
                  value="AUTHENTICATION"
                  control={<Radio size="small" />}
                  label={
                    <Typography variant="body2" className="tw-font-semibold">
                      AUTHENTICATION
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="MARKETING"
                  control={<Radio size="small" />}
                  label={
                    <Typography variant="body2" className="tw-font-semibold">
                      MARKETING
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="UTILITY"
                  control={<Radio size="small" />}
                  label={
                    <Typography variant="body2" className="tw-font-semibold">
                      UTILITY
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>
          )}
        />
      </Box>
      <Box className="tw-p-4 tw-bg-slate-100 tw-mt-4 tw-rounded-lg">
        <Typography variant="subtitle1" className="tw-font-bold">
          Name
        </Typography>
        <Typography variant="body2" className="tw-text-slate-500 tw-mb-2">
          Name your message template
        </Typography>
        <Controller
          name="name"
          control={control}
          render={({ field: { ref, onChange, onBlur, ...field } }) => (
            <FormControl fullWidth className="tw-mb-4">
              <OutlinedInput
                {...field}
                ref={ref}
                size="small"
                onChange={onChange}
                onBlur={onBlur}
                error={!!errors.name}
                fullWidth
                placeholder="Template identifier"
              />
            </FormControl>
          )}
        />
      </Box>

      <Box className="tw-p-4 tw-bg-slate-100 tw-mt-4 tw-rounded-lg">
        <Typography variant="subtitle1" className="tw-font-bold">
          Language
        </Typography>
        <Typography variant="body2" className="tw-text-slate-500 tw-mb-2">
          Choose the language for your message template.
        </Typography>
        <Controller
          name="language"
          control={control}
          render={({ field: { ref, onChange, onBlur, ...field } }) => (
            <FormControl>
              <Select
                size="small"
                {...field}
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
                error={!!errors.language}
              >
                {languages.map((language) => (
                  <MenuItem key={language[1]} value={language[1]}>
                    {language[0]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Box>

      <Divider className="tw-my-4" />

      <Box className="tw-text-right">
        <Button
          className="tw-ml-auto"
          disabled={isFormDisabled()}
          variant="contained"
          disableElevation
          type="submit"
        >
          Next Step
        </Button>
      </Box>
    </form>
  );
};
