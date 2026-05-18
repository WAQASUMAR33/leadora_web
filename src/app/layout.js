import { Poppins } from 'next/font/google';
import ClientLayout from './ClientLayout';
import './globals.css';

const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://store2u.ca'),
  title: 'Store2U - Your Gateway to Quality Products',
  description: 'Shop the latest products on Store2U.',
  manifest: '/manifest.json',
  icons: {
    icon: '/store2ulogo.png',
    apple: '/store2ulogo.png',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className} suppressHydrationWarning={true}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
