export default function imageLoader({ src, width, quality }) {
  // Route data.store2u.ca images through our proxy to bypass hotlink protection
  if (src.startsWith('https://data.store2u.ca/')) {
    const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(src)}`;
    return `${proxyUrl}&w=${width}&q=${quality || 75}`;
  }
  // Default Next.js loader for other images
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
