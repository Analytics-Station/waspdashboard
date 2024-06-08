import {
  faCircleCheck,
  faCircleXmark,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';
import * as yup from 'yup';

import {
  checkTemplateName,
  RootState,
  useAppDispatch,
} from '../../../../../redux';
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
  const dispatch = useAppDispatch();
  const loading = useSelector((state: RootState) => state.template.loading);
  const nameValid = useSelector((state: RootState) => state.template.nameValid);

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
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
  const watchName = watch('name');
  const [searchQuery] = useDebounce(watchName, 300);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      console.log(searchQuery);
      validateTemplateName(searchQuery);
    }
  }, [searchQuery]);

  const validateTemplateName = (query: string) => {
    dispatch(checkTemplateName(query));
  };

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
    if (loading || !nameValid) {
      return true;
    }
    return false;
  };

  const renderTemplateNameChecker = () => {
    if (watchName.length === 0) {
      return null;
    }
    if (loading) {
      return <FontAwesomeIcon icon={faSpinner} color="#27ae60" />;
    }
    if (nameValid === null) {
      return null;
    }
    return (
      <FontAwesomeIcon
        icon={nameValid ? faCircleCheck : faCircleXmark}
        color={nameValid ? '#27ae60' : '#e74c3c'}
      />
    );
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
                endAdornment={renderTemplateNameChecker()}
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
