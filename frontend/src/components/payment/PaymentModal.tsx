import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import api from '../../services/api';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

interface PaymentFormProps {
  onSuccess: (paymentIntentId: string) => void;
  onClose: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const { data } = await api.post('/payment/create-payment-intent', {
        amount: 5000,
        currency: 'jpy',
      });

      // Confirm payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
      } else {
        // Register user
        await api.post('/auth/register', {
          email,
          stripePaymentIntentId: result.paymentIntent.id,
        });
        
        onSuccess(result.paymentIntent.id);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        sx={{ mb: 3 }}
      />
      
      <Box
        sx={{
          p: 2,
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          mb: 3,
        }}
      >
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={!stripe || loading}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Pay ¥5,000'}
      </Button>

      <Button
        fullWidth
        variant="text"
        onClick={onClose}
        disabled={loading}
      >
        Cancel
      </Button>
    </form>
  );
};

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (paymentIntentId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ open, onClose, onSuccess }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight={600}>
          Complete Your Registration
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Get instant access to all courses and features for ¥5,000
        </Typography>
        
        <Elements stripe={stripePromise}>
          <PaymentForm onSuccess={onSuccess} onClose={onClose} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};