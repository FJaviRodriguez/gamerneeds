export const getImageUrl = (url) => {
  if (!url) return '/icons/default-game.png';
  if (url.startsWith('http')) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${import.meta.env.VITE_BACKEND_URL}${url}`;
  }
  return `${import.meta.env.VITE_BACKEND_URL}/public/juegos/${url}`;
};