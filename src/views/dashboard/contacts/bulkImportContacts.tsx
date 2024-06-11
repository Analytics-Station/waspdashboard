import {
  Box,
  Button,
  Container,
  Divider,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ConfirmDialog, MLink } from '../../../components';
import {
  fetchBulkImportFormdata,
  RootState,
  useAppDispatch,
} from '../../../redux';
import {
  Contact,
  CreateContactRequest,
  makeRequest,
  ProcessContactResponse as ProcessContactsResponse,
  RequestMethod,
  S3Service,
} from '../../../shared';

export const BulkImportContacts = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const contactGroups = useSelector((state: RootState) => state.contact.groups);

  const [confirmDialog, showConfirmDialog] = useState(false);
  const [discardDialog, showDiscardDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [uploadMode, setUploadMode] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

  useEffect(() => {
    if (!uploadMode) {
      dispatch(fetchBulkImportFormdata());
    }
  }, [uploadMode]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
    },
  });

  const onFileSelect = async (file: File) => {
    const s3Service = new S3Service();
    const fileInfo = await s3Service.getPresignedUrl();
    const arrayBuf = await file.arrayBuffer();
    await uploadFile(fileInfo.uploadSignedUrl, arrayBuf);
    await processFile(fileInfo.fileUrl);
  };

  const uploadFile = async (uploadUrl: string, data: ArrayBuffer) => {
    const response = await makeRequest(
      uploadUrl,
      RequestMethod.PUT,
      false,
      data
    );
  };

  const processFile = async (url: string) => {
    const resp = await makeRequest<unknown, ProcessContactsResponse>(
      '/contacts/bulk/process',
      RequestMethod.POST,
      true,
      {
        url,
      }
    );
    setContacts(resp.message.contacts);
    setUploadMode(false);
  };

  const selectionChanged = (model: GridRowSelectionModel) => {
    setSelectedContacts(
      contacts.filter((val) => (model.includes(val.id) ? val : null))
    );
  };

  const saveChanges = async () => {
    setLoading(true);
    const payload: CreateContactRequest = {
      contacts: selectedContacts,
    };
    if (selectedGroup > 0) {
      payload['contactGroupId'] = selectedGroup;
    }
    try {
      const resp = await makeRequest<CreateContactRequest, any>(
        '/contacts',
        RequestMethod.POST,
        true,
        payload
      );
      console.log(resp.message);
    } catch (e) {
      setLoading(false);
    }
    showConfirmDialog(false);
    setLoading(false);
    navigate('/contacts');
  };

  const discardData = () => {
    setUploadMode(true);
    setContacts([]);
    setSelectedContacts([]);
    showDiscardDialog(false);
  };

  if (!uploadMode) {
    return (
      <Container maxWidth="xl">
        <Box className="tw-flex tw-items-center tw-mt-4 tw-p-4 tw-rounded-md tw-bg-yellow-100 tw-border tw-border-solid tw-border-yellow-500">
          <Typography variant="body2" className="tw-flex-1 tw-font-medium">
            Select/Deselect the contacts from the table below
          </Typography>
          <Button
            size="small"
            variant="contained"
            color="success"
            disableElevation
            className="tw-mx-2"
            disabled={selectedContacts.length === 0}
            onClick={() => showConfirmDialog(true)}
          >
            Save changes
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            disableElevation
            onClick={() => showDiscardDialog(true)}
          >
            Discard
          </Button>
        </Box>
        <Divider className="tw-my-6" />
        <Grid container>
          <Grid item xs={12} md={6} lg={4}>
            <FormGroup>
              <InputLabel id="contactGroup">Select contact group</InputLabel>
              <Select
                labelId="contactGroup"
                size="small"
                value={selectedGroup}
                onChange={(e) =>
                  setSelectedGroup(parseInt(`${e.target.value}`))
                }
              >
                <MenuItem value={-1}>No group</MenuItem>
                {contactGroups.map((group) => (
                  <MenuItem value={group.id} key={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormGroup>
          </Grid>
        </Grid>
        <Divider className="tw-my-6" />
        <DataGrid
          className="tw-mt-4"
          sx={{
            '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
              outline: 'none !important',
            },
          }}
          checkboxSelection
          disableRowSelectionOnClick
          autoHeight
          columns={[
            {
              field: 'Full name',
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
              field: 'Broadcast',
              valueFormatter: (val, row, col) => {
                return row.broadcast ? 'Yes' : 'No';
              },
              flex: 1,
            },
          ]}
          rows={contacts}
          pageSizeOptions={[10, 20, 50, 100]}
          onRowSelectionModelChange={(model) => selectionChanged(model)}
        />
        <ConfirmDialog
          open={confirmDialog}
          title="Save contacts"
          subtitle={`Are you sure you want to save ${selectedContacts.length} contacts?`}
          loading={loading}
          successText="Confirm"
          onSuccessClicked={() => saveChanges()}
          onCancelClicked={() => showConfirmDialog(false)}
        />
        <ConfirmDialog
          open={discardDialog}
          title="Discard data"
          subtitle="Are you sure you want to discard these contacts?"
          loading={false}
          successText="Confirm"
          onSuccessClicked={() => discardData()}
          onCancelClicked={() => showDiscardDialog(false)}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Grid
        {...getRootProps()}
        container
        justifyContent="center"
        className={`tw-mt-12 tw-px-4 tw-py-12 tw-border-2 tw-border-dashed tw-border-yellow-500 tw-rounded-md ${
          isDragActive && 'tw-bg-slate-100'
        }`}
      >
        <input {...getInputProps()} />
        <Grid item sm={6} className="tw-text-center">
          <Typography variant="h6" className="tw-font-bold">
            Bulk upload contacts
          </Typography>
          <Typography variant="subtitle1" className="tw-text-slate-600">
            Drag or click here to upload XLSX file to import multiple contacts.
            <br />
            Download the sample template&nbsp;
            <MLink
              href={import.meta.env.VITE_CONTACTS_BULK_TEMPLATE}
              onClick={(e) => e.stopPropagation()}
            >
              here
            </MLink>
            .
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};
