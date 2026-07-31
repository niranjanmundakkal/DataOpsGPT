import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Stack, CircularProgress } from '@mui/material';
import Navbar from '../components/Navbar';
import EventTable from '../components/EventTable';
import { getEvents } from '../services/events';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    // Establish WebSocket connection to the backend events stream
    const wsUrl = `ws://${window.location.hostname}:8000/events/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected to live events stream');
    };

    socket.onmessage = (event) => {
      try {
        const newEvent = JSON.parse(event.data);
        console.log('Received live event:', newEvent);
        setEvents((prevEvents) => [newEvent, ...prevEvents]);
      } catch (err) {
        console.error('Error parsing live event data:', err);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected from live events stream');
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar title="Pipeline Events & Logs" />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 1 }}>
              Real-time Event Stream
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Monitor PostgreSQL events database updated by Kafka pipeline processor.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
            onClick={fetchLogs}
            disabled={loading}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.12)',
              color: '#fff',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: 2.5,
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.25)',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            Refresh Logs
          </Button>
        </Stack>

        {loading && events.length === 0 ? (
          <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
        ) : (
          <EventTable events={events} />
        )}
      </Container>
    </Box>
  );
}
