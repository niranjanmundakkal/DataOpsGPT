import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import { searchDoc } from '../services/search';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

export default function Search() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (query) => {
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchDoc(query);
      setResults(data);
    } catch (err) {
      console.error('Error fetching search results:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar title="Semantic RAG Search" />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 1 }}>
            Search Error Database & Docs
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Search the vectorized error knowledge base stored in Qdrant. Find solutions, root causes, severity metrics, and matching schemas instantly.
          </Typography>
        </Box>

        <SearchBar onSearch={handleSearch} loading={loading} />

        <Box sx={{ mt: 5 }}>
          {results.length > 0 ? (
            <Grid container spacing={3}>
              {results.map((item, idx) => (
                <Grid item xs={12} key={idx}>
                  <Card
                    sx={{
                      background: 'rgba(30, 41, 59, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      p: 1,
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#38bdf8' }}>
                          Pipeline ID: {item.pipeline_id || 'N/A'}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          {item.severity && (
                            <Chip
                              label={`Severity: ${item.severity}`}
                              size="small"
                              sx={{
                                bgcolor: item.severity === 'HIGH' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                color: item.severity === 'HIGH' ? '#f87171' : '#60a5fa',
                                fontWeight: 600,
                              }}
                            />
                          )}
                          {item.status && (
                            <Chip
                              label={item.status}
                              size="small"
                              sx={{
                                bgcolor: item.status.toLowerCase().includes('fail') ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                                color: item.status.toLowerCase().includes('fail') ? '#f87171' : '#34d399',
                                fontWeight: 600,
                              }}
                            />
                          )}
                        </Stack>
                      </Box>

                      {item.event_type && (
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 1, fontWeight: 600 }}>
                          Event Type: {item.event_type}
                        </Typography>
                      )}

                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6, bgcolor: 'rgba(0,0,0,0.2)', p: 2, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)', fontFamily: 'monospace' }}>
                        {item.message || 'No description provided'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : searched && !loading ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <FolderOpenIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.15)', mb: 2 }} />
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                No matching results found in the vector database.
              </Typography>
            </Box>
          ) : null}
        </Box>
      </Container>
    </Box>
  );
}
