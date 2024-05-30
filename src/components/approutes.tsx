import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';

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
import RequireAuth from './Auth/RequireAuth';

export const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: '/auth',
      element: (
        <RequireAuth>
          <Auth />
        </RequireAuth>
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
      path: '',
      element: <Dashboard />,
      children: [
        {
          path: '/facebook-login',
          element: <FacebookBarrier />,
        },
        {
          path: 'contacts',
          element: <Contacts />,
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
          element: <Broadcast />,
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
          element: <Navigate to="contacts" />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
