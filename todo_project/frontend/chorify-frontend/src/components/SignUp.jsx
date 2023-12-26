import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography, Container, Avatar } from '@mui/material';


function SignUp() {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const registrationUrl = `/auth/registration/`;

        try {
            const response = await fetch(registrationUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: data.get('username'),
                    email: data.get('email'),
                    password1: data.get('password1'),
                    password2: data.get('password2'),
                }),
            });

            if (response.status === 204) {
                console.log('Registration successful');
                navigate('/main-interface');
            } else {
                const responseData = await response.json();
                console.log('Registration successful:', responseData);
                const token = responseData.key;
                localStorage.setItem('Token', token);
                navigate('/main-interface');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            setError('Registration failed. Please try again.');
        }
    };
    const textFieldStyles = {
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
    };

    const buttonStyles = {
        mt: 3,
        mb: 2,
        backgroundColor: '#616161', // lighter grey
        color: 'white', // text color
        maxWidth: '100px',
        '&:hover': {
            backgroundColor: '#757575', // even lighter grey on hover
        },
    };


    return (
        <Container component="main">
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
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
                    src="/static/assets/chorify-logo-iw10hy8l.png"
                >
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    sx={textFieldStyles}
                    InputLabelProps={{
                        style: { color: 'white' },
                    }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    sx={textFieldStyles}
                    InputLabelProps={{
                        style: { color: 'white' },
                    }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password1"
                    label="Password"
                    type="password"
                    id="password1"
                    autoComplete="new-password"
                    autoFocus
                    sx={textFieldStyles}
                    InputLabelProps={{
                        style: { color: 'white' },
                    }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password2"
                    label="Confirm Password"
                    type="password"
                    id="password2"
                    autoComplete="new-password"
                    autoFocus
                    sx={textFieldStyles}
                    InputLabelProps={{
                        style: { color: 'white' },
                    }}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={buttonStyles}
                >
                    Sign Up
                </Button>
            </Box>
        </Container>
    );
}

export default SignUp;