import { alpha, createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0891b2",
      dark: "#0e7490",
      light: "#cffafe",
    },
    secondary: {
      main: "#64748b",
    },
    success: {
      main: "#10b981",
    },
    warning: {
      main: "#f59e0b",
    },
    error: {
      main: "#ef4444",
    },
    background: {
      default: "#f0f9fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },
    divider: "#e0f2fe",
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h6: {
      fontWeight: 900,
    },
    button: {
      fontWeight: 800,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#0891b2",
          backgroundImage:
            "linear-gradient(135deg, #0e7490 0%, #0891b2 45%, #06b6d4 100%)",
          boxShadow: "0 4px 20px rgba(8, 145, 178, 0.15)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 16px rgba(8, 145, 178, 0.2)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          transition: "all 200ms ease",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#7dd3fc",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
            borderColor: "#0891b2",
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          transition: "all 200ms ease",
          "&.Mui-selected": {
            backgroundColor: alpha("#0891b2", 0.12),
            borderColor: "#0891b2",
            color: "#0e7490",
            boxShadow: "inset 0 0 0 1px #0891b2",
            "&:hover": {
              backgroundColor: alpha("#0891b2", 0.16),
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: "all 200ms ease",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(8, 145, 178, 0.12)",
          },
        },
      },
    },
  },
});
