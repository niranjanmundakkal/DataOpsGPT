import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Typography, Button, Stack } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function Sidebar() {
  const navItems = [
    { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { text: 'AI Chat', path: '/chat', icon: <ChatIcon /> },
    { text: 'Search', path: '/search', icon: <SearchIcon /> },
    { text: 'Events Log', path: '/events', icon: <ListAltIcon /> },
    { text: 'Registry', path: '/registry', icon: <AddCircleOutlineIcon /> },
  ];

  return (
    <Box
      sx={{
        width: 260,
        height: '100vh',
        bgcolor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
      }}
    >
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.5px',
          }}
        >
          DataOpsGPT 🚀
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
          AI Data Engineering Copilot
        </Typography>
      </Box>

      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <Button
            key={item.text}
            component={NavLink}
            to={item.path}
            variant="text"
            startIcon={item.icon}
            sx={{
              justifyContent: 'flex-start',
              color: 'rgba(255, 255, 255, 0.6)',
              py: 1.5,
              px: 2,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              '&.active': {
                bgcolor: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                boxShadow: 'inset 0 0 0 1px rgba(99, 102, 241, 0.3)',
              },
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
              },
            }}
          >
            {item.text}
          </Button>
        ))}
      </Stack>

      <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.35)', display: 'block', textAlign: 'center' }}>
          v1.0.0 · Phase 2 Active
        </Typography>
      </Box>
    </Box>
  );
}
