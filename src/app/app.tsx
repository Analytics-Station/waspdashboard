import { ThemeProvider } from '@emotion/react';
import { StyledEngineProvider } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Layout } from '../components';
import { changeLoadingStatus, RootState, setIsTokenValidated, useAppDispatch, validateToken } from '../redux';
import { LocalStorageItem, MuiCustomTheme } from '../shared';

export function App() {
  const dispatch = useAppDispatch();
  const isTokenValidated = useSelector(
    (state: RootState) => state.auth.isTokenValidated
  );
  const loading = useSelector((state: RootState) => state.app.loading);

  useEffect(() => {
    const token = localStorage.getItem(LocalStorageItem.TOKEN);
    if (token && !loading) {
      dispatch(changeLoadingStatus(true));
      dispatch(validateToken());
    } else {
      dispatch(setIsTokenValidated(true));
    }
  }, []);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={MuiCustomTheme}>
        {isTokenValidated && <Layout />}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
