import { Navigate, Route, Routes } from 'react-router-dom';

import {
  Auth,
  Broadcast,
  Contacts,
  Dashboard,
  Home,
  Register,
  SignIn,
} from '../views';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<Auth />}>
        <Route path="" element={<Navigate to="signin" />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="" element={<Home />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="broadcast" element={<Broadcast />} />
      </Route>
    </Routes>
  );
};
