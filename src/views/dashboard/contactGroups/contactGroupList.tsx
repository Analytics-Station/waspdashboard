import { faTrashAlt, faUserGroup, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Container, FormControl, Grid, IconButton, OutlinedInput, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import * as yup from 'yup';

import { DeleteDialog } from '../../../components';
import { ContactGroup, ContactGroupResponse, makeRequest, PaginationMeta, RequestMethod } from '../../../shared';
import { AddRemoveGroupUsersDialog } from './addRemoveGroupUsers';
import { NewContactGroup } from './newContactGroup';

const FormSchema = yup
  .object({
    query: yup.string(),
  })
  .required();

interface GroupUpdate {
  _add: number[];
  _remove: number[];
}

export const ContactGroupList = () => {
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
  const [contactGroups, setContactGroups] = useState<ContactGroup[]>([]);
  const [showNewContactGroup, setShowNewContactGroup] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedContactGroup, setSelectedContactGroup] =
    useState<ContactGroup | null>(null);
  const [showGroupContacts, setShowGroupContacts] = useState(false);

  useEffect(() => {
    fetchContactGroups();
  }, [searchQuery, pagination]);

  const fetchContactGroups = async () => {
    const response = await makeRequest<null, ContactGroupResponse>(
      `/contact-groups?perPage=${pagination.perPage}&currentPage=${pagination.currentPage}&q=${searchQuery}`,
      RequestMethod.GET,
      true
    );
    const message = new ContactGroupResponse(response.message);
    setContactGroups(message.list);
  };

  const deleteContactGroup = async () => {
    setLoading(true);
    try {
      const response = await makeRequest<null, null>(
        `/contact-groups/${selectedContactGroup?.id}`,
        RequestMethod.DELETE,
        true
      );
    } catch (e) {
      console.log(e);
    }
    fetchContactGroups();
    setLoading(false);
    setShowDeleteDialog(false);
  };

  const onGroupUpdate = async (added: number[], removed: number[]) => {
    console.log(added, removed);
    setLoading(true);
    try {
      const response = await makeRequest<GroupUpdate, null>(
        `/contact-groups/${selectedContactGroup?.id}/contacts`,
        RequestMethod.PATCH,
        true,
        {
          _add: added,
          _remove: removed,
        }
      );
    } catch (e) {
      console.log(e);
    }
    fetchContactGroups();
    setLoading(false);
    setShowGroupContacts(false);
    setSelectedContactGroup(null);
  };

  return (
    <Container maxWidth="xxl" className="tw-pt-12">
      <Typography variant="h4" className="tw-font-black">
        Contact groups
      </Typography>
      <Typography variant="subtitle1" className="tw-mt-4 tw-w-4/12">
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
                    placeholder="Search contact groups..."
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item sm={9} className="tw-text-right">
            <Button
              variant="contained"
              disableElevation
              onClick={() => setShowNewContactGroup(true)}
              size="small"
              startIcon={<FontAwesomeIcon icon={faUserGroup} fixedWidth />}
            >
              New Group
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
        disableRowSelectionOnClick
        columns={[
          {
            field: 'ID',
            valueFormatter: (val, row, col) => {
              return row.id;
            },
          },
          {
            field: 'Group name',
            valueFormatter: (val, row, col) => {
              return `${row.name} (${row.contactCount} contacts)`;
            },
            flex: 1,
          },
          {
            field: 'Created at',
            valueFormatter: (val, row, col) => {
              return moment(row.createdAt).format('DD, MMM YYYY hh:mm A');
            },
            flex: 1,
          },
          {
            field: 'Actions',
            renderCell: (params) => (
              <>
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => {
                    setSelectedContactGroup(params.row);
                    setShowGroupContacts(true);
                  }}
                >
                  <FontAwesomeIcon icon={faUserPlus} />
                </IconButton>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => {
                    setSelectedContactGroup(params.row);
                    setShowDeleteDialog(true);
                  }}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </IconButton>
              </>
            ),
            flex: 1,
          },
        ]}
        rows={contactGroups}
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

      <NewContactGroup
        open={showNewContactGroup}
        onCloseClicked={() => {
          setShowNewContactGroup(false);
          fetchContactGroups();
        }}
        contactGroupSaved={fetchContactGroups}
      />

      {selectedContactGroup && (
        <AddRemoveGroupUsersDialog
          open={showGroupContacts}
          loading={loading}
          onUpdate={(added, removed) => {
            onGroupUpdate(added, removed);
          }}
          onCancel={() => {
            setSelectedContactGroup(null);
            setShowGroupContacts(false);
          }}
          contactGroup={selectedContactGroup}
        />
      )}

      <DeleteDialog
        title="Delete contact group"
        subtitle={`Are you sure you want to delete ${selectedContactGroup?.name}?`}
        open={showDeleteDialog}
        onCancelClicked={() => {
          setSelectedContactGroup(null);
          setShowDeleteDialog(false);
        }}
        onDeleteClicked={deleteContactGroup}
        loading={loading}
      />
    </Container>
  );
};
