import { computed } from 'vue';
import { useCookie } from '#app';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  matricNumber?: string;
}

export const useUser = () => {
  const token = useCookie<string | null>('errandr_dispatch_token', {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    sameSite: 'lax',
  });
  
  const user = useCookie<User | null>('errandr_dispatch_user', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
  });

  const setUser = (userData: User) => {
    user.value = userData;
    if (typeof window !== 'undefined') {
      const expires = new Date(Date.now() + 7 * 86400 * 1000).toUTCString();
      document.cookie = `errandr_dispatch_user=${encodeURIComponent(JSON.stringify(userData))}; expires=${expires}; path=/; samesite=lax`;
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const setToken = (newToken: string) => {
    token.value = newToken;
    if (typeof window !== 'undefined') {
      const expires = new Date(Date.now() + 7 * 86400 * 1000).toUTCString();
      document.cookie = `errandr_dispatch_token=${newToken}; expires=${expires}; path=/; samesite=lax`;
      localStorage.setItem('token', newToken);
    }
  };

  const logOut = () => {
    user.value = null;
    token.value = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('errandr_cart');
      window.location.href = '/auth/login';
    }
  };

  const isLoggedIn = computed(() => !!token.value);

  const fullName = computed(() => {
    if (!user.value) return '';
    return `${user.value.firstName} ${user.value.lastName}`;
  });

  return {
    user,
    token,
    setUser,
    setToken,
    logOut,
    isLoggedIn,
    fullName
  };
};
