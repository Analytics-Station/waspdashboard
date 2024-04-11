import { Container, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const Contacts = () => {
  return (
    <Container maxWidth="xxl" className="tw-pt-12">
      <Typography variant="h4" className="tw-font-black">
        Contacts
      </Typography>
      <Typography variant="subtitle1" className="tw-mt-4 tw-w-4/12">
        Contact list stores the list of numbers that you've interacted with. You
        can even manually export or import contacts.
      </Typography>
      <Outlet />
    </Container>
  );
};

export * from './contactList';
export * from './bulkImportContacts';
