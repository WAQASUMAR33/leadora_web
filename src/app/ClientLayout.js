'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ThemeRegistry from '../components/ThemeRegistry/ThemeRegistry';
import store from './store/store';

const CHUNK_RELOAD_KEY = 'store2uChunkReloadOnce';

function isChunkLoadFailure(reason) {
  const msg = String(reason?.message ?? reason ?? '');
  return (
    msg.includes('Loading chunk') ||
    msg.includes('ChunkLoadError') ||
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed')
  );
}

export default function ClientLayout({ children }) {
  useEffect(() => {
    const tryReloadOnce = (reason) => {
      if (!isChunkLoadFailure(reason)) return;
      try {
        if (sessionStorage.getItem(CHUNK_RELOAD_KEY) === '1') return;
        sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
        window.location.reload();
      } catch (_) {
        /* ignore */
      }
    };
    const onRejection = (e) => tryReloadOnce(e.reason);
    const onError = (e) => tryReloadOnce(e.error ?? e.message);
    window.addEventListener('unhandledrejection', onRejection);
    window.addEventListener('error', onError);
    const clearKey = setTimeout(() => {
      try {
        sessionStorage.removeItem(CHUNK_RELOAD_KEY);
      } catch (_) {
        /* ignore */
      }
    }, 10000);
    return () => {
      clearTimeout(clearKey);
      window.removeEventListener('unhandledrejection', onRejection);
      window.removeEventListener('error', onError);
    };
  }, []);

  return (
        <Provider store={store}>
            <ThemeRegistry>
                <div className='text-black'>
                    {children}
                    <ToastContainer position="bottom-right" autoClose={4000} limit={5} />
                </div>
            </ThemeRegistry>
        </Provider>
    );
}
