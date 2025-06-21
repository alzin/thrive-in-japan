import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  Grid,
  CardContent,
  Typography,
  LinearProgress,
  Avatar,
  Stack,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import {
  School,
  Groups,
  CalendarMonth,
  EmojiEvents,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const StatCard = ({ icon, title, value, color, onClick }: any) => (
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Card
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
        height: '100%',
      }}
      onClick={onClick}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight={700} color={color}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {title}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  </motion.div>
);

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const profile = useSelector((state: RootState) => state.profile.data);

  const stats = [
    {
      icon: <School />,
      title: 'Lessons Completed',
      value: '12/30',
      color: '#FF6B6B',
      onClick: () => navigate('/classroom'),
    },
    {
      icon: <EmojiEvents />,
      title: 'Total Points',
      value: profile?.points || 0,
      color: '#4ECDC4',
    },
    {
      icon: <Groups />,
      title: 'Community Posts',
      value: '5',
      color: '#FFB7C5',
      onClick: () => navigate('/community'),
    },
    {
      icon: <CalendarMonth />,
      title: 'Upcoming Sessions',
      value: '2',
      color: '#00B894',
      onClick: () => navigate('/calendar'),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB7C5 100%)',
            color: 'white',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          />
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Welcome back, {profile?.name || user?.email.split('@')[0]}! 👋
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Continue your Japanese learning journey today
          </Typography>
        </Paper>
      </motion.div>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6 ,md: 3 }} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Progress Section */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography variant="h6" fontWeight={600}>
                  Current Progress
                </Typography>
                <Chip
                  label={`Level ${profile?.level || 1}`}
                  color="primary"
                  size="small"
                />
              </Stack>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Japan in Context
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <LinearProgress
                    variant="determinate"
                    value={40}
                    sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2">40%</Typography>
                </Stack>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  JLPT N5 Preparation
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <LinearProgress
                    variant="determinate"
                    value={25}
                    sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                    color="secondary"
                  />
                  <Typography variant="body2">25%</Typography>
                </Stack>
              </Box>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Activity
              </Typography>
              <Stack spacing={2}>
                {[
                  { title: 'Completed Lesson 5: Greetings', time: '2 hours ago' },
                  { title: 'Earned 50 points', time: '3 hours ago' },
                  { title: 'Posted in community', time: 'Yesterday' },
                ].map((activity, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ py: 1 }}
                  >
                    <Typography variant="body2">{activity.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {/* Quick Actions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Actions
              </Typography>
              <Stack spacing={2}>
                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => navigate('/classroom')}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        Continue Learning
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Lesson 6: Daily Conversations
                      </Typography>
                    </Box>
                    <IconButton color="primary">
                      <ArrowForward />
                    </IconButton>
                  </Stack>
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => navigate('/calendar')}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        Book Session
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Practice speaking
                      </Typography>
                    </Box>
                    <IconButton color="secondary">
                      <ArrowForward />
                    </IconButton>
                  </Stack>
                </Paper>
              </Stack>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Achievements
              </Typography>
              <Stack spacing={2}>
                {[
                  { badge: '🔥', title: '7-Day Streak' },
                  { badge: '🌸', title: 'First Lesson' },
                  { badge: '💬', title: 'Community Active' },
                ].map((achievement, index) => (
                  <Stack key={index} direction="row" spacing={2} alignItems="center">
                    <Typography variant="h4">{achievement.badge}</Typography>
                    <Typography variant="body2">{achievement.title}</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
