import { Navigate, Route, Routes } from 'react-router-dom';

import {
  Auth,
  Broadcast,
  BroadcastHistory,
  BroadcastScheduled,
  BroadcastTemplates,
  Contacts,
  Dashboard,
  Home,
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
        <Route path="" element={<Home />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="broadcast" element={<Broadcast />}>
          <Route path="" element={<Navigate to="history" />} />
          <Route path="history" element={<BroadcastHistory />} />
          <Route path="scheduled" element={<BroadcastScheduled />} />
          <Route path="templates" element={<BroadcastTemplates />} />
        </Route>
      </Route>
    </Routes>
  );
};
