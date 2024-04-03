import { ThemeProvider } from '@emotion/react';
import { StyledEngineProvider } from '@mui/material';

import { Layout } from '../components';
import { MuiCustomTheme } from '../shared';

export function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={MuiCustomTheme}>
        <Layout />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
