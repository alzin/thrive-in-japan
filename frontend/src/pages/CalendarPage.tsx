import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  Grid,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  Badge,
} from '@mui/material';
import {
  AccessTime,
  Group,
  VideoCall,
  LocationOn,
  Star,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

interface Session {
  id: string;
  title: string;
  type: 'SPEAKING' | 'EVENT';
  hostName: string;
  scheduledAt: Date;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  pointsRequired: number;
  meetingUrl?: string;
  location?: string;
  description: string;
}

const SessionCard = ({ session, onBook }: { session: Session; onBook: () => void }) => {
  const isFull = session.currentParticipants >= session.maxParticipants;
  
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="start" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {session.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hosted by {session.hostName}
            </Typography>
          </Box>
          <Chip
            label={session.type === 'SPEAKING' ? 'Speaking' : 'Event'}
            color={session.type === 'SPEAKING' ? 'primary' : 'secondary'}
            size="small"
          />
        </Stack>

        <Stack spacing={1} mb={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <AccessTime fontSize="small" color="action" />
            <Typography variant="body2">
              {format(session.scheduledAt, 'MMM d, yyyy • h:mm a')} ({session.duration} min)
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <Group fontSize="small" color="action" />
            <Typography variant="body2">
              {session.currentParticipants}/{session.maxParticipants} participants
            </Typography>
          </Stack>

          {session.pointsRequired > 0 && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Star fontSize="small" color="action" />
              <Typography variant="body2">
                {session.pointsRequired} points required
              </Typography>
            </Stack>
          )}

          <Stack direction="row" spacing={1} alignItems="center">
            {session.type === 'SPEAKING' ? (
              <>
                <VideoCall fontSize="small" color="action" />
                <Typography variant="body2">Online (Google Meet)</Typography>
              </>
            ) : session.location ? (
              <>
                <LocationOn fontSize="small" color="action" />
                <Typography variant="body2">{session.location}</Typography>
              </>
            ) : null}
          </Stack>
        </Stack>

        <Button
          fullWidth
          variant="contained"
          disabled={isFull}
          onClick={onBook}
        >
          {isFull ? 'Session Full' : 'Book Session'}
        </Button>
      </CardContent>
    </Card>
  );
};

export const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookingDialog, setBookingDialog] = useState<Session | null>(null);
  const [myBookings] = useState<string[]>(['1', '3']);

  const sessions: Session[] = [
    {
      id: '1',
      title: 'Casual Conversation Practice',
      type: 'SPEAKING',
      hostName: 'Yuki Tanaka',
      scheduledAt: new Date(2024, 0, 25, 19, 0),
      duration: 30,
      maxParticipants: 8,
      currentParticipants: 5,
      pointsRequired: 0,
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
      description: 'Practice everyday Japanese conversations in a relaxed environment.',
    },
    {
      id: '2',
      title: 'Business Japanese Workshop',
      type: 'SPEAKING',
      hostName: 'Kenji Sato',
      scheduledAt: new Date(2024, 0, 26, 20, 0),
      duration: 45,
      maxParticipants: 6,
      currentParticipants: 6,
      pointsRequired: 50,
      meetingUrl: 'https://meet.google.com/klm-nopq-rst',
      description: 'Learn essential business Japanese phrases and etiquette.',
    },
    {
      id: '3',
      title: 'Tea Ceremony Experience',
      type: 'EVENT',
      hostName: 'Sakura Cultural Center',
      scheduledAt: new Date(2024, 0, 27, 14, 0),
      duration: 120,
      maxParticipants: 12,
      currentParticipants: 8,
      pointsRequired: 100,
      location: 'Tokyo, Shibuya',
      description: 'Experience traditional Japanese tea ceremony with a certified instructor.',
    },
  ];

  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom fontWeight={700}>
        Calendar & Sessions
      </Typography>

      <Grid container spacing={4}>
        {/* Calendar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <IconButton onClick={() => setSelectedDate(addDays(selectedDate, -7))}>
                  <ChevronLeft />
                </IconButton>
                <Typography variant="h6" fontWeight={600}>
                  {format(selectedDate, 'MMMM yyyy')}
                </Typography>
                <IconButton onClick={() => setSelectedDate(addDays(selectedDate, 7))}>
                  <ChevronRight />
                </IconButton>
              </Stack>

              <Grid container spacing={1}>
                {weekDays.map((day) => (
                  <Grid key={day.toISOString()} size={{ xs: 12 }}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        bgcolor: isSameDay(day, selectedDate) ? 'primary.main' : 'background.paper',
                        color: isSameDay(day, selectedDate) ? 'white' : 'text.primary',
                        '&:hover': {
                          bgcolor: isSameDay(day, selectedDate) ? 'primary.dark' : 'action.hover',
                        },
                      }}
                      onClick={() => setSelectedDate(day)}
                    >
                      <Typography variant="caption" display="block">
                        {format(day, 'EEE')}
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {format(day, 'd')}
                      </Typography>
                      <Badge
                        badgeContent={
                          sessions.filter(s => isSameDay(s.scheduledAt, day)).length
                        }
                        color="error"
                        sx={{ mt: 1 }}
                      >
                        <Box sx={{ width: 8, height: 8 }} />
                      </Badge>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Upcoming Sessions
                </Typography>
                {sessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onBook={() => setBookingDialog(session)}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* My Bookings */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                My Bookings
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                You can book up to 2 sessions at a time
              </Alert>

              <Stack spacing={2}>
                {sessions
                  .filter(s => myBookings.includes(s.id))
                  .map((session) => (
                    <Paper key={session.id} sx={{ p: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {session.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(session.scheduledAt, 'MMM d • h:mm a')}
                      </Typography>
                      <Button size="small" color="error" sx={{ mt: 1 }}>
                        Cancel Booking
                      </Button>
                    </Paper>
                  ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Points Balance
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h3" fontWeight={700} color="primary">
                    250
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available Points
                  </Typography>
                </Box>
                <Button variant="outlined" fullWidth>
                  How to Earn Points
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Booking Dialog */}
      <Dialog open={!!bookingDialog} onClose={() => setBookingDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{bookingDialog?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            {bookingDialog?.description}
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>Host:</strong> {bookingDialog?.hostName}
            </Typography>
            <Typography variant="body2">
              <strong>Date:</strong> {bookingDialog && format(bookingDialog.scheduledAt, 'MMMM d, yyyy')}
            </Typography>
            <Typography variant="body2">
              <strong>Time:</strong> {bookingDialog && format(bookingDialog.scheduledAt, 'h:mm a')}
            </Typography>
            <Typography variant="body2">
              <strong>Duration:</strong> {bookingDialog?.duration} minutes
            </Typography>
            {bookingDialog?.pointsRequired && bookingDialog.pointsRequired > 0 && (
              <Typography variant="body2">
                <strong>Points Required:</strong> {bookingDialog.pointsRequired}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialog(null)}>Cancel</Button>
          <Button variant="contained" onClick={() => setBookingDialog(null)}>
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};