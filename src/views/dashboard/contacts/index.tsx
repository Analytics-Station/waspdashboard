import { Button, Container, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { fbLogin } from '../../../shared';

export const Contacts = () => {
  function login() {
    console.log('reached log in button');
    fbLogin().then((response: any) => {
      console.log(response);
      if (response.status === 'connected') {
        console.log('Person is connected');
      } else {
        // something
      }

      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        //Use this token to call the debug_token API and get the shared WABA's ID
        console.log('accessToken', accessToken);
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    });
  }

  return (
    <Container maxWidth="xxl" className="tw-pt-12">
      <Button variant="contained" color="success" onClick={() => login()}>
        Login facebook
      </Button>
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
