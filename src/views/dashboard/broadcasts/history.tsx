import { Box, Button, Container } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Broadcast,
  BroadcastResponse,
  makeRequest,
  PaginationMeta,
} from '../../../shared';

export const BroadcastHistory = () => {
  const [pagination, setPagination] = useState<PaginationMeta>(
    new PaginationMeta({})
  );
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);

  useEffect(() => {
    fetchBroadcasts();
  }, [pagination]);

  const fetchBroadcasts = async () => {
    const response = await makeRequest<null, BroadcastResponse>(
      `/broadcasts?perPage=${pagination.perPage}&currentPage=${pagination.currentPage}`
    );
    const message = new BroadcastResponse(response.message);
    setBroadcasts(message.list);
  };

  return (
    <Container maxWidth="xxl" className="tw-h-full tw-overflow-y-auto tw-py-12">
      <Box className="tw-flex tw-flex-col tw-items-end tw-mb-4">
        <Link to="/broadcasts/new">
          <Button disableElevation variant="contained">
            New Broadcast
          </Button>
        </Link>
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
            field: 'Broadcast name',
            valueFormatter: (val, row, col) => {
              return row.name;
            },
            flex: 1,
          },
          {
            field: 'Scheduled',
            valueFormatter: (val, row, col) => {
              return moment(row.createdAt).format('DD, MMM YYYY HH:mm:ss');
            },
            flex: 1,
          },
          {
            field: 'Read',
            valueFormatter: (val, row, col) => {
              return '-';
            },
            flex: 1,
          },
          {
            field: 'Recipients',
            valueFormatter: (val, row, col) => {
              return row.contacts.length;
            },
            flex: 1,
          },
          {
            field: 'Failed',
            valueFormatter: (val, row, col) => {
              return '-';
            },
            flex: 1,
          },
          {
            field: 'Status',
            valueFormatter: (val, row, col) => {
              return 'Delivered';
            },
            flex: 1,
          },
          {
            field: 'Template',
            valueFormatter: (val, row, col) => {
              return row.templateId;
            },
            flex: 1,
          },
        ]}
        rows={broadcasts}
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
    </Container>
  );
};
