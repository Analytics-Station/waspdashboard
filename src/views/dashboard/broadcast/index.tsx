import {
  faBusinessTime,
  faClock,
  faFile,
  IconDefinition,
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
import { Outlet, useNavigate } from 'react-router-dom';

interface MenuLink {
  label: string;
  url: string;
  icon: IconDefinition;
}

export const Broadcast = () => {
  const navigate = useNavigate();
  const links: MenuLink[] = [
    {
      label: 'Broadcast history',
      url: '/broadcast/history',
      icon: faClock,
    },
    {
      label: 'Scheduled Broadcasts',
      url: '/broadcast/scheduled',
      icon: faBusinessTime,
    },
    {
      label: 'Template messages',
      url: '/broadcast/templates',
      icon: faFile,
    },
  ];

  return (
    <Container maxWidth="xxl" className="tw-flex tw-h-full">
      <Box className="tw-w-56">
        <List className="tw-py-0">
          {links.map((link) => (
            <ListItemButton key={link.label} onClick={() => navigate(link.url)}>
              <ListItemIcon>
                <FontAwesomeIcon fixedWidth icon={link.icon} />
              </ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Divider orientation="vertical" />
      <Box className="tw-flex-1">
        <Outlet />
      </Box>
    </Container>
  );
};

export * from './history';
export * from './scheduled';
export * from './templates';
