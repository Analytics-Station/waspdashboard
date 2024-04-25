import { Navigate, Route, Routes } from 'react-router-dom';

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
  NewTemplateVariable,
  Register,
  SignIn,
} from '../views';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />}>
        <Route path="" element={<Navigate to="signin" />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="" element={<Dashboard />}>
        <Route path="" element={<Navigate to="contacts" />} />
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
          <Route path="templates" element={<BroadcastTemplates />}>
            <Route path="" element={<Navigate to="list" />} />
            <Route path="list" element={<BroadcastTemplateList />} />
            <Route
              path="variables/list"
              element={<BroadcastTemplateVariables />}
            />
            <Route path="variables/new" element={<NewTemplateVariable />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
