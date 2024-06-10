import { Box, Button, Container } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Broadcast, BroadcastResponse, makeRequest, PaginationMeta, RequestMethod } from '../../../shared';

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
      `/broadcasts?perPage=${pagination.perPage}&currentPage=${pagination.currentPage}`,
      RequestMethod.GET,
      true
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
            minWidth: 200,
            flex: 1,
          },
          {
            field: 'Recipients',
            valueFormatter: (val, row, col) => {
              return row.recipients;
            },
            flex: 1,
            minWidth: 150,
          },
          {
            field: 'Sent at',
            valueFormatter: (val, row, col) => {
              return moment(row.createdAt).format('DD, MMM YYYY hh:mm A');
            },
            flex: 1,
            minWidth: 200,
          },
          {
            field: 'Accepted',
            valueFormatter: (val, row, col) => {
              return row.accepted;
            },
            flex: 1,
            minWidth: 150,
          },
          {
            field: 'Delivered',
            valueFormatter: (val, row, col) => {
              return row.delivered;
            },
            flex: 1,
            minWidth: 150,
          },
          {
            field: 'Read',
            valueFormatter: (val, row, col) => {
              return row.read;
            },
            flex: 1,
            minWidth: 100,
          },
          {
            field: 'Failed',
            valueFormatter: (val, row, col) => {
              return row.failed;
            },
            flex: 1,
            minWidth: 120,
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
