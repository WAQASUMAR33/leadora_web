'use client';

import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Backdrop,
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

const ReviewableTable = ({ reviews = [], fetchReviews, products = [] }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newReview, setNewReview] = useState({
    id: null,
    reviewer: '',
    rating: 5,
    comment: '',
    productId: '',
    status: 'active',
  });

  useEffect(() => {
    if (Array.isArray(reviews)) {
      setFilteredData(
        reviews.filter((item) =>
          Object.values(item).some((val) =>
            String(val).toLowerCase().includes(filter.toLowerCase())
          )
        )
      );
    }
  }, [filter, reviews]);

  const handleAddNewItem = async () => {
    setIsLoading(true);
    try {
      const reviewToSubmit = {
        ...newReview,
        productId: parseInt(newReview.productId, 10),
        rating: parseInt(newReview.rating, 10),
      };

      let response;
      if (newReview.id) {
        response = await fetch(`/api/reviews/${newReview.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewToSubmit),
        });
      } else {
        response = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewToSubmit),
        });
      }

      const result = await response.json();
      if (response.ok) {
        fetchReviews();
        setIsModalOpen(false);
        setNewReview({ id: null, reviewer: '', rating: 5, comment: '', productId: '', status: 'active' });
      } else {
        console.error('Failed to add/update review:', result.message);
      }
    } catch (error) {
      console.error('Error adding or updating review:', error);
    }
    setIsLoading(false);
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to delete item');
      fetchReviews();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEditItem = (item) => {
    setNewReview({ ...item, productId: item.productId || '' });
    setIsModalOpen(true);
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
            Reviews List
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => setIsSearchVisible(!isSearchVisible)} sx={{ color: 'grey.600' }}>
              <SearchIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                setNewReview({ id: null, reviewer: '', rating: 5, comment: '', productId: '', status: 'pending' });
                setIsModalOpen(true);
              }}
              sx={{ color: 'grey.600' }}
            >
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
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Reviewer</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Rating</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Comment</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(filteredData) && filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <TableRow key={item.id} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 'medium', color: 'grey.900' }}>{item.id}</TableCell>
                    <TableCell sx={{ color: 'grey.700' }}>{item.reviewer}</TableCell>
                    <TableCell sx={{ color: 'grey.700' }}>{item.rating}</TableCell>
                    <TableCell sx={{ color: 'grey.700' }}>{item.product?.name || 'N/A'}</TableCell>
                    <TableCell sx={{ color: 'grey.700' }}>{item.comment || 'N/A'}</TableCell>
                    <TableCell sx={{ color: 'grey.700' }}>{item.status || 'pending'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton onClick={() => handleEditItem(item)} color="primary" size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteItem(item.id)} color="error" size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', color: 'grey.500' }}>
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ square: true }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {newReview.id ? 'Edit Review' : 'Add New Review'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reviewer Name"
                value={newReview.reviewer}
                onChange={(e) => setNewReview({ ...newReview, reviewer: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Rating"
                type="number"
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                inputProps={{ min: 1, max: 5 }}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Product</InputLabel>
                <Select
                  value={newReview.productId}
                  onChange={(e) => setNewReview({ ...newReview, productId: e.target.value })}
                  label="Product"
                >
                  <MenuItem value="">Select Product</MenuItem>
                  {Array.isArray(products) && products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={newReview.status}
                  onChange={(e) => setNewReview({ ...newReview, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Comment"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                variant="outlined"
                size="small"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setIsModalOpen(false)}
            variant="contained"
            sx={{ bgcolor: 'grey.300', color: 'grey.800', '&:hover': { bgcolor: 'grey.400' }, borderRadius: 0 }}
          >
            Cancel
          </Button>
          <Button onClick={handleAddNewItem} variant="contained" color="primary" sx={{ borderRadius: 0 }}>
            {newReview.id ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewableTable;
