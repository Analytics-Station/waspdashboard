import { Box, Container, Typography } from '@mui/material';

import { MLink } from '../../../components';

export const BulkImportContacts = () => {
  return (
    <Container maxWidth="xxl" className="tw-pt-12">
      <Box className="tw-border tw-border-dashed tw-border-yellow-600">
        <Typography>Bulk upload contacts</Typography>
        <Typography>
          Upload XLSX file to import multiple contacts. Download the sample
          template{' '}
          <MLink href={import.meta.env.VITE_CONTACTS_BULK_TEMPLATE}>here</MLink>
          .
        </Typography>
      </Box>
    </Container>
  );
};
