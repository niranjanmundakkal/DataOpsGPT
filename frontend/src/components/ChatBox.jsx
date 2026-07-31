import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, TextField, IconButton, Typography, CircularProgress, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { askQuestion } from '../services/chat';

export default function ChatBox() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your DataOpsGPT assistant. Ask me anything about pipelines, errors, or logs.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userQuery = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userQuery }]);
    setLoading(true);

    try {
      const response = await askQuestion(userQuery);
      setMessages((prev) => [...prev, { sender: 'ai', text: response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, I encountered an error while processing your request.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '600px',
        bgcolor: 'rgba(30, 41, 59, 0.25)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          bgcolor: 'rgba(99, 102, 241, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Avatar sx={{ bgcolor: 'indigo.500', width: 36, height: 36 }}>
          <SmartToyIcon sx={{ fontSize: 20 }} />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#fff' }}>
            DataOpsGPT AI Assistant
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            Retrieval-Augmented Intelligent Assistant
          </Typography>
        </Box>
      </Box>

      {/* Messages area */}
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: 1.5,
              }}
            >
              {!isUser && (
                <Avatar sx={{ bgcolor: 'rgba(129, 140, 248, 0.1)', border: '1px solid rgba(129, 140, 248, 0.3)', width: 32, height: 32 }}>
                  <SmartToyIcon sx={{ fontSize: 16, color: '#818cf8' }} />
                </Avatar>
              )}

              <Box
                sx={{
                  maxWidth: '70%',
                  bgcolor: isUser ? 'rgba(99, 102, 241, 0.85)' : 'rgba(255, 255, 255, 0.04)',
                  color: '#fff',
                  p: 2,
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: isUser ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none',
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {msg.text}
                </Typography>
              </Box>

              {isUser && (
                <Avatar sx={{ bgcolor: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', width: 32, height: 32 }}>
                  <PersonIcon sx={{ fontSize: 16, color: '#38bdf8' }} />
                </Avatar>
              )}
            </Box>
          );
        })}

        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: 'rgba(129, 140, 248, 0.1)', border: '1px solid rgba(129, 140, 248, 0.3)', width: 32, height: 32 }}>
              <SmartToyIcon sx={{ fontSize: 16, color: '#818cf8' }} />
            </Avatar>
            <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.04)',
                p: 2,
                borderRadius: '16px 16px 16px 4px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <CircularProgress size={16} sx={{ color: '#818cf8' }} />
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Thinking...
              </Typography>
            </Box>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input area */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          bgcolor: 'rgba(15, 23, 42, 0.4)',
          display: 'flex',
          gap: 1.5,
        }}
      >
        <TextField
          fullWidth
          size="medium"
          placeholder="Ask anything about the pipelines or logs..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              bgcolor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
              '&.Mui-focused fieldset': { borderColor: '#818cf8' },
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          sx={{
            bgcolor: 'rgba(99, 102, 241, 0.1)',
            color: '#818cf8',
            borderRadius: '12px',
            width: 48,
            height: 48,
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: '#6366f1',
              color: '#fff',
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(255, 255, 255, 0.02)',
              color: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
