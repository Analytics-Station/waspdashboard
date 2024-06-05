import {
  faAddressBook,
  faFileExcel,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { parsePhoneNumber } from 'react-phone-number-input';
import { Link } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import * as yup from 'yup';

import { DeleteDialog } from '../../../components';
import {
  Contact,
  ContactResponse,
  makeRequest,
  PaginationMeta,
  RequestMethod,
} from '../../../shared';

const FormSchema = yup
  .object({
    query: yup.string(),
  })
  .required();

export const ContactList = () => {
  const {
    control,
    setValue,
    formState: { errors, isDirty, isValid },
    watch,
  } = useForm({
    mode: 'all',
    defaultValues: {
      query: '',
    },
    resolver: yupResolver(FormSchema),
  });
  const watchSearch = watch('query');
  const [searchQuery] = useDebounce(watchSearch, 1000);

  const [pagination, setPagination] = useState<PaginationMeta>(
    new PaginationMeta({})
  );
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showNewContact, setShowNewContact] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, [searchQuery, pagination]);

  const fetchContacts = async () => {
    const response = await makeRequest<null, ContactResponse>(
      `/contacts?perPage=${pagination.perPage}&currentPage=${pagination.currentPage}&q=${searchQuery}`,
      RequestMethod.GET,
      true
    );
    const message = new ContactResponse(response.message);
    setContacts(message.list);
  };

  const deleteContact = async () => {
    setLoading(true);
    try {
      const response = await makeRequest<null, null>(
        `/contacts/${selectedContact?.id}`,
        RequestMethod.DELETE,
        true
      );
    } catch (e) {
      console.log(e);
    }
    fetchContacts();
    setLoading(false);
    setShowDeleteDialog(false);
  };

  return (
    <Container maxWidth="xxl" className="tw-pt-12">
      <Typography variant="h4" className="tw-font-black">
        Contacts
      </Typography>
      <Typography variant="subtitle1" className="tw-mt-4">
        Contact list stores the list of numbers that you've interacted with. You
        can even manually export or import contacts.
      </Typography>
      <Box className="tw-bg-slate-100 tw-p-6 tw-mt-8 tw-mb-4 tw-rounded-lg">
        <Grid container justifyContent="space-between" alignItems="center">
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
          <Grid item sm={9} className="tw-text-right">
            <Link to="/contacts/bulk-import">
              <Button
                variant="contained"
                disableElevation
                color="success"
                className="tw-mx-2"
                size="small"
                startIcon={
                  <FontAwesomeIcon
                    icon={faFileExcel}
                    fixedWidth
                    color="#FAFAFA"
                  />
                }
              >
                Import XLSX
              </Button>
            </Link>
            <Link to="/contacts/new">
              <Button
                variant="contained"
                disableElevation
                onClick={() => setShowNewContact(true)}
                size="small"
                startIcon={<FontAwesomeIcon icon={faAddressBook} fixedWidth />}
              >
                New Contact
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Box>

      <DataGrid
        sx={{
          '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },
        }}
        autoHeight
        columns={[
          {
            field: 'ID',
            valueFormatter: (val, row, col) => {
              return row.id;
            },
          },
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
              const phone = parsePhoneNumber(row.phone);
              return `${phone ? phone.formatInternational() : row.phone}`;
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
          {
            field: 'Created at',
            valueFormatter: (val, row, col) => {
              return moment(row.createdAt).format('DD, MMM YYYY HH:mm:ss');
            },
            flex: 1,
          },
          {
            field: 'Actions',
            renderCell: (params) => (
              <IconButton
                color="error"
                size="small"
                onClick={() => {
                  setSelectedContact(params.row);
                  setShowDeleteDialog(true);
                }}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </IconButton>
            ),
            flex: 1,
          },
        ]}
        rows={contacts}
        initialState={{
          pagination: {
            paginationModel: {
              page: pagination?.currentPage,
              pageSize: pagination?.perPage,
            },
            rowCount: pagination?.total,
          },
        }}
        onPaginationModelChange={(model) => {
          setPagination(
            new PaginationMeta({
              perPage: model.pageSize,
              currentPage: model.page + 1,
            })
          );
        }}
        pageSizeOptions={[10, 20, 50, 100]}
      />

      {/* <NewContact
        open={showNewContact}
        onCloseClicked={() => {
          setShowNewContact(false);
          fetchContacts();
        }}
        contactSaved={() => {
          fetchContacts();
        }}
      /> */}

      <DeleteDialog
        title="Delete contact"
        subtitle={`Are you sure you want to delete ${selectedContact?.name}?`}
        open={showDeleteDialog}
        onCancelClicked={() => setShowDeleteDialog(false)}
        onDeleteClicked={() => deleteContact()}
        loading={loading}
      />
    </Container>
  );
};
