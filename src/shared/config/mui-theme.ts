import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xxl: true;
  }
}

export const MuiCustomTheme = createTheme({
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536, xxl: 1800 },
  },
  typography: {
    fontFamily: [
      '"Hanken Grotesk"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    primary: {
      main: '#f8c70f',
    },
    secondary: {
      main: '#1877f2',
    },
    success: {
      main: '#27ae60',
    },
    warning: {
      main: '#f39c12',
    },
    info: {
      main: '#3498db',
    },
    error: {
      main: '#e74c3c',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          '&.MuiButton-contained.Mui-disabled': {
            backgroundColor: '#0D0D0D',
            color: '#59656F',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&.MuiIconButton-root.Mui-disabled': {
            color: '#59656F',
          },
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          lineHeight: 'normal',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          borderRadius: 20,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: 16,
          '& label.Mui-focused': {
            color: '#34495e',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#2c3e50',
          },
          '& fieldset': {
            borderColor: '#bdc3c7',
            borderRadius: '12px',
          },
          '&:hover fieldset': {
            borderColor: '#2c3e50',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#34495e',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          marginTop: -10,
        },
        root: {
          '& .MuiMenu-list': {
            minWidth: 140,
            padding: '8px 0 12px',
          },
          '& .MuiMenuItem-root': {
            margin: '4px 12px 0 12px',
            padding: '8px 10px',
            borderRadius: 8,
            fontWeight: 500,
            fontSize: 14,

            '& .MuiSvgIcon-root': {
              fontSize: 16,
              marginRight: '10px',
            },
          },
          '& .danger': {
            color: '#e74c3c',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: 14,
          marginRight: 3,
          color: '#34495e',
          '&.Mui-selected': {
            color: '#c0392b',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: 'none',
        },
        root: {
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(33, 43, 54, 0.8)',
          },

          '& .MuiDialogActions-root': {
            padding: '1rem',
          },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow:
            'rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) -20px 20px 40px -4px',
        },
        root: {
          '& .MuiList-root': {
            padding: 0,

            '& .MuiMenuItem-root': {
              fontSize: 14,
              padding: 10,
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            'rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) -20px 20px 40px -4px',
          borderRadius: 12,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          boxShadow:
            'rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) -20px 20px 40px -4px',
          borderRadius: 12,
        },
        listbox: {
          padding: 0,
          margin: 0,
        },
      },
    },
  },
});
