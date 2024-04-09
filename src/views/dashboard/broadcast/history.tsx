import { Box, Button, Container } from '@mui/material';
import { useState } from 'react';

import { NewBroadcast } from './newBroadcast';

export const BroadcastHistory = () => {
  const [showNewBroadcast, setShowNewBroadcast] = useState(false);

  return (
    <Container maxWidth="xxl" className="tw-h-full tw-overflow-y-auto tw-py-12">
      <Box className="tw-flex tw-flex-col tw-items-end">
        <Button
          disableElevation
          variant="contained"
          onClick={() => setShowNewBroadcast(true)}
        >
          New Broadcast
        </Button>
      </Box>
      <NewBroadcast
        open={showNewBroadcast}
        onCloseClicked={() => setShowNewBroadcast(false)}
      />
    </Container>
  );
};
