import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { RegistrationFlow } from '../registration/RegistrationFlow';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      // fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          m: 0,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',

        },
      }}
    >
      {/* Mobile Header with Close Button */}
      {isMobile && (
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 1,
            top: 1,
            // border: '1px solid gray',
            zIndex: 1300,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.95)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      )}

      <DialogContent
        sx={{
          p: 0,
          m: 0,
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          flex: 1,
          // Compensate for the close button header on mobile
          // pt: isMobile ? 0 : 2,
        }}
      >
        <RegistrationFlow />
      </DialogContent>
    </Dialog >
  );
};