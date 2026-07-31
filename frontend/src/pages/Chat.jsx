import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import ChatBox from '../components/ChatBox';

export default function Chat() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar title="AI Copilot Assistant" />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 1 }}>
            Ask DataOpsGPT
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Interact with our Gemini-based Assistant trained on your pipeline documentation, error configurations, database logs, and Kafka streaming schemas.
          </Typography>
        </Box>
        <ChatBox />
      </Container>
    </Box>
  );
}
