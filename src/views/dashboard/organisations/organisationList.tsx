import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormControl, Grid, OutlinedInput } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import * as yup from 'yup';

import {
  makeRequest,
  Organisation,
  OrganisationResponse,
  PaginationMeta,
} from '../../../shared';
import { NewOrganisation } from './newOrganisation';

const FormSchema = yup
  .object({
    query: yup.string(),
  })
  .required();

export const OrganisationList = () => {
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
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [showNewOrganisation, setShowNewOrganisation] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOrganisation, setSelectedOrganisation] =
    useState<Organisation | null>(null);

  useEffect(() => {
    fetchOrganisations();
  }, [searchQuery, pagination]);

  const fetchOrganisations = async () => {
    const response = await makeRequest<null, OrganisationResponse>(
      `/organisations?perPage=${pagination.perPage}&currentPage=${pagination.currentPage}&q=${searchQuery}`
    );
    const message = new OrganisationResponse(response.message);
    setOrganisations(message.list);
  };

  return (
    <>
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
                    placeholder="Search organisations..."
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item sm={9} className="tw-text-right">
            <Button
              variant="contained"
              disableElevation
              onClick={() => setShowNewOrganisation(true)}
              size="small"
              startIcon={<FontAwesomeIcon icon={faSquarePlus} fixedWidth />}
            >
              New Organisation
            </Button>
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
            field: 'Created at',
            valueFormatter: (val, row, col) => {
              return moment(row.createdAt).format('DD, MMM YYYY HH:mm:ss');
            },
            flex: 1,
          },
          // {
          //   field: 'Actions',
          //   renderCell: (params) => (
          //     <IconButton
          //       color="error"
          //       size="small"
          //       onClick={() => {
          //         setSelectedOrganisation(params.row);
          //         setShowDeleteDialog(true);
          //       }}
          //     >
          //       <FontAwesomeIcon icon={faTrashAlt} />
          //     </IconButton>
          //   ),
          //   flex: 1,
          // },
        ]}
        rows={organisations}
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

      <NewOrganisation
        open={showNewOrganisation}
        onCloseClicked={() => {
          setShowNewOrganisation(false);
          fetchOrganisations();
        }}
        organisationSaved={() => {
          fetchOrganisations();
        }}
      />
    </>
  );
};
