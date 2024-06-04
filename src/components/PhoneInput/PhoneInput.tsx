import './PhoneInput.scss';

import { FormControl, MenuItem, Select, TextField } from '@mui/material';
import { E164Number } from 'libphonenumber-js';
import { ChangeEvent, forwardRef, useState } from 'react';
import PhoneInput from 'react-phone-number-input/input';

import { countries } from '../../shared/resources';

const MaterialInput = forwardRef(
  ({ countryChanged, flagCountry, ...rest }: any, ref) => {
    return (
      <TextField
        {...rest}
        inputRef={ref}
        InputProps={{
          startAdornment: (
            <FormControl>
              <Select
                className="countrySelect"
                disableUnderline
                size="small"
                value={flagCountry}
                variant="standard"
                onChange={countryChanged}
                renderValue={() => (
                  <img
                    alt={flagCountry}
                    src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${flagCountry}.svg`}
                  />
                )}
              >
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ),
        }}
      />
    );
  }
);

export const InputPhone = (props: any) => {
  const { value, defaultValue, defaultCountry, onChange, label, ...rest } =
    props;

  const initial = value || defaultValue;
  const [selectedVal, setSelectedVal] = useState<string>(String(initial));
  const [country, setCountry] = useState(defaultCountry);

  const handleChange = (value: E164Number) => {
    setSelectedVal(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <PhoneInput
      {...rest}
      type="tel"
      label={label}
      defaultCountry={defaultCountry}
      country={country}
      flagCountry={country}
      autoComplete="tel"
      value={selectedVal}
      onChange={handleChange}
      inputComponent={MaterialInput}
      countryChanged={(e: ChangeEvent<HTMLInputElement>) => {
        setCountry(e.target.value);
      }}
    />
  );
};