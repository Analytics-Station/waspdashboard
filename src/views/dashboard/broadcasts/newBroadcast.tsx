import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
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
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import {
  Contact,
  ContactResponse,
  makeRequest,
  PaginationMeta,
} from '../../../shared';

interface Props {
  open: boolean;
  onCloseClicked: () => void;
}

const FormSchema = yup
  .object({
    broadcastName: yup.string().min(6),
    templateId: yup.string().min(6),
    contacts: yup.array().min(1, 'at least 1').required('required'),
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
      contacts: [],
    },
    resolver: yupResolver(FormSchema),
  });

  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta>(
    new PaginationMeta({})
  );
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    fetchContacts();
  }, [pagination]);

  const fetchContacts = async () => {
    const response = await makeRequest<null, ContactResponse>(
      `/contacts?perPage=${pagination.perPage}&currentPage=${pagination.currentPage}`
    );
    const message = new ContactResponse(response.message);
    setContacts(message.list);
  };

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>New Broadcast</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="body1" className="tw-font-bold">
            What message do you want to send?
          </Typography>
          <Typography variant="subtitle2" className="tw-text-slate-400">
            Add broadcast name and template below
          </Typography>

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

          <Typography variant="body1" className="tw-font-bold tw-mb-2">
            Who do you want to send it to?
          </Typography>
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
            onRowSelectionModelChange={(model) => setValue('contacts', model)}
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton
            disabled={!isValid || !isDirty}
            variant="contained"
            disableElevation
            type="submit"
            loading={loading}
          >
            Save changes
          </LoadingButton>
          <Button
            onClick={() => onCloseClicked()}
            variant="outlined"
            disableElevation
            color="error"
          >
            Close
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
