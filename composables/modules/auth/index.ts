import { ref } from 'vue';
import { auth_api } from '@/api_factory/modules/auth';
import { useUser } from './user';
// import { navigateTo } from m;
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useAuth = () => {
  const { setUser, setToken, logOut } = useUser();
  const { showToast } = useCustomToast();
  const loading = ref(false);

  const login = async (payload: any) => {
    loading.value = true;
    try {
      const res = await auth_api.login(payload);
      setUser(res.data.user);
      setToken(res.data.token);
      showToast({
        title: "Welcome Back!",
        message: "You've successfully logged in.",
        toastType: "success",
      });
      navigateTo('/dashboard');
      return res.data;
    } catch (e: any) {
      // Error handled by axios interceptor
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const register = async (payload: any) => {
    loading.value = true;
    try {
      const res = await auth_api.register(payload);
      setUser(res.data.user);
      setToken(res.data.token);
      showToast({
        title: "Account Created!",
        message: "Welcome to Errandr.",
        toastType: "success",
      });
      navigateTo('/dashboard');
      return res.data;
    } catch (e: any) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await auth_api.getProfile();
      setUser(res.data);
    } catch (e) {
      logOut();
    }
  };

  return {
    loading,
    login,
    register,
    fetchProfile,
    logOut
  };
};
