import { Button, Container, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import {
  fbLogin,
  getFacebookLoginStatus,
  initFacebookSdk,
} from '../../../shared';

export const Contacts = () => {
  useEffect(() => {
    initFacebookSdk().then(() => {
      console.log('first');
      getFacebookLoginStatus().then((response) => {
        if (response == null) {
          console.log('No login status for the person');
        } else {
          console.log(response);
        }
      });
    });
  }, []);

  function login() {
    console.log('reached log in button');
    fbLogin().then((response: any) => {
      console.log(response);
      if (response.status === 'connected') {
        console.log('Person is connected');
      } else {
        // something
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
