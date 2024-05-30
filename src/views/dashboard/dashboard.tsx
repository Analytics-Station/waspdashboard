import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { MainAppBar } from '../../components';
import { RootState, useAppDispatch } from '../../redux';

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  // useEffect(() => {
  //   authenticateUser();
  // }, []);

  // const authenticateUser = async () => {
  //   try {
  //     if (!isLoggedIn) {
  //       dispatch(validateToken());
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Box className="tw-h-full tw-overflow-y-hidden tw-flex tw-flex-col">
      <MainAppBar />
      <Box className="tw-flex-1 tw-overflow-y-auto">
        <Outlet />
      </Box>
    </Box>
  );
};
