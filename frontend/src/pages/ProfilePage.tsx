import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Stack,
  Chip,
  LinearProgress,
  Paper,
  IconButton,
  Badge,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Edit,
  PhotoCamera,
  EmojiEvents,
  School,
  TrendingUp,
  Star,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlockedAt?: string;
}

export const ProfilePage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const profile = useSelector((state: RootState) => state.profile.data);
  
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    languageLevel: profile?.languageLevel || 'N5',
  });

  const achievements: Achievement[] = [
    { id: '1', icon: '🔥', title: '7-Day Streak', description: 'Study for 7 days in a row', unlockedAt: '2024-01-15' },
    { id: '2', icon: '🌸', title: 'First Steps', description: 'Complete your first lesson', unlockedAt: '2024-01-10' },
    { id: '3', icon: '💬', title: 'Community Contributor', description: 'Make 10 posts in the community', unlockedAt: '2024-01-20' },
    { id: '4', icon: '🎯', title: 'Quiz Master', description: 'Score 100% on 5 quizzes', unlockedAt: undefined },
    { id: '5', icon: '🗣️', title: 'Conversation Starter', description: 'Complete 5 speaking sessions', unlockedAt: undefined },
    { id: '6', icon: '📚', title: 'Course Complete', description: 'Finish an entire course', unlockedAt: undefined },
  ];

  const stats = [
    { label: 'Total Points', value: profile?.points || 0, icon: <EmojiEvents /> },
    { label: 'Current Level', value: profile?.level || 1, icon: <TrendingUp /> },
    { label: 'Lessons Completed', value: 12, icon: <School /> },
    { label: 'Study Streak', value: '7 days', icon: <Star /> },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                  >
                    <PhotoCamera fontSize="small" />
                  </IconButton>
                }
              >
                <Avatar
                  src={profile?.profilePhoto}
                  sx={{ width: 120, height: 120, mb: 2, mx: 'auto' }}
                >
                  {profile?.name?.[0] || 'U'}
                </Avatar>
              </Badge>

              {editing ? (
                <Stack spacing={2} sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                  <FormControl fullWidth>
                    <InputLabel>Language Level</InputLabel>
                    <Select
                      value={formData.languageLevel}
                      label="Language Level"
                      onChange={(e) => setFormData({ ...formData, languageLevel: e.target.value })}
                    >
                      <MenuItem value="N5">N5 - Beginner</MenuItem>
                      <MenuItem value="N4">N4 - Elementary</MenuItem>
                      <MenuItem value="N3">N3 - Intermediate</MenuItem>
                      <MenuItem value="N2">N2 - Advanced</MenuItem>
                      <MenuItem value="N1">N1 - Proficient</MenuItem>
                    </Select>
                  </FormControl>
                  <Stack direction="row" spacing={1}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => setEditing(false)}
                    >
                      Save
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <>
                  <Typography variant="h5" fontWeight={600}>
                    {profile?.name || 'User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {profile?.bio || 'No bio yet'}
                  </Typography>
                  <Chip
                    label={`JLPT ${profile?.languageLevel || 'N5'}`}
                    color="primary"
                    sx={{ mt: 2 }}
                  />
                  <Button
                    startIcon={<Edit />}
                    onClick={() => setEditing(true)}
                    sx={{ mt: 2 }}
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Statistics
              </Typography>
              <Stack spacing={2}>
                {stats.map((stat, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      {stat.icon}
                      <Typography variant="body2">{stat.label}</Typography>
                    </Stack>
                    <Typography variant="h6" fontWeight={600} color="primary">
                      {stat.value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ mb: 3 }}>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
              <Tab label="Progress" />
              <Tab label="Achievements" />
              <Tab label="Activity" />
            </Tabs>
          </Paper>

          {tabValue === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Learning Progress
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <Stack direction="row" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Japan in Context</Typography>
                      <Typography variant="body2" color="text.secondary">
                        40% Complete
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={40}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Stack direction="row" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">JLPT N5 Preparation</Typography>
                      <Typography variant="body2" color="text.secondary">
                        25% Complete
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={25}
                      color="secondary"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 4 }}>
                    Skills Breakdown
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      { skill: 'Vocabulary', level: 60 },
                      { skill: 'Grammar', level: 45 },
                      { skill: 'Listening', level: 30 },
                      { skill: 'Speaking', level: 20 },
                    ].map((skill) => (
                      <Grid size={{ xs: 6 }} key={skill.skill}>
                        <Box>
                          <Typography variant="body2" gutterBottom>
                            {skill.skill}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={skill.level}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {tabValue === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Grid container spacing={2}>
                {achievements.map((achievement) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={achievement.id}>
                    <Card
                      sx={{
                        opacity: achievement.unlockedAt ? 1 : 0.5,
                        filter: achievement.unlockedAt ? 'none' : 'grayscale(100%)',
                      }}
                    >
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="h2">{achievement.icon}</Typography>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {achievement.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {achievement.description}
                            </Typography>
                            {achievement.unlockedAt && (
                              <Typography variant="caption" color="primary">
                                Unlocked {achievement.unlockedAt}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}

          {tabValue === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Recent Activity
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      { action: 'Completed Lesson 5: Greetings', time: '2 hours ago', points: '+50' },
                      { action: 'Posted in community', time: '5 hours ago', points: '+10' },
                      { action: 'Achieved 7-day streak', time: 'Yesterday', points: '+100' },
                      { action: 'Joined speaking session', time: '2 days ago', points: '+30' },
                      { action: 'Completed quiz with 90% score', time: '3 days ago', points: '+45' },
                    ].map((activity, index) => (
                      <Paper key={index} sx={{ p: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2">{activity.action}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </Box>
                          <Chip
                            label={activity.points}
                            color="success"
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};