'use client'
import React, { useState, useEffect } from 'react';
import FilterableTable from './FilterableTable';

const CHUNK_RELOAD_KEY = 'adminProductsChunkReload';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [fetchError, setFetchError] = useState('');

  // After a deploy, browsers can briefly reference removed JS chunks; one reload usually fixes it.
  useEffect(() => {
    const isChunkLoadMessage = (msg) =>
      String(msg).includes('Loading chunk') || String(msg).includes('ChunkLoadError');

    const onChunkFailure = (reason) => {
      if (!isChunkLoadMessage(reason?.message ?? reason ?? '')) return;
      try {
        if (sessionStorage.getItem(CHUNK_RELOAD_KEY) === '1') return;
        sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
        window.location.reload();
      } catch (_) {
        /* ignore */
      }
    };
    const onRejection = (e) => onChunkFailure(e.reason);
    const onError = (e) => onChunkFailure(e?.error ?? e?.message);
    window.addEventListener('unhandledrejection', onRejection);
    window.addEventListener('error', onError);
    return () => {
      window.removeEventListener('unhandledrejection', onRejection);
      window.removeEventListener('error', onError);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      setFetchError('');
      const response = await fetch('/api/products?showInactive=true', {
        cache: 'no-store',
        credentials: 'same-origin',
      });
      const raw = await response.text();
      let data;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        setFetchError(
          'Products API returned invalid data (often a cached HTML page after a deploy). Try a hard refresh (Ctrl+Shift+R) or clear site data for this domain.'
        );
        setProducts([]);
        return;
      }
      if (!response.ok) {
        const msg = (data && typeof data === 'object' && data.message) || `Server error ${response.status}`;
        setFetchError(msg);
        setProducts([]);
        return;
      }
      if (!Array.isArray(data)) {
        setFetchError(
          (data && typeof data === 'object' && data.message) ||
            'Unexpected response from products API (not a list). Check server logs.'
        );
        setProducts([]);
        return;
      }
      try {
        sessionStorage.removeItem(CHUNK_RELOAD_KEY);
      } catch (_) {
        /* ignore */
      }
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setFetchError(error.message || 'Failed to load products');
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await fetch('/api/subcategories');
      const result = await response.json();

      if (result.status) {
        setSubcategories(result.data); // Extracting data array from result
        console.log('Subcategories:', subcategories); // Logging the fetched subcategories
      } else {
        console.error('Failed to fetch subcategories:', result.message);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await fetch('/api/colors');
      const data = await response.json();
      setColors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await fetch('/api/sizes');
      const data = await response.json();
      setSizes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubcategories();
    fetchColors();
    fetchSizes();
  }, []);

  return (
    <>
      {fetchError && (
        <div style={{ margin: '16px', padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontSize: 14 }}>
          <strong>Error loading products:</strong> {fetchError}
          <button onClick={fetchProducts} style={{ marginLeft: 12, padding: '4px 10px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>Retry</button>
        </div>
      )}
      <FilterableTable
        products={products}
        fetchProducts={fetchProducts}
        categories={categories}
        subcategories={subcategories}
        colors={colors}
        sizes={sizes}
      />
    </>
  );
};

export default ProductPage;
