'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const getImageSrc = (imgurl) => {
  if (!imgurl) return null;
  if (imgurl.startsWith('http') || imgurl.startsWith('data:')) return imgurl;
  return `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${imgurl}`;
};

const FilterableSliderTable = ({ sliders = [], fetchSliders }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(sliders);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Add / Edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSlider, setEditSlider] = useState(null);
  const [sliderForm, setSliderForm] = useState({ link: '' });
  const [existingImage, setExistingImage] = useState('');
  const fileInputRef = useRef(null);

  // Confirm dialogs
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmEdit, setConfirmEdit] = useState(null); // holds item to edit

  // Snackbar feedback
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    setFilteredData(
      sliders.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, sliders]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // ── ADD ──────────────────────────────────────────────
  const handleAddItem = () => {
    setEditSlider(null);
    setSliderForm({ link: '' });
    setExistingImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsModalOpen(true);
  };

  // ── EDIT: show confirmation first ────────────────────
  const handleEditClick = (item) => {
    setConfirmEdit(item);
  };

  const handleConfirmEdit = () => {
    const item = confirmEdit;
    setConfirmEdit(null);
    setEditSlider(item);
    setSliderForm({ link: item.link || '' });
    setExistingImage(item.imgurl || '');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsModalOpen(true);
  };

  // ── SUBMIT (add or update) ────────────────────────────
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    setIsLoading(true);

    try {
      let uploadedImageUrl = existingImage;

      if (fileInputRef.current?.files?.length > 0) {
        const file = fileInputRef.current.files[0];
        const reader = new FileReader();
        const imageBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_UPLOAD_IMAGE_API}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageBase64 }),
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Image upload failed');
        uploadedImageUrl = uploadData.image_url;
      }

      const method = editSlider ? 'PUT' : 'POST';
      const url = editSlider ? `/api/slider/${editSlider.id}` : '/api/slider';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imgurl: uploadedImageUrl, link: sliderForm.link }),
      });

      if (res.ok) {
        await fetchSliders();
        showSnackbar(editSlider ? 'Slider updated successfully.' : 'Slider added successfully.');
        setEditSlider(null);
        setSliderForm({ link: '' });
        setExistingImage('');
      } else {
        throw new Error('Failed to save slider');
      }
    } catch (error) {
      console.error('Error saving slider:', error);
      showSnackbar(error.message || 'Something went wrong.', 'error');
    }

    setIsLoading(false);
  };

  // ── DELETE ────────────────────────────────────────────
  const handleDeleteConfirmed = async () => {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/slider/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        await fetchSliders();
        showSnackbar('Slider deleted successfully.');
      } else {
        throw new Error('Failed to delete slider');
      }
    } catch (error) {
      console.error('Error deleting slider:', error);
      showSnackbar(error.message || 'Something went wrong.', 'error');
    }

    setIsLoading(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditSlider(null);
    setSliderForm({ link: '' });
    setExistingImage('');
  };

  return (
    <Box sx={{ bgcolor: 'grey.100', minHeight: '100vh', p: 1 }}>

      {/* Loading overlay */}
      {isLoading && (
        <Box sx={{
          position: 'fixed', inset: 0, zIndex: 1400,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          bgcolor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)',
        }}>
          <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>Processing…</Typography>
          </Box>
        </Box>
      )}

      <Paper square sx={{ p: 2, boxShadow: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.800' }}>
            Sliders List
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => setIsSearchVisible(!isSearchVisible)} sx={{ color: 'grey.600' }}>
              <SearchIcon />
            </IconButton>
            <IconButton onClick={handleAddItem} sx={{ color: 'grey.600' }}>
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        {isSearchVisible && (
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth label="Search…" value={filter}
              onChange={(e) => setFilter(e.target.value)}
              variant="outlined" size="small"
            />
          </Box>
        )}

        {/* Table */}
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Link</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(filteredData) && filteredData.map((item, index) => (
                <TableRow key={item.id} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.50' }}>
                  <TableCell>
                    {getImageSrc(item.imgurl) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getImageSrc(item.imgurl)}
                        alt={`Slider ${item.id}`}
                        style={{ width: '4rem', height: '4rem', objectFit: 'cover', borderRadius: 4 }}
                      />
                    ) : (
                      <Typography variant="body2" sx={{ color: 'grey.500' }}>N/A</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ color: 'grey.900', fontWeight: 'medium' }}>{item.id}</TableCell>
                  <TableCell sx={{ color: 'grey.700', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.link || '—'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => handleEditClick(item)} color="primary" size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => setConfirmDeleteId(item.id)} color="error" size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {(!filteredData || filteredData.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', color: 'grey.500', py: 4 }}>
                    No sliders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ── Add / Edit Dialog ── */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth PaperProps={{ square: true }}>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {editSlider ? 'Edit Slider' : 'Add New Slider'}
          </Typography>
        </DialogTitle>
        <Box component="form" onSubmit={handleFormSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Link (URL)" name="link"
                  value={sliderForm.link}
                  onChange={(e) => setSliderForm({ link: e.target.value })}
                  variant="outlined" size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'grey.700', mb: 0.5 }}>
                  {editSlider ? 'Replace Image (optional)' : 'Image'}
                </Typography>
                <input
                  type="file" accept="image/*" ref={fileInputRef}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: 4 }}
                />
              </Grid>
              {existingImage && (
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: 'grey.600', mb: 1 }}>Current Image</Typography>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageSrc(existingImage)}
                    alt="Current slider"
                    style={{ width: '100%', height: '8rem', objectFit: 'cover', borderRadius: 4 }}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button onClick={handleCloseModal} variant="outlined" color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editSlider ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* ── Confirm Edit Dialog ── */}
      <Dialog open={confirmEdit !== null} onClose={() => setConfirmEdit(null)} maxWidth="xs" fullWidth PaperProps={{ square: true }}>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Edit Slider</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to edit this slider?</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setConfirmEdit(null)} variant="outlined" color="inherit">Cancel</Button>
          <Button onClick={handleConfirmEdit} variant="contained" color="primary">Yes, Edit</Button>
        </DialogActions>
      </Dialog>

      {/* ── Confirm Delete Dialog ── */}
      <Dialog open={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)} maxWidth="xs" fullWidth PaperProps={{ square: true }}>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Delete Slider</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this slider? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setConfirmDeleteId(null)} variant="outlined" color="inherit">Cancel</Button>
          <Button onClick={handleDeleteConfirmed} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar feedback ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FilterableSliderTable;
