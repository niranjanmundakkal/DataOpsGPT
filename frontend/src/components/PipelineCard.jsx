import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function PipelineCard({ pipeline }) {
  const getStatusDetails = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (s.includes('fail') || s.includes('error')) {
      return {
        label: 'Failed',
        color: 'error',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        icon: <ErrorOutlineIcon sx={{ fontSize: 16 }} />,
      };
    }
    if (s.includes('run') || s.includes('activ')) {
      return {
        label: 'Running',
        color: 'primary',
        bgColor: 'rgba(14, 165, 233, 0.1)',
        borderColor: 'rgba(14, 165, 233, 0.3)',
        icon: <PlayArrowIcon sx={{ fontSize: 16 }} />,
      };
    }
    return {
      label: 'Success',
      color: 'success',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />,
    };
  };

  const statusInfo = getStatusDetails(pipeline.status);

  return (
    <Card
      sx={{
        background: 'rgba(30, 41, 59, 0.3)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.4), 0 0 15px rgba(99, 102, 241, 0.15)',
          borderColor: 'rgba(99, 102, 241, 0.2)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
            {pipeline.name}
          </Typography>
          <Chip
            icon={statusInfo.icon}
            label={statusInfo.label}
            size="small"
            sx={{
              bgcolor: statusInfo.bgColor,
              borderColor: statusInfo.borderColor,
              borderWidth: 1,
              borderStyle: 'solid',
              color: statusInfo.color === 'primary' ? '#38bdf8' : statusInfo.color === 'error' ? '#f87171' : '#34d399',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              Owner:
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>
              {pipeline.owner || 'N/A'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              Schedule:
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>
              {pipeline.schedule || 'Manual'}
            </Typography>
          </Box>

          {pipeline.id && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>
                ID: {pipeline.id}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
