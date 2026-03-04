'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Backdrop,
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

// Animated loading bar
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
    background: 'linear-gradient(90deg, #3B82F6, #A855F7, #EC4899, #FBBF24, #3B82F6)',
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
  color: '#FFFFFF',
  background: 'linear-gradient(45deg, #3B82F6, #EC4899)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
  position: 'relative',
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

const FilterableTable = ({ settings = [], fetchSettings }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(settings);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editSetting, setEditSetting] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [settingForm, setSettingForm] = useState({
    deliveryCharge: '',
    taxPercentage: '',
    other1: 0,
    other2: 0,
  });
  const router = useRouter();

  useEffect(() => {
    setFilteredData(
      settings.filter((item) =>
        item &&
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, settings]);

  const handleEditItem = (item) => {
    setEditSetting(item);
    setSettingForm({
      deliveryCharge: item.deliveryCharge,
      taxPercentage: item.taxPercentage,
      other1: item.other1,
      other2: item.other2,
    });
    setIsModalVisible(true);
  };

  const handleAddNewItem = () => {
    setEditSetting(null);
    setSettingForm({
      deliveryCharge: '',
      taxPercentage: '',
      other1: 0,
      other2: 0,
    });
    setIsModalVisible(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSettingForm({ ...settingForm, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const method = editSetting ? 'PUT' : 'POST';
      const url = editSetting ? `/api/settings/${editSetting.id}` : '/api/settings';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingForm),
      });

      if (response.ok) {
        fetchSettings();
        setIsModalVisible(false);
        setEditSetting(null);
        setSettingForm({ deliveryCharge: '', taxPercentage: '', other1: 0, other2: 0 });
      } else {
        console.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
    setIsLoading(false);
  };

  const handleCancelEdit = () => {
    setEditSetting(null);
    setSettingForm({ deliveryCharge: '', taxPercentage: '', other1: 0, other2: 0 });
    setIsModalVisible(false);
  };

  return (
    <Box sx={{ bgcolor: 'grey.100', minHeight: '100vh', p: 1 }}>
      <Backdrop open={isLoading} sx={{ zIndex: 1400, backdropFilter: 'blur(6px)', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            p: 3,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <ModernProgress />
          <AnimatedLabel sx={{ mt: 2 }}>Loading</AnimatedLabel>
        </Box>
      </Backdrop>

      <Paper square sx={{ p: 2, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.800' }}>
            Settings
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => setIsSearchVisible(!isSearchVisible)} sx={{ color: 'grey.600' }}>
              <SearchIcon />
            </IconButton>
            <IconButton onClick={handleAddNewItem} sx={{ color: 'grey.600' }}>
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        {isSearchVisible && (
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              variant="outlined"
              size="small"
            />
          </Box>
        )}

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Delivery Charge</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Tax Percentage</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Cash on Delivery Charges</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Other2</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(filteredData) && filteredData.map((item, index) => (
                <TableRow key={item.id} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.50' }}>
                  <TableCell sx={{ color: 'grey.700' }}>{item.deliveryCharge}</TableCell>
                  <TableCell sx={{ color: 'grey.700' }}>{item.taxPercentage}</TableCell>
                  <TableCell sx={{ color: 'grey.700' }}>{item.other1}</TableCell>
                  <TableCell sx={{ color: 'grey.700' }}>{item.other2}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditItem(item)}
                      sx={{ color: 'primary.main' }}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {(!filteredData || filteredData.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', color: 'grey.500' }}>
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={isModalVisible}
        onClose={handleCancelEdit}
        maxWidth="sm"
        fullWidth
        PaperProps={{ square: true }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {editSetting ? 'Edit Setting' : 'Add Setting'}
          </Typography>
        </DialogTitle>
        <Box component="form" onSubmit={handleFormSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Delivery Charge"
                  type="number"
                  name="deliveryCharge"
                  value={settingForm.deliveryCharge}
                  onChange={handleFormChange}
                  variant="outlined"
                  size="small"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tax Percentage"
                  type="number"
                  name="taxPercentage"
                  value={settingForm.taxPercentage}
                  onChange={handleFormChange}
                  variant="outlined"
                  size="small"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cash on Delivery Charges"
                  type="number"
                  name="other1"
                  value={settingForm.other1}
                  onChange={handleFormChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Other2"
                  type="number"
                  name="other2"
                  value={settingForm.other2}
                  onChange={handleFormChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button
              onClick={handleCancelEdit}
              variant="contained"
              sx={{ bgcolor: 'grey.300', color: 'grey.800', '&:hover': { bgcolor: 'grey.400' }, borderRadius: 0 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ borderRadius: 0 }}
            >
              {editSetting ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default FilterableTable;
