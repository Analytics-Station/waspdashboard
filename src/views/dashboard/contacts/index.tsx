import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import * as yup from 'yup';

import {
  Contact,
  ContactResponse,
  makeRequest,
  PaginationMeta,
} from '../../../shared';
import { NewContact } from './newContact';

const FormSchema = yup
  .object({
    query: yup.string(),
  })
  .required();

export const Contacts = () => {
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

  useEffect(() => {
    fetchContacts();
  }, [searchQuery, pagination]);

  const fetchContacts = async () => {
    const response = await makeRequest<null, ContactResponse>(
      `/contacts?perPage=${pagination.perPage}&currentPage=${pagination.currentPage}&q=${searchQuery}`
    );
    const message = new ContactResponse(response.message);
    setContacts(message.list);
  };

  return (
    <Container maxWidth="xxl" className="tw-pt-12">
      <Typography variant="h4" className="tw-font-black">
        Contacts
      </Typography>
      <Typography variant="subtitle1" className="tw-mt-4 tw-w-4/12">
        Contact list stores the list of numbers that you've interacted with. You
        can even manually export or import contacts.
      </Typography>

      <Box className="tw-bg-slate-100 tw-p-6 tw-mt-8 tw-mb-4 tw-rounded-lg">
        <Grid container justifyContent="space-between">
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
          <Grid item sm={3} className="tw-text-right">
            <Button
              variant="contained"
              disableElevation
              onClick={() => setShowNewContact(true)}
            >
              New Contact
            </Button>
          </Grid>
        </Grid>
      </Box>

      <DataGrid
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
          {
            field: 'Created at',
            valueFormatter: (val, row, col) => {
              return moment(row.createdAt).format('DD, MMM YYYY HH:mm:ss');
            },
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

      <NewContact
        open={showNewContact}
        onCloseClicked={() => {
          setShowNewContact(false);
          fetchContacts();
        }}
      />
    </Container>
  );
};
