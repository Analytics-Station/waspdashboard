import { useSelector } from 'react-redux';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom';

import { RootState } from '../redux';
import {
  Auth,
  Broadcast,
  BroadcastHistory,
  BroadcastScheduled,
  BroadcastTemplateList,
  BroadcastTemplates,
  BroadcastTemplateVariables,
  BulkImportContacts,
  ContactGroupList,
  ContactList,
  Contacts,
  Dashboard,
  FacebookBarrier,
  NewBroadcast,
  NewBroadcastTemplate,
  NewTemplateVariable,
  Register,
  SignIn,
  UserList,
  Users,
} from '../views';
import {
  RedirectDashboard,
  RedirectVerification,
  RequireAuth,
  RequireOrganisationRole,
  RequireVerification,
} from './Auth';

export const AppRoutes = () => {
  const loggedUser = useSelector((state: RootState) => state.auth.user);

  const router = createBrowserRouter([
    {
      path: '/auth',
      element: (
        <RedirectDashboard>
          <Auth />
        </RedirectDashboard>
      ),
      children: [
        {
          path: 'signin',
          element: <SignIn />,
        },
        {
          path: 'register',
          element: <Register />,
        },
        {
          path: '',
          element: <Navigate to="signin" />,
        },
      ],
    },
    {
      path: '/facebook-login',
      element: (
        <RequireAuth>
          <RedirectVerification>
            <FacebookBarrier />
          </RedirectVerification>
        </RequireAuth>
      ),
    },
    {
      path: '',
      element: (
        <RequireAuth>
          <RequireVerification>
            <Dashboard />
          </RequireVerification>
        </RequireAuth>
      ),
      children: [
        {
          path: 'contacts',
          element: (
            <RequireOrganisationRole>
              <Contacts />
            </RequireOrganisationRole>
          ),
          children: [
            {
              path: 'bulk-import',
              element: <BulkImportContacts />,
            },
            {
              path: 'list',
              element: <ContactList />,
            },
            {
              path: 'groups',
              element: <ContactGroupList />,
            },
            {
              path: '',
              element: <Navigate to="list" />,
            },
          ],
        },
        {
          path: 'broadcasts',
          element: (
            <RequireOrganisationRole>
              <Broadcast />
            </RequireOrganisationRole>
          ),
          children: [
            {
              path: 'new',
              element: <NewBroadcast />,
            },
            {
              path: 'history',
              element: <BroadcastHistory />,
            },
            {
              path: 'scheduled',
              element: <BroadcastScheduled />,
            },
            {
              path: 'templates/new',
              element: <NewBroadcastTemplate />,
            },
            {
              path: 'templates',
              element: <BroadcastTemplates />,
              children: [
                {
                  path: 'list',
                  element: <BroadcastTemplateList />,
                },
                {
                  path: 'variables',
                  element: <Outlet />,
                  children: [
                    {
                      path: 'list',
                      element: <BroadcastTemplateVariables />,
                    },
                    {
                      path: 'new',
                      element: <NewTemplateVariable />,
                    },
                    {
                      path: '',
                      element: <Navigate to="list" />,
                    },
                  ],
                },
                {
                  path: '',
                  element: <Navigate to="list" />,
                },
              ],
            },
            {
              path: 'new-template',
              element: <NewBroadcastTemplate />,
            },
            {
              path: '',
              element: <Navigate to="history" />,
            },
          ],
        },
        {
          path: 'users',
          element: <Users />,
          children: [
            {
              path: '',
              element: <UserList />,
            },
          ],
        },
        // {
        //   path: 'organisations',
        //   element: <Organisations />,
        //   children: [
        //     {
        //       path: '',
        //       element: <OrganisationList />,
        //     },
        //   ],
        // },
        {
          path: '',
          element: (
            <Navigate
              to={loggedUser?.isOrganisationRole() ? 'contacts' : 'users'}
            />
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
