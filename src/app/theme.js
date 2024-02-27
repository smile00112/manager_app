import { createTheme } from '@mui/material/styles';
import { ruRU } from '@mui/material/locale';
// import useMediaQuery from '@mui/material/useMediaQuery';
// const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
const theme = createTheme(
  {
    typography: {
      useNextVariants: true,
      fontFamily: "Tahoma",
      fontSize: 14,
    },
      palette: {
          mode: 'dark',
      },
  },
  ruRU
);

export default theme;
