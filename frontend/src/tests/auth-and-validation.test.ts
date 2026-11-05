import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../stores/auth.store';
import { getErrorMessage } from '../utils/error';
import { loginSchema } from '../types/auth';
import { contactSchema } from '../types/contact-schema';

describe('Frontend Automation Suite', () => {
  describe('Zustand Auth Store', () => {
    beforeEach(() => {
      useAuthStore.getState().clearAuth(false);
    });

    it('initial state has null token and default versions', () => {
      const state = useAuthStore.getState();
      expect(state.accessToken).toBeNull();
      expect(state.signInNoticePending).toBe(false);
    });

    it('startSession stores token and updates sessionVersion', () => {
      const initialVersion = useAuthStore.getState().sessionVersion;
      useAuthStore.getState().startSession('sample-jwt-token');

      const updated = useAuthStore.getState();
      expect(updated.accessToken).toBe('sample-jwt-token');
      expect(updated.sessionVersion).toBe(initialVersion + 1);
      expect(updated.signInNoticePending).toBe(true);
      expect(updated.endedByAdmin).toBe(false);
    });

    it('clearAuth wipes token and tracks endedByAdmin flag', () => {
      useAuthStore.getState().startSession('sample-jwt-token');
      useAuthStore.getState().clearAuth(true);

      const state = useAuthStore.getState();
      expect(state.accessToken).toBeNull();
      expect(state.endedByAdmin).toBe(true);
      expect(state.signInNoticePending).toBe(false);
    });
  });

  describe('Error Message Formatter (utils/error.ts)', () => {
    it('formats native Error instance', () => {
      const err = new Error('Network connection timeout');
      expect(getErrorMessage(err)).toBe('Network connection timeout');
    });

    it('formats Axios error response message', () => {
      const axiosErr = {
        isAxiosError: true,
        response: {
          data: {
            message: 'Invalid credentials provided',
          },
        },
      };
      expect(getErrorMessage(axiosErr)).toBe('Invalid credentials provided');
    });

    it('formats unknown non-error values gracefully', () => {
      expect(getErrorMessage(null)).toBe('Something went wrong. Please try again.');
      expect(getErrorMessage('some raw string')).toBe('Something went wrong. Please try again.');
    });
  });

  describe('Form Validation Schemas', () => {
    it('loginSchema rejects invalid email format', () => {
      const result = loginSchema.safeParse({ email: 'bad-email', password: 'password123' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('email');
      }
    });

    it('loginSchema rejects passwords shorter than 8 characters', () => {
      const result = loginSchema.safeParse({ email: 'admin@rocklizard.com', password: 'short' });
      expect(result.success).toBe(false);
    });

    it('loginSchema accepts valid email and password', () => {
      const result = loginSchema.safeParse({
        email: 'admin@rocklizard.com',
        password: 'validStrongPassword123',
      });
      expect(result.success).toBe(true);
    });

    it('contactSchema rejects empty enquiry message', () => {
      const result = contactSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+919876543210',
        message: '',
      });
      expect(result.success).toBe(false);
    });
  });
});
