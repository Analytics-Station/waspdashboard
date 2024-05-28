import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { useEffect, useState } from 'react';

import { DeleteDialog } from '../../../../../components';
import {
  BroadcastTemplateVariable,
  BroadcastTemplateVariableResponse,
  makeRequest,
  PaginationMeta,
  RequestMethod,
} from '../../../../../shared';

export const BroadcastTemplateVariables = () => {
  const [pagination, setPagination] = useState<PaginationMeta>(
    new PaginationMeta({})
  );
  const [broadcastTemplateVariables, setBroadcastTemplateVariables] = useState<
    BroadcastTemplateVariable[]
  >([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [
    selectedBroadcastTemplateVariable,
    setSelectedBroadcastTemplateVariable,
  ] = useState<BroadcastTemplateVariable | null>(null);

  useEffect(() => {
    fetchBroadcastTemplateVariables();
  }, [pagination]);

  const fetchBroadcastTemplateVariables = async () => {
    const response = await makeRequest<null, BroadcastTemplateVariableResponse>(
      `/broadcast-templates/variables?perPage=${pagination.perPage}&currentPage=${pagination.currentPage}`,
      RequestMethod.GET,
      true
    );
    const message = new BroadcastTemplateVariableResponse(response.message);
    setBroadcastTemplateVariables(message.list);
  };

  const deleteBroadcastTemplateVariable = async () => {
    setLoading(true);
    try {
      const response = await makeRequest<null, null>(
        `/broadcast-templates/variables/${selectedBroadcastTemplateVariable?.id}`,
        RequestMethod.DELETE,
        true
      );
    } catch (e) {
      console.log(e);
    }
    fetchBroadcastTemplateVariables();
    setLoading(false);
    setShowDeleteDialog(false);
  };

  return (
    <Container maxWidth="xxl" className="tw-flex tw-h-full" disableGutters>
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
            field: 'Name',
            valueFormatter: (val, row, col) => {
              return row.name;
            },
            flex: 1,
          },
          {
            field: 'Value',
            valueFormatter: (val, row, col) => {
              return row.value;
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
                  setSelectedBroadcastTemplateVariable(params.row);
                  setShowDeleteDialog(true);
                }}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </IconButton>
            ),
            flex: 1,
          },
        ]}
        rows={broadcastTemplateVariables}
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
      <DeleteDialog
        title="Delete broadcast template variable"
        subtitle={`Are you sure you want to delete ${selectedBroadcastTemplateVariable?.name}?`}
        open={showDeleteDialog}
        onCancelClicked={() => setShowDeleteDialog(false)}
        onDeleteClicked={() => deleteBroadcastTemplateVariable()}
        loading={loading}
      />
    </Container>
  );
};

export * from './newVariable';
