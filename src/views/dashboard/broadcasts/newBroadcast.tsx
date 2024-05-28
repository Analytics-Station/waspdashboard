import { faContactBook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { FlexBox } from '../../../components';
import {
  BroadcastFormDataResponse,
  BroadcastTemplate,
  Contact,
  ContactGroup,
  FileInfo,
  makeRequest,
  RequestMethod,
  S3Service,
} from '../../../shared';

const FormSchema = yup
  .object({
    broadcastName: yup.string().min(6).required(),
    templateId: yup.string().required(),
    contacts: yup.array().required('required'),
    contactGroups: yup.array().required('required'),
    headerFile: yup.string().nullable(),
  })
  .required();

export const NewBroadcast = () => {
  const navigate = useNavigate();
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
      broadcastName: '',
      templateId: '',
      contacts: [],
      contactGroups: [],
      headerFile: '',
    },
    resolver: yupResolver(FormSchema),
  });

  const [loading, setLoading] = useState(false);
  const [contactGroups, setContactGroups] = useState<ContactGroup[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [templates, setTemplates] = useState<BroadcastTemplate[]>([]);
  const [fileDetails, setFileDetails] = useState<FileInfo | null>(null);

  const watchTemplateId = watch('templateId');
  const watchHeaderFile = watch('headerFile');

  useEffect(() => {
    fetchBroadcastFormdata();
  }, []);

  const fetchBroadcastFormdata = async () => {
    const response = await makeRequest<null, BroadcastFormDataResponse>(
      `/broadcasts/formdata`,
      RequestMethod.GET,
      true
    );
    const message = new BroadcastFormDataResponse(response.message);
    setContacts(message.contacts);
    setContactGroups(message.contactGroups);
    setTemplates(message.templates);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    const payload: any = {
      broadcastName: data.broadcastName,
      templateId: data.templateId,
      contacts: data.contacts,
      contactGroups: data.contactGroups,
    };

    if (isSelectedTemplateImage()) {
      payload['imageUrl'] = data.headerFile;
    }

    try {
      const response = await makeRequest(
        '/broadcasts',
        RequestMethod.POST,
        true,
        payload
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, []);

  const getFileTypes = (): Accept => {
    return {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    };
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getFileTypes(),
  });

  const onFileSelect = async (file: File) => {
    const s3Service = new S3Service();
    const parts = file.name.split('.');
    const fileInfo = await s3Service.getPresignedUrl(
      parts[parts.length - 1],
      3
    );
    const arrayBuf = await file.arrayBuffer();
    await s3Service.uploadFile(
      fileInfo.uploadSignedUrl,
      arrayBuf,
      fileInfo.contentType
    );
    setFileDetails({
      fileName: file.name,
      fileUrl: fileInfo.fileUrl,
    });
    setValue('headerFile', fileInfo.fileUrl);
  };

  const isSelectedTemplateImage = (): boolean => {
    const selectedTemplate = templates.find(
      (template) => template.id === +watchTemplateId
    );
    return (selectedTemplate && selectedTemplate.hasImage) || false;
  };

  const disableForm = (): boolean => {
    if (!isValid || !isDirty) {
      console.log('ehh');
      return true;
    }

    const selectedTemplate = templates.find(
      (template) => template.id === +watchTemplateId
    );

    if (!(selectedTemplate && selectedTemplate.hasImage && watchHeaderFile)) {
      console.log(selectedTemplate, selectedTemplate?.hasImage);
      return true;
    }

    return false;
  };

  if (templates.length === 0) {
    return (
      <Container maxWidth="md" className="tw-py-12">
        <Box className="tw-text-center tw-border-2 tw-border-yellow-400 tw-border-solid tw-p-8 tw-rounded-md">
          <Typography className="tw-mb-4" variant="h6">
            This account does not contain any templates.
          </Typography>
          <Link to="/broadcasts/templates/new">
            <Button variant="contained" disableElevation>
              Create a new template
            </Button>
          </Link>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="tw-py-12">
      <Typography variant="body1" className="tw-font-bold">
        What message do you want to send?
      </Typography>
      <Typography variant="subtitle2" className="tw-text-slate-400">
        Add broadcast name and template below
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="tw-mt-2 tw-mb-8 tw-p-4 tw-bg-slate-100 tw-rounded-lg">
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

          {isSelectedTemplateImage() && (
            <>
              <Divider className="tw-my-4" />
              <Typography variant="subtitle2">
                Select the image you want to send with this broadcast
              </Typography>
              <Grid
                {...getRootProps()}
                container
                justifyContent="center"
                className={`tw-mt-2 tw-px-4 tw-py-12 tw-border-2 tw-border-dashed tw-border-yellow-500 tw-rounded-md ${
                  isDragActive && 'tw-bg-slate-100'
                } tw-cursor-pointer`}
              >
                <input {...getInputProps()} />
                <Grid item sm={6} className="tw-text-center">
                  {fileDetails ? (
                    <>
                      <Typography
                        variant="subtitle1"
                        className="tw-font-semibold"
                      >
                        Click here or drag your file to change image
                      </Typography>
                      <Typography variant="body2">
                        {fileDetails.fileName}
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      variant="subtitle1"
                      className="tw-font-semibold"
                    >
                      Click here or drag your file to upload your image
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </>
          )}
        </Box>
        <Typography variant="body1" className="tw-font-bold">
          Who do you want to send it to?
        </Typography>

        <Box className="tw-mt-2 tw-p-4 tw-bg-slate-200 tw-rounded-md">
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
            disabled={disableForm()}
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
