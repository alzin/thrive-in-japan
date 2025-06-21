import api from './api';

interface LoginResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async register(email: string, stripePaymentIntentId: string): Promise<void> {
    await api.post('/auth/register', { email, stripePaymentIntentId });
  },
};