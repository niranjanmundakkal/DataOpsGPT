import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, LinearProgress, Stack } from '@mui/material';
import Navbar from '../components/Navbar';
import PipelineCard from '../components/PipelineCard';
import { getDashboardData, getPipelines } from '../services/dashboard';
import InfoIcon from '@mui/icons-material/Info';
import HubIcon from '@mui/icons-material/Hub';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutorenewIcon from '@mui/icons-material/Autorenew';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_pipelines: 0,
    failed_runs: 0,
    pipeline_events: 0,
    kafka_status: 'Connected',
    consumer_lag: 0,
  });
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashData, pipeData] = await Promise.all([
          getDashboardData(),
          getPipelines(),
        ]);
        setStats({
          ...dashData,
          kafka_status: 'Connected',
          consumer_lag: 0,
        });
        setPipelines(pipeData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 5000); // Polling every 5s
    return () => clearInterval(interval);
  }, []);

  const metricCards = [
    {
      title: 'Total Pipelines',
      value: stats.total_pipelines,
      subtitle: 'Registered workflows',
      color: '#a5b4fc',
      icon: <HubIcon sx={{ fontSize: 28, color: '#6366f1' }} />,
    },
    {
      title: 'Failed Runs',
      value: stats.failed_runs,
      subtitle: 'Requires attention',
      color: '#f87171',
      icon: <InfoIcon sx={{ fontSize: 28, color: '#ef4444' }} />,
    },
    {
      title: 'Pipeline Events',
      value: stats.pipeline_events,
      subtitle: 'Total system logs',
      color: '#38bdf8',
      icon: <ListAltIcon sx={{ fontSize: 28, color: '#0ea5e9' }} />,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, pb: 6 }}>
      <Navbar title="DataOpsGPT Dashboard" />

      <Box sx={{ px: 4, py: 4 }}>
        {/* Kafka & Consumer Status Panel */}
        <Card
          sx={{
            mb: 4,
            background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '16px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <CardContent sx={{ py: '16px !important' }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block' }}>
                  KAFKA CLUSTER STATUS
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, bgcolor: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }} />
                  {stats.kafka_status}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block' }}>
                  CONSUMER GROUP LAG
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
                  {stats.consumer_lag} messages
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Live Metrics Row */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {metricCards.map((card, idx) => (
            <Grid item xs={12} sm={4} key={idx}>
              <Card
                sx={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
              >
                <CardContent sx={{ display: 'flex', justifycontent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 600 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: card.color }}>
                      {card.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.35)', display: 'block', mt: 0.5 }}>
                      {card.subtitle}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
                    {card.icon}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pipelines Grid */}
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#fff' }}>
          Registered Pipelines
        </Typography>

        {loading ? (
          <LinearProgress sx={{ borderRadius: 2 }} />
        ) : pipelines.length === 0 ? (
          <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px dashed rgba(255, 255, 255, 0.1)', borderRadius: '16px', p: 4, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              No pipelines registered. Use the backend script or API to create one.
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {pipelines.map((pipeline) => (
              <Grid item xs={12} sm={6} md={4} key={pipeline.id}>
                <PipelineCard pipeline={pipeline} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
