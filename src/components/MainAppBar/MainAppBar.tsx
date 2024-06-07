import { faAddressBook, faBullhorn, faUserGroup, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  MenuProps,
  styled,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { MouseEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { logout, RootState, useAppDispatch } from '../../redux';

interface MenuItemProp {
  label: string;
  icon: IconDefinition;
  url: string;
  roles: number[];
}

export const MainAppBar = () => {
  const dispatch = useAppDispatch();
  const loggedUser = useSelector((state: RootState) => state.auth.user);

  const pages: MenuItemProp[] = [
    {
      label: 'Contacts',
      icon: faAddressBook,
      url: '/contacts',
      roles: [2, 3],
    },
    {
      label: 'Broadcast',
      icon: faBullhorn,
      url: '/broadcasts',
      roles: [2, 3],
    },
    {
      label: 'Users',
      icon: faUserGroup,
      url: '/users',
      roles: [1],
    },
  ];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutClicked = async () => {
    dispatch(logout());
    // navigate('/auth/signin');
  };

  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(() => ({
    '& .MuiPaper-root': {
      borderRadius: 12,
      minWidth: 200,
      backgroundColor: '#fff',
      border: '1px solid #bdc3c744',
      boxShadow:
        'rgb(145 158 171 / 30%) 0px 0px 2px 0px, rgb(145 158 171 / 30%) -20px 20px 40px -4px',
      '& .MuiMenu-list': {
        padding: '0 0 8px',

        '& .MuiBox-root': {
          padding: '6px 18px 10px',
          backgroundColor: 'rgba(145, 158, 171, 0.12)',
        },
        '& .MuiMenuItem-root': {
          margin: '8px 8px 0',
          borderRadius: '4px',
        },
      },
    },
  }));

  const getRoleMenus = (): MenuItemProp[] => {
    if (
      !loggedUser ||
      (loggedUser.isOrganisationRole() &&
        loggedUser.organisation &&
        !loggedUser.organisation.verified)
    ) {
      return [];
    }
    return pages.filter((page) => page.roles.includes(loggedUser.role));
  };

  return (
    <Box className="tw-bg-slate-100">
      <Container maxWidth="xxl">
        <AppBar
          elevation={0}
          color="inherit"
          position="relative"
          style={{
            backdropFilter: 'blur(6px)',
          }}
          className="tw-bg-slate-100"
        >
          <Toolbar>
            <Link to="/">
              <Typography
                variant="h6"
                className="tw-font-black tw-text-yellow-500 tw-mr-4"
              >
                WASP
              </Typography>
            </Link>
            {getRoleMenus().length > 0 && (
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                className="tw-h-6 tw-self-center"
              />
            )}
            {getRoleMenus().map((page) => (
              <Link to={page.url} key={page.label}>
                <Button
                  size="small"
                  color="secondary"
                  className="tw-ml-4"
                  startIcon={
                    <FontAwesomeIcon
                      icon={page.icon}
                      color="#1877f2"
                      size="xs"
                    />
                  }
                >
                  {page.label}
                </Button>
              </Link>
            ))}
            <Tooltip title="Profile" className="tw-ml-auto">
              <IconButton size="small" onClick={handleClick}>
                <Avatar
                  alt="Profile picture"
                  src="./images/avatar_default.jpg"
                />
              </IconButton>
            </Tooltip>
          </Toolbar>
          {loggedUser && (
            <StyledMenu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              elevation={0}
              className="tw-p-2"
            >
              <Box>
                <Typography variant="subtitle2">
                  <b>{loggedUser.name}</b>
                </Typography>
                <Typography variant="subtitle2">
                  {loggedUser.getFormattedPhone()}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleClose}>
                <Link to="/profile">
                  <Typography variant="subtitle2">My profile</Typography>
                </Link>
              </MenuItem>
              {loggedUser.isOrganisationRole() &&
                loggedUser.organisation &&
                loggedUser.organisation.verified && (
                  <MenuItem onClick={handleClose}>
                    <Link to="/users">
                      <Typography variant="subtitle2">
                        Organisation users
                      </Typography>
                    </Link>
                  </MenuItem>
                )}
              <Divider />
              <MenuItem onClick={logoutClicked}>
                <Typography variant="subtitle2">Logout</Typography>
              </MenuItem>
            </StyledMenu>
          )}
        </AppBar>
      </Container>
    </Box>
  );
};
