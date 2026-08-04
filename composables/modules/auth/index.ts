import { ref } from 'vue';
import { auth_api } from '@/api_factory/modules/auth';
import { useUser } from './user';
import { navigateTo, useRoute } from '#imports';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useAuth = () => {
  const { setUser, setToken, logOut } = useUser();
  const { showToast } = useCustomToast();
  const loading = ref(false);

  const login = async (payload: any, options: { redirect?: boolean } = { redirect: true }) => {
    const route = useRoute();
    loading.value = true;
    try {
      payload.role = 'errander';
      const res = await auth_api.login(payload);
      if (res?.type === 'ERROR') throw res;
      setUser(res.data.user);
      setToken(res.data.token);
      showToast({
        title: "Welcome Back!",
        message: "You've successfully logged in.",
        toastType: "success",
      });
      if (options.redirect) {
        const redirectPath = (route.query.redirect as string) || '/dashboard';
        await navigateTo(redirectPath);
      }
      return res.data;
    } catch (e: any) {
      console.error('Login error:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const register = async (payload: any, options: { redirect?: boolean } = { redirect: true }) => {
    loading.value = true;
    try {
      const res = await auth_api.register(payload);
      if (res?.type === 'ERROR') throw res;
      setUser(res.data.user);
      setToken(res.data.token);
      showToast({
        title: "Account Created!",
        message: "Welcome to Errandr.",
        toastType: "success",
      });
      if (options.redirect) {
        navigateTo('/dashboard');
      }
      return res.data;
    } catch (e: any) {
      console.error('Register error:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await auth_api.getProfile();
      if (res?.type === 'ERROR') throw res;
      setUser(res.data.user || res.data);
    } catch (e: any) {
      console.error('Fetch profile error:', e);
      logOut();
    }
  };

  const verifyOTP = async (email: string, otp: string, options: { redirect?: boolean } = { redirect: true }) => {
    loading.value = true;
    try {
      const res = await auth_api.verifyOtp({ email, otp });
      if (res?.type === 'ERROR') throw res;
      setUser(res.data.user);
      setToken(res.data.token);
      showToast({
        title: "Verified!",
        message: "Email successfully verified.",
        toastType: "success",
      });
      if (options.redirect) {
        navigateTo('/dashboard');
      }
      return res.data;
    } catch (e: any) {
      console.error('Verify OTP error:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const resendOTP = async (email: string) => {
    loading.value = true;
    try {
      const res = await auth_api.resendOtp(email);
      if (res?.type === 'ERROR') throw res;
      showToast({
        title: "Code Sent!",
        message: "A new verification code has been sent to your email.",
        toastType: "success",
      });
      return res.data;
    } catch (e: any) {
      console.error('Resend OTP error:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const forgotPassword = async (email: string) => {
    loading.value = true;
    try {
      const res = await auth_api.forgotPassword(email);
      if (res?.type === 'ERROR') throw res;
      showToast({
        title: "Code Sent!",
        message: res.data?.message || "Check your inbox for the reset code.",
        toastType: "success",
      });
      navigateTo(`/auth/verify-reset-otp?email=${encodeURIComponent(email)}`);
      return res.data;
    } catch (e: any) {
      console.error('Forgot password error:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const verifyResetOTP = async (email: string, otp: string) => {
    loading.value = true;
    try {
      const res = await auth_api.verifyResetOtp({ email, otp });
      if (res?.type === 'ERROR') throw res;
      showToast({
        title: "Code Verified!",
        message: res.data?.message || "Perfect! Now set your new password.",
        toastType: "success",
      });
      navigateTo(`/auth/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
      return res.data;
    } catch (e: any) {
      console.error('Verify reset OTP error:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const resetPassword = async (payload: any) => {
    loading.value = true;
    try {
      const res = await auth_api.resetPassword(payload);
      if (res?.type === 'ERROR') throw res;
      showToast({
        title: "Password Changed!",
        message: "You can now log in securely.",
        toastType: "success",
      });
      navigateTo('/auth/login');
      return res.data;
    } catch (e: any) {
      console.error('Reset password error:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    login,
    register,
    fetchProfile,
    forgotPassword,
    verifyResetOTP,
    verifyOTP,
    resendOTP,
    resetPassword,
    logOut
  };
};
