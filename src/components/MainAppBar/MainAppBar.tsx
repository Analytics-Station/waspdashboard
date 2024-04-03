import {
  faAddressBook,
  faBullhorn,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AppBar,
  Avatar,
  Button,
  Divider,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';

interface MenuItem {
  label: string;
  icon: IconDefinition;
  url: string;
}

export const MainAppBar = () => {
  const pages: MenuItem[] = [
    {
      label: 'Contacts',
      icon: faAddressBook,
      url: '/contacts',
    },
    {
      label: 'Broadcast',
      icon: faBullhorn,
      url: '/broadcast',
    },
  ];
  return (
    <AppBar
      elevation={0}
      color="inherit"
      position="fixed"
      style={{
        backdropFilter: 'blur(6px)',
      }}
      className="tw-bg-slate-100"
    >
      <Toolbar>
        <Link to="/dashboard">
          <Typography
            variant="h6"
            className="tw-font-black tw-text-yellow-500 tw-mr-4"
          >
            WASP
          </Typography>
        </Link>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          className="tw-h-6 tw-self-center"
        />
        {pages.map((page) => (
          <Link to={`/dashboard${page.url}`} key={page.label}>
            <Button
              size="small"
              color="secondary"
              className="tw-ml-4"
              startIcon={
                <FontAwesomeIcon icon={page.icon} color="#1877f2" size="xs" />
              }
            >
              {page.label}
            </Button>
          </Link>
        ))}
        <Tooltip title="Profile" className="tw-ml-auto">
          <IconButton size="small">
            <Avatar alt="Profile picture" src="./images/avatar_default.jpg" />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};
