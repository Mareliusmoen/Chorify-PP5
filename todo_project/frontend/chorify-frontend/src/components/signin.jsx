import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from './ProtectedRoute';
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

// TODO remove, this demo shouldn't need to reset the theme.

const theme = createTheme({
    palette: {
        background: {
            default: '#000000', // black background
        },
        text: {
            primary: '#ffffff', // white text
        },
    },
    components: {
        // Style overrides for TextField
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& label.Mui-focused': {
                        color: 'white',
                    },
                    '& .MuiInput-underline:after': {
                        borderBottomColor: 'white',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'white',
                        },
                        '&:hover fieldset': {
                            borderColor: 'white',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'white',
                        },
                        '& input': {
                            color: 'white',
                            backgroundColor: '#424242',
                        },
                        '& .MuiInputLabel-root': {
                            color: 'white',
                        },
                        '& .MuiPlaceholder-root': {
                            color: 'white',
                        },
                    },
                },
            },
        },
        // Style overrides for Button
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: '#616161', // lighter grey
                    color: 'white', // text color
                    maxWidth: '100px',
                    '&:hover': {
                        backgroundColor: '#757575', // even lighter grey on hover
                    },
                },
            },
        },
    },
});


export default function SignIn() {
    const navigate = useNavigate();
    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/main-interface');
        }
    }, [navigate]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const apiUrl = import.meta.env.VITE_API_URL;
        const signInUrl = `${apiUrl}auth/login/`;

        try {
            const response = await fetch(signInUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: data.get('email'),
                    email: data.get('email'),
                    password: data.get('password'),
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Login successful:', responseData);

            const token = responseData.key;
            localStorage.setItem('token', token);

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
                    <h3>Welcome to Chorify</h3>
                    <Avatar
                        sx={{
                            m: 1,
                            bgcolor: 'white',
                            width: 155,
                            height: 155,
                        }}
                        src={logo}
                    >
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            InputLabelProps={{
                                style: { color: 'white' },
                            }}
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            InputLabelProps={{
                                style: { color: 'white' },
                            }}
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    value="remember"
                                    sx={{
                                        '&.Mui-checked': {
                                            color: 'white', // when checked
                                        },
                                        '&.MuiCheckbox-root': {
                                            color: 'grey', // when unchecked
                                        },
                                    }}
                                />
                            }
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
                                <Link
                                    href="#"
                                    variant="body2"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        navigate('/SignUp');
                                    }}
                                >
                                    {"Sign up here!"}
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