import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        p: '8px 8px 8px 16px',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'rgba(30, 41, 59, 0.25)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
      }}
    >
      <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.3)', mr: 1 }} />
      <TextField
        fullWidth
        variant="standard"
        placeholder="Search pipeline databases (e.g. CustomerID, schema error, pipeline status...)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{
          input: { color: '#fff', fontSize: '0.95rem' },
        }}
        InputProps={{
          disableUnderline: true,
        }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={loading || !query.trim()}
        sx={{
          bgcolor: '#6366f1',
          borderRadius: '12px',
          px: 3,
          py: 1,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
          '&:hover': {
            bgcolor: '#4f46e5',
          },
        }}
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : 'Search'}
      </Button>
    </Paper>
  );
}
