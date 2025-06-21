import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  IconButton,
  Chip,
  Paper,
  Tabs,
  Tab,
  Divider,
  Badge,
} from '@mui/material';
import {
  ThumbUp,
  Comment,
  Share,
  PhotoCamera,
  VideoCall,
  Campaign,
  TrendingUp,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
  };
  content: string;
  mediaUrls: string[];
  isAnnouncement: boolean;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked: boolean;
}

const PostCard = ({ post }: { post: Post }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    layout
  >
    <Card
      sx={{
        mb: 3,
        ...(post.isAnnouncement && {
          border: '2px solid',
          borderColor: 'primary.main',
        }),
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
          <Badge
            badgeContent={`L${post.author.level}`}
            color="primary"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Avatar src={post.author.avatar} sx={{ width: 48, height: 48 }}>
              {post.author.name[0]}
            </Avatar>
          </Badge>
          <Box flexGrow={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                {post.author.name}
              </Typography>
              {post.isAnnouncement && (
                <Chip
                  icon={<Campaign />}
                  label="Announcement"
                  size="small"
                  color="primary"
                />
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {post.createdAt}
            </Typography>
          </Box>
        </Stack>

        <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
          {post.content}
        </Typography>

        {post.mediaUrls.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: post.mediaUrls.length === 1 ? '1fr' : 'repeat(2, 1fr)',
              gap: 1,
              mb: 2,
            }}
          >
            {post.mediaUrls.map((url, index) => (
              <Paper
                key={index}
                sx={{
                  paddingTop: '56.25%',
                  position: 'relative',
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
                  <Typography variant="caption" color="text.secondary">
                    Media {index + 1}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </CardContent>

      <Divider />

      <CardActions sx={{ px: 2 }}>
        <Stack direction="row" spacing={2} flexGrow={1}>
          <Button
            startIcon={<ThumbUp />}
            size="small"
            color={post.isLiked ? 'primary' : 'inherit'}
            sx={{ textTransform: 'none' }}
          >
            {post.likesCount} Likes
          </Button>
          <Button
            startIcon={<Comment />}
            size="small"
            sx={{ textTransform: 'none' }}
          >
            {post.commentsCount} Comments
          </Button>
          <Button
            startIcon={<Share />}
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Share
          </Button>
        </Stack>
      </CardActions>
    </Card>
  </motion.div>
);

export const CommunityPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [newPost, setNewPost] = useState('');
  const [posts] = useState<Post[]>([
    {
      id: '1',
      author: { name: 'Admin', avatar: '', level: 99 },
      content: '🎉 Welcome to our community! This is a place to share your learning journey, ask questions, and connect with fellow learners. Be respectful and supportive!',
      mediaUrls: [],
      isAnnouncement: true,
      likesCount: 24,
      commentsCount: 5,
      createdAt: '2 hours ago',
      isLiked: false,
    },
    {
      id: '2',
      author: { name: 'Sarah Chen', avatar: '', level: 3 },
      content: 'Just completed my first week of lessons! The cultural context really helps understand why certain phrases are used. Anyone else finding the business etiquette section particularly interesting? 🏢',
      mediaUrls: [],
      isAnnouncement: false,
      likesCount: 12,
      commentsCount: 3,
      createdAt: '5 hours ago',
      isLiked: true,
    },
    {
      id: '3',
      author: { name: 'Mike Johnson', avatar: '', level: 2 },
      content: 'Finally mastered hiragana! 🎊 Here\'s my practice sheet. What helped you remember the characters?',
      mediaUrls: ['practice-sheet.jpg'],
      isAnnouncement: false,
      likesCount: 18,
      commentsCount: 7,
      createdAt: '1 day ago',
      isLiked: false,
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom fontWeight={700}>
        Community
      </Typography>

      {/* Create Post */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack direction="row" spacing={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>Y</Avatar>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Share your thoughts, ask questions, or celebrate achievements..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              variant="outlined"
            />
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ px: 3, py: 1.5 }}>
          <Stack direction="row" spacing={1} flexGrow={1}>
            <IconButton size="small" color="primary">
              <PhotoCamera />
            </IconButton>
            <IconButton size="small" color="primary">
              <VideoCall />
            </IconButton>
          </Stack>
          <Button
            variant="contained"
            disabled={!newPost.trim()}
            sx={{ borderRadius: 8 }}
          >
            Post
          </Button>
        </CardActions>
      </Card>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab label="All Posts" />
        <Tab label="Announcements" />
        <Tab label="Trending" icon={<TrendingUp />} iconPosition="end" />
      </Tabs>

      {/* Posts */}
      <AnimatePresence>
        {posts
          .filter(post => {
            if (tabValue === 1) return post.isAnnouncement;
            if (tabValue === 2) return post.likesCount > 15;
            return true;
          })
          .map(post => (
            <PostCard key={post.id} post={post} />
          ))}
      </AnimatePresence>
    </Container>
  );
};