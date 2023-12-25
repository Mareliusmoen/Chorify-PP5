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
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme({
    palette: {
        background: {
            default: '#000000',
        },
        text: {
            primary: '#ffffff',
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    background: 'rgb(64, 64, 64)', // Set background color
                    '& .MuiInputBase-input': {
                        color: 'white', // Set text color
                    },
                    '& .MuiInputLabel-root, & .MuiInputLabel-formControl': {
                        color: 'white !important', // Set label color (important to override default styles)
                    },
                    '& .MuiInput-underline:before, & .MuiInput-underline:after': {
                        borderBottomColor: 'white', // Set underline color
                    },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                        borderBottomColor: 'white', // Set underline color on hover
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'white', // Set outline border color
                        },
                        '&:hover fieldset': {
                            borderColor: 'white', // Set outline border color on hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'white', // Set outline border color when focused
                        },
                    },
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: 'white !important', // Set the default checkbox color
                    '&$checked': {
                        color: 'grey !important', // Set the checked checkbox color
                        '&.MuiIconButton-colorSecondary': {
                            color: 'grey !important', // Set the checked checkbox color for secondary color
                        },
                    },
                },
            },
        },
    },
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
        const apiUrl = "chorify-554b3183ed2e.herokuapp.com/api/";
        const signInUrl = `${apiUrl}auth/login/`;

        try {
            function getCookie(name) {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop().split(';').shift();
            }
            
            // Get the CSRF token
            const csrfToken = getCookie('csrftoken');
            console.log('CSRF Token:', csrfToken);
            const response = await fetch(signInUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
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
    const handleSignUpClick = () => {
        navigate('/signup');
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
                        maxWidth: '400px'
                    }}>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-auto">
                                <h1>Chorify</h1>
                            </div>
                            <div className="col-auto">
                                <img className="main-logo" src="./src/assets/images/chorify-logo.png" alt="Chorify logo" />
                            </div>
                        </div>
                    </div>
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
                            className="grey-button"
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Button onClick={handleSignUpClick} variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
