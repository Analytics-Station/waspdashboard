import { faContactBook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { FlexBox } from '../../../components';
import {
  BroadcastFormDataResponse,
  BroadcastTemplate,
  Contact,
  ContactGroup,
  makeRequest,
  RequestMethod,
} from '../../../shared';

const FormSchema = yup
  .object({
    broadcastName: yup.string().min(6).required(),
    templateId: yup.string().required(),
    contacts: yup.array().required('required'),
    contactGroups: yup.array().required('required'),
  })
  .required();

export const NewBroadcast = () => {
  const navigate = useNavigate();
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
      contacts: [],
      contactGroups: [],
    },
    resolver: yupResolver(FormSchema),
  });

  const [loading, setLoading] = useState(false);
  const [contactGroups, setContactGroups] = useState<ContactGroup[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [templates, setTemplates] = useState<BroadcastTemplate[]>([]);

  useEffect(() => {
    fetchBroadcastFormdata();
  }, []);

  const fetchBroadcastFormdata = async () => {
    const response = await makeRequest<null, BroadcastFormDataResponse>(
      `/broadcasts/formdata`
    );
    const message = new BroadcastFormDataResponse(response.message);
    setContacts(message.contacts);
    setContactGroups(message.contactGroups);
    setTemplates(message.templates);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await makeRequest(
        '/broadcasts',
        RequestMethod.POST,
        false,
        {
          broadcastName: data.broadcastName,
          templateId: data.templateId,
          contacts: data.contacts,
          contactGroups: data.contactGroups,
        }
      );
      navigate('/broadcasts/history');
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
    resetForm();
  };

  const resetForm = () => {
    setValue('broadcastName', '');
    setValue('templateId', '');
    setValue('contacts', []);
  };

  return (
    <Container maxWidth="md" className="tw-py-12">
      <Typography variant="body1" className="tw-font-bold">
        What message do you want to send?
      </Typography>
      <Typography variant="subtitle2" className="tw-text-slate-400">
        Add broadcast name and template below
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="tw-mt-4 tw-mb-6 tw-p-4 tw-bg-slate-100 tw-rounded-lg">
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
              <FormControl fullWidth className="tw-mt-4 tw-mb-2" size="small">
                <InputLabel id="template_name">Select template name</InputLabel>
                <Select
                  labelId="template_name"
                  label="Select template name"
                  {...field}
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.broadcastName}
                  fullWidth
                  placeholder="Template name"
                >
                  {templates.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Box>
        <Typography variant="body1" className="tw-font-bold">
          Who do you want to send it to?
        </Typography>

        <Box className="tw-mt-4 tw-p-4 tw-bg-slate-200 tw-rounded-md">
          <FlexBox className="tw-mb-2">
            <FontAwesomeIcon icon={faContactBook} color="#f8c70f" />
            <Typography variant="subtitle1" className="tw-font-bold tw-ml-2">
              Contact groups
            </Typography>
          </FlexBox>
          <DataGrid
            className="tw-bg-white"
            sx={{
              '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                outline: 'none !important',
              },
            }}
            autoHeight
            checkboxSelection
            disableRowSelectionOnClick
            columns={[
              {
                field: 'Name',
                valueFormatter: (val, row, col) => {
                  return row.name;
                },
                flex: 1,
              },
            ]}
            rows={contactGroups}
            onRowSelectionModelChange={(model) =>
              setValue('contactGroups', model)
            }
          />
        </Box>

        <Box className="tw-mt-4 tw-p-4 tw-bg-slate-200 tw-rounded-md">
          <FlexBox className="tw-mb-2">
            <FontAwesomeIcon icon={faContactBook} color="#f8c70f" />
            <Typography variant="subtitle1" className="tw-font-bold tw-ml-2">
              Contacts
            </Typography>
          </FlexBox>
          <DataGrid
            sx={{
              '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                outline: 'none !important',
              },
            }}
            autoHeight
            checkboxSelection
            disableRowSelectionOnClick
            columns={[
              {
                field: 'Name',
                valueFormatter: (val, row, col) => {
                  return row.name;
                },
                flex: 1,
              },
              {
                field: 'Phone',
                valueFormatter: (val, row, col) => {
                  return row.phone;
                },
                flex: 1,
              },
              {
                field: 'Allow broadcast',
                valueFormatter: (val, row, col) => {
                  return row.broadcast ? 'Yes' : 'No';
                },
                flex: 1,
              },
            ]}
            rows={contacts}
            onRowSelectionModelChange={(model) => setValue('contacts', model)}
          />
        </Box>
        <Box className="tw-mt-6 tw-text-right">
          <LoadingButton
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
