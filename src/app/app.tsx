import { ThemeProvider } from '@emotion/react';
import { StyledEngineProvider } from '@mui/material';
import { useEffect } from 'react';

import { Layout } from '../components';
import { LocalStorageItem, MuiCustomTheme } from '../shared';

export function App() {
  useEffect(() => {
    localStorage.removeItem(LocalStorageItem.Logged);
  }, []);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={MuiCustomTheme}>
        <Layout />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
