import React from 'react';
import {
  Dialog,
} from '@mui/material';

import { RegistrationFlow } from '../registration/RegistrationFlow';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <RegistrationFlow />
    </Dialog>
  );
};