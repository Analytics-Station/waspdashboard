import { Box, CircularProgress, Typography } from '@mui/material';

export const PleaseWait = () => {
  return (
    <Box className="tw-text-center tw-my-12">
      <Typography variant="h6" className="tw-font-medium tw-mb-4">
        Please wait...
      </Typography>
      <CircularProgress size={16} />
    </Box>
  );
};
