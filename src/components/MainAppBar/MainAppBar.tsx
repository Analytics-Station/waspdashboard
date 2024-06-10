import {
  faAddressBook,
  faBars,
  faBullhorn,
  faCaretDown,
  faCaretUp,
  faSquare,
  faUserGroup,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
  icon?: IconDefinition;
  url: string;
  roles: number[];
  children?: MenuItemProp[];
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
      children: [
        {
          label: 'Contact list',
          url: '/contacts/list',
          roles: [2, 3],
        },
        {
          label: 'Groups',
          url: '/contacts/groups',
          roles: [2, 3],
        },
      ],
    },
    {
      label: 'Broadcast',
      icon: faBullhorn,
      url: '/broadcasts',
      roles: [2, 3],
      children: [
        {
          label: 'Broadcast history',
          url: '/broadcasts/history',
          roles: [2, 3],
        },
        {
          label: 'New broadcast',
          url: '/broadcasts/new',
          roles: [2, 3],
        },
        {
          label: 'Scheduled broadcast',
          url: '/broadcasts/scheduled',
          roles: [2, 3],
        },
        {
          label: 'Template messages',
          url: '/broadcasts/templates/list',
          roles: [2, 3],
        },
      ],
    },
    {
      label: 'Users',
      icon: faUserGroup,
      url: '/users',
      roles: [1],
    },
  ];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedMenuItem, setExpandedMenuItem] = useState<number>(-1);
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

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <Link to="/">
        <img
          src="./images/wassp.svg"
          alt="Wassp"
          className="tw-w-full tw-px-8 tw-py-4"
        />
      </Link>
      <Divider />
      <List component="nav">
        {getRoleMenus().map((page, index) => (
          <Box key={page.label}>
            <ListItem
              key={page.label}
              disablePadding
              onClick={() => {
                if (expandedMenuItem === index) {
                  setExpandedMenuItem(-1);
                } else {
                  setExpandedMenuItem(index);
                }
              }}
            >
              <ListItemButton>
                {page.icon && (
                  <ListItemIcon>
                    <FontAwesomeIcon icon={page.icon} />
                  </ListItemIcon>
                )}
                <ListItemText primary={page.label} />
                {expandedMenuItem === index ? (
                  <FontAwesomeIcon icon={faCaretUp} />
                ) : (
                  <FontAwesomeIcon icon={faCaretDown} />
                )}
              </ListItemButton>
            </ListItem>
            <Collapse
              in={expandedMenuItem === index}
              timeout="auto"
              unmountOnExit
            >
              <List
                component="div"
                disablePadding
                onClick={() => setDrawerOpen(false)}
              >
                {page.children?.map((child) => (
                  <Link to={child.url} key={child.label}>
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemText primary={child.label} />
                    </ListItemButton>
                  </Link>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>
    </Box>
  );

  return (
    <Box className="tw-bg-slate-100">
      <Container maxWidth="xxl" disableGutters>
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
              <img
                src="./images/wassp.svg"
                alt="Wassp"
                className="xs:tw-hidden md:tw-block tw-w-24 tw-mr-4"
              />
            </Link>
            <IconButton
              className="xs:tw-block md:tw-hidden tw-w-12 tw-p-2 tw-mr-4"
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              <FontAwesomeIcon icon={faBars} />
            </IconButton>
            <Box className="tw-hidden md:tw-flex tw-items-center">
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
                        icon={page.icon ? page.icon : faSquare}
                        color="#1877f2"
                        size="xs"
                      />
                    }
                  >
                    {page.label}
                  </Button>
                </Link>
              ))}
            </Box>
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
              <Link to="/profile">
                <MenuItem onClick={handleClose}>
                  <Typography variant="subtitle2">My profile</Typography>
                </MenuItem>
              </Link>
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
              <Divider className="tw-mt-2" />
              <MenuItem onClick={logoutClicked}>
                <Typography variant="subtitle2">Logout</Typography>
              </MenuItem>
            </StyledMenu>
          )}
        </AppBar>
      </Container>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {DrawerList}
      </Drawer>
    </Box>
  );
};
