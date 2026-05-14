'use client';

import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ThemeRegistry from '../components/ThemeRegistry/ThemeRegistry';
import store from './store/store';

export default function ClientLayout({ children }) {
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
