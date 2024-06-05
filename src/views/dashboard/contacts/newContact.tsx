import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Country } from 'react-phone-number-input';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { InputPhone } from '../../../components/PhoneInput/PhoneInput';

const FormSchema = yup
  .object({
    name: yup.string().min(6),
    phone: yup.string().min(10),
    broadcast: yup.boolean(),
    attributes: yup.array(),
  })
  .required();

export const NewContact = () => {
  const navigate = useNavigate();
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
      phone: '',
      broadcast: true,
      attributes: [],
    },
    resolver: yupResolver(FormSchema),
  });

  const [loading, setLoading] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<Country>('IN');
  const watchPhone = watch('phone');
  const watchAttributes = watch('attributes');

  const onSubmit = async (data: any) => {
    setLoading(true);
    const payload = {
      contacts: [
        {
          name: data.name,
          phone: data.phone,
          broadcast: data.broadcast,
          attributes: data.attributes,
        },
      ],
    };
    console.log(payload);
    // try {
    //   const response = await makeRequest(
    //     '/contacts',
    //     RequestMethod.POST,
    //     true,
    //     payload
    //   );
    //   navigate('/contacts/list');
    // } catch (e) {
    //   console.log(e);
    // }
    setLoading(false);
  };

  const disableForm = () => {
    if (!isValid || !isDirty) {
      return true;
    }
    if (watchPhone && !isValidPhoneNumber(watchPhone, currentCountry)) {
      return true;
    }

    let attributeValidation = false;
    if (watchAttributes) {
      watchAttributes.every((attr) => {
        if (attr[0].length === 0 || attr[1].length === 0) {
          attributeValidation = true;
        }
        return !attributeValidation;
      });
    }

    return attributeValidation;
  };

  const addAttribute = () => {
    let newAttributes = [['', '']];
    if (watchAttributes) {
      newAttributes = [...watchAttributes, [0, '', '']];
    }
    setValue('attributes', newAttributes);
  };

  const removeAttribute = (indexToRemove: number) => {
    if (watchAttributes) {
      setValue(
        'attributes',
        watchAttributes.filter((attribute, index) =>
          index === indexToRemove ? null : attribute
        )
      );
    }
  };

  const attributeValueChanged = (
    indexToUpdate: number,
    value: string,
    isKey: boolean
  ) => {
    if (watchAttributes) {
      setValue(
        'attributes',
        watchAttributes.map((attribute, index) => {
          if (indexToUpdate === index) {
            if (isKey) {
              attribute[1] = value;
            } else {
              attribute[2] = value;
            }
          }
          return attribute;
        })
      );
    }
  };

  const attributeTypeChanged = (indexToUpdate: number, value: string) => {
    if (watchAttributes) {
      setValue(
        'attributes',
        watchAttributes.map((attribute, index) => {
          if (indexToUpdate === index) {
            attribute[0] = value;
            attribute[2] = '';
          }
          return attribute;
        })
      );
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Container maxWidth="md">
        <Box className="tw-mt-12">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" className="tw-font-bold tw-mb-4">
              New Contact
            </Typography>
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
              render={({ field: { ref, onChange, ...field } }) => (
                <InputPhone
                  {...field}
                  fullWidth
                  className="tw-mt-6 tw-mb-4"
                  onChange={onChange}
                  defaultCountry="IN"
                  error={!!errors.phone}
                  label="Phone number"
                  helperText={errors.phone ? errors.phone.message : ''}
                  onCountryChanged={setCurrentCountry}
                />
              )}
            />

            <Controller
              name="broadcast"
              control={control}
              render={({
                field: { ref, onChange, onBlur, value, ...field },
              }) => (
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

            <Divider className="tw-my-4" />

            <Typography variant="body1" className="tw-font-medium">
              Add attributes
            </Typography>
            <Typography variant="subtitle2" className="tw-font-medium tw-mb-4">
              Create custom attributes for this contact
            </Typography>

            {watchAttributes &&
              watchAttributes.map((attribute, index) => (
                <Grid
                  container
                  spacing={2}
                  key={`attr${index}`}
                  className="tw-mb-4 tw-items-center"
                >
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <Select
                        size="small"
                        value={attribute[0]}
                        onChange={(e) =>
                          attributeTypeChanged(index, e.target.value)
                        }
                      >
                        <MenuItem value={0}>Text</MenuItem>
                        <MenuItem value={1}>Number</MenuItem>
                        <MenuItem value={2}>Date</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={9}></Grid>
                  <Grid item xs={5}>
                    <FormControl fullWidth>
                      <OutlinedInput
                        size="small"
                        fullWidth
                        placeholder="Key"
                        value={attribute[1]}
                        onChange={(e) =>
                          attributeValueChanged(index, e.target.value, true)
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    {[0, 1].includes(attribute[0]) ? (
                      <FormControl fullWidth>
                        <OutlinedInput
                          size="small"
                          fullWidth
                          placeholder="Value"
                          value={attribute[2]}
                          type={attribute[0] === 0 ? 'text' : 'number'}
                          onChange={(e) =>
                            attributeValueChanged(index, e.target.value, false)
                          }
                        />
                      </FormControl>
                    ) : (
                      <DatePicker
                        openTo="year"
                        views={['year', 'month', 'day']}
                        label="Choose your date"
                        slotProps={{
                          textField: {
                            size: 'small',
                            fullWidth: true,
                          },
                        }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeAttribute(index)}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

            <Box className="tw-text-right tw-mt-4">
              <Button
                variant="contained"
                size="small"
                disableElevation
                onClick={addAttribute}
                startIcon={<FontAwesomeIcon icon={faPlus} />}
              >
                Add attribute
              </Button>
            </Box>

            <Divider className="tw-my-4" />

            <LoadingButton
              disabled={disableForm()}
              variant="contained"
              disableElevation
              type="submit"
              loading={loading}
            >
              Save changes
            </LoadingButton>
          </form>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};
