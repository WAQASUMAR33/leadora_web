'use client';
import React, { useState, useEffect, useRef } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// MUI Imports
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select as MuiSelect,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import PublicIcon from '@mui/icons-material/Public';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import StyleIcon from '@mui/icons-material/Style';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

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
    background: 'linear-gradient(90deg, #F25C2C, #F97316, #FB923C, #FBBF24, #F25C2C)',
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
    bgcolor: '#fff',
    '& fieldset': { borderColor: '#E5E7EB' },
    '&:hover fieldset': { borderColor: '#3B82F6' },
    '&.Mui-focused fieldset': { borderColor: '#3B82F6' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#3B82F6' },
};

const selectMenuProps = {
  PaperProps: {
    square: true,
    sx: {
      mt: 0.5,
      border: '1px solid #E5E7EB',
      '& .MuiList-root': { p: 0 },
      '& .MuiMenuItem-root': {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#4B5563',
        '&:hover': { bgcolor: '#F3F4F6', color: '#3B82F6' },
        '&.Mui-selected': {
          bgcolor: '#EFF6FF',
          color: '#3B82F6',
          fontWeight: 700,
          '&:hover': { bgcolor: '#DBEAFE' },
        },
      },
    },
  },
};

const FilterableTable = ({
  products = [],
  fetchProducts,
  categories = [],
  subcategories = [],
  colors = [],
  sizes = [],
}) => {
  const [filter, setFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [topRatedFilter, setTopRatedFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredData, setFilteredData] = useState(products);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [itemSlugToDelete, setItemSlugToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticStatuses, setOptimisticStatuses] = useState({});
  const [togglingSlug, setTogglingSlug] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    subcategorySlug: '',
    colors: [],
    sizes: [],
    discount: '',
    isTopRated: false,
    isActive: true,
    images: [],
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    sku: '',
    productType: 'tangible',
    digitalDataSize: '',
  });

  const [existingImages, setExistingImages] = useState([]);
  const [digitalFiles, setDigitalFiles] = useState([]);
  const [existingDigitalFiles, setExistingDigitalFiles] = useState([]);
  const [digitalDimensions, setDigitalDimensions] = useState({ height: { value: '', unit: 'px' }, width: { value: '', unit: 'px' } });
  const [updateError, setUpdateError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const fileInputRef = useRef(null);
  const digitalFileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    let result = products;

    if (filter) {
      result = result.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        ) ||
        String(item.id).includes(filter) ||
        String(item.sku || '').toLowerCase().includes(filter.toLowerCase())
      );
    }

    if (stockFilter !== 'all') {
      result = result.filter((item) => {
        const stock = parseInt(item.stock || 0);
        if (stockFilter === 'out') return stock === 0;
        if (stockFilter === 'low') return stock > 0 && stock < 10;
        if (stockFilter === 'medium') return stock >= 10 && stock < 50;
        if (stockFilter === 'healthy') return stock >= 50;
        return true;
      });
    }

    if (topRatedFilter !== 'all') {
      const isTop = topRatedFilter === 'top';
      result = result.filter((item) => item.isTopRated === isTop);
    }

    if (statusFilter !== 'all') {
      const active = statusFilter === 'active';
      result = result.filter((item) => (item.isActive ?? true) === active);
    }

    setFilteredData(result);
    setPage(0);
  }, [filter, stockFilter, topRatedFilter, statusFilter, products]);

  useEffect(() => {
    if (subcategories.length) {
      setFilteredSubcategories(subcategories);
    } else {
      setFilteredSubcategories([]);
    }
  }, [selectedCategory, subcategories]);

  const handleDeleteClick = (slug) => {
    setItemSlugToDelete(slug);
    setIsPopupVisible(true);
  };

  const handleDeleteItem = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${itemSlugToDelete}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        fetchProducts();
        setIsPopupVisible(false);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    setIsLoading(false);
  };

  const handleCancelDelete = () => {
    setIsPopupVisible(false);
    setItemSlugToDelete(null);
  };

  const getEffectiveStatus = (item) =>
    optimisticStatuses.hasOwnProperty(item.slug)
      ? optimisticStatuses[item.slug]
      : (item.isActive ?? true);

  const handleToggleStatus = async (slug, currentActive) => {
    const newStatus = !currentActive;

    // Flip UI instantly
    setOptimisticStatuses(prev => ({ ...prev, [slug]: newStatus }));
    setTogglingSlug(slug);

    try {
      const res = await fetch(`/api/products/status/${slug}`, { method: 'PATCH' });
      if (!res.ok) throw new Error('API error');
      // Sync in background without blocking
      fetchProducts().then(() => {
        setOptimisticStatuses(prev => {
          const next = { ...prev };
          delete next[slug];
          return next;
        });
      });
    } catch (error) {
      // Revert on failure
      setOptimisticStatuses(prev => {
        const next = { ...prev };
        delete next[slug];
        return next;
      });
      console.error('Error toggling product status:', error);
    } finally {
      setTogglingSlug(null);
    }
  };

  const roundToTwoDecimalPlaces = (num) => Math.round(num * 100) / 100;

  const handleEditItem = (item) => {
    setEditProduct(item);

    let itemColors = [];
    try {
      if (Array.isArray(item.colors)) {
        itemColors = item.colors;
      } else if (typeof item.colors === 'string') {
        if (item.colors === 'null') itemColors = [];
        else itemColors = JSON.parse(item.colors);
      }
      if (!Array.isArray(itemColors)) itemColors = [];
    } catch (e) {
      itemColors = [];
    }

    let itemSizes = [];
    try {
      if (Array.isArray(item.sizes)) {
        itemSizes = item.sizes;
      } else if (typeof item.sizes === 'string') {
        if (item.sizes === 'null') itemSizes = [];
        else itemSizes = JSON.parse(item.sizes);
      }
      if (!Array.isArray(itemSizes)) itemSizes = [];
    } catch (e) {
      itemSizes = [];
    }

    const existingColors = colors
      .filter((color) => itemColors.includes(color.id))
      .map((color) => ({ value: color.id, label: `${color.name} (${color.hex})`, hex: color.hex }));

    const existingSizes = sizes
      .filter((size) => itemSizes.includes(size.id))
      .map((size) => ({ value: size.id, label: size.name }));

    let parsedDigitalData = null;
    try {
      if (item.digitalData) {
        parsedDigitalData = typeof item.digitalData === 'string' ? JSON.parse(item.digitalData) : item.digitalData;
      }
    } catch (e) { parsedDigitalData = null; }

    setProductForm({
      name: item.name,
      slug: item.slug,
      description: item.description,
      price: item.price,
      stock: item.stock,
      subcategorySlug: item.subcategorySlug,
      colors: existingColors,
      sizes: existingSizes,
      discount: item.discount || '',
      isTopRated: item.isTopRated || false,
      isActive: item.isActive ?? true,
      images: [],
      meta_title: item.meta_title || '',
      meta_description: item.meta_description || '',
      meta_keywords: item.meta_keywords || '',
      sku: item.sku || '',
      productType: item.productType || 'tangible',
      digitalDataSize: parsedDigitalData?.size || '',
    });
    setExistingImages(item.images.map((img) => img.url));
    setExistingDigitalFiles(parsedDigitalData?.files || []);
    setDigitalFiles([]);
    setDigitalDimensions(parsedDigitalData?.dimensions || { height: { value: '', unit: 'px' }, width: { value: '', unit: 'px' } });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : name === 'stock' ? Math.max(0, parseInt(value) || 0) : value;
    setProductForm({ ...productForm, [name]: newValue });
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setUpdateError('');
    try {
      const uploadedImages = await Promise.all(
        productForm.images.map(async (file) => {
          const imageBase64 = await convertToBase64(file);
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageBase64 }),
          });
          const result = await response.json();
          if (response.ok) return result.image_url;
          throw new Error(result.error || 'Failed to upload image');
        })
      );

      // Upload new digital files if digital product
      let digitalDataPayload = null;
      if (productForm.productType === 'digital') {
        const uploadedDigitalFiles = await Promise.all(
          digitalFiles.map(async (file) => {
            const fileBase64 = await convertToBase64(file);
            const ext = file.name.split('.').pop().toLowerCase() || 'jpg';
            const response = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: fileBase64, type: ext }),
            });
            const result = await response.json();
            if (response.ok) return result.image_url;
            throw new Error(result.error || 'Failed to upload digital file');
          })
        );
        digitalDataPayload = {
          files: [...existingDigitalFiles, ...uploadedDigitalFiles],
          dimensions: digitalDimensions,
          size: productForm.digitalDataSize,
        };
      }

      const productData = {
        ...productForm,
        stock: productForm.productType === 'tangible' ? parseInt(productForm.stock) || 0 : 0,
        images: [...existingImages, ...uploadedImages],
        discount: productForm.discount ? productForm.discount : null,
        colors: productForm.productType === 'tangible' ? productForm.colors.map((color) => color.value) : [],
        sizes: productForm.productType === 'tangible' ? productForm.sizes.map((size) => size.value) : [],
        digitalData: digitalDataPayload,
      };

      const response = await fetch(`/api/products/${editProduct.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        await fetchProducts();
        setEditProduct(null);
        setProductForm({
          name: '', slug: '', description: '', price: '', stock: '',
          subcategorySlug: '', colors: [], sizes: [], discount: '',
          isTopRated: false, isActive: true, images: [], meta_title: '', meta_description: '',
          meta_keywords: '', sku: '', productType: 'tangible', digitalDataSize: '',
        });
        setExistingImages([]);
        setExistingDigitalFiles([]);
        setDigitalFiles([]);
        setDigitalDimensions({ height: { value: '', unit: 'px' }, width: { value: '', unit: 'px' } });
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        const errData = await response.json().catch(() => ({}));
        setUpdateError(errData.error || errData.message || `Update failed (${response.status})`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setUpdateError(error.message || 'An unexpected error occurred');
    }
    setIsLoading(false);
  };

  const handleCancelEdit = () => {
    setEditProduct(null);
    setProductForm({
      name: '', slug: '', description: '', price: '', stock: '',
      subcategorySlug: '', colors: [], sizes: [], discount: '',
      isTopRated: false, isActive: true, images: [], meta_title: '', meta_description: '',
      meta_keywords: '', sku: '', productType: 'tangible', digitalDataSize: '',
    });
    setExistingDigitalFiles([]);
    setDigitalFiles([]);
    setDigitalDimensions({ height: { value: '', unit: 'px' }, width: { value: '', unit: 'px' } });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveImage = (index) => {
    setProductForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStockStatus = (stock) => {
    const s = parseInt(stock) || 0;
    if (s === 0) return { label: 'Out of Stock', color: 'error', icon: <WarningIcon /> };
    if (s < 10) return { label: 'Low Stock', color: 'warning', icon: <WarningIcon /> };
    if (s < 50) return { label: 'Medium Stock', color: 'info', icon: <InventoryIcon /> };
    return { label: 'In Stock', color: 'success', icon: <CheckCircleIcon /> };
  };

  const StockDisplay = ({ stock }) => {
    const stockNum = parseInt(stock) || 0;
    const status = getStockStatus(stock);
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          icon={status.icon}
          label={`${stockNum} units`}
          color={status.color}
          size="small"
          sx={{ fontWeight: 600, fontSize: '0.75rem', borderRadius: 0 }}
        />
        <Typography
          variant="caption"
          sx={{
            color: status.color === 'error' ? 'error.main' : status.color === 'warning' ? 'warning.main' : status.color === 'info' ? 'info.main' : 'success.main',
            fontWeight: 500,
            fontSize: '0.7rem',
          }}
        >
          {status.label}
        </Typography>
      </Box>
    );
  };

  const sectionIcon = (bgcolor, color, Icon) => (
    <Box sx={{ p: 1, bgcolor, borderRadius: 0, color, display: 'flex' }}>
      <Icon sx={{ fontSize: '1.1rem' }} />
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F9FAFB', p: 2 }}>

      {/* Backdrop Loading */}
      <Backdrop
        open={isLoading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, flexDirection: 'column', backdropFilter: 'blur(6px)' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.1)', p: 3, border: '1px solid rgba(255,255,255,0.2)' }}>
          <ModernProgress />
          <AnimatedLabel sx={{ mt: 2 }}>Loading</AnimatedLabel>
        </Box>
      </Backdrop>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isPopupVisible}
        onClose={handleCancelDelete}
        PaperProps={{ square: true, sx: { p: 1, maxWidth: '400px', width: '100%' } }}
      >
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, pt: 4 }}>
          <Box sx={{ p: 2, bgcolor: '#FEF2F2', color: '#EF4444', display: 'flex' }}>
            <WarningIcon sx={{ fontSize: '2.5rem' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827' }}>Are you sure?</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 0 }}>
          <Typography variant="body2" sx={{ color: '#4B5563' }}>
            Deleting this product will also remove all associated order history. This action is{' '}
            <span style={{ color: '#EF4444', fontWeight: 700 }}>irreversible</span>.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={handleCancelDelete}
            sx={{ textTransform: 'none', borderRadius: 0, px: 3, fontWeight: 700, color: '#6B7280', bgcolor: '#F3F4F6', '&:hover': { bgcolor: '#E5E7EB' } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteItem}
            disabled={isLoading}
            variant="contained"
            sx={{ textTransform: 'none', borderRadius: 0, px: 3, fontWeight: 700, bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' } }}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Products List */}
      <Paper square elevation={0} sx={{ border: '1px solid #E5E7EB', bgcolor: '#fff', overflow: 'hidden' }}>
        <Box sx={{ p: 3 }}>

          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827' }}>All Products</Typography>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>Inventory management and stock control</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                startIcon={<SearchIcon />}
                sx={{
                  textTransform: 'none',
                  borderRadius: 0,
                  fontWeight: 600,
                  borderColor: isSearchVisible ? '#3B82F6' : '#E5E7EB',
                  color: isSearchVisible ? '#3B82F6' : '#4B5563',
                  bgcolor: isSearchVisible ? '#EFF6FF' : 'transparent',
                  '&:hover': { borderColor: '#3B82F6', bgcolor: '#EFF6FF' },
                }}
              >
                Search
              </Button>
              <Button
                variant="contained"
                onClick={() => router.push('/admin/pages/add-product')}
                startIcon={<PlusIcon className="h-4 w-4" />}
                sx={{ textTransform: 'none', borderRadius: 0, fontWeight: 700, bgcolor: '#3B82F6', '&:hover': { bgcolor: '#2563EB' } }}
              >
                Add Product
              </Button>
            </Box>
          </Box>

          {/* Search Input */}
          {isSearchVisible && (
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Filter by name, SKU, or details..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3, ...inputStyles }}
            />
          )}

          {/* Stock Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Out of Stock', count: filteredData.filter((p) => parseInt(p.stock || 0) === 0).length, color: '#EF4444', icon: <WarningIcon sx={{ fontSize: '1.1rem', color: '#EF4444' }} /> },
              { label: 'Low Stock', count: filteredData.filter((p) => { const s = parseInt(p.stock || 0); return s > 0 && s < 10; }).length, color: '#F59E0B', icon: <WarningIcon sx={{ fontSize: '1.1rem', color: '#F59E0B' }} /> },
              { label: 'Medium Stock', count: filteredData.filter((p) => { const s = parseInt(p.stock || 0); return s >= 10 && s < 50; }).length, color: '#3B82F6', icon: <InventoryIcon sx={{ fontSize: '1.1rem', color: '#3B82F6' }} /> },
              { label: 'Healthy Stock', count: filteredData.filter((p) => parseInt(p.stock || 0) >= 50).length, color: '#10B981', icon: <CheckCircleIcon sx={{ fontSize: '1.1rem', color: '#10B981' }} /> },
            ].map((card, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Paper square elevation={0} sx={{ p: 2, border: '1px solid #E5E7EB', borderLeft: `3px solid ${card.color}` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                      {card.label}
                    </Typography>
                    {card.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827' }}>
                    {card.count}
                    <Typography component="span" variant="caption" sx={{ color: '#6B7280', fontWeight: 500, ml: 0.5 }}>items</Typography>
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Filters Row */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', p: 2, border: '1px solid #E5E7EB', bgcolor: '#F9FAFB' }}>
            <Box sx={{ minWidth: '150px', flex: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="Search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                sx={inputStyles}
                InputProps={{ startAdornment: <SearchIcon sx={{ color: '#9CA3AF', mr: 1, fontSize: '1rem' }} /> }}
              />
            </Box>
            <Box sx={{ minWidth: '180px', flex: 1 }}>
              <FormControl fullWidth size="small" sx={inputStyles}>
                <InputLabel>Stock Status</InputLabel>
                <MuiSelect value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} label="Stock Status" MenuProps={selectMenuProps}>
                  <MenuItem value="all">All Inventory</MenuItem>
                  <MenuItem value="healthy">Healthy (50+)</MenuItem>
                  <MenuItem value="medium">Medium (10–49)</MenuItem>
                  <MenuItem value="low">Low (1–9)</MenuItem>
                  <MenuItem value="out">Out of Stock</MenuItem>
                </MuiSelect>
              </FormControl>
            </Box>
            <Box sx={{ minWidth: '160px', flex: 1 }}>
              <FormControl fullWidth size="small" sx={inputStyles}>
                <InputLabel>Rating</InputLabel>
                <MuiSelect value={topRatedFilter} onChange={(e) => setTopRatedFilter(e.target.value)} label="Rating" MenuProps={selectMenuProps}>
                  <MenuItem value="all">Any Rating</MenuItem>
                  <MenuItem value="top">Top Rated</MenuItem>
                  <MenuItem value="regular">Regular</MenuItem>
                </MuiSelect>
              </FormControl>
            </Box>
            <Box sx={{ minWidth: '140px', flex: 1 }}>
              <FormControl fullWidth size="small" sx={inputStyles}>
                <InputLabel>Status</InputLabel>
                <MuiSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status" MenuProps={selectMenuProps}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </MuiSelect>
              </FormControl>
            </Box>
            <Button
              variant="text"
              onClick={() => { setFilter(''); setStockFilter('all'); setTopRatedFilter('all'); setStatusFilter('all'); }}
              sx={{ textTransform: 'none', fontWeight: 600, color: '#EF4444', borderRadius: 0, '&:hover': { bgcolor: '#FEF2F2' } }}
            >
              Reset
            </Button>
          </Box>

          {/* Table */}
          <TableContainer component={Paper} square elevation={0} sx={{ border: '1px solid #E5E7EB' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                  {['ID', 'Product', 'SKU', 'Price', 'Inventory', 'Status', 'Updated', 'Actions'].map((head) => (
                    <TableCell key={head} sx={{ color: '#4B5563', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', py: 1.5, borderBottom: '2px solid #E5E7EB' }}>
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(paginatedData) && paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <TableRow key={item.slug} sx={{ '&:hover': { bgcolor: '#FAFAFA' } }}>
                      <TableCell sx={{ fontWeight: 600, color: '#9CA3AF', fontSize: '0.8rem' }}>#{item.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ width: 40, height: 40, overflow: 'hidden', border: '1px solid #E5E7EB', bgcolor: '#F9FAFB', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {item.images && item.images.length > 0 && item.images[0]?.url ? (
                              <Image
                                width={40}
                                height={40}
                                unoptimized
                                src={item.images[0].url.startsWith('http') ? item.images[0].url : `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL || ''}/${item.images[0].url}`}
                                alt=""
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                              />
                            ) : (
                              <InventoryIcon sx={{ fontSize: '1rem', color: '#D1D5DB' }} />
                            )}
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827', maxWidth: 180, lineHeight: 1.3 }}>
                            {item.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={item.sku || 'No SKU'} size="small" sx={{ bgcolor: '#F3F4F6', fontWeight: 600, borderRadius: 0, fontSize: '0.75rem' }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#3B82F6' }}>
                          CA${parseFloat(item.price || 0).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StockDisplay stock={item.stock} />
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const active = getEffectiveStatus(item);
                          const toggling = togglingSlug === item.slug;
                          return (
                            <Tooltip title={active ? 'Click to deactivate' : 'Click to activate'} placement="top">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Switch
                                  size="small"
                                  checked={active}
                                  disabled={toggling}
                                  onChange={() => handleToggleStatus(item.slug, active)}
                                  sx={{
                                    opacity: toggling ? 0.6 : 1,
                                    transition: 'opacity 0.2s',
                                    '& .MuiSwitch-switchBase': { transition: 'transform 0.2s ease' },
                                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#10B981' },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#10B981' },
                                    '& .MuiSwitch-track': { transition: 'background-color 0.2s ease' },
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: 700,
                                    minWidth: 48,
                                    color: active ? '#10B981' : '#EF4444',
                                    transition: 'color 0.2s ease',
                                  }}
                                >
                                  {active ? 'Active' : 'Inactive'}
                                </Typography>
                              </Box>
                            </Tooltip>
                          );
                        })()}
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton size="small" onClick={() => handleEditItem(item)} sx={{ borderRadius: 0, bgcolor: '#EFF6FF', color: '#3B82F6', '&:hover': { bgcolor: '#DBEAFE' } }}>
                            <EditIcon sx={{ fontSize: '1rem' }} />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteClick(item.slug)} sx={{ borderRadius: 0, bgcolor: '#FEF2F2', color: '#EF4444', '&:hover': { bgcolor: '#FEE2E2' } }}>
                            <DeleteIcon sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Box sx={{ opacity: 0.4, textAlign: 'center' }}>
                        <InventoryIcon sx={{ fontSize: '2.5rem', mb: 1, color: '#9CA3AF' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>No products found</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 25, 50]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ border: 'none' }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Edit Product Dialog */}
      {editProduct && (
        <Dialog
          open={Boolean(editProduct)}
          onClose={isLoading ? undefined : handleCancelEdit}
          maxWidth="lg"
          fullWidth
          PaperProps={{ square: true, sx: { bgcolor: '#F9FAFB' } }}
        >
          <DialogTitle sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff', borderBottom: '1px solid #E5E7EB' }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827' }}>Edit Product</Typography>
                <Chip
                  label={productForm.productType === 'digital' ? 'Digital' : 'Tangible'}
                  size="small"
                  sx={{
                    borderRadius: 0,
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    bgcolor: productForm.productType === 'digital' ? '#EFF6FF' : '#ECFDF5',
                    color: productForm.productType === 'digital' ? '#1D4ED8' : '#059669',
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: '#6B7280' }}>Product ID: #{editProduct.id}</Typography>
            </Box>
            <IconButton onClick={handleCancelEdit} disabled={isLoading} sx={{ borderRadius: 0, bgcolor: '#F3F4F6', '&:hover': { bgcolor: '#E5E7EB' } }}>
              <CloseIcon sx={{ fontSize: '1.1rem' }} />
            </IconButton>
          </DialogTitle>

          {/* Loading bar — visible only while update is in progress */}
          {isLoading && (
            <LinearProgress
              sx={{
                height: 3,
                bgcolor: '#DBEAFE',
                '& .MuiLinearProgress-bar': { bgcolor: '#3B82F6' },
              }}
            />
          )}

          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={3} sx={{ mt: 0 }}>
              {/* Left Column */}
              <Grid item xs={12} lg={8}>
                <Stack spacing={2}>

                  {/* General Info */}
                  <Paper square elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      {sectionIcon('#DBEAFE', '#1D4ED8', InfoIcon)}
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827' }}>General Details</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField fullWidth size="small" label="Product Name" name="name" value={productForm.name} onChange={handleFormChange} sx={inputStyles} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth size="small" label="URL Slug" name="slug" value={productForm.slug} onChange={(e) => setProductForm({ ...productForm, slug: e.target.value.replace(/\s+/g, '-') })} sx={inputStyles} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth size="small" label="SKU" name="sku" value={productForm.sku} onChange={handleFormChange} sx={inputStyles} />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth size="small" sx={inputStyles}>
                          <InputLabel>Subcategory</InputLabel>
                          <MuiSelect name="subcategorySlug" value={productForm.subcategorySlug} onChange={handleFormChange} label="Subcategory" MenuProps={selectMenuProps}>
                            <MenuItem value="">Select Subcategory</MenuItem>
                            {filteredSubcategories.map((subcat) => (
                              <MenuItem key={subcat.id} value={subcat.slug}>{subcat.name}</MenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Description */}
                  <Paper square elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      {sectionIcon('#F3E8FF', '#7E22CE', DescriptionIcon)}
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827' }}>Product Description</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{
                      '& .ql-toolbar': { borderColor: '#E5E7EB', bgcolor: '#F9FAFB' },
                      '& .ql-container': { borderColor: '#E5E7EB', minHeight: '160px', fontSize: '0.9rem' },
                    }}>
                      <ReactQuill
                        value={productForm.description}
                        onChange={(value) => setProductForm({ ...productForm, description: value })}
                      />
                    </Box>
                  </Paper>

                  {/* SEO */}
                  <Paper square elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      {sectionIcon('#ECFDF5', '#059669', PublicIcon)}
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827' }}>Search Optimization</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={2}>
                      <TextField
                        fullWidth size="small" label="Meta Title"
                        value={productForm.meta_title}
                        onChange={(e) => setProductForm({ ...productForm, meta_title: e.target.value.slice(0, 60) })}
                        sx={inputStyles}
                        helperText={`${productForm.meta_title.length}/60`}
                      />
                      <TextField
                        fullWidth size="small" label="Meta Description" multiline rows={2}
                        value={productForm.meta_description}
                        onChange={(e) => setProductForm({ ...productForm, meta_description: e.target.value.slice(0, 160) })}
                        sx={inputStyles}
                        helperText={`${productForm.meta_description.length}/160`}
                      />
                    </Stack>
                  </Paper>
                </Stack>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} lg={4}>
                <Stack spacing={2}>

                  {/* Pricing & Stock */}
                  <Paper square elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      {sectionIcon('#DCFCE7', '#16A34A', LocalOfferIcon)}
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827' }}>
                        {productForm.productType === 'digital' ? 'Pricing' : 'Pricing & Stock'}
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={2}>
                      <TextField fullWidth size="small" label="Price (CA$)" name="price" type="number" value={productForm.price} onChange={handleFormChange} sx={inputStyles} />
                      <TextField fullWidth size="small" label="Discount (%)" name="discount" type="number" value={productForm.discount} onChange={(e) => setProductForm({ ...productForm, discount: roundToTwoDecimalPlaces(parseFloat(e.target.value) || 0) })} sx={inputStyles} />
                      {productForm.productType === 'tangible' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, border: '1px solid #E5E7EB', bgcolor: '#F9FAFB' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#4B5563' }}>Stock</Typography>
                          <TextField type="number" size="small" name="stock" value={productForm.stock} onChange={handleFormChange} sx={{ width: '80px', '& .MuiOutlinedInput-root': { borderRadius: 0 } }} />
                        </Box>
                      )}
                      <FormControlLabel
                        control={<Checkbox checked={productForm.isTopRated} onChange={handleFormChange} name="isTopRated" size="small" sx={{ color: '#3B82F6', '&.Mui-checked': { color: '#3B82F6' } }} />}
                        label={<Typography variant="body2" sx={{ fontWeight: 600, color: '#4B5563' }}>Top Rated</Typography>}
                      />
                    </Stack>
                  </Paper>

                  {/* Media */}
                  <Paper square elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      {sectionIcon('#FFEDD5', '#EA580C', CloudUploadIcon)}
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827' }}>Media Gallery</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box
                      onClick={() => fileInputRef.current.click()}
                      sx={{ border: '2px dashed #D1D5DB', p: 2, textAlign: 'center', cursor: 'pointer', mb: 2, '&:hover': { bgcolor: '#F9FAFB', borderColor: '#3B82F6' } }}
                    >
                      <CloudUploadIcon sx={{ fontSize: '1.5rem', color: '#9CA3AF', mb: 0.5 }} />
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: '#6B7280' }}>Click to upload</Typography>
                      <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} multiple accept="image/*" />
                    </Box>
                    <Grid container spacing={1}>
                      {existingImages.map((img, index) => (
                        <Grid item xs={4} key={`existing-${index}`}>
                          <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                            <Image fill src={img.startsWith('https://') ? img : `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${img}`} alt="" style={{ objectFit: 'cover' }} />
                            <IconButton size="small" onClick={() => handleRemoveExistingImage(index)} sx={{ position: 'absolute', top: 2, right: 2, borderRadius: 0, bgcolor: 'rgba(255,255,255,0.9)', p: 0.25, '&:hover': { bgcolor: '#FEE2E2', color: '#EF4444' } }}>
                              <CloseIcon sx={{ fontSize: '0.8rem' }} />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                      {productForm.images.map((img, index) => (
                        <Grid item xs={4} key={`new-${index}`}>
                          <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden', border: '2px solid #3B82F6' }}>
                            <Image fill src={URL.createObjectURL(img)} alt="" style={{ objectFit: 'cover' }} />
                            <IconButton size="small" onClick={() => handleRemoveImage(index)} sx={{ position: 'absolute', top: 2, right: 2, borderRadius: 0, bgcolor: 'rgba(255,255,255,0.9)', p: 0.25, '&:hover': { bgcolor: '#FEE2E2', color: '#EF4444' } }}>
                              <CloseIcon sx={{ fontSize: '0.8rem' }} />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>

                  {/* Attributes – tangible only */}
                  {productForm.productType === 'tangible' && (
                    <Paper square elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        {sectionIcon('#FEF3C7', '#D97706', StyleIcon)}
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827' }}>Attributes</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Stack spacing={2}>
                        <FormControl fullWidth size="small" sx={inputStyles}>
                          <InputLabel>Colors</InputLabel>
                          <MuiSelect
                            multiple
                            value={productForm.colors}
                            onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                            label="Colors"
                            MenuProps={selectMenuProps}
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((color) => (
                                  <Chip key={color.value} label={color.label} size="small" sx={{ borderRadius: 0, fontWeight: 600 }} />
                                ))}
                              </Box>
                            )}
                          >
                            {(Array.isArray(colors) ? colors : []).map((color) => (
                              <MenuItem key={color.id} value={{ value: color.id, label: color.name, hex: color.hex }}>
                                <Checkbox checked={productForm.colors.some((c) => c.value === color.id)} size="small" />
                                <Box sx={{ width: 10, height: 10, bgcolor: color.hex, mr: 1, border: '1px solid #E5E7EB', flexShrink: 0 }} />
                                {color.name}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>
                        <FormControl fullWidth size="small" sx={inputStyles}>
                          <InputLabel>Sizes</InputLabel>
                          <MuiSelect
                            multiple
                            value={productForm.sizes}
                            onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                            label="Sizes"
                            MenuProps={selectMenuProps}
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((size) => (
                                  <Chip key={size.value} label={size.label} size="small" sx={{ borderRadius: 0, fontWeight: 600 }} />
                                ))}
                              </Box>
                            )}
                          >
                            {(Array.isArray(sizes) ? sizes : []).map((size) => (
                              <MenuItem key={size.id} value={{ value: size.id, label: size.name }}>
                                <Checkbox checked={productForm.sizes.some((s) => s.value === size.id)} size="small" />
                                {size.name}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>
                      </Stack>
                    </Paper>
                  )}

                  {/* Digital Files – digital only */}
                  {productForm.productType === 'digital' && (
                    <Paper square elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        {sectionIcon('#DBEAFE', '#1D4ED8', CloudUploadIcon)}
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827' }}>Digital Files</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Stack spacing={2}>
                        <TextField
                          fullWidth size="small"
                          label="Product Size / Dimensions (e.g. 1920x1080, A4, 5MB)"
                          value={productForm.digitalDataSize}
                          onChange={(e) => setProductForm({ ...productForm, digitalDataSize: e.target.value })}
                          sx={inputStyles}
                        />
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth size="small" label="Height"
                              value={digitalDimensions.height.value}
                              onChange={(e) => setDigitalDimensions({ ...digitalDimensions, height: { ...digitalDimensions.height, value: e.target.value } })}
                              sx={inputStyles}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth size="small" label="Width"
                              value={digitalDimensions.width.value}
                              onChange={(e) => setDigitalDimensions({ ...digitalDimensions, width: { ...digitalDimensions.width, value: e.target.value } })}
                              sx={inputStyles}
                            />
                          </Grid>
                        </Grid>
                        {/* Existing digital files */}
                        {existingDigitalFiles.length > 0 && (
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#4B5563', mb: 1, display: 'block' }}>Current Files</Typography>
                            <Stack spacing={1}>
                              {existingDigitalFiles.map((url, i) => (
                                <Box key={i} sx={{ p: 1.5, border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#F9FAFB' }}>
                                  <Typography variant="caption" sx={{ color: '#374151', wordBreak: 'break-all' }}>
                                    {url.split('/').pop()}
                                  </Typography>
                                  <IconButton size="small" onClick={() => setExistingDigitalFiles((prev) => prev.filter((_, idx) => idx !== i))} sx={{ borderRadius: 0, color: '#EF4444' }}>
                                    <CloseIcon sx={{ fontSize: '0.8rem' }} />
                                  </IconButton>
                                </Box>
                              ))}
                            </Stack>
                          </Box>
                        )}
                        {/* Upload new digital files */}
                        <Box
                          onClick={() => digitalFileInputRef.current?.click()}
                          sx={{ border: '2px dashed #D1D5DB', p: 2, textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#F9FAFB', borderColor: '#3B82F6' } }}
                        >
                          <CloudUploadIcon sx={{ fontSize: '1.5rem', color: '#9CA3AF', mb: 0.5 }} />
                          <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: '#6B7280' }}>Click to add new digital files</Typography>
                          <input type="file" hidden ref={digitalFileInputRef} multiple onChange={(e) => setDigitalFiles((prev) => [...prev, ...Array.from(e.target.files)])} />
                        </Box>
                        {digitalFiles.map((file, i) => (
                          <Box key={i} sx={{ p: 1.5, border: '2px solid #3B82F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#374151' }}>{file.name}</Typography>
                            <IconButton size="small" onClick={() => setDigitalFiles((prev) => prev.filter((_, idx) => idx !== i))} sx={{ borderRadius: 0, color: '#EF4444' }}>
                              <CloseIcon sx={{ fontSize: '0.8rem' }} />
                            </IconButton>
                          </Box>
                        ))}
                      </Stack>
                    </Paper>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, bgcolor: '#fff', borderTop: '1px solid #E5E7EB', gap: 1 }}>
            <Button
              onClick={handleCancelEdit}
              disabled={isLoading}
              sx={{ textTransform: 'none', fontWeight: 600, color: '#6B7280', borderRadius: 0 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <SaveIcon />}
              sx={{
                textTransform: 'none',
                borderRadius: 0,
                px: 3,
                fontWeight: 700,
                bgcolor: '#3B82F6',
                '&:hover': { bgcolor: '#2563EB' },
                '&.Mui-disabled': { bgcolor: '#93C5FD', color: '#fff' },
                minWidth: 150,
              }}
            >
              {isLoading ? 'Updating…' : 'Update Product'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(updateError)}
        autoHideDuration={6000}
        onClose={() => setUpdateError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setUpdateError('')} severity="error" sx={{ width: '100%', fontWeight: 600 }}>
          {updateError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FilterableTable;
