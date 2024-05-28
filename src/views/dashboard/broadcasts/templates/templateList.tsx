import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chip, Container, IconButton, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { useEffect, useState } from 'react';

import { DeleteDialog } from '../../../../components';
import {
  BroadcastTemplate,
  BroadcastTemplateResponse,
  languages,
  makeRequest,
  PaginationMeta,
  RequestMethod,
} from '../../../../shared';

export const BroadcastTemplateList = () => {
  const [pagination, setPagination] = useState<PaginationMeta>(
    new PaginationMeta({})
  );
  const [broadcastTemplate, setBroadcastTemplates] = useState<
    BroadcastTemplate[]
  >([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBroadcastTemplate, setSelectedBroadcastTemplate] =
    useState<BroadcastTemplate | null>(null);

  useEffect(() => {
    fetchBroadcastTemplates();
  }, [pagination]);

  const fetchBroadcastTemplates = async () => {
    const response = await makeRequest<null, BroadcastTemplateResponse>(
      `/broadcast-templates?perPage=${pagination.perPage}&currentPage=${pagination.currentPage}`,
      RequestMethod.GET,
      true
    );
    const message = new BroadcastTemplateResponse(response.message);
    setBroadcastTemplates(message.list);
  };

  const deleteBroadcastTemplate = async () => {
    setLoading(true);
    try {
      const response = await makeRequest<null, null>(
        `/broadcast-templates/${selectedBroadcastTemplate?.id}`,
        RequestMethod.DELETE,
        true
      );
    } catch (e) {
      console.log(e);
    }
    fetchBroadcastTemplates();
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
            renderCell: ({ formattedValue, row }) => {
              return (
                <Tooltip title={row.name}>
                  <p>{row.name}</p>
                </Tooltip>
              );
            },
            valueFormatter: (val, row, col) => {
              return row.name;
            },
            flex: 1,
          },
          {
            field: 'Category',
            valueFormatter: (val, row, col) => {
              return row.category;
            },
            flex: 1,
          },
          {
            field: 'Language',
            valueFormatter: (val, row, col) => {
              const language = languages.find(
                (lang) => lang[1] === row.language
              );
              return language ? language[0] : row.language;
            },
            flex: 1,
          },
          {
            field: 'Status',
            renderCell: ({ formattedValue, row }) => {
              return (
                <Chip
                  className="tw-font-medium"
                  color={row.getStatusColor()}
                  size="small"
                  label={row.status}
                />
              );
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
                  setSelectedBroadcastTemplate(params.row);
                  setShowDeleteDialog(true);
                }}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </IconButton>
            ),
            flex: 1,
          },
        ]}
        rows={broadcastTemplate}
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
        title="Delete broadcast template"
        subtitle={`Are you sure you want to delete ${selectedBroadcastTemplate?.name}?`}
        open={showDeleteDialog}
        onCancelClicked={() => setShowDeleteDialog(false)}
        onDeleteClicked={() => deleteBroadcastTemplate()}
        loading={loading}
      />
    </Container>
  );
};
