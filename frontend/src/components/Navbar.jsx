import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Navbar({ title }) {
  return (
    <Box
      sx={{
        height: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 4,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        bgcolor: 'rgba(13, 15, 20, 0.5)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
        {title}
      </Typography>
    </Box>
  );
}
