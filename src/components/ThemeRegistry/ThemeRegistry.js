'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './EmotionCache';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#D63384',
            light: '#F48FB1',
            dark: '#A0005E',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#9C27B0',
            light: '#CE93D8',
            dark: '#6A0080',
            contrastText: '#ffffff',
        },
        background: {
            default: '#FDF2F8',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: 'Poppins, sans-serif',
    },
});

export default function ThemeRegistry({ children }) {
    return (
        <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </NextAppDirEmotionCacheProvider>
    );
}
