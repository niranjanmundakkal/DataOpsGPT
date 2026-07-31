import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, TextField, Button, Alert, Snackbar, MenuItem } from '@mui/material';
import Navbar from '../components/Navbar';
import api from '../services/api';
import HubIcon from '@mui/icons-material/Hub';
import ConnectionIcon from '@mui/icons-material/AltRoute';

export default function Registry() {
  const [pipelineForm, setPipelineForm] = useState({
    name: '',
    owner: '',
    schedule: '0 0 * * *',
    status: 'ACTIVE',
  });

  const [lineageForm, setLineageForm] = useState({
    pipeline_name: '',
    table_name: '',
    dashboard_name: '',
    owner_name: '',
  });

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [loadingPipe, setLoadingPipe] = useState(false);
  const [loadingLineage, setLoadingLineage] = useState(false);

  const handlePipeChange = (e) => {
    setPipelineForm({ ...pipelineForm, [e.target.name]: e.target.value });
  };

  const handleLineageChange = (e) => {
    setLineageForm({ ...lineageForm, [e.target.name]: e.target.value });
  };

  const handlePipeSubmit = async (e) => {
    e.preventDefault();
    if (!pipelineForm.name || !pipelineForm.owner) {
      showNotification('Please fill in all pipeline fields', 'error');
      return;
    }
    setLoadingPipe(true);
    try {
      await api.post('/pipelines', pipelineForm);
      showNotification('Pipeline registered successfully in SQL DB!', 'success');
      setPipelineForm({ name: '', owner: '', schedule: '0 0 * * *', status: 'ACTIVE' });
    } catch (err) {
      console.error(err);
      showNotification('Failed to register pipeline', 'error');
    } finally {
      setLoadingPipe(false);
    }
  };

  const handleLineageSubmit = async (e) => {
    e.preventDefault();
    if (!lineageForm.pipeline_name || !lineageForm.table_name || !lineageForm.dashboard_name || !lineageForm.owner_name) {
      showNotification('Please fill in all lineage fields', 'error');
      return;
    }
    setLoadingLineage(true);
    try {
      await api.post('/pipelines/lineage', lineageForm);
      showNotification('Lineage metadata updated in Neo4j Graph!', 'success');
      setLineageForm({ pipeline_name: '', table_name: '', dashboard_name: '', owner_name: '' });
    } catch (err) {
      console.error(err);
      showNotification('Failed to register lineage mapping', 'error');
    } finally {
      setLoadingLineage(false);
    }
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  return (
    <Box sx={{ flexGrow: 1, pb: 6 }}>
      <Navbar title="DataOps Registry" />
      <Box sx={{ px: 4, py: 4 }}>
        <Grid container spacing={4}>
          {/* Card 1: Pipeline Registration */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                background: 'rgba(30, 41, 59, 0.25)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Box sx={{ p: 1, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
                    <HubIcon sx={{ color: '#818cf8', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff' }}>
                    Register New Pipeline
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 4 }}>
                  Add a new pipeline workflow metadata schema into the SQL operational database.
                </Typography>

                <form onSubmit={handlePipeSubmit}>
                  <TextField
                    fullWidth
                    label="Pipeline Name"
                    name="name"
                    value={pipelineForm.name}
                    onChange={handlePipeChange}
                    placeholder="e.g. sales_transactions_pipeline"
                    margin="normal"
                    variant="outlined"
                    sx={{
                      '& label': { color: 'rgba(255, 255, 255, 0.4)' },
                      '& label.Mui-focused': { color: '#818cf8' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '12px',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                        '&.Mui-focused fieldset': { borderColor: '#818cf8' },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Team / Owner"
                    name="owner"
                    value={pipelineForm.owner}
                    onChange={handlePipeChange}
                    placeholder="e.g. Data Platform Team"
                    margin="normal"
                    variant="outlined"
                    sx={{
                      '& label': { color: 'rgba(255, 255, 255, 0.4)' },
                      '& label.Mui-focused': { color: '#818cf8' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '12px',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                        '&.Mui-focused fieldset': { borderColor: '#818cf8' },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Cron Schedule"
                    name="schedule"
                    value={pipelineForm.schedule}
                    onChange={handlePipeChange}
                    placeholder="e.g. 0 12 * * *"
                    margin="normal"
                    variant="outlined"
                    sx={{
                      '& label': { color: 'rgba(255, 255, 255, 0.4)' },
                      '& label.Mui-focused': { color: '#818cf8' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '12px',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                        '&.Mui-focused fieldset': { borderColor: '#818cf8' },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    select
                    label="Initial Status"
                    name="status"
                    value={pipelineForm.status}
                    onChange={handlePipeChange}
                    margin="normal"
                    variant="outlined"
                    sx={{
                      '& label': { color: 'rgba(255, 255, 255, 0.4)' },
                      '& label.Mui-focused': { color: '#818cf8' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '12px',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                        '&.Mui-focused fieldset': { borderColor: '#818cf8' },
                      },
                      '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.4)' },
                    }}
                  >
                    <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                    <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                  </TextField>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loadingPipe}
                    sx={{
                      mt: 4,
                      py: 1.5,
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 700,
                      background: 'linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)',
                      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #4f46e5 0%, #4338ca 100%)',
                      },
                    }}
                  >
                    {loadingPipe ? 'Registering...' : 'Register Pipeline'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 2: Lineage Connector */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                background: 'rgba(30, 41, 59, 0.25)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Box sx={{ p: 1, bgcolor: 'rgba(14, 165, 233, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
                    <ConnectionIcon sx={{ color: '#38bdf8', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff' }}>
                    Map Data Lineage
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 4 }}>
                  Define downstream data flow relationships in the Neo4j Graph to empower AI lineage analysis.
                </Typography>

                <form onSubmit={handleLineageSubmit}>
                  <TextField
                    fullWidth
                    label="Pipeline Name"
                    name="pipeline_name"
                    value={lineageForm.pipeline_name}
                    onChange={handleLineageChange}
                    placeholder="e.g. sales_transactions_pipeline"
                    margin="normal"
                    variant="outlined"
                    sx={{
                      '& label': { color: 'rgba(255, 255, 255, 0.4)' },
                      '& label.Mui-focused': { color: '#38bdf8' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '12px',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                        '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Downstream Table Name"
                    name="table_name"
                    value={lineageForm.table_name}
                    onChange={handleLineageChange}
                    placeholder="e.g. sales_revenue_clean"
                    margin="normal"
                    variant="outlined"
                    sx={{
                      '& label': { color: 'rgba(255, 255, 255, 0.4)' },
                      '& label.Mui-focused': { color: '#38bdf8' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '12px',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                        '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Affected Dashboard Name"
                    name="dashboard_name"
                    value={lineageForm.dashboard_name}
                    onChange={handleLineageChange}
                    placeholder="e.g. Executive Sales Performance"
                    margin="normal"
                    variant="outlined"
                    sx={{
                      '& label': { color: 'rgba(255, 255, 255, 0.4)' },
                      '& label.Mui-focused': { color: '#38bdf8' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '12px',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                        '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Lineage/Dashboard Owner"
                    name="owner_name"
                    value={lineageForm.owner_name}
                    onChange={handleLineageChange}
                    placeholder="e.g. Executive BI Team"
                    margin="normal"
                    variant="outlined"
                    sx={{
                      '& label': { color: 'rgba(255, 255, 255, 0.4)' },
                      '& label.Mui-focused': { color: '#38bdf8' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '12px',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                        '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loadingLineage}
                    sx={{
                      mt: 4,
                      py: 1.5,
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 700,
                      background: 'linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%)',
                      boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #0284c7 0%, #0369a1 100%)',
                      },
                    }}
                  >
                    {loadingLineage ? 'Mapping...' : 'Link Downstream Lineage'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
