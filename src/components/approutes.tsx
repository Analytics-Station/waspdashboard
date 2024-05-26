import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

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
  ContactGroups,
  ContactList,
  Contacts,
  Dashboard,
  NewBroadcast,
  NewBroadcastTemplate,
  NewTemplateVariable,
  Register,
  SignIn,
  UserList,
  Users,
} from '../views';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />}>
        <Route path="signin" element={<SignIn />} />
        <Route path="register" element={<Register />} />
        <Route path="" element={<Navigate to="signin" />} />
      </Route>

      <Route path="" element={<Dashboard />}>
        <Route path="contacts" element={<Contacts />}>
          <Route path="" element={<ContactList />} />
          <Route path="bulk-import" element={<BulkImportContacts />} />
        </Route>
        <Route path="contact-groups" element={<ContactGroups />}>
          <Route path="" element={<ContactGroupList />} />
        </Route>
        <Route path="broadcasts" element={<Broadcast />}>
          <Route path="" element={<Navigate to="history" />} />
          <Route path="new" element={<NewBroadcast />} />
          <Route path="history" element={<BroadcastHistory />} />
          <Route path="scheduled" element={<BroadcastScheduled />} />
          <Route path="templates/new" element={<NewBroadcastTemplate />} />
          <Route path="templates" element={<BroadcastTemplates />}>
            <Route path="list" element={<BroadcastTemplateList />} />
            <Route path="variables" element={<Outlet />}>
              <Route path="list" element={<BroadcastTemplateVariables />} />
              <Route path="new" element={<NewTemplateVariable />} />
              <Route path="" element={<Navigate to="list" />} />
            </Route>
            <Route path="" element={<Navigate to="list" />} />
          </Route>
          <Route path="new-template" element={<NewBroadcastTemplate />} />
        </Route>
        <Route path="users" element={<Users />}>
          <Route path="" element={<UserList />} />
        </Route>
        <Route path="" element={<Navigate to="contacts" />} />
      </Route>
    </Routes>
  );
};
