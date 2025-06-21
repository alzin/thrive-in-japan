import React, { useState } from 'react';

import {
  Box,
  Container,
  Card,
  Grid,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Stack,
  Button,
  Paper,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  PlayCircle,
  CheckCircle,
  Lock,
  Menu as MenuIcon,
  Close,
} from '@mui/icons-material';
import { motion } from 'framer-motion';


interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
}

interface Lesson {
  id: string;
  title: string;
  order: number;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
}

const CourseCard = ({ course, onClick }: { course: Course; onClick: () => void }) => (
  <motion.div whileHover={{ y: -8 }} whileTap={{ scale: 0.98 }}>
    <Card
      sx={{
        cursor: 'pointer',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          height: 200,
          background: `linear-gradient(135deg, ${
            course.id === '1' ? '#FF6B6B' : '#4ECDC4'
          } 0%, ${course.id === '1' ? '#FFB7C5' : '#7ED4D0'} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Typography variant="h1" sx={{ fontSize: '4rem', opacity: 0.8 }}>
          {course.icon}
        </Typography>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            bgcolor: 'background.paper',
          }}
        >
          <LinearProgress
            variant="determinate"
            value={course.progress}
            sx={{ height: '100%' }}
          />
        </Box>
      </Box>
      <CardContent>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {course.description}
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Chip label={`${course.progress}% Complete`} size="small" />
          <Button endIcon={<PlayCircle />}>Continue</Button>
        </Stack>
      </CardContent>
    </Card>
  </motion.div>
);

export const ClassroomPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const courses: Course[] = [
    {
      id: '1',
      title: 'Japan in Context',
      description: 'Understand Japanese culture, customs, and daily life',
      icon: '🏯',
      progress: 40,
    },
    {
      id: '2',
      title: 'JLPT N5 Preparation',
      description: 'Master the fundamentals of Japanese language',
      icon: '📚',
      progress: 25,
    },
  ];

  const lessons: Lesson[] = [
    { id: '1', title: 'Introduction to Japanese Culture', order: 1, duration: '15 min', isCompleted: true, isLocked: false },
    { id: '2', title: 'Greetings and Basic Etiquette', order: 2, duration: '20 min', isCompleted: true, isLocked: false },
    { id: '3', title: 'Japanese Food Culture', order: 3, duration: '25 min', isCompleted: true, isLocked: false },
    { id: '4', title: 'Transportation in Japan', order: 4, duration: '18 min', isCompleted: true, isLocked: false },
    { id: '5', title: 'Shopping and Numbers', order: 5, duration: '22 min', isCompleted: false, isLocked: false },
    { id: '6', title: 'Daily Conversations', order: 6, duration: '30 min', isCompleted: false, isLocked: false },
    { id: '7', title: 'Japanese Festivals', order: 7, duration: '25 min', isCompleted: false, isLocked: true },
    { id: '8', title: 'Business Etiquette', order: 8, duration: '28 min', isCompleted: false, isLocked: true },
  ];

  const LessonSidebar = () => (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={600}>
          {selectedCourse?.title || 'Select a Course'}
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(false)}>
            <Close />
          </IconButton>
        )}
      </Stack>
      <List>
        {lessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={selectedLesson?.id === lesson.id}
                disabled={lesson.isLocked}
                onClick={() => setSelectedLesson(lesson)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon>
                  {lesson.isCompleted ? (
                    <CheckCircle color={selectedLesson?.id === lesson.id ? 'inherit' : 'success'} />
                  ) : lesson.isLocked ? (
                    <Lock color="disabled" />
                  ) : (
                    <PlayCircle color={selectedLesson?.id === lesson.id ? 'inherit' : 'action'} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={lesson.title}
                  secondary={lesson.duration}
                  secondaryTypographyProps={{
                    color: selectedLesson?.id === lesson.id ? 'inherit' : 'text.secondary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Box>
  );

  if (!selectedCourse) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom fontWeight={700}>
          My Classroom
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Choose a course to begin your learning journey
        </Typography>
        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid size={{ xs: 12, md: 6 }} key={course.id}>
              <CourseCard course={course} onClick={() => setSelectedCourse(course)} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      {/* Sidebar for desktop */}
      {!isMobile && (
        <Paper
          sx={{
            width: 320,
            borderRadius: 0,
            borderRight: '1px solid',
            borderColor: 'divider',
            overflowY: 'auto',
          }}
        >
          <LessonSidebar />
        </Paper>
      )}

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          display: { md: 'none' },
          '& .MuiDrawer-paper': { width: 320 },
        }}
      >
        <LessonSidebar />
      </Drawer>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ mb: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          {selectedLesson ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h4" gutterBottom fontWeight={600}>
                {selectedLesson.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Lesson {selectedLesson.order} • {selectedLesson.duration}
              </Typography>
              
              {/* Video placeholder */}
              <Paper
                sx={{
                  position: 'relative',
                  paddingTop: '56.25%', // 16:9 aspect ratio
                  mb: 4,
                  bgcolor: 'grey.100',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    Video content will be displayed here
                  </Typography>
                </Box>
              </Paper>

              {/* Action buttons */}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined">Download Resources</Button>
                <Button variant="contained" disabled={selectedLesson.isCompleted}>
                  Mark as Complete
                </Button>
              </Stack>
            </motion.div>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                Select a lesson to begin
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};