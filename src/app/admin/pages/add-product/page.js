'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// MUI Imports
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import {
  Close as CloseIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
  LocalOffer as LocalOfferIcon,
  Inventory as InventoryIcon,
  Style as StyleIcon,
  Public as PublicIcon,
  CloudUpload as CloudUploadIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

// React Quill (dynamically imported as in your code)
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const ModernProgress = styled(Box)(() => ({
  width: '300px',
  height: '8px',
  background: 'rgba(255, 255, 255, 0.15)',
  overflow: 'hidden',
  position: 'relative',
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

const AddProductPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const [newProduct, setNewProduct] = useState({
    id: null,
    name: '',
    slug: '',
    richDescription: '',
    price: '',
    stock: '',
    categorySlug: '',
    subcategorySlug: '',
    colors: [],
    sizes: [],
    image: [],
    imageUrl: '',
    discount: '',
    isTopRated: false,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    sku: '',
    productType: 'tangible', // Default to tangible
  });

  const [categories, setCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setNewProduct({
      id: null, name: '', slug: '', richDescription: '', price: '', stock: '',
      categorySlug: '', subcategorySlug: '', colors: [], sizes: [], image: [],
      imageUrl: '', discount: '', isTopRated: false, meta_title: '',
      meta_description: '', meta_keywords: '', sku: '', productType: 'tangible',
    });
    setImages([]);
    setExistingImages([]);
    setFilteredSubcategories([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    fetchCategories();
    fetchColors();
    fetchSizes();

    if (productId) {
      fetchProductData(productId);
    }
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const json = await response.json();
      // API returns { status: true, data: [...] } — extract the array
      const list = Array.isArray(json) ? json : (Array.isArray(json.data) ? json.data : []);
      setCategories(list);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchSubcategories = async (categorySlug) => {
    try {
      const response = await fetch(`/api/subcategories/${categorySlug}`);
      if (!response.ok) throw new Error('Failed to fetch subcategories');
      const data = await response.json();
      setFilteredSubcategories(data?.data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      // alert(`Failed to fetch subcategories: ${error.message}`); // Optional: Don't spam alert on load, maybe just log or toast
      setFilteredSubcategories([]);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await fetch('/api/colors');
      if (!response.ok) throw new Error('Failed to fetch colors');
      const data = await response.json();
      const mappedColors = data.map((color) => ({
        value: color.id,
        label: `${color.name} (${color.hex})`,
        hex: color.hex,
      }));
      setColors(mappedColors);
    } catch (error) {
      console.error('Error fetching colors:', error);
      setColors([]);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await fetch('/api/sizes');
      if (!response.ok) throw new Error('Failed to fetch sizes');
      const data = await response.json();
      const mappedSizes = data.map((size) => ({
        value: size.id,
        label: size.name,
      }));
      setSizes(mappedSizes);
    } catch (error) {
      console.error('Error fetching sizes:', error);
      setSizes([]);
    }
  };

  const fetchProductData = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product data');
      const json = await response.json();

      // The GET /api/products/[slug] returns { data: { product, colors, sizes, relatedProducts } }
      const product = json.data?.product || json;
      const apiColors = json.data?.colors || [];
      const apiSizes = json.data?.sizes || [];

      const parsedColors = Array.isArray(apiColors)
        ? apiColors.map((color) => ({
          value: color.id,
          label: `${color.name} (${color.hex})`,
          hex: color.hex,
        }))
        : [];
      const parsedSizes = Array.isArray(apiSizes)
        ? apiSizes.map((size) => ({
          value: size.id,
          label: size.name,
        }))
        : [];

      const categorySlug = product.subcategory?.category?.slug || '';

      setNewProduct({
        ...product,
        richDescription: product.description || '',
        colors: parsedColors,
        sizes: parsedSizes,
        categorySlug,
      });
      setExistingImages(product.images || []);
      if (categorySlug) await fetchSubcategories(categorySlug);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
    setIsLoading(false);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAddNewItem = async () => {
    const requiredFields = [
      { name: 'name', label: 'Product Name' },
      { name: 'slug', label: 'Slug' },
      { name: 'richDescription', label: 'Description' },
      { name: 'price', label: 'Price' },
      { name: 'categorySlug', label: 'Category' },
      { name: 'subcategorySlug', label: 'Subcategory' },
    ];

    requiredFields.push({ name: 'stock', label: 'Stock' });

    let missingFields = requiredFields
      .filter((field) => typeof newProduct[field.name] === 'string' && !newProduct[field.name].trim())
      .map((field) => field.label);

    if (newProduct.stock === '' || newProduct.stock === null || newProduct.stock === undefined) {
      if (!missingFields.includes('Stock')) missingFields.push('Stock');
    }

    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);

    try {
      const isEditing = Boolean(newProduct.id);

      // Only check slug uniqueness when creating a new product (not editing)
      if (!isEditing) {
        console.log('[Product] Checking slug availability:', newProduct.slug);
        const existingProductResponse = await fetch(`/api/products/${newProduct.slug}`);
        if (existingProductResponse.ok) {
          alert('Product with this slug already exists. Please use a different slug.');
          setIsLoading(false);
          return;
        }
        console.log('[Product] Slug is available, proceeding...');
      }

      // Upload new images (via server-side proxy to avoid CORS)
      console.log('[Product] Uploading', images.length, 'new image(s)...');
      let uploadedImages = [];
      if (images.length > 0) {
        try {
          uploadedImages = await Promise.all(
            images.map(async (img) => {
              const imageBase64 = await convertToBase64(img);
              const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageBase64 }),
              });
              let result;
              try { result = await response.json(); } catch { result = {}; }
              if (response.ok) return result.image_url;
              throw new Error(result.error || `Image upload failed with status ${response.status}`);
            })
          );
        } catch (uploadError) {
          console.error('[Product] Image upload error:', uploadError);
          alert(`Image upload failed: ${uploadError.message}. Please try again or remove the images.`);
          setIsLoading(false);
          return;
        }
      }

      // Include existing images (for edit mode)
      const existingImageUrls = existingImages.map((img) => img.url || img);
      const imageUrls = [...existingImageUrls, ...uploadedImages.map((filename) => `${filename}`)];
      console.log('[Product] Final image URLs:', imageUrls);

      const colorValues = newProduct.colors.map((color) => color.value);
      const sizeValues = newProduct.sizes.map((size) => size.value);

      if (isEditing) {
        // PUT /api/products/[slug] for updating an existing product
        console.log('[Product] Updating existing product:', newProduct.slug);
        const productToUpdate = {
          name: newProduct.name,
          description: newProduct.richDescription,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock, 10),
          subcategorySlug: newProduct.subcategorySlug,
          colors: colorValues,
          sizes: sizeValues,
          images: imageUrls,
          discount: newProduct.discount ? roundToTwoDecimalPlaces(parseFloat(newProduct.discount)) : null,
          isTopRated: Boolean(newProduct.isTopRated),
          meta_title: newProduct.meta_title,
          meta_description: newProduct.meta_description,
          meta_keywords: newProduct.meta_keywords,
          sku: newProduct.sku,
        };

        const response = await fetch(`/api/products/${newProduct.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productToUpdate),
        });

        if (response.ok) {
          router.push('/admin/pages/Products');
        } else {
          const errorText = await response.text();
          let errorData = {};
          try { errorData = JSON.parse(errorText); } catch { errorData = { message: errorText || 'Unknown error' }; }
          console.error('[Product] Update failed:', errorData);
          alert(`Failed to update product: ${errorData.error || errorData.message || 'Unknown error'}`);
        }
      } else {
        // POST /api/products for creating a new product
        console.log('[Product] Creating new product...');
        const productToSubmit = {
          name: newProduct.name,
          slug: newProduct.slug,
          description: newProduct.richDescription,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock, 10),
          subcategorySlug: newProduct.subcategorySlug,
          colors: colorValues,
          sizes: sizeValues,
          images: imageUrls,
          discount: newProduct.discount ? roundToTwoDecimalPlaces(parseFloat(newProduct.discount)) : null,
          isTopRated: Boolean(newProduct.isTopRated),
          meta_title: newProduct.meta_title,
          meta_description: newProduct.meta_description,
          meta_keywords: newProduct.meta_keywords,
          sku: newProduct.sku,
          productType: 'tangible',
        };

        console.log('[Product] Sending POST with data:', JSON.stringify(productToSubmit).substring(0, 200));
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productToSubmit),
        });

        if (response.ok) {
          resetForm();
          setSuccessOpen(true);
        } else {
          const errorText = await response.text();
          let errorData = {};
          try { errorData = JSON.parse(errorText); } catch { errorData = { message: errorText || 'Unknown error' }; }
          console.error('[Product] Create failed:', errorData);
          alert(`Failed to create product: ${errorData.error || errorData.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('[Product] Unexpected error:', error);
      alert(`Error saving product: ${error.message}`);
    }

    setIsLoading(false);
  };

  const roundToTwoDecimalPlaces = (num) => {
    return Math.round(num * 100) / 100;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      bgcolor: '#fff',
      '&:hover fieldset': { borderColor: '#3B82F6' },
      '&.Mui-focused fieldset': { borderColor: '#3B82F6' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#3B82F6' },
  };

  const sectionHeaderStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    mb: 2.5,
    pb: 1,
    borderBottom: '1px solid #F3F4F6'
  };

  const selectMenuProps = {
    PaperProps: {
      sx: {
        borderRadius: 0,
        mt: 1,
        boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1), 0 4px 8px -4px rgba(0,0,0,0.06)',
        border: '1px solid #F3F4F6',
        '& .MuiList-root': { p: 0.5 },
        '& .MuiMenuItem-root': {
          fontSize: '0.9rem',
          fontWeight: 500,
          borderRadius: 0,
          mb: 0,
          color: '#4B5563',
          '&:hover': { bgcolor: '#F3F4F6', color: '#3B82F6' },
          '&.Mui-selected': {
            bgcolor: '#EFF6FF',
            color: '#3B82F6',
            fontWeight: 700,
            '&:hover': { bgcolor: '#DBEAFE' }
          },
        }
      }
    }
  };

  return (
    <Box sx={{ bgcolor: '#F9FAFB', minHeight: '100vh', p: { xs: 2, md: 3 } }}>
      {/* Loading Overlay */}
      <Backdrop open={isLoading} sx={{ zIndex: 100, color: '#fff', flexDirection: 'column', backdropFilter: 'blur(6px)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.1)', p: 3, border: '1px solid rgba(255,255,255,0.2)' }}>
          <ModernProgress />
          <AnimatedLabel sx={{ mt: 2 }}>Saving</AnimatedLabel>
        </Box>
      </Backdrop>

      {/* Success Snackbar */}
      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessOpen(false)}
          severity="success"
          variant="filled"
          sx={{ borderRadius: 0, fontWeight: 600 }}
        >
          Product added successfully! You can add another product below.
        </Alert>
      </Snackbar>

      {/* Header & Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={() => router.back()}
            sx={{
              minWidth: '40px',
              width: '40px',
              height: '40px',
              borderRadius: 0,
              bgcolor: '#fff',
              color: '#4B5563',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              '&:hover': { bgcolor: '#F3F4F6', color: '#111827' },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: '1.2rem' }} />
          </Button>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', letterSpacing: '-1px' }}>
              {newProduct.id ? 'Edit Product' : 'Add New Product'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 500 }}>
              {newProduct.id ? `Modifying existing product ID: ${newProduct.id}` : 'Create a fresh entry in your product catalog'}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => router.push('/admin/pages/Products')}
            sx={{
              textTransform: 'none',
              borderRadius: 0,
              px: 3,
              fontWeight: 700,
              borderColor: '#E5E7EB',
              color: '#4B5563',
              '&:hover': { borderColor: '#9CA3AF', bgcolor: '#F9FAFB' }
            }}
          >
            Discard
          </Button>
          <Button
            variant="contained"
            onClick={handleAddNewItem}
            startIcon={<SaveIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: 0,
              px: 4,
              fontWeight: 800,
              bgcolor: '#3B82F6',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              '&:hover': { bgcolor: '#2563EB', boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)' }
            }}
          >
            {newProduct.id ? 'Save Changes' : 'Create Product'}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: General & Description & Attributes */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            {/* General Info Card */}
            <Paper square elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB' }}>
              <Box sx={sectionHeaderStyles}>
                <Box sx={{ p: 1, bgcolor: '#DBEAFE', borderRadius: 0, color: '#1D4ED8', display: 'flex' }}>
                  <InfoIcon sx={{ fontSize: '1.25rem' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', fontSize: '1rem' }}>General Details</Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    id="product-name"
                    fullWidth
                    label="Product Name *"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Enter a descriptive product name"
                    sx={inputStyles}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="product-slug"
                    fullWidth
                    label="Product URL Slug"
                    value={newProduct.slug}
                    onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value.replace(/\s+/g, '-') })}
                    placeholder="product-name-slug"
                    sx={inputStyles}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="product-sku"
                    fullWidth
                    label="SKU ID"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    placeholder="Unique identifier"
                    sx={inputStyles}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={inputStyles}>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category-select"
                      value={newProduct.categorySlug}
                      onChange={(e) => {
                        const categorySlug = e.target.value;
                        setNewProduct({ ...newProduct, categorySlug, subcategorySlug: '' });
                        fetchSubcategories(categorySlug);
                      }}
                      label="Category"
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value="">Select Category</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.slug} value={category.slug}>{category.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={inputStyles} disabled={!filteredSubcategories.length}>
                    <InputLabel id="subcategory-label">Subcategory</InputLabel>
                    <Select
                      labelId="subcategory-label"
                      id="subcategory-select"
                      value={newProduct.subcategorySlug}
                      onChange={(e) => setNewProduct({ ...newProduct, subcategorySlug: e.target.value })}
                      label="Subcategory"
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value="">Select Subcategory</MenuItem>
                      {filteredSubcategories.map((subcategory) => (
                        <MenuItem key={subcategory.slug} value={subcategory.slug}>{subcategory.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            {/* Description Card */}
            <Paper square elevation={0} sx={{ p: 4, border: '1px solid #E5E7EB' }}>
              <Box sx={sectionHeaderStyles}>
                <Box sx={{ p: 1, bgcolor: '#F3E8FF', borderRadius: 0, color: '#7E22CE', display: 'flex' }}>
                  <DescriptionIcon sx={{ fontSize: '1.25rem' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', fontSize: '1rem' }}>Product Description</Typography>
              </Box>
              <Box sx={{
                '& .ql-toolbar': { borderRadius: 0, borderColor: '#E5E7EB', bgcolor: '#F9FAFB' },
                '& .ql-container': { borderRadius: 0, borderColor: '#E5E7EB', minHeight: '250px', fontSize: '1rem' }
              }}>
                <ReactQuill
                  theme="snow"
                  id="product-description"
                  value={newProduct.richDescription}
                  onChange={(value) => setNewProduct({ ...newProduct, richDescription: value })}
                  placeholder="Tell customers about your product..."
                />
              </Box>
            </Paper>



            {/* Attributes & Options */}
            <Paper square elevation={0} sx={{ p: 4, border: '1px solid #E5E7EB' }}>
                <Box sx={sectionHeaderStyles}>
                  <Box sx={{ p: 1, bgcolor: '#FEF3C7', borderRadius: 0, color: '#D97706', display: 'flex' }}>
                    <StyleIcon sx={{ fontSize: '1.25rem' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', fontSize: '1rem' }}>Attributes & Options</Typography>
                </Box>
                <Stack spacing={3}>
                  <FormControl fullWidth sx={inputStyles}>
                    <InputLabel id="colors-label">Available Colors</InputLabel>
                    <Select
                      labelId="colors-label"
                      id="product-colors"
                      multiple
                      value={newProduct.colors.map((c) => c.value)}
                      onChange={(e) => {
                        const ids = e.target.value;
                        const selected = colors.filter((c) => ids.includes(c.value));
                        setNewProduct({ ...newProduct, colors: selected });
                      }}
                      label="Available Colors"
                      MenuProps={selectMenuProps}
                      renderValue={() => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {newProduct.colors.map((color) => (
                            <Chip
                              key={color.value}
                              label={color.label}
                              size="small"
                              sx={{
                                bgcolor: '#F3F4F6',
                                fontWeight: 600,
                                '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 1 }
                              }}
                              icon={<Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color.hex, ml: 1 }} />}
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {colors.map((color) => (
                        <MenuItem key={color.value} value={color.value}>
                          <Checkbox checked={newProduct.colors.some((c) => c.value === color.value)} sx={{ color: color.hex, '&.Mui-checked': { color: color.hex } }} />
                          {color.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={inputStyles}>
                    <InputLabel id="sizes-label">Available Sizes</InputLabel>
                    <Select
                      labelId="sizes-label"
                      id="product-sizes"
                      multiple
                      value={newProduct.sizes.map((s) => s.value)}
                      onChange={(e) => {
                        const ids = e.target.value;
                        const selected = sizes.filter((s) => ids.includes(s.value));
                        setNewProduct({ ...newProduct, sizes: selected });
                      }}
                      label="Available Sizes"
                      MenuProps={selectMenuProps}
                      renderValue={() => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {newProduct.sizes.map((size) => (
                            <Chip key={size.value} label={size.label} size="small" sx={{ bgcolor: '#F3F4F6', fontWeight: 600 }} />
                          ))}
                        </Box>
                      )}
                    >
                      {sizes.map((size) => (
                        <MenuItem key={size.value} value={size.value}>
                          <Checkbox checked={newProduct.sizes.some((s) => s.value === size.value)} />
                          {size.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Paper>

          </Stack>
        </Grid>

        {/* Right Column: Pricing & Media */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={4}>
            {/* Pricing Card */}
            <Paper square elevation={0} sx={{ p: 4, border: '1px solid #E5E7EB' }}>
              <Box sx={sectionHeaderStyles}>
                <Box sx={{ p: 1, bgcolor: '#DCFCE7', borderRadius: 0, color: '#16A34A', display: 'flex' }}>
                  <LocalOfferIcon sx={{ fontSize: '1.25rem' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', fontSize: '1rem' }}>Pricing & Stock</Typography>
              </Box>
              <Stack spacing={3}>
                <TextField
                  id="product-price"
                  fullWidth
                  label="Display Price (CA$)"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  sx={inputStyles}
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                />
                <TextField
                  id="product-discount"
                  fullWidth
                  label="Discount Percentage (%)"
                  type="number"
                  value={newProduct.discount}
                  onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                  sx={inputStyles}
                  InputProps={{ inputProps: { min: 0, max: 100, step: 0.01 } }}
                />

                <Box sx={{
                  bgcolor: '#F9FAFB',
                  p: 2,
                  borderRadius: 0,
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <InventoryIcon sx={{ color: '#6B7280' }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#4B5563' }}>Current Stock</Typography>
                  </Box>
                  <TextField
                    id="product-stock"
                    type="number"
                    size="small"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    sx={{ width: '100px', '& .MuiOutlinedInput-root': { borderRadius: 0, bgcolor: '#fff' } }}
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      id="product-is-top-rated"
                      checked={newProduct.isTopRated}
                      onChange={(e) => setNewProduct({ ...newProduct, isTopRated: e.target.checked })}
                      sx={{ color: '#3B82F6', '&.Mui-checked': { color: '#3B82F6' } }}
                    />
                  }
                  label={<Typography variant="body2" sx={{ fontWeight: 600, color: '#4B5563' }}>Mark as Top Rated</Typography>}
                />
              </Stack>
            </Paper>

            {/* Media Card */}
            <Paper square elevation={0} sx={{ p: 4, border: '1px solid #E5E7EB' }}>
              <Box sx={sectionHeaderStyles}>
                <Box sx={{ p: 1, bgcolor: '#FFEDD5', borderRadius: 0, color: '#EA580C', display: 'flex' }}>
                  <CloudUploadIcon sx={{ fontSize: '1.25rem' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', fontSize: '1rem' }}>Media Gallery</Typography>
              </Box>

              <Box
                onClick={() => fileInputRef.current.click()}
                sx={{
                  border: '2px dashed #D1D5DB',
                  borderRadius: 0,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#F9FAFB', borderColor: '#3B82F6' },
                  transition: 'all 0.2s',
                  mb: 3
                }}
              >
                <CloudUploadIcon sx={{ fontSize: '2.5rem', color: '#9CA3AF', mb: 1.5 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#4B5563' }}>
                  Click to upload images
                </Typography>
                <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                  Multiple images supported (JPG, PNG)
                </Typography>
                <input
                  id="image-upload-input"
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  multiple
                  accept="image/*"
                />
              </Box>

              <Grid container spacing={1.5}>
                {existingImages.map((img, index) => (
                  <Grid item xs={4} key={`existing-${index}`}>
                    <Box sx={{ position: 'relative', pt: '100%', borderRadius: 0, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                      <Image
                        fill
                        src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${img}`}
                        alt="Existing"
                        style={{ objectFit: 'cover' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveExistingImage(index)}
                        sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: '#FEE2E2', color: '#EF4444' } }}
                      >
                        <CloseIcon sx={{ fontSize: '0.8rem' }} />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
                {images.map((img, index) => (
                  <Grid item xs={4} key={`new-${index}`}>
                    <Box sx={{ position: 'relative', pt: '100%', borderRadius: 0, overflow: 'hidden', border: '1px solid #3B82F6' }}>
                      <Image
                        fill
                        src={URL.createObjectURL(img)}
                        alt="New"
                        style={{ objectFit: 'cover' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                        sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: '#FEE2E2', color: '#EF4444' } }}
                      >
                        <CloseIcon sx={{ fontSize: '0.8rem' }} />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* SEO Card */}
            <Paper square elevation={0} sx={{ p: 4, border: '1px solid #E5E7EB' }}>
              <Box sx={sectionHeaderStyles}>
                <Box sx={{ p: 1, bgcolor: '#ECFDF5', borderRadius: 0, color: '#059669', display: 'flex' }}>
                  <PublicIcon sx={{ fontSize: '1.25rem' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', fontSize: '1rem' }}>Search Optimization</Typography>
              </Box>
              <Stack spacing={3}>
                <TextField
                  id="meta-title"
                  fullWidth
                  label="Meta Title"
                  value={newProduct.meta_title}
                  onChange={(e) => setNewProduct({ ...newProduct, meta_title: e.target.value.slice(0, 60) })}
                  sx={inputStyles}
                  helperText={`${newProduct.meta_title.length}/60 characters`}
                />
                <TextField
                  id="meta-description"
                  fullWidth
                  multiline
                  rows={4}
                  label="Meta Description"
                  value={newProduct.meta_description}
                  onChange={(e) => setNewProduct({ ...newProduct, meta_description: e.target.value.slice(0, 160) })}
                  sx={inputStyles}
                  helperText={`${newProduct.meta_description.length}/160 characters`}
                />
                <TextField
                  id="meta-keywords"
                  fullWidth
                  label="Meta Keywords"
                  value={newProduct.meta_keywords}
                  onChange={(e) => setNewProduct({ ...newProduct, meta_keywords: e.target.value })}
                  placeholder="e.g. clothing, fashion, summer"
                  sx={inputStyles}
                />
              </Stack>
            </Paper>

          </Stack>
        </Grid>
      </Grid >
    </Box >
  );
};

const AddProductPage = () => {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading...</Box>}>
      <AddProductPageContent />
    </Suspense>
  );
};

export default AddProductPage;