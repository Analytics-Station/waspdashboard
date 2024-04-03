import { Box } from '@mui/material';

import { AppRoutes } from './approutes';

export const Layout = () => {
  return (
    <Box className="tw-clear-both tw-my-0 tw-mx-auto tw-overflow-x-hidden tw-h-full">
      <AppRoutes />
    </Box>
  );
};
