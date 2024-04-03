import { Navigate, Route, Routes } from 'react-router-dom';

import { Auth, Register, SignIn } from '../views';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<Auth />}>
        <Route path="" element={<Navigate to="signin" />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
};
