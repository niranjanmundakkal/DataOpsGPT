import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography, Box } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function EventTable({ events }) {
  const getSeverityChip = (severity) => {
    const sev = severity ? severity.toUpperCase() : 'LOW';
    switch (sev) {
      case 'HIGH':
        return (
          <Chip
            icon={<ErrorOutlineIcon style={{ color: '#ef4444', fontSize: '16px' }} />}
            label="HIGH"
            size="small"
            sx={{
              bgcolor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              fontWeight: 700,
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          />
        );
      case 'MEDIUM':
        return (
          <Chip
            icon={<WarningAmberIcon style={{ color: '#f59e0b', fontSize: '16px' }} />}
            label="MEDIUM"
            size="small"
            sx={{
              bgcolor: 'rgba(245, 158, 11, 0.1)',
              color: '#f59e0b',
              fontWeight: 700,
              border: '1px solid rgba(245, 158, 11, 0.2)',
            }}
          />
        );
      default:
        return (
          <Chip
            icon={<InfoOutlinedIcon style={{ color: '#3b82f6', fontSize: '16px' }} />}
            label="LOW"
            size="small"
            sx={{
              bgcolor: 'rgba(59, 130, 246, 0.1)',
              color: '#3b82f6',
              fontWeight: 700,
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          />
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  if (!events || events.length === 0) {
    return (
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          background: 'rgba(30, 41, 59, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
        }}
      >
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
          No events available.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        background: 'rgba(30, 41, 59, 0.15)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        boxShadow: 'none',
        overflow: 'hidden',
      }}
    >
      <Table>
        <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
          <TableRow>
            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>ID</TableCell>
            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Pipeline ID</TableCell>
            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Severity</TableCell>
            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Type</TableCell>
            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Status</TableCell>
            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Message</TableCell>
            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow
              key={event.id}
              sx={{
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.01)' },
                transition: 'background-color 0.2s',
              }}
            >
              <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.85rem' }}>
                {event.id}
              </TableCell>
              <TableCell sx={{ color: '#38bdf8', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.85rem' }}>
                {event.pipeline_id}
              </TableCell>
              <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                {getSeverityChip(event.severity)}
              </TableCell>
              <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500, borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.85rem' }}>
                <Chip label={event.event_type || 'UNKNOWN'} size="small" variant="outlined" sx={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.1)' }} />
              </TableCell>
              <TableCell sx={{ color: event.status?.toLowerCase().includes('fail') ? '#f87171' : '#34d399', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.85rem' }}>
                {event.status}
              </TableCell>
              <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.85rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {event.message}
              </TableCell>
              <TableCell sx={{ color: 'rgba(255, 255, 255, 0.4)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.8rem' }}>
                {formatDate(event.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
