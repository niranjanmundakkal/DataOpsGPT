import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, CircularProgress, Stack, Paper } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // POST login
      const response = await api.post('/auth/login', { email, password });
      const { access_token } = response.data;
      
      // Store token
      localStorage.setItem('token', access_token);

      // Fetch user profile info to store role and username
      const meResponse = await api.get('/auth/me');
      localStorage.setItem('username', meResponse.data.username);
      localStorage.setItem('role', meResponse.data.role);

      // Redirect to home dashboard
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Invalid credentials or server connection failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #0d0f14 100%)',
        px: 3,
      }}
    >
      <Stack spacing={4} sx={{ width: '100%', maxWidth: '440px' }}>
        {/* Main Card */}
        <Card
          sx={{
            background: 'rgba(30, 41, 59, 0.3)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
                  mb: 2,
                }}
              >
                <LockOpenIcon sx={{ fontSize: 28, color: '#fff' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', textAlign: 'center' }}>
                Welcome to DataOpsGPT
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.45)', mt: 0.5, letterSpacing: '0.5px' }}>
                AI-POWERED DATA OPERATIONS PORTAL
              </Typography>
            </Box>

            <form onSubmit={handleLogin}>
              <Stack spacing={3}>
                {error && (
                  <Alert severity="error" sx={{ borderRadius: '12px', bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    {error}
                  </Alert>
                )}

                <TextField
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                  InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.5)' } }}
                  InputProps={{
                    style: { color: '#fff', borderRadius: '12px' },
                    sx: {
                      bgcolor: 'rgba(255, 255, 255, 0.03)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25) !important' },
                      '&.Mui-focused fieldset': { borderColor: '#6366f1 !important' },
                    },
                  }}
                />

                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.5)' } }}
                  InputProps={{
                    style: { color: '#fff', borderRadius: '12px' },
                    sx: {
                      bgcolor: 'rgba(255, 255, 255, 0.03)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25) !important' },
                      '&.Mui-focused fieldset': { borderColor: '#6366f1 !important' },
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.8,
                    borderRadius: '12px',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>

        {/* Credentials Sandbox Box */}
        <Paper
          sx={{
            background: 'rgba(30, 41, 59, 0.15)',
            border: '1px dashed rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            p: 3,
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#a5b4fc', mb: 1.5, textAlign: 'center' }}>
            🔒 Seeded Demo Logins (Password: password)
          </Typography>
          <Stack spacing={1} sx={{ fontSize: '0.8rem' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#f87171' }}>ADMIN:</Typography>
              <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>admin@test.com</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#f59e0b' }}>ENGINEER:</Typography>
              <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>engineer@test.com</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#38bdf8' }}>VIEWER:</Typography>
              <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>viewer@test.com</Typography>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
