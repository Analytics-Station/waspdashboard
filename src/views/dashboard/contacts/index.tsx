import {
  faAddressBook,
  faPeopleGroup,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Container,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { MenuLink } from '../../../shared';

export const Contacts = () => {
  const location = useLocation();
  const links: MenuLink[] = [
    {
      label: 'Contacts',
      url: '/contacts/list',
      urlCheck: ['/contacts/list', '/contacts/new', '/contacts/bulk-import'],
      icon: faAddressBook,
    },
    {
      label: 'Contact groups',
      url: '/contacts/groups',
      icon: faPeopleGroup,
    },
  ];

  const isItemActive = (index: number): boolean => {
    const link = links[index];
    if (link.urlCheck) {
      let exists = false;
      link.urlCheck.every((url) => {
        if (location.pathname.startsWith(url)) {
          exists = true;
          return false;
        }
        return true;
      });
      return exists;
    }
    return location.pathname.startsWith(link.url);
  };

  return (
    <Container maxWidth="xxl" className="tw-flex tw-h-full" disableGutters>
      <Box className="tw-w-56">
        <List className="tw-py-0">
          {links.map((link, index) => (
            <ListItemButton
              key={link.label}
              component={Link}
              to={link.url}
              selected={isItemActive(index)}
            >
              <ListItemIcon>
                <FontAwesomeIcon fixedWidth icon={link.icon} />
              </ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Divider orientation="vertical" />
      <Box className="tw-flex-1 tw-overflow-y-auto">
        <Outlet />
      </Box>
    </Container>
  );
};

export * from './contactList';
export * from './bulkImportContacts';
export * from './newContact';
