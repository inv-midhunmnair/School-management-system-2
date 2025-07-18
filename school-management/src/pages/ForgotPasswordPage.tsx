import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/password-reset/', { email });
      if (response.status === 200) {
        setSubmitted(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error sending reset email');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <Typography variant="h5" gutterBottom>
        Forgot Password
      </Typography>

      {submitted ? (
        <Alert severity="success">Password reset email sent successfully.</Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter your email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button variant="contained" color="primary" fullWidth type="submit" sx={{ mt: 2 }}>
            Send Reset Email
          </Button>
        </form>
      )}
    </Box>
  );
};

export default ForgotPasswordPage;
