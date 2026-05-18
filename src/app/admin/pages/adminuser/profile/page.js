'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  Backdrop,
} from '@mui/material';
import { styled } from '@mui/system';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ModernProgress = styled(Box)(() => ({
  width: '300px',
  height: '8px',
  background: 'rgba(255, 255, 255, 0.15)',
  overflow: 'hidden',
  position: 'relative',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, #F25C2C, #c46cf7, #FB923C, #FBBF24, #F25C2C)',
    backgroundSize: '200% 100%',
    animation: 'flow 1.5s infinite ease-in-out',
  },
  '@keyframes flow': {
    '0%': { backgroundPosition: '200% 0' },
    '100%': { backgroundPosition: '-200% 0' },
  },
}));

const AnimatedLabel = styled(Typography)(() => ({
  fontSize: '1.5rem',
  fontWeight: '600',
  background: 'linear-gradient(45deg, #F25C2C, #FB923C)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  '&:after': {
    content: '"..."',
    display: 'inline-block',
    animation: 'dots 1.5s infinite steps(4, end)',
  },
  '@keyframes dots': {
    '0%': { content: '"."', opacity: 1 },
    '25%': { content: '".."', opacity: 1 },
    '50%': { content: '"..."', opacity: 1 },
    '75%': { content: '"..."', opacity: 0.5 },
    '100%': { content: '"..."', opacity: 1 },
  },
}));

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    '& fieldset': { borderColor: '#E5E7EB' },
    '&:hover fieldset': { borderColor: '#3B82F6' },
    '&.Mui-focused fieldset': { borderColor: '#3B82F6' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#3B82F6' },
};

const ProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', id: null });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const res = await axios.get(`/api/users/${decoded.id}`);
          setUserData({ name: res.data.name, email: res.data.email, id: decoded.id });
        } catch (error) {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load profile');
        }
      }
    };
    fetchProfile();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put('/api/users/change-password', {
        id: userData.id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (res.data.status) {
        toast.success('Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(res.data.message || 'Failed to update password');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F9FAFB', minHeight: '100vh' }}>

      {/* Loading Overlay */}
      <Backdrop
        open={loading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, flexDirection: 'column', backdropFilter: 'blur(6px)' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.1)', p: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <ModernProgress />
          <AnimatedLabel sx={{ mt: 2 }}>Loading</AnimatedLabel>
        </Box>
      </Backdrop>

      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          onClick={() => router.back()}
          sx={{ bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: 0 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827' }}>My Profile</Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Paper square elevation={0} sx={{ p: 4, border: '1px solid #E5E7EB' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ p: 1, bgcolor: '#DBEAFE', borderRadius: 0, color: '#1D4ED8', display: 'flex' }}>
                <PersonIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Personal Information</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Stack spacing={3}>
              <TextField
                label="Full Name"
                value={userData.name}
                disabled
                fullWidth
                sx={inputStyles}
              />
              <TextField
                label="Email Address"
                value={userData.email}
                disabled
                fullWidth
                sx={inputStyles}
              />
              <Typography variant="caption" sx={{ color: '#6B7280' }}>
                * Profile details are managed by system administrators. Contact IT support to change your name or email.
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        {/* Security & Password */}
        <Grid item xs={12} md={6}>
          <Paper square elevation={0} sx={{ p: 4, border: '1px solid #E5E7EB' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ p: 1, bgcolor: '#FEE2E2', borderRadius: 0, color: '#DC2626', display: 'flex' }}>
                <LockIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Security & Password</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleChangePassword}>
              <Stack spacing={3}>
                <TextField
                  label="Current Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  sx={inputStyles}
                />
                <TextField
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  sx={inputStyles}
                />
                <TextField
                  label="Confirm New Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  sx={inputStyles}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ borderRadius: 0 }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                  sx={{
                    bgcolor: '#3B82F6',
                    borderRadius: 0,
                    py: 1.5,
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#2563EB' },
                  }}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
