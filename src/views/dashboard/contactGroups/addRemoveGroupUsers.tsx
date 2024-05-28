import { LoadingButton } from '@mui/lab';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from '@mui/material';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

import {
  AssignedContact,
  Contact,
  ContactGroup,
  ContactGroupContactListResponse,
  ContactResponse,
  makeRequest,
  PaginationMeta,
  RequestMethod,
} from '../../../shared';

interface Props {
  open: boolean;
  loading: boolean;
  onUpdate: (added: number[], removed: number[]) => void;
  onCancel: () => void;
  contactGroup: ContactGroup;
}

export const AddRemoveGroupUsersDialog = ({
  open,
  loading,
  onUpdate,
  onCancel,
  contactGroup,
}: Props) => {
  const apiRef = useGridApiRef();
  const [pagination, setPagination] = useState<PaginationMeta>(
    new PaginationMeta({})
  );
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [assignedContacts, setAssignedContacts] = useState<AssignedContact[]>(
    []
  );
  const [newSelection, setNewSelection] = useState<number[] | null>(null);

  useEffect(() => {
    fetchContactGroupContacts(contactGroup);
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [pagination]);

  useEffect(() => {
    updateContactSelection();
  }, [assignedContacts, contacts]);

  const fetchContactGroupContacts = async (contactGroup: ContactGroup) => {
    const response = await makeRequest<null, ContactGroupContactListResponse>(
      `/contact-groups/${contactGroup.id}/contacts`,
      RequestMethod.GET,
      true
    );
    const message = new ContactGroupContactListResponse(response.message);
    setAssignedContacts(message.contacts);
  };

  const fetchContacts = async () => {
    const response = await makeRequest<null, ContactResponse>(
      `/contacts?perPage=${pagination.perPage}&currentPage=${pagination.currentPage}`,
      RequestMethod.GET,
      true
    );
    const message = new ContactResponse(response.message);
    setContacts(message.list);
  };

  const updateContactSelection = () => {
    assignedContacts.map((contact) => {
      apiRef.current.selectRow(contact.id);
      return contact;
    });
  };

  const saveChanges = () => {
    if (!newSelection) {
      onUpdate([], []);
      return;
    }

    const assignedContactIds = assignedContacts.map((item) => item.id);

    // const added: number[] = [];
    // const removed: number[] = [];

    // newSelection.forEach((contact) => {
    //   if (!assignedContactIds.includes(contact)) {
    //     added.push(contact);
    //   }
    // });

    // assignedContactIds.forEach((contact) => {
    //   if (!newSelection.includes(contact)) {
    //     removed.push(contact);
    //   }
    // });

    const added: number[] = newSelection.filter(
      (contact) => !assignedContactIds.includes(contact)
    );

    const removed: number[] = assignedContactIds.filter(
      (contact) => !newSelection.includes(+contact)
    );
    onUpdate(added, removed);
  };

  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>Add/Remove contacts from this group</DialogTitle>
      <Divider />
      <DialogContent>
        <Chip
          label={contactGroup.name}
          color="primary"
          className="tw-font-bold tw-mb-4"
        />
        <DataGrid
          apiRef={apiRef}
          sx={{
            '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
              outline: 'none !important',
            },
          }}
          autoHeight
          checkboxSelection
          columns={[
            {
              field: 'Contact',
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
          onRowSelectionModelChange={(model) => {
            if (model) {
              setNewSelection(model.map((item) => +item));
            }
          }}
        />
      </DialogContent>
      <Divider />
      <DialogActions>
        <LoadingButton
          variant="contained"
          disableElevation
          loading={loading}
          onClick={() => saveChanges()}
          color="error"
        >
          Save changes
        </LoadingButton>
        <Button
          onClick={() => onCancel()}
          variant="outlined"
          disableElevation
          color="warning"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
