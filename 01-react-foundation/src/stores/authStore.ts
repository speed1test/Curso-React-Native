import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Interfaces
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Mock API function for login
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock users database
  const users = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin' as const,
    },
    {
      id: 2,
      name: 'María García',
      email: 'user@test.com',
      password: 'user123',
      role: 'user' as const,
    },
  ];

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  // Remove password from returned user
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Zustand store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const user = await mockLogin(email, password);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: (error as Error).message,
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
