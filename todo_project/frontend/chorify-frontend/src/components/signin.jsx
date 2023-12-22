import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import logo from '../assets/images/chorify-logo.png';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';


function Copyright(props) {
    return (
        <Typography
            variant="body2"
            align="center"
            sx={{ color: 'lightgray' }}
            {...props}
        >
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Chorify
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme({
    // ... (theme configurations)
});


export default function SignIn() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is already authenticated and redirect if true
        if (localStorage.getItem('Token')) {
            navigate('/main-interface');
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { username, password } = event.currentTarget.elements;
        const apiUrl = import.meta.env.VITE_API_URL;
        const signInUrl = `${apiUrl}auth/login/`;
    
        try {
            const response = await fetch(signInUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.value,
                    password: password.value,
                }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, ${response.statusText}`);
            }
    
            const responseData = await response.json();
            console.log('Login successful:', responseData);
    
            const token = responseData.key;
            localStorage.setItem('Token', token);
    
            // Redirect to the main interface
            navigate('/main-interface');
        } catch (error) {
            console.error('Login failed:', error);
            // Handle errors, e.g., show error message to the user
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        maxWidth: '300px'
                    }}
                >
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}
